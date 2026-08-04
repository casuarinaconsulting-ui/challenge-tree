import { Category } from '@prisma/client'
import { prisma } from '../lib/prisma'

// A challenge a person can realistically complete the same day with no purchase
// and low effort. Used to keep daily sets and swaps achievable.
const isDoable = (c: { costLevel: string; difficulty: number }) =>
  c.costLevel === 'free' && c.difficulty <= 2

// Prisma where-clause for the doable subset.
const DOABLE_FILTER = { costLevel: 'free', difficulty: { lte: 2 } as any }

// Start of the *user's* local day, anchored at UTC midnight of that calendar
// date so storage is consistent regardless of the server's timezone.
// tzOffsetMin is the client's Date.getTimezoneOffset() (minutes; UTC+10 → -600).
const startOfUserDay = (tzOffsetMin = 0): Date => {
  const localMs = Date.now() - tzOffsetMin * 60000
  const dateStr = new Date(localMs).toISOString().slice(0, 10)
  return new Date(`${dateStr}T00:00:00.000Z`)
}

// The user's current local day plus the real instant it ends. nextMidnightRealMs
// is when "today" rolls over in real time, used for the streak-restore countdown.
const userDayInfo = (tzOffsetMin = 0) => {
  const localMs = Date.now() - tzOffsetMin * 60000
  const todayStr = new Date(localMs).toISOString().slice(0, 10)
  const todayUtc = new Date(`${todayStr}T00:00:00.000Z`)
  const nextMidnightRealMs = todayUtc.getTime() + 86400000 + tzOffsetMin * 60000
  return { todayStr, todayUtc, nextMidnightRealMs }
}

export async function getDailyChallenges(userId: string, tzOffsetMin = 0) {
  const today = startOfUserDay(tzOffsetMin)

  // Return already-assigned challenges for today if they exist
  const existing = await prisma.userChallenge.findMany({
    where: { userId, assignedDate: today },
    include: { challenge: true }
  })
  if (existing.length === 3) return existing

  // Find all challenge IDs this user has ever received
  const seen = await prisma.userChallenge.findMany({
    where: { userId },
    select: { challengeId: true }
  })
  const seenIds = seen.map(s => s.challengeId)

  // Fetch user profile for personalisation
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const profileFilter = {
    isActive:     true,
    costLevel:    user.incomeLevel === 'low' ? { in: ['free', 'low'] } : undefined,
    difficulty:   user.abilityLevel === 'limited' ? { lte: 2 } : undefined,
    timeEstimate: user.timeAvailable ? { lte: user.timeAvailable } : undefined,
    OR: [{ region: 'global' }, { region: user.country ?? 'global' }] as any,
  }

  // Try unseen challenges first
  let candidates = await prisma.challenge.findMany({
    where: { ...profileFilter, id: { notIn: seenIds.length ? seenIds : ['__none__'] } },
    take: 200,
  })

  // Cycle exhausted, pull from the full pool so the user never runs dry.
  // Using a Fisher-Yates shuffle seeded by today's date + userId ensures
  // the cycle order is different every time it restarts.
  if (candidates.length < 3) {
    candidates = await prisma.challenge.findMany({
      where: profileFilter,
      take: 200,
    })
  }

  // Fisher-Yates shuffle using a simple seeded random for today
  const seed = parseInt(
    Buffer.from(`${userId}-${today.toISOString().slice(0, 10)}`).toString('hex').slice(0, 8),
    16
  )
  let s = seed
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff }
  const shuffled = [...candidates]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const picked: typeof shuffled = []
  const usedCategories = new Set<Category>()

  // A "doable" challenge needs no purchase and isn't high-effort, so it can be
  // organised and completed the same day. We guarantee at least 2 of the 3 are
  // doable, leaving at most one "stretch" (paid or harder) challenge, so every
  // user can realistically finish all three.
  const easy = shuffled.filter(isDoable)

  // 1) Up to 2 doable challenges, category-diverse where possible
  for (const c of easy) {
    if (picked.length >= 2) break
    if (!usedCategories.has(c.category)) { picked.push(c); usedCategories.add(c.category) }
  }
  // 2) Top up the doable quota ignoring category if diversity ran out
  for (const c of easy) {
    if (picked.length >= 2) break
    if (!picked.find(p => p.id === c.id)) { picked.push(c); usedCategories.add(c.category) }
  }
  // 3) Third slot: any challenge (may be a stretch), prefer a fresh category
  for (const c of shuffled) {
    if (picked.length >= 3) break
    if (!picked.find(p => p.id === c.id) && !usedCategories.has(c.category)) {
      picked.push(c); usedCategories.add(c.category)
    }
  }
  // 4) Final fallback: fill any remaining slots regardless of category
  for (const c of shuffled) {
    if (picked.length >= 3) break
    if (!picked.find(p => p.id === c.id)) picked.push(c)
  }

  // Assign to user
  const assignments = await Promise.all(
    picked.map(c =>
      prisma.userChallenge.create({
        data: { userId, challengeId: c.id, assignedDate: today },
        include: { challenge: true }
      })
    )
  )

  return assignments
}

export async function markComplete(userId: string, challengeId: string, tzOffsetMin = 0) {
  const today = startOfUserDay(tzOffsetMin)

  const assignment = await prisma.userChallenge.findFirst({
    where: { userId, challengeId, assignedDate: today },
    include: { challenge: true }
  })
  if (!assignment) return { error: 'Challenge not assigned for today' }
  if (assignment.isCompleted) return { error: 'Already completed' }

  const impact = assignment.challenge.impactEstimate as {
    co2?: number; water?: number; waste?: number
  }

  // Was there already activity today (before this completion)? Used to ensure
  // the streak is counted only once per day, on the first completion.
  const existingToday = await prisma.impact.findUnique({
    where: { userId_date: { userId, date: today } }
  })
  const firstActionToday = !existingToday

  // Mark challenge complete
  await prisma.userChallenge.updateMany({
    where: { userId, challengeId, assignedDate: today },
    data: { isCompleted: true, completedAt: new Date() }
  })

  // Upsert today's impact record
  await prisma.impact.upsert({
    where: { userId_date: { userId, date: today } },
    create: {
      userId,
      date:          today,
      co2Saved:      impact.co2   ?? 0,
      waterSaved:    impact.water ?? 0,
      wasteDiverted: impact.waste ?? 0,
      treesEquiv:    (impact.co2 ?? 0) / 21,
      totalActions:  1,
    },
    update: {
      co2Saved:      { increment: impact.co2   ?? 0 },
      waterSaved:    { increment: impact.water ?? 0 },
      wasteDiverted: { increment: impact.waste ?? 0 },
      treesEquiv:    { increment: (impact.co2 ?? 0) / 21 },
      totalActions:  { increment: 1 },
    }
  })

  // Only advance the streak once per day (on the first completion).
  const newBadge = firstActionToday ? await updateStreak(userId, tzOffsetMin) : null
  return { success: true, impact, newBadge }
}

// Ecosia plants roughly one tree for every 45 searches. A search from a
// challenge card funds real tree planting, so we credit that as "learning
// impact" (kept separate from physical CO2/water/waste savings).
const ECOSIA_TREES_PER_SEARCH = 1 / 45

// Shift a YYYY-MM-DD key by whole days (UTC), used to prune the search log.
function shiftDateKey(dateKey: string, deltaDays: number): string {
  const d = new Date(`${dateKey}T00:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + deltaDays)
  return d.toISOString().slice(0, 10)
}

// Record that the user ran an Ecosia search to learn about a challenge. Credits
// learning impact once per challenge per day (anti-gaming), stored on the user's
// preferences JSON so it never interferes with the daily Impact record or streak.
export async function recordEcosiaSearch(userId: string, challengeId: string, tzOffsetMin = 0) {
  const today   = startOfUserDay(tzOffsetMin)
  const dateKey = today.toISOString().slice(0, 10)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { error: 'User not found' }

  const prefs = (user.preferences as Record<string, any>) ?? {}
  const ecosia = prefs.ecosia ?? { searches: 0, treesEquiv: 0, log: {} }
  const log: Record<string, string[]> = ecosia.log ?? {}
  const todayList: string[] = log[dateKey] ?? []

  const alreadyToday = todayList.includes(challengeId)
  if (!alreadyToday) {
    todayList.push(challengeId)
    log[dateKey] = todayList
    // keep only the last 3 days of the log so preferences stays small
    const keep = new Set([dateKey, shiftDateKey(dateKey, -1), shiftDateKey(dateKey, -2)])
    for (const k of Object.keys(log)) if (!keep.has(k)) delete log[k]
    ecosia.searches   = (ecosia.searches ?? 0) + 1
    ecosia.treesEquiv = (ecosia.treesEquiv ?? 0) + ECOSIA_TREES_PER_SEARCH
    ecosia.log        = log
    await prisma.user.update({
      where: { id: userId },
      data:  { preferences: { ...prefs, ecosia } as any },
    })
  }

  return {
    success:    true,
    credited:   !alreadyToday,
    searches:   ecosia.searches,
    treesEquiv: ecosia.treesEquiv,
  }
}

// Replace one of today's (incomplete) challenges with a fresh alternative.
export async function swapChallenge(userId: string, challengeId: string, tzOffsetMin = 0) {
  const today = startOfUserDay(tzOffsetMin)

  const current = await prisma.userChallenge.findFirst({
    where: { userId, challengeId, assignedDate: today },
  })
  if (!current) return { error: 'Challenge not assigned for today' }
  if (current.isCompleted) return { error: 'Cannot swap a completed challenge' }

  const todays = await prisma.userChallenge.findMany({
    where: { userId, assignedDate: today },
    include: { challenge: { select: { id: true, category: true } } },
  })
  const keepIds        = todays.map(t => t.challengeId)
  const keepCategories = todays.filter(t => t.challengeId !== challengeId).map(t => t.challenge.category)

  const seen    = await prisma.userChallenge.findMany({ where: { userId }, select: { challengeId: true } })
  const seenIds = seen.map(s => s.challengeId)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { error: 'User not found' }

  // One swap per day, total (not per card)
  const dateKey = today.toISOString().slice(0, 10)
  const prefs = (user.preferences as Record<string, unknown>) ?? {}
  if (prefs.lastSwapDate === dateKey) {
    return { error: 'You can swap one challenge per day. Come back tomorrow.' }
  }

  const profileFilter = {
    isActive:     true,
    costLevel:    user.incomeLevel === 'low' ? { in: ['free', 'low'] } : undefined,
    difficulty:   user.abilityLevel === 'limited' ? { lte: 2 } : undefined,
    timeEstimate: user.timeAvailable ? { lte: user.timeAvailable } : undefined,
    OR: [{ region: 'global' }, { region: user.country ?? 'global' }] as any,
  }

  const excludeSeen = [...new Set([...seenIds, ...keepIds])]

  // A swap usually means the user couldn't do that challenge, so bias the
  // replacement toward a "doable" one (free, low-effort). Fall back step by step
  // so a swap always returns something rather than failing.
  const tiers = [
    // doable first
    { ...profileFilter, ...DOABLE_FILTER, id: { notIn: excludeSeen }, category: { notIn: keepCategories as any } },
    { ...profileFilter, ...DOABLE_FILTER, id: { notIn: excludeSeen } },
    // then any unseen
    { ...profileFilter, id: { notIn: excludeSeen }, category: { notIn: keepCategories as any } },
    { ...profileFilter, id: { notIn: excludeSeen } },
    // cycle exhausted: doable, then anything, not already in today's set
    { ...profileFilter, ...DOABLE_FILTER, id: { notIn: keepIds } },
    { ...profileFilter, id: { notIn: keepIds } },
  ]
  let candidates: Awaited<ReturnType<typeof prisma.challenge.findMany>> = []
  for (const where of tiers) {
    candidates = await prisma.challenge.findMany({ where, take: 100 })
    if (candidates.length) break
  }
  if (candidates.length < 1) return { error: 'No alternative challenge available right now' }

  const pick = candidates[Math.floor(Math.random() * candidates.length)]

  await prisma.userChallenge.delete({ where: { id: current.id } })
  const created = await prisma.userChallenge.create({
    data: { userId, challengeId: pick.id, assignedDate: today },
    include: { challenge: true },
  })

  // Record that today's single swap has been used
  await prisma.user.update({
    where: { id: userId },
    data: { preferences: { ...prefs, lastSwapDate: dateKey } as any },
  })

  return { success: true, userChallenge: created, swapUsed: true }
}

const STREAK_MILESTONES = [1, 3, 7, 30, 90, 180, 270, 365]

async function updateStreak(userId: string, tzOffsetMin = 0) {
  const yesterday = startOfUserDay(tzOffsetMin)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)

  const yesterdayRecord = await prisma.impact.findUnique({
    where: { userId_date: { userId, date: yesterday } }
  })

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null

  // A streak restore (see restoreStreak) can bridge a single missed day so the
  // streak continues instead of resetting to 1. It only takes effect once the
  // user completes a challenge today, and it never fabricates impact for the
  // missed day: the chain is reconnected, the numbers are not touched.
  const yesterdayKey = yesterday.toISOString().slice(0, 10)
  const prefs = (user.preferences as Record<string, any>) ?? {}
  const restore = prefs.streakRestore ?? {}
  const bridgedByRestore = !yesterdayRecord && restore.coveredDay === yesterdayKey
  const bridged = !!yesterdayRecord || bridgedByRestore

  const newStreak = bridged ? user.streakCount + 1 : 1
  const data: Record<string, any> = {
    streakCount:   newStreak,
    longestStreak: Math.max(newStreak, user.longestStreak),
    lastActive:    new Date(),
  }
  // Consume the restore: start the 30-day cooldown, clear the pending freeze.
  if (bridgedByRestore) {
    data.preferences = { ...prefs, streakRestore: { lastUsedAt: new Date().toISOString() } }
  }
  await prisma.user.update({ where: { id: userId }, data })

  if (!STREAK_MILESTONES.includes(newStreak)) return null

  const badge = await prisma.badge.findFirst({
    where: { requirement: { path: ['threshold'], equals: newStreak } }
  })
  if (!badge) return null

  const already = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } }
  })
  if (already) return null

  await prisma.userBadge.create({ data: { userId, badgeId: badge.id } })

  const req = badge.requirement as { threshold: number; level: number }
  return { id: badge.id, name: badge.name, icon: badge.icon, description: badge.description, level: req.level }
}

// A streak restore is offered only after exactly one missed day, during the day
// that follows it (the ~24h window after the streak ended), and at most once
// every 30 days.
const STREAK_RESTORE_COOLDOWN_DAYS = 30

// Current streak plus whether a just-broken streak can still be restored.
// gap = whole days since the last day with any completed challenge:
//   0/1 -> streak still alive, 2 -> one day missed (restorable today), 3+ -> gone.
export async function getStreakStatus(userId: string, tzOffsetMin = 0) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { error: 'User not found' as const }

  const { todayStr, todayUtc, nextMidnightRealMs } = userDayInfo(tzOffsetMin)
  const last = await prisma.impact.findFirst({
    where: { userId }, orderBy: { date: 'desc' }, select: { date: true },
  })

  const prefs = (user.preferences as Record<string, any>) ?? {}
  const restore = prefs.streakRestore ?? {}
  const onCooldown = restore.lastUsedAt
    ? Date.now() - Date.parse(restore.lastUsedAt) < STREAK_RESTORE_COOLDOWN_DAYS * 86400000
    : false

  const missedDay = shiftDateKey(todayStr, -1)
  const gap = last ? Math.round((todayUtc.getTime() - last.date.getTime()) / 86400000) : null
  const broken = gap != null && gap >= 2
  const armed = gap === 2 && restore.coveredDay === missedDay
  const restorable = gap === 2 && !onCooldown && !armed

  return {
    streakCount: user.streakCount,
    broken,
    restorable,
    armed,
    coveredDay: gap === 2 ? missedDay : null,
    hoursLeft: gap === 2 ? Math.max(0, Math.round((nextMidnightRealMs - Date.now()) / 360000) / 10) : 0,
    onCooldown,
    cooldownDays: STREAK_RESTORE_COOLDOWN_DAYS,
  }
}

// Arm a streak restore for the single missed day. The streak only actually
// continues when the user completes a challenge today (see updateStreak), so
// this never fabricates activity. Allowed once every 30 days, inside the window.
export async function restoreStreak(userId: string, tzOffsetMin = 0) {
  const status = await getStreakStatus(userId, tzOffsetMin)
  if ('error' in status) return status
  if (status.armed) {
    return {
      success: true, alreadyArmed: true, restoredStreak: status.streakCount,
      message: 'Streak restore is armed. Complete a challenge today to keep it.',
    }
  }
  if (!status.restorable) {
    const reason = status.onCooldown ? 'cooldown' : status.broken ? 'window_closed' : 'streak_active'
    return { error: 'not_restorable' as const, reason, status }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const prefs = (user!.preferences as Record<string, any>) ?? {}
  const restore = prefs.streakRestore ?? {}
  await prisma.user.update({
    where: { id: userId },
    data: {
      preferences: {
        ...prefs,
        streakRestore: { ...restore, coveredDay: status.coveredDay, createdAt: new Date().toISOString() },
      },
    },
  })
  return {
    success: true, restoredStreak: status.streakCount,
    message: 'Streak restore armed. Complete a challenge today to keep your streak.',
  }
}
