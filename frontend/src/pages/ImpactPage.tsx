import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function ImpactWave() {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none"
         style={{ display: 'block', width: '100%', height: 40, marginTop: -1 }}>
      <path d="M0,0 L400,0 L400,40 Q330,8 260,26 Q190,44 120,18 Q60,-4 0,20 Z"
            fill="#1b4332"/>
    </svg>
  )
}

function getMotivation(n: number): { headline: string; body: string } {
  if (n === 0) return {
    headline: 'Every journey begins here.',
    body: 'Climate hits communities unequally. Each action helps close that gap.',
  }
  if (n <= 5) return {
    headline: 'Sustainability is justice.',
    body: 'For future generations and the communities already living the crisis.',
  }
  if (n <= 15) return {
    headline: 'You\'re inspiring others.',
    body: 'Each visible change influences an average of 3 people around you.',
  }
  return {
    headline: 'You\'re proof it works.',
    body: 'Real change is built by consistent people, not perfect ones.',
  }
}

function CasuarinaFooter() {
  return (
    <div style={{
      textAlign: 'center', padding: '20px 0 10px',
      fontFamily: "'Oswald', sans-serif", fontSize: 10,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'rgba(26,51,40,0.28)',
    }}>
      Casuarina Consulting
    </div>
  )
}

export default function ImpactPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['impact'],
    queryFn: () => api.get('/impact').then(r => r.data),
  })

  const totalActions = data?.totalActions ?? 0
  const motivation   = getMotivation(totalActions)

  const stats = [
    { icon: '🌬️', label: 'CO₂ saved',       value: `${(data?.co2Saved ?? 0).toFixed(1)} kg`,     color: '#5e7a44' },
    { icon: '💧', label: 'Water saved',      value: `${(data?.waterSaved ?? 0).toFixed(0)} L`,     color: '#2b8fb5' },
    { icon: '♻️', label: 'Waste diverted',   value: `${(data?.wasteDiverted ?? 0).toFixed(1)} kg`, color: '#7b68ae' },
    { icon: '🌳', label: 'Trees equivalent', value: `${(data?.treesEquiv ?? 0).toFixed(2)}`,       color: '#2a9d8f' },
    { icon: '✅', label: 'Total actions',    value: `${totalActions}`,                              color: '#c8952a' },
  ]

  return (
    <div className="min-h-screen pb-10" style={{ background: 'var(--cream)' }}>

      {/* ── Header ── */}
      <div style={{ background: '#1b4332' }}>
        <div style={{ padding: '52px 22px 20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              color: 'rgba(255,255,255,0.55)', fontSize: 13, background: 'none',
              border: 'none', cursor: 'pointer', marginBottom: 12, padding: 0,
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em',
            }}
          >
            ← Back
          </button>
          <h1 style={{
            color: '#fff', fontFamily: "'Oswald', sans-serif",
            fontWeight: 600, fontSize: 26, margin: 0,
          }}>
            Your Impact
          </h1>
          <p style={{ color: '#95d5b2', fontSize: 13, marginTop: 4 }}>Every action adds up</p>
        </div>
        <ImpactWave />
      </div>

      {/* ── Stats grid — 3 rows × 2 cols ── */}
      <div style={{ padding: '20px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {isLoading
          ? [1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse"
                   style={{ height: 100, borderRadius: 14, background: '#e5e7eb' }} />
            ))
          : <>
              {stats.map(s => (
                <div key={s.label} style={{
                  background: '#fff', borderRadius: 14,
                  padding: '14px 14px 16px',
                  border: '1px solid #ebebeb',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <p style={{
                    fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                    fontSize: 22, color: s.color, margin: '6px 0 2px',
                  }}>
                    {s.value}
                  </p>
                  <p style={{ fontSize: 11.5, color: '#888', margin: 0 }}>{s.label}</p>
                </div>
              ))}

              {/* ── 6th card: motivational (right of Total actions) ── */}
              <div style={{
                background: '#1b4332', borderRadius: 14,
                padding: '14px 14px 16px',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <span style={{
                  position: 'absolute', right: 8, top: 6,
                  fontSize: 36, opacity: 0.07, userSelect: 'none',
                }}>
                  🌍
                </span>
                <div>
                  <p style={{
                    fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                    fontSize: 13, color: '#c8952a', margin: '0 0 6px',
                    lineHeight: 1.3,
                  }}>
                    {motivation.headline}
                  </p>
                  <p style={{
                    fontSize: 11.5, color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.55, margin: 0,
                  }}>
                    {motivation.body}
                  </p>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
                }}>
                  <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: 9, opacity: 0.35 }}>🌿</span>
                </div>
              </div>
            </>
        }
      </div>

      <CasuarinaFooter />
    </div>
  )
}
