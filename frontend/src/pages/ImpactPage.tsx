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
    headline: 'Every movement starts somewhere.',
    body: 'Climate change hits hardest those who did least to cause it. Your first challenge is the first step toward a fairer world — where environmental justice and human dignity go hand in hand.',
  }
  if (n <= 5) return {
    headline: 'Small actions, outsized impact.',
    body: 'Inequality and environmental damage are deeply linked. Every challenge you complete shifts demand, reduces waste, and builds the habit of choosing differently — for yourself and the communities most harmed.',
  }
  if (n <= 15) return {
    headline: 'You are influencing others.',
    body: 'Research shows each person who visibly changes their behaviour inspires an average of three others. Your streak belongs not just to you — it belongs to a growing ripple of people choosing a fairer future.',
  }
  return {
    headline: 'You are proof that it works.',
    body: 'Real change is built by consistent people, not perfect ones. The gap between the world we have and the world we want is bridged one action at a time. Keep going.',
  }
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
    { icon: '🌬️', label: 'CO₂ saved',       value: `${(data?.co2Saved ?? 0).toFixed(1)} kg`,  color: '#5e7a44' },
    { icon: '💧', label: 'Water saved',      value: `${(data?.waterSaved ?? 0).toFixed(0)} L`,  color: '#2b8fb5' },
    { icon: '♻️', label: 'Waste diverted',   value: `${(data?.wasteDiverted ?? 0).toFixed(1)} kg`, color: '#7b68ae' },
    { icon: '🌳', label: 'Trees equivalent', value: `${(data?.treesEquiv ?? 0).toFixed(2)}`,    color: '#2a9d8f' },
    { icon: '✅', label: 'Total actions',    value: `${totalActions}`,                           color: '#c8952a' },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--cream)' }}>

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

      {/* ── Stats grid ── */}
      <div style={{ padding: '20px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {isLoading
          ? [1,2,3,4,5,6].map(i => (
              <div key={i}
                   className="animate-pulse"
                   style={{
                     height: i === 6 ? 140 : 100, borderRadius: 14,
                     background: '#e5e7eb',
                     gridColumn: i === 6 ? 'span 2' : undefined,
                   }} />
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

              {/* ── 6th card: motivational ── */}
              <div style={{
                gridColumn: 'span 2',
                background: '#1b4332',
                borderRadius: 14,
                padding: '22px 20px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Subtle botanical watermark */}
                <span style={{
                  position: 'absolute', right: 16, top: 12,
                  fontSize: 52, opacity: 0.08, userSelect: 'none',
                }}>
                  🌍
                </span>

                <p style={{
                  fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                  fontSize: 16, color: '#c8952a', margin: '0 0 10px',
                  letterSpacing: '0.02em',
                }}>
                  {motivation.headline}
                </p>
                <p style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.65, margin: 0,
                }}>
                  {motivation.body}
                </p>

                {/* Decorative rule */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginTop: 16,
                }}>
                  <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.18)' }} />
                  <span style={{ fontSize: 12, opacity: 0.3 }}>🌿</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                </div>
              </div>
            </>
        }
      </div>
    </div>
  )
}
