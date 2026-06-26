// Environmental "impact days" (global observances, plus region-specific ones).
// Surfaced in the app to build awareness, the way streak badges celebrate
// progress. Dates are fixed Gregorian dates (month 1-12, day 1-31).

export interface ImpactDay {
  name: string
  month: number
  day: number
  emoji: string
  blurb: string        // one mindful sentence
  action: string       // a small, concrete nudge tied to the app
  color: string        // accent colour
  region?: string      // omit or 'global' for everyone; else match user's country
}

const BLUE = '#2b8fb5'
const GREEN = '#2d6a4f'
const TEAL = '#2a9d8f'
const GOLD = '#c8952a'
const CORAL = '#b85c38'
const LEAF = '#5e7a44'
const PURPLE = '#7b68ae'

export const IMPACT_DAYS: ImpactDay[] = [
  { name: 'World Wetlands Day', month: 2, day: 2, emoji: '🪷', color: BLUE,
    blurb: 'Wetlands store carbon, filter water, and shelter countless species, yet we have lost most of them.',
    action: 'Save water today and let a little wildness be.' },
  { name: 'World Wildlife Day', month: 3, day: 3, emoji: '🦒', color: GOLD,
    blurb: 'A million species face extinction. Every habitat protected is a lifeline.',
    action: 'Take a biodiversity challenge today.' },
  { name: 'International Day of Action for Rivers', month: 3, day: 14, emoji: '🏞️', color: BLUE,
    blurb: 'Healthy rivers carry life. What we pour down the drain ends up downstream.',
    action: 'Be mindful of what goes into the water today.' },
  { name: 'International Day of Forests', month: 3, day: 21, emoji: '🌳', color: GREEN,
    blurb: 'Forests are the lungs of the planet and home to 80% of land biodiversity.',
    action: 'Do your learning on Ecosia today, it funds tree planting.' },
  { name: 'World Water Day', month: 3, day: 22, emoji: '💧', color: BLUE,
    blurb: '2 billion people lack safe drinking water. Every litre saved matters.',
    action: 'Pick a water challenge today.' },
  { name: 'World Meteorological Day', month: 3, day: 23, emoji: '🌦️', color: TEAL,
    blurb: 'The last ten years were the warmest on record. The climate is telling us something.',
    action: 'Cut some carbon today, every action bends the curve.' },
  { name: 'Earth Day', month: 4, day: 22, emoji: '🌍', color: TEAL,
    blurb: 'A billion people act for the planet today. You are one of them.',
    action: 'Complete all three challenges today.' },
  { name: 'World Bee Day', month: 5, day: 20, emoji: '🐝', color: GOLD,
    blurb: '75% of food crops depend on pollinators. Protecting insects is food security.',
    action: 'Choose a biodiversity or food challenge today.' },
  { name: 'International Day for Biological Diversity', month: 5, day: 22, emoji: '🦋', color: PURPLE,
    blurb: 'Biodiversity is the immune system of the planet. Diversity keeps everything stable.',
    action: 'Take a biodiversity challenge today.' },
  { name: 'World Bicycle Day', month: 6, day: 3, emoji: '🚲', color: LEAF,
    blurb: 'Cycling is zero-emission, healthy, and one of the simplest climate wins there is.',
    action: 'Try a transport challenge today.' },
  { name: 'World Environment Day', month: 6, day: 5, emoji: '🌿', color: GREEN,
    blurb: 'The biggest environmental day of the year. The solutions exist, what is needed is will.',
    action: 'Make today count, finish all three challenges.' },
  { name: 'World Oceans Day', month: 6, day: 8, emoji: '🌊', color: BLUE,
    blurb: 'The ocean produces half our oxygen and absorbs a quarter of our carbon. It needs us.',
    action: 'Cut plastic and save water today.' },
  { name: 'Desertification and Drought Day', month: 6, day: 17, emoji: '🏜️', color: CORAL,
    blurb: 'Healthy soil holds water and feeds the world. Once it degrades, recovery takes generations.',
    action: 'Pick a food or water challenge today.' },
  { name: 'International Plastic Bag Free Day', month: 7, day: 3, emoji: '🛍️', color: TEAL,
    blurb: 'Only 9% of plastic ever made has been recycled. Refusing it is the real fix.',
    action: 'Take a waste challenge today.' },
  { name: 'World Nature Conservation Day', month: 7, day: 28, emoji: '🌲', color: GREEN,
    blurb: 'We protect what we love, and we love what we know. Spend a moment with the natural world.',
    action: 'Choose a biodiversity challenge today.' },
  { name: 'National Threatened Species Day', month: 9, day: 7, emoji: '🐨', color: GOLD, region: 'Australia',
    blurb: 'Australia has one of the highest extinction rates on Earth. Local action protects what remains.',
    action: 'Take a biodiversity challenge today.' },
  { name: 'World Ozone Day', month: 9, day: 16, emoji: '🌐', color: TEAL,
    blurb: 'The ozone layer is healing, proof that global cooperation on the environment works.',
    action: 'Cut some energy use today.' },
  { name: 'World Car-Free Day', month: 9, day: 22, emoji: '🚶', color: LEAF,
    blurb: 'Transport is a quarter of global emissions. The most sustainable trip is the one not driven.',
    action: 'Walk, cycle, or take transit today.' },
  { name: 'Food Loss and Waste Awareness Day', month: 9, day: 29, emoji: '🍎', color: CORAL,
    blurb: 'A third of all food is wasted while millions go hungry. This is a distribution failure we can fix.',
    action: 'Take a food challenge today.' },
  { name: 'World Animal Day', month: 10, day: 4, emoji: '🐾', color: GOLD,
    blurb: 'We share this planet with every other living thing. Their wellbeing and ours are not separate.',
    action: 'Choose a biodiversity challenge today.' },
  { name: 'World Food Day', month: 10, day: 16, emoji: '🌽', color: CORAL,
    blurb: 'A plant-rich diet is the single highest-impact food choice for the planet.',
    action: 'Cook a plant-based meal today.' },
  { name: 'World Soil Day', month: 12, day: 5, emoji: '🌱', color: LEAF,
    blurb: 'A teaspoon of healthy soil holds more organisms than there are people on Earth.',
    action: 'Compost or take a food challenge today.' },
  { name: 'International Mountain Day', month: 12, day: 11, emoji: '⛰️', color: GREEN,
    blurb: 'Mountains supply freshwater to half the world. What happens upstream reaches us all.',
    action: 'Save water today.' },
]

// The impact day for a given date, preferring a match for the user's country.
export function getImpactDayFor(date: Date = new Date(), country?: string | null): ImpactDay | null {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const matches = IMPACT_DAYS.filter(x => x.month === m && x.day === d)
  if (!matches.length) return null
  if (country) {
    const regional = matches.find(x => x.region && x.region.toLowerCase() === country.toLowerCase())
    if (regional) return regional
  }
  return matches.find(x => !x.region || x.region === 'global') ?? matches[0]
}
