import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Wordmark from '../components/Wordmark'
import BottomNav from '../components/BottomNav'

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

// Badge definitions — mirrors the backend seed, used for current-level display
const BADGE_MILESTONES = [
  { threshold: 1,   level: 1, name: 'Siberian Tiger',     icon: '🐯' },
  { threshold: 3,   level: 2, name: 'Snow Leopard',       icon: '🐆' },
  { threshold: 7,   level: 3, name: 'African Wild Dog',   icon: '🐕' },
  { threshold: 30,  level: 4, name: 'Amur Leopard',       icon: '🐅' },
  { threshold: 90,  level: 5, name: 'Sumatran Orangutan', icon: '🦧' },
  { threshold: 180, level: 6, name: 'Javan Rhinoceros',   icon: '🦏' },
  { threshold: 270, level: 7, name: 'Vaquita',            icon: '🐬' },
  { threshold: 365, level: 8, name: 'Kakapo',             icon: '🦜' },
]

function getCurrentBadge(streak: number) {
  return [...BADGE_MILESTONES].reverse().find(b => streak >= b.threshold) ?? null
}

function getNextBadge(streak: number) {
  return BADGE_MILESTONES.find(b => streak < b.threshold) ?? null
}

const DEMO_CHALLENGES = [
  {
    id: 'demo-1', isCompleted: false,
    challenge: {
      id: 'demo-1', title: '5-minute shower', category: 'WATER',
      description: 'Cut your shower to 5 minutes today and save up to 50 litres of water.',
      timeEstimate: 5, costLevel: 'free', difficulty: 1,
    },
  },
  {
    id: 'demo-2', isCompleted: false,
    challenge: {
      id: 'demo-2', title: 'Plant-based meal', category: 'FOOD',
      description: 'Cook one fully plant-based meal — no meat, no dairy.',
      timeEstimate: 30, costLevel: 'low', difficulty: 2,
    },
  },
  {
    id: 'demo-3', isCompleted: false,
    challenge: {
      id: 'demo-3', title: 'Walk or cycle one trip', category: 'TRANSPORT',
      description: 'Skip motorised transport for one journey today, no matter how short.',
      timeEstimate: 20, costLevel: 'free', difficulty: 1,
    },
  },
]

function HomeWave() {
  return (
    <svg viewBox="0 0 400 44" preserveAspectRatio="none"
         style={{ display: 'block', width: '100%', height: 44, marginTop: -1 }}>
      <path d="M0,0 L400,0 L400,44 Q340,14 270,32 Q200,50 130,24 Q70,2 0,28 Z"
            fill="#1b4332"/>
    </svg>
  )
}

interface BadgeUnlock {
  name: string
  icon: string
  description: string
  level: number
}

function BadgeUnlockModal({ badge, onClose }: { badge: BadgeUnlock; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,28,18,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #1b4332, #0d2b1f)',
          borderRadius: 24,
          padding: '36px 28px 32px',
          maxWidth: 340,
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(82,183,136,0.3)',
          boxShadow: '0 0 60px rgba(82,183,136,0.18), 0 24px 48px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,149,42,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: -30, width: 120, height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Header label */}
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 10, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: '#c8952a', marginBottom: 16,
        }}>
          Badge Unlocked
        </div>

        {/* Species emoji */}
        <div style={{
          fontSize: 72, lineHeight: 1, marginBottom: 12,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
          animation: 'badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {badge.icon}
        </div>

        {/* Level chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(200,149,42,0.15)', border: '1px solid rgba(200,149,42,0.35)',
          borderRadius: 999, padding: '4px 14px', marginBottom: 12,
        }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, color: '#c8952a', letterSpacing: '0.12em' }}>
            LEVEL {badge.level}
          </span>
        </div>

        {/* Species name */}
        <h2 style={{
          fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 28,
          color: '#fff', margin: '0 0 12px', lineHeight: 1.15,
        }}>
          {badge.name}
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 13.5, color: 'rgba(149,213,178,0.85)', lineHeight: 1.6,
          margin: '0 0 28px',
        }}>
          {badge.description}
        </p>

        {/* Dismiss */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 14,
            border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #52b788 0%, #2d6a4f 100%)',
            color: '#fff', fontFamily: "'Oswald', sans-serif",
            fontSize: 13, fontWeight: 500, letterSpacing: '0.15em',
            textTransform: 'uppercase',
            boxShadow: '0 6px 20px rgba(82,183,136,0.35)',
          }}
        >
          Keep going 🌱
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes badgePop {
          from { transform: scale(0.4) rotate(-15deg); opacity: 0 }
          to   { transform: scale(1) rotate(0deg);    opacity: 1 }
        }
      `}</style>
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

  useEffect(() => {
    const status = (error as any)?.response?.status
    if (status === 401) {
      logout()
      navigate('/login', { replace: true })
    }
  }, [error, logout, navigate])

  const displayChallenges = (Array.isArray(challenges) && challenges.length > 0) ? challenges : DEMO_CHALLENGES

  const STORAGE_KEY = 'challenge-tree-completions'

  const [demoCompleted, setDemoCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  const completedCount = displayChallenges.filter((uc: any) =>
    uc.isCompleted || demoCompleted.has(uc.id)
  ).length

  const completeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (challengeId.startsWith('demo-')) {
        setDemoCompleted(prev => {
          const next = new Set(prev).add(challengeId)
          const withCategories = displayChallenges
            .filter((uc: any) => next.has(uc.id))
            .map((uc: any) => ({ id: uc.id, category: uc.challenge.category }))
          localStorage.setItem(STORAGE_KEY, JSON.stringify(withCategories))
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

      {/* ── Header ── */}
      <div style={{ background: '#1b4332', position: 'relative', overflow: 'hidden' }}>
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
        <div style={{ padding: '52px 22px 22px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h1><Wordmark size={22} dark /></h1>
            <button
              onClick={() => { logout(); navigate('/login') }}
              style={{
                fontSize: 11, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.75)', fontFamily: "'Oswald', sans-serif",
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              Sign out
            </button>
          </div>

          <p style={{ color: '#95d5b2', fontSize: 13, marginBottom: 12 }}>
            Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}
          </p>

          {/* Streak badge row */}
          {!isDemo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              {currentBadge ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'rgba(200,149,42,0.18)', border: '1px solid rgba(200,149,42,0.38)',
                  borderRadius: 999, padding: '5px 13px 5px 9px',
                }}>
                  <span style={{ fontSize: 17, lineHeight: 1 }}>{currentBadge.icon}</span>
                  <span style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 11.5,
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
                    fontFamily: "'Oswald', sans-serif", fontSize: 11,
                    color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em',
                  }}>
                    Complete a challenge to earn your first badge
                  </span>
                </div>
              )}

              {nextBadge && streakCount > 0 && (
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 10,
                  color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em',
                }}>
                  {nextBadge.threshold - streakCount}d to {nextBadge.icon}
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
              color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 6,
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em',
            }}>
              {completedCount}/3 today
            </span>
            {!isDemo && streakCount > 0 && (
              <span style={{
                marginLeft: 'auto', fontSize: 11,
                fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em',
                color: '#52b788',
              }}>
                🔥 {streakCount} day streak
              </span>
            )}
          </div>
        </div>

        <HomeWave />
      </div>

      {/* ── Challenge list ── */}
      <div style={{ padding: '18px 18px 0' }}>

        {/* Section header with gradient rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 20,
            color: 'var(--green-deep)', letterSpacing: '0.02em', margin: 0, flexShrink: 0,
          }}>
            Today's Challenges
          </h2>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #2d6a4f55, transparent)' }} />
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

              return (
                <div key={uc.id} className={isCompleted ? '' : 'card-3d animate-slide-up'} style={{
                  borderRadius: 18, overflow: 'hidden', background: '#fff',
                  border: isCompleted ? `1.5px solid ${cat.bg}50` : '1px solid rgba(0,0,0,0.06)',
                  animationDelay: `${uc.id === 'demo-1' ? '0' : uc.id === 'demo-2' ? '0.07' : '0.14'}s`,
                }}>

                  {/* Category colour band */}
                  <div style={{
                    background: isCompleted
                      ? `${cat.bg}bb`
                      : `linear-gradient(135deg, ${cat.bg} 0%, ${cat.bg}cc 100%)`,
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
                        fontFamily: "'Oswald', sans-serif", fontWeight: 400, fontSize: 12,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.92)',
                      }}>
                        {cat.label}
                      </span>
                    </div>
                    {isCompleted && (
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em',
                        fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase',
                        color: '#fff', background: 'rgba(255,255,255,0.22)',
                        padding: '3px 10px', borderRadius: 999,
                      }}>
                        Done ✓
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div style={{
                    padding: '16px 16px 18px',
                    background: isCompleted ? `${cat.bg}0a` : '#fff',
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
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: isCompleted ? 0 : 15 }}>
                      {[
                        { icon: '⏱', val: `${c.timeEstimate} min` },
                        { icon: '💰', val: c.costLevel },
                        { icon: '🎯', val: `Level ${c.difficulty}` },
                      ].map(m => (
                        <span key={m.val} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          padding: '3px 9px', borderRadius: 999, fontSize: 11.5,
                          background: '#f3f3f1', color: '#555', fontWeight: 500,
                        }}>
                          {m.icon} {m.val}
                        </span>
                      ))}
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
                          boxShadow: `0 4px 14px ${cat.bg}55, 0 1px 3px rgba(0,0,0,0.15)`,
                          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 20px ${cat.bg}66, 0 2px 4px rgba(0,0,0,0.15)`
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 14px ${cat.bg}55, 0 1px 3px rgba(0,0,0,0.15)`
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
      <div style={{
        textAlign: 'center', padding: '24px 0 10px',
        fontFamily: "'Oswald', sans-serif", fontSize: 10,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(26,51,40,0.28)',
      }}>
        Casuarina Consulting
      </div>

      <BottomNav />
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}
