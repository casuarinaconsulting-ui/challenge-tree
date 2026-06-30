import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import BottomNav from '../components/BottomNav'
import Wordmark from '../components/Wordmark'
import TreeMark from '../components/TreeMark'
import { getEcosystem } from '../utils/ecosystems'
import { getCurrentBadgeData, getNextBadgeData, BADGE_DATA } from '../utils/badges'
import { ImpactBadgeSummary } from '../components/ImpactBadges'
import { getLocalImpactTotals } from '../utils/impactTotals'

function ChangePasswordCard() {
  const [open, setOpen]       = useState(false)
  const [current, setCurrent] = useState('')
  const [next, setNext]       = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (next !== confirm) { setMsg({ type: 'err', text: 'New passwords do not match.' }); return }
    if (next.length < 8)  { setMsg({ type: 'err', text: 'New password must be at least 8 characters.' }); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/change-password', { currentPassword: current, newPassword: next })
      setMsg({ type: 'ok', text: data.message || 'Password updated.' })
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err: any) {
      setMsg({ type: 'err', text: err.response?.data?.error || 'Could not update password.' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', fontSize: 15, padding: '10px 12px', marginBottom: 10,
    background: '#fff', border: '1px solid #e5e0d5', borderRadius: 8,
    outline: 'none', color: '#1a1f1c', boxSizing: 'border-box',
  }

  return (
    <div className="card-3d animate-slide-up" style={{
      borderRadius: 22, padding: '18px 20px', marginBottom: 14,
      background: '#fffdf8', border: '1px solid rgba(120,90,40,0.10)',
      boxShadow: '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)', animationDelay: '0.18s',
    }}>
      <button
        onClick={() => { setOpen(o => !o); setMsg(null) }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <span style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#1b4332',
        }}>
          🔑 Change Password
        </span>
        <span style={{ color: '#9ca3af', fontSize: 14 }}>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <input type="password" placeholder="Current password" value={current}
                 onChange={e => setCurrent(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="New password (min. 8 characters)" value={next}
                 onChange={e => setNext(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Confirm new password" value={confirm}
                 onChange={e => setConfirm(e.target.value)} required style={inputStyle} />

          {msg && (
            <p style={{
              fontSize: 14, margin: '2px 0 10px',
              color: msg.type === 'ok' ? '#2d6a4f' : '#b85c38',
              fontStyle: 'italic',
            }}>
              {msg.type === 'ok' ? '✓ ' : ''}{msg.text}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: loading ? '#7cc4a0' : 'linear-gradient(135deg, #2d6a4f, #1b4332)',
            color: '#fff', fontFamily: "'Oswald', sans-serif",
            fontWeight: 500, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}
    </div>
  )
}

function FeedbackCard() {
  const user = useAuthStore(s => s.user)
  const [open, setOpen]       = useState(false)
  const [type, setType]       = useState<'Idea' | 'Issue' | 'Other'>('Idea')
  const [message, setMessage] = useState('')
  const [sent, setSent]       = useState(false)
  const [sentVia, setSentVia] = useState<'server' | 'mail'>('server')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)

  const EMAIL   = 'casuarinaconsulting@gmail.com'
  const WEBSITE = 'https://casuarinaconsulting.com'

  function buildMailto() {
    const subject = `Challenge Tre3 feedback · ${type}`
    const ctx = [
      user?.name  ? `From: ${user.name}`   : null,
      user?.email ? `Email: ${user.email}` : null,
      `Sent: ${new Date().toLocaleString()}`,
    ].filter(Boolean).join('\n')
    const body = `${message.trim()}\n\nContext:\n${ctx}\nSent from Challenge Tre3`
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const msg = message.trim()
    if (!msg || loading) return
    setLoading(true)
    try {
      await api.post('/feedback', { message: msg, type, name: user?.name, email: user?.email })
      setSentVia('server')
      setSent(true)
    } catch {
      // Server could not take it (offline, or email not configured yet): hand
      // off to the user's mail app so the feedback still reaches us.
      window.location.href = buildMailto()
      setSentVia('mail')
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  function copyEmail() {
    navigator.clipboard?.writeText(EMAIL)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }

  const typeChip = (t: 'Idea' | 'Issue' | 'Other') => (
    <button type="button" key={t} onClick={() => setType(t)} style={{
      flex: 1, padding: '8px 0', borderRadius: 10, cursor: 'pointer',
      fontFamily: "'Oswald', sans-serif", fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase',
      background: type === t ? '#1b4332' : 'transparent',
      color: type === t ? '#fff' : '#6b6350',
      border: `1px solid ${type === t ? '#1b4332' : '#e0d8c6'}`,
      transition: 'all 0.15s ease',
    }}>{t}</button>
  )

  const textareaStyle: React.CSSProperties = {
    width: '100%', fontSize: 15, padding: '11px 12px', marginTop: 10,
    background: '#fff', border: '1px solid #e5e0d5', borderRadius: 10,
    outline: 'none', color: '#1a1f1c', boxSizing: 'border-box',
    minHeight: 90, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5,
  }

  return (
    <div className="card-3d animate-slide-up" style={{
      borderRadius: 22, padding: '18px 20px', marginBottom: 14,
      background: '#fffdf8', border: '1px solid rgba(120,90,40,0.10)',
      boxShadow: '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)',
      animationDelay: '0.2s',
    }}>
      <button onClick={() => { setOpen(o => !o); setSent(false) }} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      }}>
        <span style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#1b4332',
        }}>
          💬 Send feedback
        </span>
        <span style={{ color: '#9ca3af', fontSize: 14 }}>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div style={{ marginTop: 16 }}>
          {sent ? (
            <div style={{
              background: 'rgba(45,106,79,0.07)', border: '1px solid rgba(45,106,79,0.2)',
              borderRadius: 12, padding: '14px 16px',
            }}>
              <p style={{ fontSize: 14, color: '#1b4332', lineHeight: 1.6, margin: '0 0 6px', fontWeight: 600 }}>
                ✓ Thank you 🌿
              </p>
              <p style={{ fontSize: 13, color: '#566c60', lineHeight: 1.6, margin: 0 }}>
                {sentVia === 'server'
                  ? 'Your feedback is on its way to the Casuarina team. We read every message.'
                  : <>Your email app should have opened with your message ready to send. If it did not, reach us directly at{' '}
                      <a href={`mailto:${EMAIL}`} style={{ color: '#2d6a4f', fontWeight: 600 }}>{EMAIL}</a>.</>}
              </p>
              <button onClick={() => { setSent(false); setMessage('') }} style={{
                marginTop: 12, background: 'none', border: 'none', cursor: 'pointer',
                color: '#2d6a4f', fontFamily: "'Oswald', sans-serif", fontSize: 13,
                letterSpacing: '0.06em', textDecoration: 'underline', textDecorationStyle: 'dotted', padding: 0,
              }}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend}>
              <p style={{ fontSize: 13, color: '#566c60', lineHeight: 1.55, margin: '0 0 12px' }}>
                Ideas, issues, or just a hello. We read every message.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['Idea', 'Issue', 'Other'] as const).map(typeChip)}
              </div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                required
                style={textareaStyle}
              />
              <button type="submit" disabled={!message.trim() || loading} style={{
                width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', marginTop: 12,
                cursor: (message.trim() && !loading) ? 'pointer' : 'not-allowed',
                background: (message.trim() && !loading) ? 'linear-gradient(135deg, #2d6a4f, #1b4332)' : '#cdbfa6',
                color: '#fff', fontFamily: "'Oswald', sans-serif",
                fontWeight: 500, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase',
                boxShadow: (message.trim() && !loading) ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 16px rgba(27,67,50,0.3)' : 'none',
              }}>
                {loading ? 'Sending…' : 'Send feedback'}
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                marginTop: 14, flexWrap: 'wrap',
              }}>
                <button type="button" onClick={copyEmail} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontSize: 12.5, color: '#2d6a4f', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.04em',
                }}>
                  {copied ? '✓ Email copied' : '📋 Copy email'}
                </button>
                <span style={{ color: '#d4c9b8' }}>·</span>
                <a href={WEBSITE} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 12.5, color: '#2d6a4f', fontFamily: "'Oswald', sans-serif",
                  letterSpacing: '0.04em', textDecoration: 'none',
                }}>
                  🌐 Visit our website
                </a>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const logout   = useAuthStore(s => s.logout)

  const token  = useAuthStore(s => s.token)
  const user   = useAuthStore(s => s.user)
  const isDemo = token === 'demo-token'

  // Retry with backoff so a slow/cold backend (Railway free tier) recovers on
  // its own instead of leaving the streak stuck at its default until the user
  // interacts and triggers a fresh fetch.
  const retryOpts = {
    retry: 3,
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 5000),
  }

  const { data: apiProfile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/user/profile').then(r => r.data),
    enabled: !isDemo,
    ...retryOpts,
  })

  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: () => api.get('/badges').then(r => r.data),
    enabled: !isDemo,
    ...retryOpts,
  })

  const { data: impact } = useQuery({
    queryKey: ['impact'],
    queryFn: () => api.get('/impact').then(r => r.data),
    enabled: !isDemo,
    ...retryOpts,
  })

  // Demo mode is a frontend-only bypass with no backend session, so the calls
  // above are skipped. Fall back to a sensible default profile so the streak
  // card renders proper values instead of a perpetual loading placeholder.
  const demoProfile = {
    id: user?.id ?? 'demo',
    email: user?.email ?? 'demo@challengetree.app',
    name: user?.name ?? 'Explorer',
    preferences: {},
    streakCount: 0,
    longestStreak: 0,
    userBadges: [],
  }
  const profile = isDemo ? demoProfile : apiProfile

  const ecosystem    = getEcosystem((profile?.preferences as any)?.ecosystem, profile?.id ?? profile?.email)
  const streak       = profile?.streakCount ?? 0
  const best         = profile?.longestStreak ?? 0
  const currentBadge = getCurrentBadgeData(streak)
  const nextBadge    = getNextBadgeData(streak)

  // Progress towards next badge (0-1)
  const prevThreshold = currentBadge?.threshold ?? 0
  const nextThreshold = nextBadge?.threshold ?? (prevThreshold + 1)
  const progress = nextBadge
    ? Math.min((streak - prevThreshold) / (nextThreshold - prevThreshold), 1)
    : 1

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  // Impact-badge totals: cumulative from the API for real users, or today's
  // local completions in demo mode.
  const impactTotals = (!isDemo && impact) ? impact : getLocalImpactTotals()

  return (
    <div className="min-h-screen pb-28" style={{
      background: `
        radial-gradient(ellipse at 20% 0%, rgba(82,183,136,0.09) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(200,149,42,0.06) 0%, transparent 50%),
        #f5efe6
      `,
    }}>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(168deg, #205038 0%, #173a2b 100%)', position: 'relative', overflow: 'hidden' }}>
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
        {/* Faint topographic contour motif */}
        <svg viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d="M-20,52 Q110,16 230,48 T460,42" fill="none" stroke="#c8952a" strokeOpacity="0.11" strokeWidth="1.1" />
          <path d="M-20,84 Q120,48 250,76 T470,66" fill="none" stroke="#c8952a" strokeOpacity="0.08" strokeWidth="1.1" />
          <path d="M-20,118 Q90,84 220,110 T470,98" fill="none" stroke="#7fd4a8" strokeOpacity="0.08" strokeWidth="1.1" />
        </svg>

        <div style={{ padding: '52px 24px 32px', position: 'relative', textAlign: 'center' }}>

          {/* Brand lockup */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, marginBottom: 22 }}>
            <TreeMark size={48} />
            <Wordmark size={22} dark />
          </div>

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
              fontFamily: "'Oswald', sans-serif", fontSize: 12,
              color: 'rgba(149,213,178,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              {ecosystem.name}
            </span>
            {memberSince && (
              <>
                <span style={{ color: 'rgba(149,213,178,0.3)', fontSize: 12 }}>·</span>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 12,
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
                    fontFamily: "'Oswald', sans-serif", fontSize: 11,
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
                <p style={{ fontSize: 13, color: 'rgba(149,213,178,0.55)', margin: 0 }}>
                  {currentBadge.population} remaining · {currentBadge.habitat}
                </p>
              </div>
            </div>
            <p style={{
              fontSize: 13.5, color: 'rgba(149,213,178,0.7)', lineHeight: 1.6,
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
                  {profile ? streak : '–'}
                </span>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 14,
                  color: '#52b788', letterSpacing: '0.06em',
                }}>
                  day{streak !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 12,
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
                {profile ? best : '–'}
              </div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 12,
                color: '#9ca3af', letterSpacing: '0.16em', textTransform: 'uppercase',
              }}>
                Best 🏆
              </div>
            </div>
          </div>

          {/* Progress to next badge */}
          {profile && nextBadge && (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#6b7280', minWidth: 0, overflowWrap: 'break-word' }}>
                  Next: {nextBadge.icon} {nextBadge.name}
                </span>
                <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
              fontFamily: "'Oswald', sans-serif", fontSize: 13.5,
              color: '#c8952a', letterSpacing: '0.1em',
            }}>
              🦜 All badges earned, you are extraordinary
            </div>
          )}
        </div>

        {/* ── Impact stats ── */}
        {impact && (
          <div className="card-3d animate-slide-up" style={{
            borderRadius: 22, padding: '20px', marginBottom: 14,
            background: '#fffdf8', border: '1px solid rgba(120,90,40,0.10)',
            boxShadow: '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)',
            animationDelay: '0.10s',
          }}>
            <h3 style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.16em',
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
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2, letterSpacing: '0.06em' }}>
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
            background: '#fffdf8', border: '1px solid rgba(120,90,40,0.10)',
            boxShadow: '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)',
            animationDelay: '0.15s',
          }}>
            <h3 style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.16em',
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
                        <div style={{ fontSize: 12, color: rich.statusColor, marginTop: 1, letterSpacing: '0.08em' }}>
                          {rich.status.toUpperCase()} · {rich.population} remaining
                        </div>
                      )}
                    </div>
                    <div style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 13,
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

        {/* ── Impact badges (compact summary, links to full set on Impact) ── */}
        {impactTotals && (
          <ImpactBadgeSummary totals={impactTotals} onOpen={() => navigate('/impact')} />
        )}

        {/* ── Send feedback ── */}
        <FeedbackCard />

        {/* ── Change password ── */}
        <ChangePasswordCard />

        {/* ── Sign out ── */}
        <button onClick={() => { logout(); navigate('/login') }}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 16, cursor: 'pointer',
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#dc2626',
            border: '1px solid #fca5a5',
            boxShadow: '0 4px 14px rgba(220,38,38,0.1)',
            fontFamily: "'Oswald', sans-serif", fontSize: 13.5,
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
              fontFamily: "'Oswald', sans-serif", fontSize: 13,
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
            fontFamily: "'Oswald', sans-serif", fontSize: 11,
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
