import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Wordmark from '../components/Wordmark'
import TreeMark from '../components/TreeMark'
import BottomNav from '../components/BottomNav'
import { getCurrentBadgeData, getNextBadgeData, BADGE_DATA } from '../utils/badges'
import { getImpactDayFor, getUpcomingImpactDays } from '../utils/impactDays'
import { ImpactDayBanner, ImpactDayModal, NextImpactDayBanner } from '../components/ImpactDay'

const CATEGORY_CONFIG: Record<string, { bg: string; label: string; emoji: string }> = {
  ENERGY:           { bg: '#e07b39', label: 'Energy',           emoji: '⚡' },
  WATER:            { bg: '#2b8fb5', label: 'Water',            emoji: '💧' },
  WASTE:            { bg: '#7b68ae', label: 'Waste',            emoji: '♻️' },
  TRANSPORT:        { bg: '#c8952a', label: 'Transport',        emoji: '🚲' },
  FOOD:             { bg: '#5c9e47', label: 'Food',             emoji: '🥦' },
  CONSUMPTION:      { bg: '#d64045', label: 'Consumption',      emoji: '🛍️' },
  BIODIVERSITY:     { bg: '#2a9d8f', label: 'Biodiversity',     emoji: '🌿' },
  COMMUNITY:        { bg: '#c94f6d', label: 'Community',        emoji: '🤝' },
  SOCIAL_EQUITY:    { bg: '#4a7fa5', label: 'Social Equity',   emoji: '⚖️' },
  CIRCULAR_ECONOMY: { bg: '#5e7a44', label: 'Circular Economy', emoji: '🔄' },
  CLIMATE_ADVOCACY: { bg: '#b86b25', label: 'Climate',          emoji: '📢' },
  WELLBEING:        { bg: '#6aaa5a', label: 'Wellbeing',        emoji: '🌱' },
}

function getCurrentBadge(streak: number) { return getCurrentBadgeData(streak) ?? null }
function getNextBadge(streak: number)    { return getNextBadgeData(streak) ?? null }

const DEMO_CHALLENGES = [
  {
    id: 'demo-1', isCompleted: false,
    challenge: {
      id: 'demo-1', title: '5-minute shower', category: 'WATER',
      description: 'Cut your shower to 5 minutes today and save up to 50 litres of water.',
      timeEstimate: 5, costLevel: 'free', difficulty: 1,
      impactEstimate: { co2: 0.05, water: 30, waste: 0 },
      educationalText: 'Heating water is one of the biggest energy uses in the home. A shorter shower saves both water and the energy used to heat it, cutting your bills and carbon at once.',
      tips: ['Play one song and finish before it ends', 'A water-saving showerhead cuts flow without losing pressure'],
      barriers: ['Habit and routine', 'Shared households'],
    },
  },
  {
    id: 'demo-2', isCompleted: false,
    challenge: {
      id: 'demo-2', title: 'Plant-based meal', category: 'FOOD',
      description: 'Cook one fully plant-based meal, no meat, no dairy.',
      timeEstimate: 30, costLevel: 'low', difficulty: 2,
      impactEstimate: { co2: 1.5, water: 300, waste: 0.1 },
      educationalText: 'Food production drives roughly a quarter of global emissions, and animal products are the most resource-intensive. One plant-based meal meaningfully lowers your footprint.',
      tips: ['Lentils, beans, and chickpeas are cheap, filling protein', 'Make a dish you already love in a plant-based version'],
      barriers: ['Unfamiliar recipes', 'Cooking time'],
    },
  },
  {
    id: 'demo-3', isCompleted: false,
    challenge: {
      id: 'demo-3', title: 'Walk or cycle one trip', category: 'TRANSPORT',
      description: 'Skip motorised transport for one journey today, no matter how short.',
      timeEstimate: 20, costLevel: 'free', difficulty: 1,
      impactEstimate: { co2: 0.6, water: 0, waste: 0 },
      educationalText: 'Transport is about a quarter of global CO₂. Short car trips are the least efficient of all, replacing even one with walking or cycling cuts emissions and improves your health.',
      tips: ['Pick a trip under 2 km to start', 'Combine errands into one walk or ride'],
      barriers: ['Weather', 'Time pressure'],
    },
  },
]

// Extra challenges used only in demo mode when "swap" is tapped
const DEMO_ALTERNATES = [
  {
    id: 'demo-alt-1', isCompleted: false,
    challenge: {
      id: 'demo-alt-1', title: 'Refuse single-use plastic', category: 'WASTE',
      description: 'Say no to one single-use plastic item today, bag, bottle, cup, or cutlery.',
      timeEstimate: 5, costLevel: 'free', difficulty: 1,
      impactEstimate: { co2: 0.1, water: 0, waste: 0.3 },
      educationalText: 'Only about 9% of all plastic ever made has been recycled. Refusing single-use plastic stops waste at the source, the most effective point in the chain.',
      tips: ['Keep a reusable bag and bottle by the door', 'A refusal is more powerful than recycling after the fact'],
      barriers: ['Forgetting reusables', 'Limited alternatives on the go'],
    },
  },
  {
    id: 'demo-alt-2', isCompleted: false,
    challenge: {
      id: 'demo-alt-2', title: 'Unplug idle devices', category: 'ENERGY',
      description: 'Switch off or unplug devices on standby for the rest of the day.',
      timeEstimate: 10, costLevel: 'free', difficulty: 1,
      impactEstimate: { co2: 0.4, water: 0, waste: 0 },
      educationalText: 'Standby power ("vampire load") can be 5-10% of a home\'s electricity. Devices left plugged in draw power even when off, switching them off is free saving.',
      tips: ['A switched power strip turns off several devices at once', 'Chargers draw power even with nothing attached'],
      barriers: ['Hard-to-reach sockets', 'Devices that need to stay on'],
    },
  },
  {
    id: 'demo-alt-3', isCompleted: false,
    challenge: {
      id: 'demo-alt-3', title: 'Spend 20 minutes in nature', category: 'WELLBEING',
      description: 'Step outside and spend 20 phone-free minutes in a natural setting.',
      timeEstimate: 20, costLevel: 'free', difficulty: 1,
      impactEstimate: { co2: 0, water: 0, waste: 0 },
      educationalText: 'Twenty minutes in nature measurably lowers stress hormones. Connection to the natural world is also one of the strongest predictors of wanting to protect it.',
      tips: ['Even a park bench or garden counts', 'Notice three things you can see, hear, and touch'],
      barriers: ['No green space nearby', 'Weather'],
    },
  },
  {
    id: 'demo-alt-4', isCompleted: false,
    challenge: {
      id: 'demo-alt-4', title: 'Share a tip with a friend', category: 'COMMUNITY',
      description: 'Tell one person about a sustainable swap you have made.',
      timeEstimate: 10, costLevel: 'free', difficulty: 1,
      impactEstimate: { co2: 0, water: 0, waste: 0 },
      educationalText: 'Behaviour spreads through social networks. A genuine conversation with someone you know is one of the most effective ways to shift attitudes and habits.',
      tips: ['Share what worked for you, not what others "should" do', 'Lead with the benefit you noticed'],
      barriers: ['Feeling preachy', 'Finding the moment'],
    },
  },
]

function HomeWave() {
  return (
    <svg viewBox="0 0 400 44" preserveAspectRatio="none"
         style={{ display: 'block', width: '100%', height: 44, marginTop: -1 }}>
      <path d="M0,0 L400,0 L400,44 Q340,14 270,32 Q200,50 130,24 Q70,2 0,28 Z"
            fill="#173a2b"/>
    </svg>
  )
}

interface BadgeUnlock {
  name: string
  icon: string
  description: string
  level: number
}

const CONFETTI_COLORS = ['#52b788','#c8952a','#e8c97a','#95d5b2','#fff','#f4a261','#2a9d8f']

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => i)
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.map(i => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
        const left   = `${(i * 37 + 7) % 100}%`
        const delay  = `${(i * 0.13) % 1.4}s`
        const size   = 6 + (i % 5) * 2
        const rotate = (i * 47) % 360
        return (
          <div key={i} style={{
            position: 'absolute', top: -20, left,
            width: size, height: size,
            background: color,
            borderRadius: i % 3 === 0 ? '50%' : 2,
            animation: `confettiFall 1.8s ${delay} ease-in forwards`,
            transform: `rotate(${rotate}deg)`,
            opacity: 0.9,
          }} />
        )
      })}
    </div>
  )
}

function BadgeUnlockModal({ badge, onClose }: { badge: BadgeUnlock; onClose: () => void }) {
  const richData = BADGE_DATA.find(b => b.level === badge.level)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(5,18,12,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #132b1e 0%, #0a1c12 100%)',
          borderRadius: 28,
          padding: '0 0 28px',
          maxWidth: 360,
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(82,183,136,0.25)',
          boxShadow: '0 0 80px rgba(82,183,136,0.15), 0 30px 60px rgba(0,0,0,0.6)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Confetti />

        {/* Top colour band */}
        <div style={{
          background: `linear-gradient(135deg, ${richData?.statusColor ?? '#52b788'}33, transparent)`,
          borderBottom: `1px solid ${richData?.statusColor ?? '#52b788'}44`,
          padding: '28px 24px 20px',
          position: 'relative',
        }}>
          {/* Shimmer */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)',
            animation: 'shimmerLine 3s linear infinite',
          }} />

          {/* "NEW BADGE" pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(200,149,42,0.18)', border: '1px solid rgba(200,149,42,0.4)',
            borderRadius: 999, padding: '4px 14px', marginBottom: 18,
          }}>
            <span style={{ fontSize: 10, color: '#c8952a' }}>★</span>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, color: '#c8952a', letterSpacing: '0.25em' }}>
              LEVEL {badge.level} UNLOCKED
            </span>
            <span style={{ fontSize: 10, color: '#c8952a' }}>★</span>
          </div>

          {/* Emoji */}
          <div style={{
            fontSize: 82, lineHeight: 1, marginBottom: 8,
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
            animation: 'badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {badge.icon}
          </div>

          {/* Species name */}
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 30,
            color: '#fff', margin: '0 0 6px', lineHeight: 1.1,
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>
            {badge.name}
          </h2>

          {/* IUCN status */}
          {richData && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: `${richData.statusColor}22`,
              border: `1px solid ${richData.statusColor}55`,
              borderRadius: 999, padding: '3px 12px', marginTop: 4,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: richData.statusColor }} />
              <span style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 12,
                color: richData.statusColor, letterSpacing: '0.12em',
              }}>
                {richData.status.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Stats row */}
        {richData && (
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 0,
            borderBottom: '1px solid rgba(82,183,136,0.12)',
            margin: '0 0 20px',
          }}>
            <div style={{ flex: 1, padding: '14px 8px', borderRight: '1px solid rgba(82,183,136,0.12)' }}>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700,
                color: richData.statusColor, lineHeight: 1,
              }}>
                {richData.population}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(149,213,178,0.5)', marginTop: 3, letterSpacing: '0.06em' }}>
                remaining
              </div>
            </div>
            <div style={{ flex: 1, padding: '14px 8px' }}>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600,
                color: '#95d5b2', lineHeight: 1.2,
              }}>
                {richData.habitat}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(149,213,178,0.5)', marginTop: 3, letterSpacing: '0.06em' }}>
                habitat
              </div>
            </div>
          </div>
        )}

        {/* Fun fact */}
        <div style={{ padding: '0 24px 22px' }}>
          <p style={{
            fontSize: 13, color: 'rgba(149,213,178,0.82)', lineHeight: 1.65,
            margin: 0, fontStyle: 'italic',
          }}>
            "{richData?.funFact ?? badge.description}"
          </p>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 24px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '15px 0', borderRadius: 16,
              border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #52b788 0%, #2d6a4f 100%)',
              color: '#fff', fontFamily: "'Oswald', sans-serif",
              fontSize: 13, fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase',
              boxShadow: '0 8px 24px rgba(82,183,136,0.4)',
            }}
          >
            Keep protecting them 🌱
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes badgePop {
          from { transform: scale(0.4) rotate(-15deg); opacity: 0 }
          to   { transform: scale(1) rotate(0deg);    opacity: 1 }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0.9 }
          80%  { opacity: 0.7 }
          100% { transform: translateY(520px) rotate(720deg); opacity: 0 }
        }
      `}</style>
    </div>
  )
}

// Research/learning actions involve looking things up — recommend Ecosia.
function isResearchAction(title: string) {
  return /\b(learn|read|research|understand|explore|discover|find out|look up|watch|calculate|audit)\b/i.test(title || '')
}

function ChallengeDetailModal({ challenge, onClose }: { challenge: any; onClose: () => void }) {
  const cat = CATEGORY_CONFIG[challenge.category] ?? { bg: '#2d6a4f', label: challenge.category, emoji: '🌍' }
  const impact = challenge.impactEstimate ?? {}
  const tips: string[] = challenge.tips ?? []
  const barriers: string[] = challenge.barriers ?? []
  const impactRows = [
    { label: 'CO₂ saved', value: impact.co2 ? `${impact.co2} kg` : null, icon: '🌍' },
    { label: 'Water saved', value: impact.water ? `${impact.water} L` : null, icon: '💧' },
    { label: 'Waste diverted', value: impact.waste ? `${impact.waste} kg` : null, icon: '♻️' },
  ].filter(r => r.value)

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(10,28,18,0.78)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      backdropFilter: 'blur(6px)', animation: 'fadeIn 0.25s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, maxHeight: '88vh', overflowY: 'auto',
        background: '#fff', borderRadius: '24px 24px 0 0',
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
        {/* Coloured header */}
        <div style={{
          background: `linear-gradient(135deg, ${cat.bg} 0%, ${cat.bg}cc 100%)`,
          padding: '22px 22px 20px', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.45)', margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>{cat.emoji}</span>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)',
            }}>{cat.label}</span>
          </div>
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 23,
            color: '#fff', margin: 0, lineHeight: 1.2,
          }}>{challenge.title}</h2>
        </div>

        <div style={{ padding: '20px 22px 28px' }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: '0 0 16px' }}>
            {challenge.description}
          </p>

          {/* Ecosia tip — affordable / measurable research path */}
          {(isResearchAction(challenge.title) || (challenge.costLevel && challenge.costLevel !== 'free')) && (
            <div style={{
              background: 'rgba(45,106,79,0.07)', border: '1px solid rgba(45,106,79,0.18)',
              borderRadius: 12, padding: '12px 14px', margin: '0 0 20px',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 17, lineHeight: 1.2 }}>🌱</span>
              <p style={{ fontSize: 12.5, color: '#3a5a4a', lineHeight: 1.55, margin: 0 }}>
                {challenge.costLevel && challenge.costLevel !== 'free'
                  ? <>On a budget? Do your research on{' '}
                      <a href="https://www.ecosia.org" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#2d6a4f', fontWeight: 600 }}>Ecosia</a>{' '}
                      instead — buying makes the biggest difference, but learning still counts and helps plant trees.</>
                  : <>Do your searching on{' '}
                      <a href="https://www.ecosia.org" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#2d6a4f', fontWeight: 600 }}>Ecosia</a>{' '}
                      — it funds tree planting (about one tree per 45 searches), so even research has real impact.</>}
              </p>
            </div>
          )}

          {/* Why it matters */}
          {challenge.educationalText && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: cat.bg, margin: '0 0 8px',
              }}>Why it matters</h3>
              <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                {challenge.educationalText}
              </p>
            </div>
          )}

          {/* Impact breakdown */}
          {impactRows.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: cat.bg, margin: '0 0 10px',
              }}>Your impact</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                {impactRows.map(r => (
                  <div key={r.label} style={{
                    flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 12,
                    background: `${cat.bg}0f`, border: `1px solid ${cat.bg}22`,
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{r.icon}</div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 16, color: cat.bg }}>{r.value}</div>
                    <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 2 }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: cat.bg, margin: '0 0 8px',
              }}>💡 Tips</h3>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {tips.map((t, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 4 }}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Barriers */}
          {barriers.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 8px',
              }}>⚠️ Common barriers</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {barriers.map((b, i) => (
                  <span key={i} style={{
                    fontSize: 13.5, color: '#6b7280', background: '#f3f3f1',
                    padding: '4px 10px', borderRadius: 999,
                  }}>{b}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={onClose} style={{
            width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${cat.bg} 0%, ${cat.bg}dd 100%)`, color: '#fff',
            fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const user     = useAuthStore(s => s.user)
  const logout   = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const token  = useAuthStore(s => s.token)
  const isDemo = token === 'demo-token'

  const { data: challenges, isLoading, error } = useQuery({
    queryKey: ['daily-challenges'],
    queryFn: () => api.get('/challenges/daily').then(r => r.data),
    enabled: !isDemo,
    retry: false,
  })

  // Fetch profile to get streakCount + currentBadge
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/user/profile').then(r => r.data),
    enabled: !isDemo,
    staleTime: 30_000,
  })

  const streakCount  = profile?.streakCount ?? 0
  const currentBadge = getCurrentBadge(streakCount)
  const nextBadge    = getNextBadge(streakCount)

  const [badgeUnlock, setBadgeUnlock] = useState<BadgeUnlock | null>(null)
  const [detailC, setDetailC] = useState<any | null>(null)

  // Environmental "impact day" for today (e.g. World Oceans Day), if any.
  const impactDay = getImpactDayFor(new Date(), profile?.country)
  // On other days, point to the next one coming up (recomputed each render).
  const nextImpactDay = !impactDay
    ? (getUpcomingImpactDays(new Date(), 1, profile?.country)[0] ?? null)
    : null
  const [showImpactDay, setShowImpactDay] = useState(false)
  useEffect(() => {
    if (!impactDay) return
    const key = `impact-day-seen-${localDateKey()}`
    if (!localStorage.getItem(key)) {
      setShowImpactDay(true)
      try { localStorage.setItem(key, '1') } catch { /* ignore */ }
    }
  }, [impactDay?.name])
  // Local challenge list for demo mode (so demo "swap" can replace items)
  const [demoList, setDemoList] = useState<any[]>(DEMO_CHALLENGES)
  // One swap per day, total. Tracked server-side (preferences.lastSwapDate) for
  // real users and in localStorage for demo; mirrored locally for instant UI.
  const DEMO_SWAP_KEY = 'challenge-tree-demo-swap'
  const [swapUsedLocal, setSwapUsedLocal] = useState(false)
  const swapUsedToday = swapUsedLocal
    || (isDemo
      ? (() => { try { return JSON.parse(localStorage.getItem(DEMO_SWAP_KEY) || 'null')?.date === localDateKey() } catch { return false } })()
      : (profile?.preferences as any)?.lastSwapDate === localDateKey())

  useEffect(() => {
    const status = (error as any)?.response?.status
    if (status === 401) {
      logout()
      navigate('/login', { replace: true })
    }
  }, [error, logout, navigate])

  const displayChallenges = isDemo
    ? demoList
    : ((Array.isArray(challenges) && challenges.length > 0) ? challenges : DEMO_CHALLENGES)

  const STORAGE_KEY = 'challenge-tree-completions'

  // Demo/local completions are scoped to the user's LOCAL calendar date so they
  // reset at local midnight, exactly like real challenges do on the backend.
  const [demoCompleted, setDemoCompleted] = useState<Set<string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved && saved.date === localDateKey() && Array.isArray(saved.ids)) {
        return new Set<string>(saved.ids)
      }
    } catch { /* ignore */ }
    return new Set()
  })

  // Auto-reset when the local day rolls over while the app is left open
  // (e.g. a PWA running overnight). Checks once a minute; on a new local date
  // it clears local completions and refetches today's challenges + profile.
  useEffect(() => {
    let currentDay = localDateKey()
    const iv = setInterval(() => {
      const today = localDateKey()
      if (today !== currentDay) {
        currentDay = today
        setDemoCompleted(new Set())
        setSwapUsedLocal(false)
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(DEMO_SWAP_KEY)
        qc.invalidateQueries({ queryKey: ['daily-challenges'] })
        qc.invalidateQueries({ queryKey: ['profile'] })
      }
    }, 60_000)
    return () => clearInterval(iv)
  }, [qc])

  const completedCount = displayChallenges.filter((uc: any) =>
    uc.isCompleted || demoCompleted.has(uc.id)
  ).length

  const completeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (challengeId.startsWith('demo-')) {
        setDemoCompleted(prev => {
          const next = new Set(prev).add(challengeId)
          const items = displayChallenges
            .filter((uc: any) => next.has(uc.id))
            .map((uc: any) => ({ id: uc.id, category: uc.challenge.category }))
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            date: localDateKey(), ids: [...next], items,
          }))
          return next
        })
        return Promise.resolve(null as any)
      }
      return api.post(`/challenges/${challengeId}/complete`)
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['daily-challenges'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
      if (data?.data?.newBadge) {
        setBadgeUnlock(data.data.newBadge)
      }
    },
  })

  const swapMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (swapUsedToday) return Promise.resolve(null as any) // guard: one per day
      if (challengeId.startsWith('demo-')) {
        // Demo: replace the tapped item with an alternate not already shown
        setDemoList(prev => {
          const shownIds = new Set(prev.map(uc => uc.id))
          const alt = DEMO_ALTERNATES.find(a => !shownIds.has(a.id))
          if (!alt) return prev
          return prev.map(uc => (uc.challenge.id === challengeId ? alt : uc))
        })
        try { localStorage.setItem(DEMO_SWAP_KEY, JSON.stringify({ date: localDateKey() })) } catch { /* ignore */ }
        setSwapUsedLocal(true)
        return Promise.resolve(null as any)
      }
      return api.post(`/challenges/${challengeId}/swap`)
    },
    onSuccess: () => {
      setSwapUsedLocal(true)
      qc.invalidateQueries({ queryKey: ['daily-challenges'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
    // If the server rejects (already swapped today), lock the buttons too
    onError: () => setSwapUsedLocal(true),
  })

  return (
    <div className="min-h-screen pb-24" style={{
      background: `
        radial-gradient(ellipse at 15% 0%, rgba(82,183,136,0.10) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 100%, rgba(200,149,42,0.07) 0%, transparent 55%),
        #f5efe6
      `,
    }}>

      {/* Badge unlock modal */}
      {badgeUnlock && (
        <BadgeUnlockModal badge={badgeUnlock} onClose={() => setBadgeUnlock(null)} />
      )}

      {/* Impact day modal (once per day) */}
      {showImpactDay && impactDay && (
        <ImpactDayModal day={impactDay} onClose={() => setShowImpactDay(false)} />
      )}

      {/* Challenge detail modal */}
      {detailC && (
        <ChallengeDetailModal challenge={detailC} onClose={() => setDetailC(null)} />
      )}

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(168deg, #205038 0%, #173a2b 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Floating glow orbs */}
        <div style={{
          position: 'absolute', top: -30, right: -20, width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.22) 0%, transparent 70%)',
          animation: 'orbDrift 7s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 10, left: -30, width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,149,42,0.16) 0%, transparent 70%)',
          animation: 'orbDrift 9s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }} />
        {/* Faint topographic contour motif */}
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d="M-20,46 Q110,12 230,42 T460,36" fill="none" stroke="#c8952a" strokeOpacity="0.12" strokeWidth="1.1" />
          <path d="M-20,74 Q120,40 250,66 T470,58" fill="none" stroke="#c8952a" strokeOpacity="0.09" strokeWidth="1.1" />
          <path d="M-20,104 Q90,72 220,96 T470,86" fill="none" stroke="#7fd4a8" strokeOpacity="0.09" strokeWidth="1.1" />
        </svg>
        <div style={{ padding: '52px 22px 22px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 11, margin: 0 }}>
              <TreeMark size={50} />
              <Wordmark size={24} dark />
            </h1>
            <button
              onClick={() => { logout(); navigate('/login') }}
              style={{
                fontSize: 13, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.75)', fontFamily: "'Oswald', sans-serif",
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              Sign out
            </button>
          </div>

          <p style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 10.5, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(149,213,178,0.7)', margin: '0 0 6px',
          }}>
            {formatTodayLabel()}
          </p>
          <p style={{ color: '#95d5b2', fontSize: 13, marginBottom: 12 }}>
            Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}
          </p>

          {/* Streak badge row */}
          {!isDemo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              {currentBadge ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'linear-gradient(180deg, rgba(200,149,42,0.28), rgba(200,149,42,0.14))',
                  border: '1px solid rgba(224,180,82,0.5)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
                  borderRadius: 999, padding: '5px 13px 5px 9px',
                }}>
                  <span style={{ fontSize: 17, lineHeight: 1 }}>{currentBadge.icon}</span>
                  <span style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 13,
                    color: '#e8c97a', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    Lv.{currentBadge.level} {currentBadge.name}
                  </span>
                </div>
              ) : (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)',
                  borderRadius: 999, padding: '5px 13px',
                }}>
                  <span style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 13,
                    color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em',
                  }}>
                    Complete a challenge to earn your first badge
                  </span>
                </div>
              )}

              {nextBadge && streakCount > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontFamily: "'Oswald', sans-serif", fontSize: 13,
                  color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em',
                }}>
                  {nextBadge.threshold - streakCount}d to
                  <span style={{ fontSize: 19, lineHeight: 1 }}>{nextBadge.icon}</span>
                </span>
              )}
            </div>
          )}

          {/* Progress dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i < completedCount ? '#52b788' : 'rgba(255,255,255,0.2)',
                transition: 'background 0.3s',
              }} />
            ))}
            <span style={{
              color: 'rgba(255,255,255,0.4)', fontSize: 13, marginLeft: 6,
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em',
            }}>
              {completedCount}/3 today
            </span>
            {!isDemo && streakCount > 0 && (
              <span style={{
                marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em', color: '#74d99f',
              }}>
                <span style={{ fontSize: 17, lineHeight: 1 }}>🔥</span>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{streakCount}</span>
                <span style={{ fontSize: 14, opacity: 0.85 }}>day streak</span>
              </span>
            )}
          </div>
        </div>

        <HomeWave />
      </div>

      {/* ── Challenge list ── */}
      <div style={{ padding: '18px 18px 0' }}>

        {/* Impact day banner: today's moment, or a heads-up for the next one */}
        {impactDay ? (
          <ImpactDayBanner day={impactDay} onOpen={() => setShowImpactDay(true)} />
        ) : nextImpactDay ? (
          <NextImpactDayBanner day={nextImpactDay.day} date={nextImpactDay.date} onOpen={() => navigate('/impact')} />
        ) : null}

        {/* Section header with gradient rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 20,
            color: 'var(--green-deep)', letterSpacing: '0.02em', margin: 0, flexShrink: 0,
          }}>
            Today's Challenges
          </h2>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #c8952a88, #2d6a4f33, transparent)' }} />
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse"
                   style={{ height: 180, borderRadius: 16, background: '#e5e7eb' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {displayChallenges?.map((uc: any) => {
              const c = uc.challenge
              const isCompleted = uc.isCompleted || demoCompleted.has(uc.id)
              const cat = CATEGORY_CONFIG[c.category] ?? { bg: '#2d6a4f', label: c.category, emoji: '🌍' }
              const isImpactMatch = !!(impactDay && impactDay.category === c.category)

              return (
                <div key={uc.id} className={isCompleted ? '' : 'card-3d animate-slide-up'} style={{
                  borderRadius: 18, overflow: 'hidden', background: '#fffdf8',
                  border: isCompleted ? `1.5px solid ${cat.bg}50` : isImpactMatch ? `1.5px solid ${impactDay!.color}55` : '1px solid rgba(120,90,40,0.10)',
                  boxShadow: isImpactMatch && !isCompleted
                    ? `0 0 0 1px ${impactDay!.color}18, 0 10px 26px ${impactDay!.color}1f`
                    : isCompleted ? '0 4px 14px rgba(95,82,55,0.06)'
                    : '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)',
                  animationDelay: `${uc.id === 'demo-1' ? '0' : uc.id === 'demo-2' ? '0.07' : '0.14'}s`,
                }}>

                  {/* Gold hairline accent */}
                  <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #c8952a, transparent)' }} />

                  {/* Category colour band */}
                  <div style={{
                    background: isCompleted
                      ? `${cat.bg}bb`
                      : `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.10) 100%), linear-gradient(135deg, ${cat.bg} 0%, ${cat.bg}cc 100%)`,
                    padding: '13px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Shimmer overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmerLine 3s linear infinite',
                      pointerEvents: 'none',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontSize: 17 }}>{cat.emoji}</span>
                      <span style={{
                        fontFamily: "'Oswald', sans-serif", fontWeight: 400, fontSize: 13.5,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.92)',
                      }}>
                        {cat.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isImpactMatch && !isCompleted && (
                        <span style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: 11.5, letterSpacing: '0.06em',
                          textTransform: 'uppercase', color: '#fff',
                          background: 'rgba(255,255,255,0.22)', padding: '3px 10px', borderRadius: 999,
                        }}>
                          {impactDay!.emoji} Theme
                        </span>
                      )}
                      {isCompleted && (
                        <span style={{
                          fontSize: 12.5, fontWeight: 700, letterSpacing: '0.07em',
                          fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase',
                          color: '#fff', background: 'rgba(255,255,255,0.22)',
                          padding: '3px 10px', borderRadius: 999,
                        }}>
                          Done ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{
                    padding: '16px 16px 18px',
                    background: isCompleted ? `${cat.bg}0a` : '#fffdf8',
                  }}>
                    <h3 style={{
                      fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 19,
                      color: '#1a1f1c', marginBottom: 6, lineHeight: 1.2,
                    }}>
                      {c.title}
                    </h3>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55, marginBottom: 13 }}>
                      {c.description}
                    </p>

                    {/* Metadata pills */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: isCompleted ? 14 : 15 }}>
                      {[
                        { icon: '⏱', val: `${c.timeEstimate} min` },
                        { icon: '💰', val: c.costLevel },
                        { icon: '🎯', val: `Level ${c.difficulty}` },
                      ].map(m => (
                        <span key={m.val} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          padding: '3px 9px', borderRadius: 999, fontSize: 13,
                          background: '#f1ebde', border: '1px solid #e6dcc6', color: '#6b6350', fontWeight: 500,
                        }}>
                          {m.icon} {m.val}
                        </span>
                      ))}
                    </div>

                    {/* Secondary actions: learn more + swap */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: isCompleted ? 0 : 16 }}>
                      <button
                        onClick={() => setDetailC(c)}
                        style={{
                          flex: 1, padding: '9px 0', borderRadius: 10, cursor: 'pointer',
                          background: 'transparent', border: `1px solid ${cat.bg}40`, color: cat.bg,
                          fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 13,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}
                      >
                        ⓘ Why it matters
                      </button>
                      {!isCompleted && !swapUsedToday && (
                        <button
                          onClick={() => swapMutation.mutate(c.id)}
                          disabled={swapMutation.isPending}
                          style={{
                            flex: '0 0 auto', padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                            background: '#f1ebde', border: '1px solid #e6dcc6', color: '#6b6350',
                            fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 13,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            opacity: swapMutation.isPending ? 0.6 : 1,
                          }}
                        >
                          {swapMutation.isPending ? '…' : '↻ Swap'}
                        </button>
                      )}
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => completeMutation.mutate(c.id)}
                        disabled={completeMutation.isPending}
                        style={{
                          width: '100%', padding: '13px 0', borderRadius: 12,
                          border: 'none', cursor: 'pointer',
                          background: `linear-gradient(135deg, ${cat.bg} 0%, ${cat.bg}dd 100%)`,
                          color: '#fff',
                          fontFamily: "'Oswald', sans-serif", fontWeight: 500,
                          fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase',
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 7px 16px ${cat.bg}66, 0 1px 3px rgba(0,0,0,0.12)`,
                          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.25), 0 11px 24px ${cat.bg}70, 0 2px 4px rgba(0,0,0,0.15)`
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.25), 0 7px 16px ${cat.bg}66, 0 1px 3px rgba(0,0,0,0.12)`
                        }}
                      >
                        Mark complete
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 0 10px' }}>
        <a
          href="https://casuarinaconsulting.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 12,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(26,51,40,0.45)', textDecoration: 'none',
            borderBottom: '1px solid rgba(26,51,40,0.18)', paddingBottom: 2,
          }}
        >
          Casuarina Consulting
        </a>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 11,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(26,51,40,0.28)', marginTop: 5,
        }}>
          casuarinaconsulting.com
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}

// Editorial date label for the header, e.g. "Thursday, 26 June".
function formatTodayLabel() {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
}

// User's local calendar date as YYYY-MM-DD (en-CA gives ISO-like format)
function localDateKey() {
  return new Date().toLocaleDateString('en-CA')
}
