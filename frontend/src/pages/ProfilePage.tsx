import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import BottomNav from '../components/BottomNav'
import { getEcosystem } from '../utils/ecosystems'
import { getCurrentBadgeData, getNextBadgeData, BADGE_DATA } from '../utils/badges'

export default function ProfilePage() {
  const navigate = useNavigate()
  const logout   = useAuthStore(s => s.logout)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/user/profile').then(r => r.data),
  })

  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: () => api.get('/badges').then(r => r.data),
  })

  const { data: impact } = useQuery({
    queryKey: ['impact'],
    queryFn: () => api.get('/impact').then(r => r.data),
  })

  const ecosystem    = getEcosystem((profile?.preferences as any)?.ecosystem, profile?.id ?? profile?.email)
  const streak       = profile?.streakCount ?? 0
  const best         = profile?.longestStreak ?? 0
  const currentBadge = getCurrentBadgeData(streak)
  const nextBadge    = getNextBadgeData(streak)

  // Progress towards next badge (0–1)
  const prevThreshold = currentBadge?.threshold ?? 0
  const nextThreshold = nextBadge?.threshold ?? (prevThreshold + 1)
  const progress = nextBadge
    ? Math.min((streak - prevThreshold) / (nextThreshold - prevThreshold), 1)
    : 1

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen pb-28" style={{
      background: `
        radial-gradient(ellipse at 20% 0%, rgba(82,183,136,0.09) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(200,149,42,0.06) 0%, transparent 50%),
        #f5efe6
      `,
    }}>

      {/* ── Header ── */}
      <div style={{ background: '#1b4332', position: 'relative', overflow: 'hidden' }}>
        {/* Orbs */}
        <div style={{
          position: 'absolute', top: -40, right: -30, width: 220, height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.22) 0%, transparent 70%)',
          animation: 'orbDrift 8s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: -30, width: 160, height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,149,42,0.14) 0%, transparent 70%)',
          animation: 'orbDrift 11s ease-in-out infinite reverse', pointerEvents: 'none',
        }} />

        <div style={{ padding: '52px 24px 32px', position: 'relative', textAlign: 'center' }}>

          {/* Ecosystem avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
            <div style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              background: 'conic-gradient(#c8952a 0%, #52b788 40%, #95d5b2 70%, #c8952a 100%)',
              animation: 'spin 8s linear infinite',
              opacity: 0.8,
            }} />
            <div style={{
              position: 'relative', width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2d6a4f, #1b4332)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38, border: '3px solid #1b4332',
            }}>
              {isLoading ? '…' : ecosystem.emoji}
            </div>
          </div>

          <h1 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 24,
            color: '#fff', margin: '0 0 4px', letterSpacing: '0.02em',
          }}>
            {isLoading ? '…' : profile?.name}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(149,213,178,0.7)', margin: '0 0 4px' }}>
            {profile?.email}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 10,
              color: 'rgba(149,213,178,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              {ecosystem.name}
            </span>
            {memberSince && (
              <>
                <span style={{ color: 'rgba(149,213,178,0.3)', fontSize: 10 }}>·</span>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 10,
                  color: 'rgba(149,213,178,0.5)', letterSpacing: '0.1em',
                }}>
                  Member since {memberSince}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 400 44" preserveAspectRatio="none"
             style={{ display: 'block', width: '100%', height: 40, marginTop: -1 }}>
          <path d="M0,0 L400,0 L400,44 Q340,14 270,32 Q200,50 130,24 Q70,2 0,28 Z" fill="#f5efe6"/>
        </svg>
      </div>

      <div style={{ padding: '6px 18px 0' }}>

        {/* ── Current badge card ── */}
        {currentBadge ? (
          <div className="card-3d animate-slide-up" style={{
            borderRadius: 22, overflow: 'hidden', marginBottom: 14,
            background: `linear-gradient(145deg, #132b1e, #0d1f15)`,
            border: `1px solid ${currentBadge.statusColor}33`,
            boxShadow: `0 8px 32px ${currentBadge.statusColor}18, 0 2px 8px rgba(0,0,0,0.2)`,
          }}>
            <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ fontSize: 56, lineHeight: 1, flexShrink: 0, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
                {currentBadge.icon}
              </div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: `${currentBadge.statusColor}22`,
                  border: `1px solid ${currentBadge.statusColor}44`,
                  borderRadius: 999, padding: '2px 10px', marginBottom: 6,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: currentBadge.statusColor }} />
                  <span style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 9,
                    color: currentBadge.statusColor, letterSpacing: '0.14em',
                  }}>
                    {currentBadge.status.toUpperCase()} · LEVEL {currentBadge.level}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 20,
                  color: '#fff', margin: '0 0 2px', lineHeight: 1.1,
                }}>
                  {currentBadge.name}
                </h2>
                <p style={{ fontSize: 11, color: 'rgba(149,213,178,0.55)', margin: 0 }}>
                  {currentBadge.population} remaining · {currentBadge.habitat}
                </p>
              </div>
            </div>
            <p style={{
              fontSize: 12, color: 'rgba(149,213,178,0.7)', lineHeight: 1.6,
              margin: 0, padding: '12px 20px 20px', fontStyle: 'italic',
            }}>
              "{currentBadge.funFact}"
            </p>
          </div>
        ) : (
          <div className="animate-slide-up" style={{
            borderRadius: 22, padding: '16px 20px', marginBottom: 14,
            background: 'rgba(27,67,50,0.08)', border: '1px dashed rgba(27,67,50,0.2)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
              Complete your first challenge to earn a badge 🐯
            </p>
          </div>
        )}

        {/* ── Streak card ── */}
        <div className="card-3d animate-slide-up" style={{
          borderRadius: 22, padding: '20px', marginBottom: 14,
          background: '#fff', border: '1px solid rgba(0,0,0,0.05)',
          animationDelay: '0.05s',
        }}>
          {/* Top accent */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 3,
            borderRadius: '0 0 6px 6px',
            background: 'linear-gradient(90deg, #52b788, #c8952a, #52b788)',
            marginTop: -1,
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 48,
                  color: '#1b4332', lineHeight: 1,
                }}>
                  {streak}
                </span>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 14,
                  color: '#52b788', letterSpacing: '0.06em',
                }}>
                  day{streak !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 10,
                color: '#9ca3af', letterSpacing: '0.16em', textTransform: 'uppercase',
              }}>
                Current streak 🔥
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 28,
                color: '#c8952a', lineHeight: 1,
              }}>
                {best}
              </div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 10,
                color: '#9ca3af', letterSpacing: '0.16em', textTransform: 'uppercase',
              }}>
                Best 🏆
              </div>
            </div>
          </div>

          {/* Progress to next badge */}
          {nextBadge && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#6b7280' }}>
                  Next: {nextBadge.icon} {nextBadge.name}
                </span>
                <span style={{ fontSize: 11, color: '#6b7280' }}>
                  {nextBadge.threshold - streak} day{nextBadge.threshold - streak !== 1 ? 's' : ''} to go
                </span>
              </div>
              <div style={{
                height: 8, borderRadius: 999,
                background: 'rgba(27,67,50,0.08)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  width: `${Math.max(progress * 100, 4)}%`,
                  background: 'linear-gradient(90deg, #52b788, #c8952a)',
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          )}
          {!nextBadge && streak > 0 && (
            <div style={{
              textAlign: 'center', padding: '8px 0 0',
              fontFamily: "'Oswald', sans-serif", fontSize: 12,
              color: '#c8952a', letterSpacing: '0.1em',
            }}>
              🦜 All badges earned — you are extraordinary
            </div>
          )}
        </div>

        {/* ── Impact stats ── */}
        {impact && (
          <div className="card-3d animate-slide-up" style={{
            borderRadius: 22, padding: '20px', marginBottom: 14,
            background: '#fff', border: '1px solid rgba(0,0,0,0.05)',
            animationDelay: '0.10s',
          }}>
            <h3 style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#1b4332', margin: '0 0 16px',
            }}>
              Your Impact
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Actions', value: impact.totalActions,                    unit: '',    icon: '⚡', color: '#52b788' },
                { label: 'CO₂ Saved',  value: impact.co2Saved?.toFixed(1),         unit: ' kg', icon: '🌍', color: '#2a9d8f' },
                { label: 'Water',   value: impact.waterSaved?.toFixed(0),          unit: ' L',  icon: '💧', color: '#2b8fb5' },
                { label: 'Waste',   value: impact.wasteDiverted?.toFixed(1),       unit: ' kg', icon: '♻️', color: '#7b68ae' },
              ].map(s => (
                <div key={s.label} style={{
                  borderRadius: 14, padding: '14px 14px',
                  background: `${s.color}0e`,
                  border: `1px solid ${s.color}22`,
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{
                    fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22,
                    color: s.color, lineHeight: 1,
                  }}>
                    {s.value}{s.unit}
                  </div>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, letterSpacing: '0.06em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Badge collection ── */}
        {badges?.length > 0 && (
          <div className="card-3d animate-slide-up" style={{
            borderRadius: 22, padding: '20px', marginBottom: 14,
            background: '#fff', border: '1px solid rgba(0,0,0,0.05)',
            animationDelay: '0.15s',
          }}>
            <h3 style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#1b4332', margin: '0 0 14px',
            }}>
              Badges Earned
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {badges.map((ub: any) => {
                const req = ub.badge?.requirement as { threshold: number; level: number } | undefined
                const rich = BADGE_DATA.find(b => b.level === req?.level)
                return (
                  <div key={ub.badge?.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '10px 14px', borderRadius: 14,
                    background: rich ? `${rich.statusColor}0c` : '#f9f9f7',
                    border: `1px solid ${rich ? rich.statusColor + '28' : 'rgba(0,0,0,0.06)'}`,
                  }}>
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{ub.badge?.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 14,
                        color: '#1a1f1c',
                      }}>
                        {ub.badge?.name}
                      </div>
                      {rich && (
                        <div style={{ fontSize: 10, color: rich.statusColor, marginTop: 1, letterSpacing: '0.08em' }}>
                          {rich.status.toUpperCase()} · {rich.population} remaining
                        </div>
                      )}
                    </div>
                    <div style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 11,
                      color: '#9ca3af', letterSpacing: '0.1em',
                    }}>
                      LV.{req?.level}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Sign out ── */}
        <button onClick={() => { logout(); navigate('/login') }}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 16, cursor: 'pointer',
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#dc2626',
            border: '1px solid #fca5a5',
            boxShadow: '0 4px 14px rgba(220,38,38,0.1)',
            fontFamily: "'Oswald', sans-serif", fontSize: 12,
            fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
          Sign out
        </button>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', padding: '22px 0 8px' }}>
          <a
            href="https://casuarinaconsulting.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 11,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(26,51,40,0.45)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(26,51,40,0.18)',
              paddingBottom: 2,
              transition: 'color 0.2s',
            }}
          >
            Casuarina Consulting
          </a>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 9,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(26,51,40,0.25)', marginTop: 5,
          }}>
            casuarinaconsulting.com
          </div>
        </div>
      </div>

      <BottomNav />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
      `}</style>
    </div>
  )
}
