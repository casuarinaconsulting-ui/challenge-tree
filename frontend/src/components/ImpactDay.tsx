import type { ImpactDay } from '../utils/impactDays'
import { getUpcomingImpactDays } from '../utils/impactDays'

// Upcoming impact days list for the Impact page (light theme).
export function UpcomingImpactDays({ country }: { country?: string | null }) {
  const items = getUpcomingImpactDays(new Date(), 6, country)
  if (!items.length) return null

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const dateLabel = (d: Date) => {
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Tomorrow'
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  }

  return (
    <div style={{ padding: '24px 18px 0' }}>
      <div style={{
        background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(45,106,79,0.12)',
        borderRadius: 16, padding: '16px 16px 6px',
      }}>
        <p style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 11.5, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#2d6a4f', margin: '0 0 12px',
        }}>
          Upcoming impact days
        </p>
        {items.map(({ day, date }, i) => (
          <div key={day.name + i} style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '10px 0',
            borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)',
          }}>
            <span style={{ fontSize: 21, lineHeight: 1, flexShrink: 0, width: 24, textAlign: 'center' }}>{day.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13.5, color: '#1b4332', fontWeight: 500, lineHeight: 1.25,
                overflowWrap: 'break-word', wordBreak: 'break-word',
              }}>{day.name}</div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 10, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: day.color, marginTop: 2,
              }}>
                {day.theme === 'social' ? 'Social' : 'Environmental'}
              </div>
            </div>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 12, color: '#566c60',
              flexShrink: 0, letterSpacing: '0.03em', whiteSpace: 'nowrap', marginLeft: 4,
            }}>
              {dateLabel(date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Slim, all-day banner shown on the home screen when today is an impact day.
export function ImpactDayBanner({ day, onOpen }: { day: ImpactDay; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        textAlign: 'left', cursor: 'pointer',
        background: `linear-gradient(135deg, ${day.color}14 0%, ${day.color}05 100%)`,
        border: `1px solid ${day.color}33`, borderRadius: 16,
        padding: '12px 14px', marginBottom: 16,
      }}
    >
      <span style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{day.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 10.5, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: day.color, marginBottom: 2,
        }}>
          {day.theme === 'social' ? 'Social impact day' : 'Environmental impact day'}
        </div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 15,
          color: '#1b4332', lineHeight: 1.15,
          overflowWrap: 'break-word', wordBreak: 'break-word',
        }}>
          {day.name}
        </div>
      </div>
      <span style={{ color: day.color, fontSize: 18, flexShrink: 0 }}>›</span>
    </button>
  )
}

// Once-per-day celebratory modal, mirroring the badge unlock moment.
export function ImpactDayModal({ day, onClose }: { day: ImpactDay; onClose: () => void }) {
  // Scale the title down for longer names so it always fits the card width
  // (longest is "International Day for Biological Diversity").
  const n = day.name.length
  const titleSize = n > 30 ? 20 : n > 24 ? 22 : n > 18 ? 24 : 26
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(5,18,12,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backdropFilter: 'blur(16px)', animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #132b1e 0%, #0a1c12 100%)',
          borderRadius: 28, padding: '0 0 26px', maxWidth: 360, width: '100%',
          textAlign: 'center', border: `1px solid ${day.color}44`,
          boxShadow: `0 0 80px ${day.color}22, 0 30px 60px rgba(0,0,0,0.6)`,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Top colour band */}
        <div style={{
          background: `linear-gradient(135deg, ${day.color}38, transparent)`,
          borderBottom: `1px solid ${day.color}44`,
          padding: '28px 24px 22px', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)',
            animation: 'shimmerLine 3s linear infinite',
          }} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${day.color}26`, border: `1px solid ${day.color}55`,
            borderRadius: 999, padding: '4px 14px', marginBottom: 16,
          }}>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 11.5, color: '#fff',
              letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.92,
            }}>
              Today is
            </span>
          </div>

          <div style={{
            fontSize: 76, lineHeight: 1, marginBottom: 8,
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
            animation: 'badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {day.emoji}
          </div>

          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: titleSize,
            color: '#fff', margin: 0, lineHeight: 1.12, textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            overflowWrap: 'break-word', wordBreak: 'break-word',
          }}>
            {day.name}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 4px' }}>
          <p style={{
            fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.82)', margin: '0 0 16px',
          }}>
            {day.blurb}
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
            background: `${day.color}1a`, border: `1px solid ${day.color}33`,
            borderRadius: 12, padding: '11px 14px', marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>🌱</span>
            <span style={{ fontSize: 13.5, color: '#cdeadd', lineHeight: 1.4 }}>{day.action}</span>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${day.color}, ${day.color}cc)`, color: '#fff',
              fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 14,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          >
            Let's go
          </button>
        </div>
      </div>
    </div>
  )
}
