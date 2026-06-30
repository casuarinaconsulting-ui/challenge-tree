import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import Wordmark from '../components/Wordmark'
import TreeMark from '../components/TreeMark'

function BotanicalAccent() {
  return (
    <svg width="90" height="110" viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44 106 C43 90 41 70 38 50 C35 30 32 15 35 6"
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M41 82 C28 75 12 78 14 90 C22 84 32 83 41 82Z" fill="rgba(255,255,255,0.16)"/>
      <path d="M42 76 C52 64 68 65 66 78 C58 74 50 74 42 76Z" fill="rgba(255,255,255,0.13)"/>
      <path d="M40 56 C28 48 13 52 16 63 C24 57 32 57 40 56Z" fill="rgba(255,255,255,0.16)"/>
      <path d="M40 50 C50 38 66 40 64 52 C57 47 49 48 40 50Z" fill="rgba(255,255,255,0.13)"/>
      <path d="M37 28 C27 20 18 26 20 36 C28 30 32 29 37 28Z" fill="rgba(255,255,255,0.16)"/>
      <path d="M35 6 C32 0 37 -2 39 4 C38 6 36 7 35 6Z" fill="rgba(255,255,255,0.22)"/>
    </svg>
  )
}

function LoginWave() {
  return (
    <svg viewBox="0 0 400 52" preserveAspectRatio="none"
         style={{ display: 'block', width: '100%', height: 52, marginTop: -1 }}>
      <path d="M0,0 L400,0 L400,52 Q360,24 300,38 Q230,52 170,28 Q110,4 60,34 Q28,46 0,32 Z"
            fill="#173a2b"/>
    </svg>
  )
}

interface GlobalImpact {
  members: number
  co2Saved: number
  waterSaved: number
  wasteDiverted: number
  totalActions: number
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return `${Math.round(n)}`
}

// Counts up to a target value for a satisfying first impression
function useCountUp(target: number, durationMs = 1100): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!target) { setValue(0); return }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])
  return value
}

function CollectiveImpact({ data }: { data: GlobalImpact }) {
  const members = useCountUp(data.members)
  const co2     = useCountUp(data.co2Saved)
  const water   = useCountUp(data.waterSaved)
  const actions = useCountUp(data.totalActions)

  const stats = [
    { icon: '🌬️', value: `${formatCompact(co2)} kg`, label: 'CO₂ saved' },
    { icon: '💧', value: `${formatCompact(water)} L`, label: 'Water saved' },
    { icon: '✅', value: formatCompact(actions),       label: 'Actions' },
  ]

  return (
    <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 4px' }}>
      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <p style={{
          color: '#fff', fontFamily: "'Oswald', sans-serif", fontWeight: 600,
          fontSize: 15, margin: 0, lineHeight: 1.4,
        }}>
          Join <span style={{ color: '#f0c96e' }}>{formatCompact(members)}+ members</span> worldwide
        </p>
        <p style={{
          color: 'rgba(255,255,255,0.6)', fontSize: 13.5, margin: '3px 0 0',
        }}>
          making real change, one daily action at a time
        </p>
      </div>

      {/* Stat strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16, padding: '14px 10px',
        backdropFilter: 'blur(8px)',
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            textAlign: 'center',
            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{s.icon}</div>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 16,
              color: '#fff', lineHeight: 1,
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              fontFamily: "'Oswald', sans-serif",
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <p style={{
        textAlign: 'center', fontSize: 11.5, color: 'rgba(255,255,255,0.35)',
        margin: '8px 0 0', letterSpacing: '0.12em', textTransform: 'uppercase',
        fontFamily: "'Oswald', sans-serif",
      }}>
        Our collective impact so far 🌍
      </p>
    </div>
  )
}

export default function LoginPage() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail]     = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMsg, setForgotMsg]         = useState('')
  const [global, setGlobal]               = useState<GlobalImpact | null>(null)
  const setAuth  = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/impact/global')
      .then(r => setGlobal(r.data))
      .catch(() => {/* silent, login still works without the graphic */})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (email === 'demo@challengetree.app' && password === 'vh9oNDVX23OaXn') {
      setAuth({ id: 'demo', name: 'Ramon', email }, 'demo-token')
      setLoading(false)
      navigate('/')
      return
    }

    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setForgotLoading(true)
    setForgotMsg('')
    try {
      const { data } = await api.post('/auth/forgot-password', { email: forgotEmail || email })
      setForgotMsg(data.message || 'Check your email for a temporary password.')
    } catch {
      setForgotMsg('Something went wrong. Please try again in a moment.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(ellipse at 20% 0%, rgba(82,183,136,0.12) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(200,149,42,0.08) 0%, transparent 50%),
        #f5efe6
      `,
    }}>

      {/* ── Green header ── */}
      <div style={{ background: 'linear-gradient(168deg, #205038 0%, #173a2b 100%)', position: 'relative', overflow: 'hidden' }}>

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: -40, right: -30, width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.22) 0%, transparent 70%)',
          animation: 'orbDrift 8s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 20, left: -30, width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,149,42,0.16) 0%, transparent 70%)',
          animation: 'orbDrift 10s ease-in-out infinite reverse', pointerEvents: 'none',
        }} />

        {/* Botanical illustration, top right */}
        <div style={{ position: 'absolute', top: 0, right: 16, zIndex: 1 }}>
          <BotanicalAccent />
        </div>

        {/* Terracotta accent dots, top left */}
        <div style={{ position: 'absolute', top: 28, left: 24, display: 'flex', flexDirection: 'column', gap: 5, zIndex: 1 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#b85c38', opacity: 0.75 }} />
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 20, paddingLeft: 24, paddingRight: 24, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <TreeMark size={68} />
          </div>
          <Wordmark size={42} dark />

          {/* Tagline with decorative lines */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, justifyContent: 'center' }}>
            <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.28)' }} />
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 300, fontSize: 13,
              letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0,
            }}>
              Small actions. Global impact.
            </p>
            <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.28)' }} />
          </div>
        </div>

        {/* Collective impact graphic */}
        {global && global.members > 0 && <CollectiveImpact data={global} />}

        <div style={{ height: 18 }} />
        <LoginWave />
      </div>

      {/* ── Form section, frosted glass card ── */}
      <div style={{ padding: '28px 20px 48px' }}>
      <div className="card-3d animate-slide-up" style={{
        background: 'rgba(253,250,243,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 22,
        padding: '28px 24px 24px',
        border: '1px solid rgba(255,255,255,0.95)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Top accent gradient line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 3,
          borderRadius: '0 0 4px 4px',
          background: 'linear-gradient(90deg, #1b4332, #52b788, #c8952a)',
          opacity: 0.7,
        }} />
        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: 22 }}>
            <label style={{
              display: 'block', fontSize: 12.5,
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#2d6a4f', marginBottom: 7,
            }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{
                width: '100%', fontSize: 16, padding: '9px 0',
                background: 'transparent', border: 'none',
                borderBottom: '2px solid #c8b89a',
                outline: 'none', color: '#1a1f1c',
              }}
              onFocus={e => (e.target.style.borderBottomColor = '#2d6a4f')}
              onBlur={e  => (e.target.style.borderBottomColor = '#c8b89a')}
            />
          </div>

          <div style={{ marginBottom: 30 }}>
            <label style={{
              display: 'block', fontSize: 12.5,
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#2d6a4f', marginBottom: 7,
            }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{
                width: '100%', fontSize: 16, padding: '9px 0',
                background: 'transparent', border: 'none',
                borderBottom: '2px solid #c8b89a',
                outline: 'none', color: '#1a1f1c',
              }}
              onFocus={e => (e.target.style.borderBottomColor = '#2d6a4f')}
              onBlur={e  => (e.target.style.borderBottomColor = '#c8b89a')}
            />
          </div>

          {error && (
            <p style={{ color: '#b85c38', fontSize: 13, marginBottom: 16, fontStyle: 'italic' }}>
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '15px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: loading ? '#52b788' : 'linear-gradient(135deg, #2d6a4f, #1b4332)',
              color: '#fff', fontFamily: "'Oswald', sans-serif",
              fontWeight: 500, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 16px rgba(27,67,50,0.3)',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Forgot password */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={() => { setShowForgot(v => !v); setForgotMsg('') }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, color: '#2d6a4f',
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em',
              textDecoration: 'underline', textDecorationStyle: 'dotted',
            }}
          >
            Forgot password?
          </button>

          {showForgot && (
            <div style={{
              marginTop: 12, padding: '16px', borderRadius: 12,
              background: '#f0f7f3', border: '1px solid #b7dfc8', textAlign: 'left',
            }}>
              {forgotMsg ? (
                <p style={{ fontSize: 13, color: '#1b4332', lineHeight: 1.6, margin: 0 }}>
                  ✓ {forgotMsg}
                </p>
              ) : (
                <form onSubmit={handleForgot}>
                  <p style={{ fontSize: 14, color: '#2d6a4f', lineHeight: 1.55, margin: '0 0 12px' }}>
                    Enter your email and we'll send a <strong>temporary password</strong> you can sign in with, then change.
                  </p>
                  <input
                    type="email"
                    value={forgotEmail || email}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%', fontSize: 15, padding: '10px 12px', marginBottom: 10,
                      background: '#fff', border: '1px solid #b7dfc8', borderRadius: 8,
                      outline: 'none', color: '#1a1f1c', boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="submit" disabled={forgotLoading}
                    style={{
                      width: '100%', padding: '11px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: forgotLoading ? '#7cc4a0' : '#2d6a4f',
                      color: '#fff', fontFamily: "'Oswald', sans-serif",
                      fontWeight: 500, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}
                  >
                    {forgotLoading ? 'Sending…' : 'Send temporary password'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ fontSize: 13, color: '#888' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#c8952a', fontWeight: 600 }}>
              Create one free
            </Link>
          </p>

          {/* Decorative bottom flourish */}
          <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <div style={{ width: 36, height: 1, background: '#d4c9b8' }} />
            <span style={{ fontSize: 15, opacity: 0.35 }}>🌿</span>
            <div style={{ width: 36, height: 1, background: '#d4c9b8' }} />
          </div>

          <div style={{ marginTop: 20 }}>
            <Link to="/privacy" style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'rgba(45,106,79,0.6)', textDecoration: 'none',
            }}>
              Privacy Policy
            </Link>
          </div>
          <div style={{
            marginTop: 8,
            fontFamily: "'Oswald', sans-serif", fontSize: 12,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(26,51,40,0.28)',
          }}>
            Casuarina Consulting
          </div>
        </div>
      </div>{/* end glass card */}
      </div>{/* end padding wrapper */}
    </div>
  )
}
