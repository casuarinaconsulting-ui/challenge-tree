import { useState } from 'react'
import {
  getMetricProgress, formatImpact,
  type ImpactTotals, type ImpactMetricDef, type EarnedImpactBadge,
} from '../utils/impactBadges'

// ── Per-metric milestone list shown on the Impact page ──
export function ImpactMilestones({ totals }: { totals: ImpactTotals }) {
  const [openDef, setOpenDef] = useState<ImpactMetricDef | null>(null)
  const rows = getMetricProgress(totals)

  return (
    <div style={{ padding: '24px 18px 0' }}>
      <div style={{
        background: '#fffdf8', border: '1px solid rgba(120,90,40,0.12)',
        boxShadow: '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)',
        borderRadius: 16, padding: '16px 16px 8px',
      }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #c8952a, transparent)', margin: '-16px -16px 14px', borderRadius: '16px 16px 0 0' }} />
        <p style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 11.5, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#2d6a4f', margin: '0 0 4px',
        }}>
          Impact milestones
        </p>
        <p style={{ fontSize: 12, color: '#8a8270', margin: '0 0 8px', lineHeight: 1.45 }}>
          Earn a badge as your impact grows. Tap any row to see the full set.
        </p>

        {rows.map(({ def, current, next, earnedCount, progress }, i) => (
          <button
            key={def.metric}
            onClick={() => setOpenDef(def)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)', padding: '12px 0',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 13, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              background: `${def.color}14`, border: `1px solid ${def.color}30`,
              filter: current ? undefined : 'grayscale(1)', opacity: current ? 1 : 0.45,
            }}>
              {current ? current.icon : def.tiers[0].icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600, color: '#1b4332',
                }}>
                  {def.label}
                </span>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 11.5, letterSpacing: '0.03em',
                  color: def.color, flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                  {current ? (def.unique ? `Rank: ${current.name}` : current.name) : 'No badge yet'}
                </span>
              </div>

              <div style={{ height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.06)', overflow: 'hidden', margin: '6px 0 4px' }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  width: `${Math.max(progress * 100, current ? 8 : 3)}%`,
                  background: `linear-gradient(90deg, ${def.color}, ${def.color}bb)`,
                  transition: 'width 0.6s ease',
                }} />
              </div>

              <div style={{ fontSize: 11, color: '#8a8270', overflowWrap: 'break-word' }}>
                {next ? `Next: ${next.name} at ${formatImpact(def, next.threshold)}` : `All ${earnedCount} earned 🎉`}
              </div>
            </div>

            <span style={{ color: def.color, fontSize: 16, flexShrink: 0 }}>›</span>
          </button>
        ))}
      </div>

      {openDef && <LadderModal def={openDef} totals={totals} onClose={() => setOpenDef(null)} />}
    </div>
  )
}

// ── Compact summary for the Profile page, shown alongside the streak badges ──
export function ImpactBadgeSummary({ totals, onOpen }: { totals: ImpactTotals; onOpen?: () => void }) {
  const rows = getMetricProgress(totals)
  const earnedTotal = rows.reduce((n, r) => n + r.earnedCount, 0)

  return (
    <button
      onClick={onOpen}
      className="card-3d animate-slide-up"
      style={{
        width: '100%', textAlign: 'left', cursor: onOpen ? 'pointer' : 'default',
        borderRadius: 22, padding: '18px 20px', marginBottom: 14,
        background: '#fffdf8', border: '1px solid rgba(120,90,40,0.10)',
        boxShadow: '0 10px 26px rgba(95,82,55,0.10), 0 1px 0 rgba(255,255,255,0.7)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#1b4332', margin: 0,
        }}>
          Impact Badges
        </h3>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12.5, color: '#c8952a', letterSpacing: '0.06em' }}>
            {earnedTotal} earned
          </span>
          {onOpen && <span style={{ color: '#c8952a', fontSize: 15 }}>›</span>}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {rows.map(({ def, current, earnedCount }) => {
          const earned = !!current
          return (
            <div key={def.metric} style={{ textAlign: 'center', minWidth: 0 }}>
              <div style={{
                height: 50, borderRadius: 14, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 23,
                background: `${def.color}14`, border: `1px solid ${def.color}30`,
                filter: earned ? undefined : 'grayscale(1)', opacity: earned ? 1 : 0.4,
              }}>
                {earned ? current!.icon : def.tiers[0].icon}
                {earnedCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -6, right: -5,
                    minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
                    background: def.color, color: '#fff', fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Oswald', sans-serif", border: '1.5px solid #fffdf8',
                  }}>
                    {earnedCount}
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 10.5, color: '#8a8270', marginTop: 5,
                letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {def.short}
              </div>
            </div>
          )
        })}
      </div>
    </button>
  )
}

// ── Full ladder for one metric (bottom sheet), showing each tier + what it means ──
function LadderModal({ def, totals, onClose }: { def: ImpactMetricDef; totals: ImpactTotals; onClose: () => void }) {
  const value = Number((totals as any)[def.field] ?? 0)
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 320, background: 'rgba(10,28,18,0.78)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      backdropFilter: 'blur(6px)', animation: 'fadeIn 0.25s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, maxHeight: '88vh', overflowY: 'auto',
        background: '#fffdf8', borderRadius: '24px 24px 0 0', border: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${def.color} 0%, ${def.color}cc 100%)`,
          padding: '22px 22px 18px', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.45)', margin: '0 auto 14px' }} />
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', marginBottom: 4,
          }}>
            {def.unique ? 'Action ranks' : 'Impact badges'}
          </div>
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 22, color: '#fff',
            margin: 0, lineHeight: 1.15,
          }}>
            {def.label}: {formatImpact(def, def.metric === 'co2' || def.metric === 'waste' ? Number(value.toFixed(1)) : def.metric === 'trees' ? Number(value.toFixed(2)) : Math.round(value))}
          </h2>
        </div>

        <div style={{ padding: '14px 16px 26px' }}>
          {def.tiers.map(tier => {
            const earned = value >= tier.threshold
            return (
              <div key={tier.threshold} style={{
                display: 'flex', alignItems: 'center', gap: 13, padding: '12px 12px',
                borderRadius: 14, marginBottom: 8,
                background: earned ? `${def.color}0f` : '#f4efe6',
                border: `1px solid ${earned ? def.color + '33' : 'rgba(0,0,0,0.05)'}`,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  background: earned ? '#fff' : 'transparent',
                  filter: earned ? undefined : 'grayscale(1)', opacity: earned ? 1 : 0.4,
                }}>
                  {tier.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 15,
                      color: earned ? '#1b4332' : '#9a917f',
                    }}>
                      {tier.name}
                    </span>
                    <span style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 11.5, letterSpacing: '0.04em',
                      color: earned ? def.color : '#b3a98f', flexShrink: 0, whiteSpace: 'nowrap',
                    }}>
                      {earned ? 'Earned ✓' : formatImpact(def, tier.threshold)}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: earned ? '#5a5444' : '#a59a82', lineHeight: 1.45, margin: '3px 0 0' }}>
                    {tier.equiv}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Celebration shown once when a new impact badge is earned ──
export function ImpactBadgeModal({ badge, totals, onClose }: { badge: EarnedImpactBadge; totals: ImpactTotals; onClose: () => void }) {
  const { def, tier } = badge
  const value = Number((totals as any)[def.field] ?? 0)
  const valueLabel = formatImpact(def,
    def.metric === 'co2' || def.metric === 'waste' ? Number(value.toFixed(1))
    : def.metric === 'trees' ? Number(value.toFixed(2)) : Math.round(value))

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,18,12,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', backdropFilter: 'blur(16px)', animation: 'fadeIn 0.25s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(160deg, #132b1e 0%, #0a1c12 100%)',
        borderRadius: 28, padding: '0 0 26px', maxWidth: 360, width: '100%',
        textAlign: 'center', border: `1px solid ${def.color}44`,
        boxShadow: `0 0 80px ${def.color}22, 0 30px 60px rgba(0,0,0,0.6)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${def.color}38, transparent)`,
          borderBottom: `1px solid ${def.color}44`, padding: '28px 24px 22px', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.05) 50%, transparent 65%)',
            animation: 'shimmerLine 3s linear infinite',
          }} />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${def.color}26`, border: `1px solid ${def.color}55`,
            borderRadius: 999, padding: '4px 14px', marginBottom: 16,
          }}>
            <span style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 11, color: '#fff',
              letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.92,
            }}>
              {def.unique ? 'New rank' : 'Impact badge'}
            </span>
          </div>
          <div style={{
            fontSize: 76, lineHeight: 1, marginBottom: 8,
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
            animation: 'badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {tier.icon}
          </div>
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 26, color: '#fff',
            margin: 0, lineHeight: 1.12, textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>
            {tier.name}
          </h2>
          <p style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 12.5, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: def.color, margin: '6px 0 0',
          }}>
            {def.label} · {valueLabel}
          </p>
        </div>

        <div style={{ padding: '20px 24px 4px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
            background: `${def.color}1a`, border: `1px solid ${def.color}33`,
            borderRadius: 12, padding: '12px 14px', marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>{def.unique ? '🚀' : '🌍'}</span>
            <span style={{ fontSize: 13.5, color: '#cdeadd', lineHeight: 1.45 }}>{tier.equiv}</span>
          </div>
          <button onClick={onClose} style={{
            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${def.color}, ${def.color}cc)`, color: '#fff',
            fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 14,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {def.unique ? 'Keep going' : 'Love that'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes badgePop {
          from { transform: scale(0.4) rotate(-15deg); opacity: 0 }
          to   { transform: scale(1) rotate(0deg);    opacity: 1 }
        }
        @keyframes shimmerLine {
          0%   { transform: translateX(-30%) }
          100% { transform: translateX(30%) }
        }
      `}</style>
    </div>
  )
}
