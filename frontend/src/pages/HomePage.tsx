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

  useEffect(() => {
    const status = (error as any)?.response?.status
    if (status === 401) {
      logout()
      navigate('/login', { replace: true })
    }
  }, [error, logout, navigate])

  const displayChallenges = (Array.isArray(challenges) && challenges.length > 0) ? challenges : DEMO_CHALLENGES

  const [demoCompleted, setDemoCompleted] = useState<Set<string>>(new Set())

  const completedCount = displayChallenges.filter((uc: any) =>
    uc.isCompleted || demoCompleted.has(uc.id)
  ).length

  const completeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (challengeId.startsWith('demo-')) {
        setDemoCompleted(prev => new Set(prev).add(challengeId))
        return Promise.resolve(null as any)
      }
      return api.post(`/challenges/${challengeId}/complete`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['daily-challenges'] }),
  })

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--cream)' }}>

      {/* ── Header ── */}
      <div style={{ background: '#1b4332', position: 'relative' }}>
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
                <div key={uc.id} style={{
                  borderRadius: 16, overflow: 'hidden', background: '#fff',
                  boxShadow: isCompleted ? 'none' : '0 2px 14px rgba(0,0,0,0.07)',
                  border: isCompleted ? `1.5px solid ${cat.bg}50` : '1px solid #ebebeb',
                }}>

                  {/* Category colour band */}
                  <div style={{
                    background: isCompleted ? `${cat.bg}bb` : cat.bg,
                    padding: '13px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
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
                          width: '100%', padding: '12px 0', borderRadius: 10,
                          border: 'none', cursor: 'pointer',
                          background: cat.bg, color: '#fff',
                          fontFamily: "'Oswald', sans-serif", fontWeight: 500,
                          fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase',
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
