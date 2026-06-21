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

const DAILY_MESSAGES = [
  { headline: 'Climate justice starts with daily choices.', body: 'Climate change hits hardest those who did least to cause it. Every action you take helps close that gap.' },
  { headline: 'Biodiversity is not a luxury.', body: 'One in eight species faces extinction. The choices we make in daily life are among the most powerful forces we have.' },
  { headline: 'Over 2 billion people lack safe water.', body: 'Every litre you conserve shifts demand in systems that affect millions — far beyond your tap.' },
  { headline: 'Sustainability without equity is just aesthetics.', body: 'Real change includes everyone — especially those with the least power and the most to lose.' },
  { headline: 'A third of all food produced is wasted.', body: 'What we eat and how we buy it is one of the highest-leverage choices available to any individual.' },
  { headline: 'Individual acts, collective power.', body: 'No single person fixes the climate alone. But millions changing together? That is a movement.' },
  { headline: 'Taking care of the planet is self-care.', body: 'A sustainable life is also a more intentional, connected, and fulfilling one. The two are not in tension.' },
  { headline: 'We borrow this earth from our children.', body: 'Every decision you make today shapes the climate experienced for the next century. That is real power.' },
  { headline: 'Markets follow behaviour.', body: 'When millions of people change how they live, industries follow. Your choices are a form of governance.' },
  { headline: 'The most equal communities are the most resilient.', body: 'Sharing resources, sharing power, sharing futures — equity and sustainability grow from the same root.' },
  { headline: 'You are not alone in this.', body: 'Hundreds of millions of people are making the same choices right now. You are part of something vast.' },
  { headline: 'The strongest movements are local.', body: 'Change rooted in community, visible to neighbours, and contagious in conversation — that is the kind that lasts.' },
  { headline: 'Individual and systemic change are the same thing.', body: 'They operate at different scales but fuel each other. Your habit can become someone\'s policy proposal.' },
  { headline: 'Energy poverty is a justice issue.', body: 'Low-income communities bear the highest energy costs and the worst air quality. Clean energy is a shared right.' },
  { headline: 'What you eat shapes the land.', body: 'Food production accounts for roughly a quarter of global emissions. Every meal is a small vote for the food system you want.' },
  { headline: 'Circular thinking changes everything.', body: 'When nothing is waste and everything has a next life, the relationship between humanity and resources transforms.' },
  { headline: 'Children born today will live to 2100.', body: 'The systems we build now will be inherited by people who are already alive. Act like it matters — because it does.' },
  { headline: 'Transport is power — and access.', body: 'Who can move, and how, determines who participates in society. Sustainable transport is also more equitable transport.' },
  { headline: 'Small consistent acts reshape systems.', body: 'Habits repeated across millions become norms. Norms become expectations. Expectations become policy.' },
  { headline: 'The planet needs imperfect allies.', body: 'Not a handful doing sustainability perfectly — but millions doing it imperfectly, persistently, and together.' },
]

function getDailyMotivation() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length]
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
  const motivation   = getDailyMotivation()

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
