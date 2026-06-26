// Environmental and social "impact days" (global observances, plus region-
// specific ones). Surfaced in the app to build awareness, the way streak badges
// celebrate progress. Most have a fixed Gregorian date; some float (e.g. "last
// Saturday of March") and are resolved per year.

export interface ImpactDay {
  name: string
  month: number                       // 1-12
  day?: number                        // fixed date; omit when `floating` is set
  floating?: { weekday: number; nth: number | 'last' }  // weekday 0=Sun..6=Sat
  emoji: string
  blurb: string                       // one mindful sentence
  action: string                      // a small, concrete nudge tied to the app
  color: string                       // accent colour
  category?: string                   // app challenge category this day relates to
  theme?: 'environmental' | 'social'  // defaults to environmental
  region?: string                     // omit or 'global' for everyone; else match user's country
}

const BLUE = '#2b8fb5'
const GREEN = '#2d6a4f'
const TEAL = '#2a9d8f'
const GOLD = '#c8952a'
const CORAL = '#b85c38'
const LEAF = '#5e7a44'
const PURPLE = '#7b68ae'
const ROSE = '#c45d7c'

export const IMPACT_DAYS: ImpactDay[] = [
  // ── Environmental, fixed dates ──
  { name: 'World Wetlands Day', month: 2, day: 2, emoji: '🪷', color: BLUE, category: 'WATER',
    blurb: 'Wetlands store carbon, filter water, and shelter countless species, yet we have lost most of them.',
    action: 'Save water today and let a little wildness be.' },
  { name: 'World Wildlife Day', month: 3, day: 3, emoji: '🦒', color: GOLD, category: 'BIODIVERSITY',
    blurb: 'A million species face extinction. Every habitat protected is a lifeline.',
    action: 'Take a biodiversity challenge today.' },
  { name: 'International Day of Action for Rivers', month: 3, day: 14, emoji: '🏞️', color: BLUE, category: 'WATER',
    blurb: 'Healthy rivers carry life. What we pour down the drain ends up downstream.',
    action: 'Be mindful of what goes into the water today.' },
  { name: 'International Day of Forests', month: 3, day: 21, emoji: '🌳', color: GREEN, category: 'BIODIVERSITY',
    blurb: 'Forests are the lungs of the planet and home to 80% of land biodiversity.',
    action: 'Do your learning on Ecosia today, it funds tree planting.' },
  { name: 'World Water Day', month: 3, day: 22, emoji: '💧', color: BLUE, category: 'WATER',
    blurb: '2 billion people lack safe drinking water. Every litre saved matters.',
    action: 'Pick a water challenge today.' },
  { name: 'World Meteorological Day', month: 3, day: 23, emoji: '🌦️', color: TEAL, category: 'ENERGY',
    blurb: 'The last ten years were the warmest on record. The climate is telling us something.',
    action: 'Cut some carbon today, every action bends the curve.' },
  { name: 'Earth Day', month: 4, day: 22, emoji: '🌍', color: TEAL, category: 'CLIMATE_ADVOCACY',
    blurb: 'A billion people act for the planet today. You are one of them.',
    action: 'Complete all three challenges today.' },
  { name: 'World Bee Day', month: 5, day: 20, emoji: '🐝', color: GOLD, category: 'BIODIVERSITY',
    blurb: '75% of food crops depend on pollinators. Protecting insects is food security.',
    action: 'Choose a biodiversity or food challenge today.' },
  { name: 'International Day for Biological Diversity', month: 5, day: 22, emoji: '🦋', color: PURPLE, category: 'BIODIVERSITY',
    blurb: 'Biodiversity is the immune system of the planet. Diversity keeps everything stable.',
    action: 'Take a biodiversity challenge today.' },
  { name: 'World Bicycle Day', month: 6, day: 3, emoji: '🚲', color: LEAF, category: 'TRANSPORT',
    blurb: 'Cycling is zero-emission, healthy, and one of the simplest climate wins there is.',
    action: 'Try a transport challenge today.' },
  { name: 'World Environment Day', month: 6, day: 5, emoji: '🌿', color: GREEN, category: 'CLIMATE_ADVOCACY',
    blurb: 'The biggest environmental day of the year. The solutions exist, what is needed is will.',
    action: 'Make today count, finish all three challenges.' },
  { name: 'World Oceans Day', month: 6, day: 8, emoji: '🌊', color: BLUE, category: 'WATER',
    blurb: 'The ocean produces half our oxygen and absorbs a quarter of our carbon. It needs us.',
    action: 'Cut plastic and save water today.' },
  { name: 'Desertification and Drought Day', month: 6, day: 17, emoji: '🏜️', color: CORAL, category: 'FOOD',
    blurb: 'Healthy soil holds water and feeds the world. Once it degrades, recovery takes generations.',
    action: 'Pick a food or water challenge today.' },
  { name: 'International Plastic Bag Free Day', month: 7, day: 3, emoji: '🛍️', color: TEAL, category: 'WASTE',
    blurb: 'Only 9% of plastic ever made has been recycled. Refusing it is the real fix.',
    action: 'Take a waste challenge today.' },
  { name: 'World Nature Conservation Day', month: 7, day: 28, emoji: '🌲', color: GREEN, category: 'BIODIVERSITY',
    blurb: 'We protect what we love, and we love what we know. Spend a moment with the natural world.',
    action: 'Choose a biodiversity challenge today.' },
  { name: 'National Threatened Species Day', month: 9, day: 7, emoji: '🐨', color: GOLD, category: 'BIODIVERSITY', region: 'Australia',
    blurb: 'Australia has one of the highest extinction rates on Earth. Local action protects what remains.',
    action: 'Take a biodiversity challenge today.' },
  { name: 'World Ozone Day', month: 9, day: 16, emoji: '🌐', color: TEAL, category: 'ENERGY',
    blurb: 'The ozone layer is healing, proof that global cooperation on the environment works.',
    action: 'Cut some energy use today.' },
  { name: 'World Car-Free Day', month: 9, day: 22, emoji: '🚶', color: LEAF, category: 'TRANSPORT',
    blurb: 'Transport is a quarter of global emissions. The most sustainable trip is the one not driven.',
    action: 'Walk, cycle, or take transit today.' },
  { name: 'Food Loss and Waste Awareness Day', month: 9, day: 29, emoji: '🍎', color: CORAL, category: 'FOOD',
    blurb: 'A third of all food is wasted while millions go hungry. This is a distribution failure we can fix.',
    action: 'Take a food challenge today.' },
  { name: 'World Animal Day', month: 10, day: 4, emoji: '🐾', color: GOLD, category: 'BIODIVERSITY',
    blurb: 'We share this planet with every other living thing. Their wellbeing and ours are not separate.',
    action: 'Choose a biodiversity challenge today.' },
  { name: 'World Food Day', month: 10, day: 16, emoji: '🌽', color: CORAL, category: 'FOOD',
    blurb: 'A plant-rich diet is the single highest-impact food choice for the planet.',
    action: 'Cook a plant-based meal today.' },
  { name: 'World Soil Day', month: 12, day: 5, emoji: '🌱', color: LEAF, category: 'FOOD',
    blurb: 'A teaspoon of healthy soil holds more organisms than there are people on Earth.',
    action: 'Compost or take a food challenge today.' },
  { name: 'International Mountain Day', month: 12, day: 11, emoji: '⛰️', color: GREEN, category: 'WATER',
    blurb: 'Mountains supply freshwater to half the world. What happens upstream reaches us all.',
    action: 'Save water today.' },

  // ── Environmental, floating dates ──
  { name: 'Earth Hour', month: 3, floating: { weekday: 6, nth: 'last' }, emoji: '🌑', color: TEAL, category: 'ENERGY',
    blurb: 'Hundreds of millions switch off their lights for one hour, a global signal for the planet.',
    action: 'Switch off non-essential lights and devices today.' },
  { name: 'World Migratory Bird Day', month: 5, floating: { weekday: 6, nth: 2 }, emoji: '🐦', color: BLUE, category: 'BIODIVERSITY',
    blurb: 'Billions of birds cross the globe each year. Their journeys connect every ecosystem.',
    action: 'Take a biodiversity challenge today.' },
  { name: 'World Cleanup Day', month: 9, floating: { weekday: 6, nth: 3 }, emoji: '🧹', color: TEAL, category: 'WASTE',
    blurb: 'Millions clean up litter in one of the largest civic actions on Earth.',
    action: 'Take a waste challenge today.' },

  // ── Social impact days, fixed ──
  { name: 'World Day of Social Justice', month: 2, day: 20, emoji: '⚖️', color: ROSE, theme: 'social', category: 'SOCIAL_EQUITY',
    blurb: 'A fair society is a stable one. Social justice and environmental justice are the same fight.',
    action: 'Take a social equity challenge today.' },
  { name: 'International Women\'s Day', month: 3, day: 8, emoji: '💜', color: ROSE, theme: 'social', category: 'SOCIAL_EQUITY',
    blurb: 'When women lead, social and environmental outcomes improve. Equality lifts everyone.',
    action: 'Take a social equity challenge today.' },
  { name: 'International Day of Happiness', month: 3, day: 20, emoji: '😊', color: GOLD, theme: 'social', category: 'WELLBEING',
    blurb: 'Wellbeing, not just wealth, is the real measure of progress.',
    action: 'Take a wellbeing challenge today.' },
  { name: 'World Health Day', month: 4, day: 7, emoji: '❤️', color: CORAL, theme: 'social', category: 'WELLBEING',
    blurb: 'Healthy people, healthy planet. Clean air, water, and food underpin both.',
    action: 'Take a wellbeing challenge today.' },
  { name: 'World Day Against Child Labour', month: 6, day: 12, emoji: '✋', color: ROSE, theme: 'social', category: 'SOCIAL_EQUITY',
    blurb: 'Every child deserves school, not labour. The supply chains we choose shape their futures.',
    action: 'Take a social equity challenge today.' },
  { name: 'World Refugee Day', month: 6, day: 20, emoji: '🕊️', color: BLUE, theme: 'social', category: 'COMMUNITY',
    blurb: 'Millions are displaced, increasingly by climate. Welcome and dignity are a shared duty.',
    action: 'Take a community challenge today.' },
  { name: 'Nelson Mandela International Day', month: 7, day: 18, emoji: '✊', color: GOLD, theme: 'social', category: 'COMMUNITY',
    blurb: 'It is in your hands to make the world a better place. Give a little of your time in service.',
    action: 'Take a community challenge today.' },
  { name: 'International Youth Day', month: 8, day: 12, emoji: '🌱', color: TEAL, theme: 'social', category: 'CLIMATE_ADVOCACY',
    blurb: 'Young people are leading the movement for a fairer, greener world.',
    action: 'Take an advocacy challenge today.' },
  { name: 'World Humanitarian Day', month: 8, day: 19, emoji: '🤝', color: TEAL, theme: 'social', category: 'COMMUNITY',
    blurb: 'Humanitarian need is rising with climate shocks. Solidarity is the response.',
    action: 'Take a community challenge today.' },
  { name: 'International Literacy Day', month: 9, day: 8, emoji: '📖', color: PURPLE, theme: 'social', category: 'SOCIAL_EQUITY',
    blurb: 'Education is the highest-leverage investment in equity and the planet alike.',
    action: 'Do your learning on Ecosia today.' },
  { name: 'International Day of Peace', month: 9, day: 21, emoji: '🕊️', color: BLUE, theme: 'social', category: 'COMMUNITY',
    blurb: 'No country has reached sustainability through conflict. Peace is the precondition.',
    action: 'Take a community challenge today.' },
  { name: 'International Day of Non-Violence', month: 10, day: 2, emoji: '☮️', color: BLUE, theme: 'social', category: 'CLIMATE_ADVOCACY',
    blurb: 'Non-violence is the most effective tool for durable change, history shows it.',
    action: 'Take an advocacy challenge today.' },
  { name: 'International Day of the Girl', month: 10, day: 11, emoji: '👧', color: ROSE, theme: 'social', category: 'SOCIAL_EQUITY',
    blurb: 'Educating and empowering girls is one of the most powerful climate solutions there is.',
    action: 'Take a social equity challenge today.' },
  { name: 'Day for the Eradication of Poverty', month: 10, day: 17, emoji: '🤲', color: CORAL, theme: 'social', category: 'SOCIAL_EQUITY',
    blurb: 'Poverty and environmental harm trap the same communities. Lifting one lifts the other.',
    action: 'Take a social equity challenge today.' },
  { name: 'World Children\'s Day', month: 11, day: 20, emoji: '🧒', color: GOLD, theme: 'social', category: 'CLIMATE_ADVOCACY',
    blurb: 'Today\'s children will inherit this decade\'s decisions. We owe them a livable world.',
    action: 'Take an advocacy challenge today.' },
  { name: 'Day to End Violence Against Women', month: 11, day: 25, emoji: '💜', color: ROSE, theme: 'social', category: 'SOCIAL_EQUITY',
    blurb: 'Safety and equality are the foundation of any just, sustainable society.',
    action: 'Take a social equity challenge today.' },
  { name: 'Day of Persons with Disabilities', month: 12, day: 3, emoji: '♿', color: BLUE, theme: 'social', category: 'SOCIAL_EQUITY',
    blurb: 'Inclusive design serves everyone. Accessibility is a measure of a fair society.',
    action: 'Take a social equity challenge today.' },
  { name: 'Human Rights Day', month: 12, day: 10, emoji: '✊', color: ROSE, theme: 'social', category: 'CLIMATE_ADVOCACY',
    blurb: 'Where human rights are protected, environmental rights tend to follow.',
    action: 'Take an advocacy challenge today.' },
  { name: 'International Migrants Day', month: 12, day: 18, emoji: '🧳', color: TEAL, theme: 'social', category: 'COMMUNITY',
    blurb: 'Migration, increasingly climate-driven, calls for dignity and shared responsibility.',
    action: 'Take a community challenge today.' },
  { name: 'International Human Solidarity Day', month: 12, day: 20, emoji: '🤝', color: TEAL, theme: 'social', category: 'COMMUNITY',
    blurb: 'We are because we are. No one flourishes alone.',
    action: 'Take a community challenge today.' },

  // ── Social impact days, floating ──
  { name: 'International Day of Cooperatives', month: 7, floating: { weekday: 6, nth: 1 }, emoji: '🤝', color: PURPLE, theme: 'social', category: 'COMMUNITY',
    blurb: 'Co-operatives put people and planet before profit. Shared ownership builds resilience.',
    action: 'Take a community challenge today.' },
  { name: 'World Habitat Day', month: 10, floating: { weekday: 1, nth: 1 }, emoji: '🏘️', color: CORAL, theme: 'social', category: 'COMMUNITY',
    blurb: 'Everyone deserves a safe, decent place to live. Cities shape our footprint and our fairness.',
    action: 'Take a community challenge today.' },
]

// Day-of-month for the nth (or last) given weekday in a month/year.
function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number | 'last'): number {
  const lastDate = new Date(year, month, 0).getDate()
  if (nth === 'last') {
    for (let d = lastDate; d >= 1; d--) {
      if (new Date(year, month - 1, d).getDay() === weekday) return d
    }
    return -1
  }
  let count = 0
  for (let d = 1; d <= lastDate; d++) {
    if (new Date(year, month - 1, d).getDay() === weekday) {
      if (++count === nth) return d
    }
  }
  return -1
}

// The calendar day-of-month an impact day falls on in a given year.
export function resolvedDay(x: ImpactDay, year: number): number {
  if (x.floating) return nthWeekdayOfMonth(year, x.month, x.floating.weekday, x.floating.nth)
  return x.day ?? -1
}

function matchesRegion(x: ImpactDay, country?: string | null): boolean {
  if (!x.region || x.region === 'global') return true
  return !!country && x.region.toLowerCase() === country.toLowerCase()
}

// The impact day for a given date, preferring a match for the user's country.
export function getImpactDayFor(date: Date = new Date(), country?: string | null): ImpactDay | null {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const y = date.getFullYear()
  const matches = IMPACT_DAYS.filter(x => x.month === m && resolvedDay(x, y) === d)
  if (!matches.length) return null
  if (country) {
    const regional = matches.find(x => x.region && x.region !== 'global' && matchesRegion(x, country))
    if (regional) return regional
  }
  return matches.find(x => matchesRegion(x, country)) ?? null
}

// The soonest `count` upcoming impact days from `from` (inclusive of today).
export function getUpcomingImpactDays(from: Date = new Date(), count = 6, country?: string | null) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const out: { day: ImpactDay; date: Date }[] = []
  for (const x of IMPACT_DAYS) {
    if (!matchesRegion(x, country)) continue
    for (const yr of [today.getFullYear(), today.getFullYear() + 1]) {
      const d = resolvedDay(x, yr)
      if (d < 1) continue
      const dt = new Date(yr, x.month - 1, d)
      if (dt >= today) { out.push({ day: x, date: dt }); break }
    }
  }
  out.sort((a, b) => a.date.getTime() - b.date.getTime())
  return out.slice(0, count)
}
