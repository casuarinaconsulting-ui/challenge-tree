import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import Wordmark from '../components/Wordmark'
import TreeMark from '../components/TreeMark'
import { ECOSYSTEMS, getEcosystem } from '../utils/ecosystems'

function RegisterWave() {
  return (
    <svg viewBox="0 0 400 44" preserveAspectRatio="none"
         style={{ display: 'block', width: '100%', height: 44, marginTop: -1 }}>
      <path d="M0,0 L400,0 L400,44 Q340,14 270,32 Q200,50 130,24 Q70,2 0,28 Z"
            fill="#1b4332"/>
    </svg>
  )
}

function WelcomeModal({ name, onStart }: { name: string; onStart: () => void }) {
  const first = (name || '').split(' ')[0] || 'there'
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(8,22,15,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto',
        background: 'linear-gradient(160deg, #1b4332 0%, #0d2b1e 100%)',
        borderRadius: '26px 26px 0 0', border: '1px solid rgba(82,183,136,0.25)',
        padding: '30px 26px 32px', position: 'relative',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', margin: '0 auto 22px' }} />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <TreeMark size={62} />
        </div>

        <h2 style={{
          fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 26,
          color: '#fff', textAlign: 'center', margin: '0 0 6px',
        }}>
          Welcome, {first}. 🌱
        </h2>
        <p style={{
          textAlign: 'center', color: '#95d5b2', fontSize: 13.5,
          fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em',
          textTransform: 'uppercase', margin: '0 0 22px',
        }}>
          You're part of something bigger now
        </p>

        <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 14px' }}>
            The climate crisis can feel overwhelming, like individual actions don't matter.
            They do. Every mindful choice adds to a wave of collective change.
          </p>
          <p style={{ margin: '0 0 14px' }}>
            Each day, Challenge Tre3 gives you <strong style={{ color: '#fff' }}>three simple
            actions</strong> that fit your life, wherever you are. Small steps that add up to
            real, measurable impact.
          </p>
          <p style={{ margin: '0 0 6px' }}>
            Share it with friends and family, the more of us who take part, the greater our
            collective impact. We're honoured to have you with us.
          </p>
        </div>

        <button
          onClick={onStart}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
            marginTop: 24,
            background: 'linear-gradient(135deg, #52b788 0%, #2d6a4f 100%)', color: '#fff',
            fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 14,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            boxShadow: '0 8px 24px rgba(82,183,136,0.4)',
          }}
        >
          Start my first challenge →
        </button>

        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'rgba(149,213,178,0.55)', margin: '16px 0 0', lineHeight: 1.6 }}>
          Questions or ideas?{' '}
          <a href="mailto:casuarinaconsulting@gmail.com" style={{ color: '#95d5b2' }}>casuarinaconsulting@gmail.com</a>
          <br />
          <a href="https://casuarinaconsulting.com" target="_blank" rel="noopener noreferrer" style={{ color: '#95d5b2' }}>casuarinaconsulting.com</a>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [form, setForm]             = useState({ name: '', email: '', password: '', country: '' })
  const [ecosystem, setEcosystem]   = useState<string | null>(null)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [welcomeName, setWelcomeName] = useState<string | null>(null)
  const setAuth  = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // If user didn't pick, assign deterministically from their email
      const chosenEcosystem = ecosystem ?? getEcosystem(undefined, form.email).id
      const { data } = await api.post('/auth/register', {
        ...form,
        preferences: { ecosystem: chosenEcosystem },
      })
      setAuth(data.user, data.token)
      setWelcomeName(data.user?.name || form.name)
    } catch (err: any) {
      const responseError = err.response?.data?.error
      if (!responseError) {
        setError('Connection failed, please check your internet and try again.')
      } else if (typeof responseError === 'string') {
        setError(responseError)
      } else if (responseError.fieldErrors) {
        const msgs = Object.values(responseError.fieldErrors).flat() as string[]
        setError(msgs[0] || 'Please check your details and try again.')
      } else {
        setError('Please check your details and try again.')
      }
    } finally {
      setLoading(false)
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

      {welcomeName && <WelcomeModal name={welcomeName} onStart={() => navigate('/')} />}

      {/* ── Header ── */}
      <div style={{ background: '#1b4332', position: 'relative', overflow: 'hidden' }}>
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

        <div style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 28, paddingLeft: 24, paddingRight: 24, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <TreeMark size={58} />
          </div>
          <Wordmark size={38} dark />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, justifyContent: 'center' }}>
            <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.28)' }} />
            <p style={{
              color: 'rgba(255,255,255,0.5)', fontFamily: "'Oswald', sans-serif",
              fontWeight: 300, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0,
            }}>
              Create your free account
            </p>
            <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.28)' }} />
          </div>
        </div>
        <RegisterWave />
      </div>

      {/* ── Form ── */}
      <div style={{ padding: '28px 20px 48px' }}>
        <div className="card-3d animate-slide-up" style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 22, padding: '28px 24px 24px',
          border: '1px solid rgba(255,255,255,0.95)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top gradient line */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: 3,
            borderRadius: '0 0 4px 4px',
            background: 'linear-gradient(90deg, #1b4332, #52b788, #c8952a)', opacity: 0.7,
          }} />

          <form onSubmit={handleSubmit}>
            {[
              { key: 'name',     label: 'Full name',          type: 'text',     required: true  },
              { key: 'email',    label: 'Email',               type: 'email',    required: true  },
              { key: 'password', label: 'Password (min. 8 characters)', type: 'password', required: true  },
              { key: 'country',  label: 'Country (optional)',  type: 'text',     required: false },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 22 }}>
                <label style={{
                  display: 'block', fontSize: 12.5,
                  fontFamily: "'Oswald', sans-serif", letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#2d6a4f', marginBottom: 7,
                }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={update(f.key)}
                  required={f.required}
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
            ))}

            {/* ── Ecosystem picker ── */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 12.5,
                fontFamily: "'Oswald', sans-serif", letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#2d6a4f', marginBottom: 4,
              }}>
                Your ecosystem
              </label>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 12, lineHeight: 1.5 }}>
                Choose the ecosystem that represents you, or skip and we'll pick one.
              </p>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
              }}>
                {ECOSYSTEMS.map(eco => {
                  const selected = ecosystem === eco.id
                  return (
                    <button
                      key={eco.id}
                      type="button"
                      onClick={() => setEcosystem(selected ? null : eco.id)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 4, padding: '10px 4px', borderRadius: 12, cursor: 'pointer',
                        border: selected ? '2px solid #2d6a4f' : '2px solid transparent',
                        background: selected ? 'rgba(45,106,79,0.10)' : 'rgba(0,0,0,0.035)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: 22, lineHeight: 1 }}>{eco.emoji}</span>
                      <span style={{
                        fontSize: 11, color: selected ? '#1b4332' : '#666',
                        fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em',
                        textAlign: 'center', lineHeight: 1.2,
                        fontWeight: selected ? 600 : 400,
                      }}>
                        {eco.name}
                      </span>
                    </button>
                  )
                })}
              </div>
              {!ecosystem && (
                <p style={{
                  fontSize: 12.5, color: '#aaa', marginTop: 8, textAlign: 'center',
                  fontStyle: 'italic',
                }}>
                  None selected, we'll surprise you ✨
                </p>
              )}
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
                background: loading
                  ? '#52b788'
                  : 'linear-gradient(135deg, #2d6a4f, #1b4332)',
                color: '#fff', fontFamily: "'Oswald', sans-serif",
                fontWeight: 500, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase',
                boxShadow: '0 4px 16px rgba(27,67,50,0.35)',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p style={{ fontSize: 13, color: '#888' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#c8952a', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center', marginTop: 28,
          fontFamily: "'Oswald', sans-serif", fontSize: 12,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(26,51,40,0.28)',
        }}>
          Casuarina Consulting
        </div>
      </div>
    </div>
  )
}
