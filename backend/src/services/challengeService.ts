import { Category } from '@prisma/client'
import { prisma } from '../lib/prisma'

const TODAY = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export async function getDailyChallenges(userId: string) {
  const today = TODAY()

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

  // Cycle exhausted — pull from the full pool so the user never runs dry.
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

  for (const c of shuffled) {
    if (picked.length === 3) break
    if (!usedCategories.has(c.category)) {
      picked.push(c)
      usedCategories.add(c.category)
    }
  }

  // Fall back to any challenges if not enough category-diverse ones
  for (const c of shuffled) {
    if (picked.length === 3) break
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

export async function markComplete(userId: string, challengeId: string) {
  const today = TODAY()

  const assignment = await prisma.userChallenge.findFirst({
    where: { userId, challengeId, assignedDate: today },
    include: { challenge: true }
  })
  if (!assignment) return { error: 'Challenge not assigned for today' }
  if (assignment.isCompleted) return { error: 'Already completed' }

  const impact = assignment.challenge.impactEstimate as {
    co2?: number; water?: number; waste?: number
  }

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

  // Update streak
  await updateStreak(userId)

  return { success: true, impact }
}

async function updateStreak(userId: string) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const yesterdayRecord = await prisma.impact.findUnique({
    where: { userId_date: { userId, date: yesterday } }
  })

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const newStreak = yesterdayRecord ? user.streakCount + 1 : 1
  await prisma.user.update({
    where: { id: userId },
    data: {
      streakCount:   newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      lastActive:    new Date()
    }
  })
}
