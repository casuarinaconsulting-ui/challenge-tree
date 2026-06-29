// Impact badges: earned by reaching cumulative-impact milestones, separate from
// the streak (species) badges. Each badge also teaches what that amount of impact
// represents in the real world. Total actions uses a distinct "rank" ladder
// rather than a physical equivalence, so it reads as a personal status.
//
// Badges are derived purely from the user's cumulative totals (the /impact
// endpoint sums every record), so there is no backend or database to keep in
// sync, and it behaves identically in demo mode.

export type ImpactMetric = 'co2' | 'water' | 'waste' | 'trees' | 'actions'

export interface ImpactBadgeTier {
  threshold: number   // cumulative value needed to unlock
  name: string        // badge title
  icon: string        // emoji
  equiv: string       // what this amount represents (the teaching line)
}

export interface ImpactMetricDef {
  metric: ImpactMetric
  field: 'co2Saved' | 'waterSaved' | 'wasteDiverted' | 'treesEquiv' | 'totalActions'
  label: string
  unit: string        // shown after the number ('kg', 'L', '')
  color: string
  unique?: boolean    // total actions: rank ladder, special styling
  tiers: ImpactBadgeTier[]  // ascending by threshold
}

export interface ImpactTotals {
  co2Saved?: number
  waterSaved?: number
  wasteDiverted?: number
  treesEquiv?: number
  totalActions?: number
}

export const IMPACT_BADGES: ImpactMetricDef[] = [
  {
    metric: 'co2', field: 'co2Saved', label: 'CO₂ saved', unit: 'kg', color: '#5e7a44',
    tiers: [
      { threshold: 1,    icon: '🌬️', name: 'First Breath',     equiv: 'About a 6 km car journey kept out of the air.' },
      { threshold: 10,   icon: '☁️', name: 'Clear Air',        equiv: 'Roughly 60 km not driven in an average car.' },
      { threshold: 25,   icon: '🌳', name: "A Tree's Year",     equiv: 'More than a mature tree absorbs in a whole year.' },
      { threshold: 100,  icon: '🌍', name: 'Climate Guardian',  equiv: 'Around 600 km of driving, kept out of the atmosphere.' },
      { threshold: 250,  icon: '💨', name: 'Carbon Crusader',   equiv: 'About a decade of a single tree carbon work.' },
      { threshold: 1000, icon: '🛡️', name: 'Tonne Tamer',       equiv: 'A full tonne of CO₂, roughly a transatlantic flight footprint.' },
    ],
  },
  {
    metric: 'water', field: 'waterSaved', label: 'Water saved', unit: 'L', color: '#2b8fb5',
    tiers: [
      { threshold: 100,   icon: '💧', name: 'First Drops',    equiv: 'About a full bathtub of water saved.' },
      { threshold: 500,   icon: '🚿', name: 'Stream Saver',   equiv: 'Around five baths kept in the system.' },
      { threshold: 1000,  icon: '🪣', name: 'Cubic Metre',    equiv: '1,000 litres, over a year of drinking water for one person.' },
      { threshold: 5000,  icon: '🌊', name: 'Tide Turner',    equiv: 'Roughly seven years of one person drinking water.' },
      { threshold: 10000, icon: '🏞️', name: 'River Keeper',   equiv: 'Ten cubic metres, about a small backyard pool.' },
      { threshold: 25000, icon: '💦', name: 'Water Guardian', equiv: 'Decades of household drinking water, saved.' },
    ],
  },
  {
    metric: 'waste', field: 'wasteDiverted', label: 'Waste diverted', unit: 'kg', color: '#7b68ae',
    tiers: [
      { threshold: 1,  icon: '♻️', name: 'First Save',        equiv: 'About 100 plastic bottles kept out of landfill.' },
      { threshold: 2,  icon: '🛍️', name: 'Bag Beater',        equiv: 'Roughly 200 plastic bottles diverted.' },
      { threshold: 5,  icon: '🗑️', name: 'Waste Warrior',     equiv: 'Around a full kitchen bin of waste, rerouted.' },
      { threshold: 10, icon: '📦', name: 'Landfill Diverter', equiv: 'About 10 bags of rubbish kept out of the ground.' },
      { threshold: 25, icon: '🌱', name: 'Circular Champion', equiv: 'Close to a month of one person household waste.' },
      { threshold: 50, icon: '🛡️', name: 'Zero-Waste Hero',   equiv: "Roughly 5,000 plastic bottles' worth, diverted." },
    ],
  },
  {
    metric: 'trees', field: 'treesEquiv', label: 'Trees equivalent', unit: '', color: '#2a9d8f',
    tiers: [
      { threshold: 0.5, icon: '🌱', name: 'Seedling',        equiv: 'Half a tree yearly carbon work, matched.' },
      { threshold: 1,   icon: '🌿', name: 'Sapling',         equiv: 'A whole tree year of carbon, matched by you.' },
      { threshold: 3,   icon: '🌳', name: 'Grove Starter',   equiv: 'Three trees working a full year.' },
      { threshold: 5,   icon: '🌲', name: 'Woodland',        equiv: 'Five trees annual carbon, absorbed.' },
      { threshold: 10,  icon: '🏕️', name: 'Forest Friend',   equiv: 'A stand of ten trees, a year of their work.' },
      { threshold: 25,  icon: '🌍', name: 'Forest Guardian', equiv: "Twenty-five trees, a real woodland's year." },
    ],
  },
  {
    metric: 'actions', field: 'totalActions', label: 'Total actions', unit: '', color: '#c8952a', unique: true,
    tiers: [
      { threshold: 1,   icon: '🌱', name: 'First Step',     equiv: 'Every movement starts with one action. This is yours.' },
      { threshold: 10,  icon: '✊', name: 'Changemaker',    equiv: 'Ten mindful choices. A habit is forming.' },
      { threshold: 25,  icon: '⭐', name: 'Trailblazer',    equiv: 'Twenty-five actions. You are setting the pace.' },
      { threshold: 50,  icon: '🔥', name: 'Force of Nature', equiv: 'Fifty actions. Momentum is yours.' },
      { threshold: 100, icon: '🏆', name: 'Centurion',      equiv: 'One hundred actions. A genuine force for change.' },
      { threshold: 250, icon: '👑', name: 'Living Legend',  equiv: 'Two hundred and fifty actions. This is what change looks like.' },
      { threshold: 500, icon: '🌟', name: 'Earthshaker',    equiv: 'Five hundred actions. Very few ever reach this.' },
    ],
  },
]

export function metricValue(totals: ImpactTotals, def: ImpactMetricDef): number {
  return Number(totals[def.field] ?? 0)
}

// Pretty-print a threshold or value with its unit.
export function formatImpact(def: ImpactMetricDef, n: number): string {
  if (def.metric === 'trees') {
    const v = Number.isInteger(n) ? n : n
    return v === 1 ? '1 tree' : `${v} trees`
  }
  if (def.metric === 'actions') return `${n.toLocaleString()} action${n === 1 ? '' : 's'}`
  return `${n.toLocaleString()} ${def.unit}`.trim()
}

export interface MetricProgress {
  def: ImpactMetricDef
  value: number
  current: ImpactBadgeTier | null
  next: ImpactBadgeTier | null
  earnedCount: number
  progress: number   // 0..1 toward the next tier (1 when all earned)
}

export function getMetricProgress(totals: ImpactTotals): MetricProgress[] {
  return IMPACT_BADGES.map(def => {
    const value = metricValue(totals, def)
    let current: ImpactBadgeTier | null = null
    let next: ImpactBadgeTier | null = null
    let earnedCount = 0
    for (const tier of def.tiers) {
      if (value >= tier.threshold) { current = tier; earnedCount++ }
      else { next = tier; break }
    }
    const prevT = current?.threshold ?? 0
    const nextT = next?.threshold ?? prevT
    const progress = next ? Math.max(0, Math.min((value - prevT) / (nextT - prevT), 1)) : 1
    return { def, value, current, next, earnedCount, progress }
  })
}

export interface EarnedImpactBadge {
  key: string        // `${metric}-${threshold}`, stable id for "seen" tracking
  metric: ImpactMetric
  def: ImpactMetricDef
  tier: ImpactBadgeTier
}

// Every impact badge the totals currently satisfy, ordered by metric then tier.
export function getEarnedImpactBadges(totals: ImpactTotals): EarnedImpactBadge[] {
  const out: EarnedImpactBadge[] = []
  for (const def of IMPACT_BADGES) {
    const value = metricValue(totals, def)
    for (const tier of def.tiers) {
      if (value >= tier.threshold) {
        out.push({ key: `${def.metric}-${tier.threshold}`, metric: def.metric, def, tier })
      }
    }
  }
  return out
}
