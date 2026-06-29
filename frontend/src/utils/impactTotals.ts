import type { ImpactTotals } from './impactBadges'

// Per-challenge impact by category. Conservative averages that match the backend
// impact model. Indirect categories (community, advocacy, wellbeing) save nothing
// measurable directly, so they count toward actions/streaks rather than these totals.
export const IMPACT_PER_CATEGORY: Record<string, { co2: number; water: number; waste: number }> = {
  WATER:            { co2: 0.05, water: 30,  waste: 0.0 },
  TRANSPORT:        { co2: 0.60, water: 0,   waste: 0.0 },
  FOOD:             { co2: 1.50, water: 300, waste: 0.1 },
  ENERGY:           { co2: 0.40, water: 0,   waste: 0.0 },
  WASTE:            { co2: 0.10, water: 0,   waste: 0.3 },
  CONSUMPTION:      { co2: 0.80, water: 20,  waste: 0.2 },
  BIODIVERSITY:     { co2: 0.10, water: 5,   waste: 0.0 },
  COMMUNITY:        { co2: 0.0,  water: 0,   waste: 0.0 },
  SOCIAL_EQUITY:    { co2: 0.0,  water: 0,   waste: 0.0 },
  CIRCULAR_ECONOMY: { co2: 1.00, water: 10,  waste: 0.3 },
  CLIMATE_ADVOCACY: { co2: 0.0,  water: 0,   waste: 0.0 },
  WELLBEING:        { co2: 0.0,  water: 0,   waste: 0.0 },
}

// Impact totals derived from locally stored completions (demo mode + offline
// fallback), scoped to the user's local calendar day. Returns null when there is
// nothing stored for today.
export function getLocalImpactTotals(): ImpactTotals | null {
  try {
    const raw = localStorage.getItem('challenge-tree-completions')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const today = new Date().toLocaleDateString('en-CA')
    // Support both the {date, items} shape and the legacy plain array.
    const completions: { id: string; category: string }[] = Array.isArray(parsed)
      ? parsed
      : (parsed?.date === today && Array.isArray(parsed.items) ? parsed.items : [])
    if (!completions.length) return null
    let co2 = 0, water = 0, waste = 0
    completions.forEach(({ category }) => {
      const m = IMPACT_PER_CATEGORY[category] ?? { co2: 0.1, water: 5, waste: 0.1 }
      co2 += m.co2; water += m.water; waste += m.waste
    })
    return {
      co2Saved: co2, waterSaved: water, wasteDiverted: waste,
      totalActions: completions.length, treesEquiv: co2 / 21,
    }
  } catch { return null }
}
