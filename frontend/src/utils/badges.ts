export interface BadgeData {
  threshold: number
  level: number
  name: string
  icon: string
  status: 'Vulnerable' | 'Endangered' | 'Critically Endangered'
  statusColor: string
  population: string
  habitat: string
  funFact: string
}

export const BADGE_DATA: BadgeData[] = [
  {
    threshold: 1, level: 1,
    name: 'Siberian Tiger', icon: '🐯',
    status: 'Endangered', statusColor: '#e07b39',
    population: '~500', habitat: 'Russian Far East',
    funFact: 'The largest wild cat on Earth. A single male patrols up to 1,000 km² of forest. Your first day of action joins the fight for every last one of them.',
  },
  {
    threshold: 3, level: 2,
    name: 'Snow Leopard', icon: '🐆',
    status: 'Vulnerable', statusColor: '#c8952a',
    population: '~4,000', habitat: 'Central Asian mountains',
    funFact: 'Known as the "ghost of the mountains," Snow Leopards are so elusive that a researcher can spend years in their habitat without a single sighting. Three days in — you\'re building something real.',
  },
  {
    threshold: 7, level: 3,
    name: 'African Wild Dog', icon: '🐕',
    status: 'Endangered', statusColor: '#e07b39',
    population: '~6,600', habitat: 'Sub-Saharan Africa',
    funFact: 'African Wild Dogs have the highest hunt success rate of any large predator on Earth — over 80%. They also care for injured pack members. Seven days: same relentless commitment.',
  },
  {
    threshold: 30, level: 4,
    name: 'Amur Leopard', icon: '🐅',
    status: 'Critically Endangered', statusColor: '#dc2626',
    population: '<100', habitat: 'Russian-Chinese border forests',
    funFact: 'There are fewer Amur Leopards alive on Earth than the number of days you\'ve shown up. They survived ice ages. You\'re helping ensure they survive us.',
  },
  {
    threshold: 90, level: 5,
    name: 'Sumatran Orangutan', icon: '🦧',
    status: 'Critically Endangered', statusColor: '#dc2626',
    population: '~14,000', habitat: 'Sumatra, Indonesia',
    funFact: 'Sumatran Orangutans share 96.9% of our DNA and have been observed using tools, treating wounds with medicinal plants, and teaching their young for years. Ninety days — you\'re proving our shared capacity for change.',
  },
  {
    threshold: 180, level: 6,
    name: 'Javan Rhinoceros', icon: '🦏',
    status: 'Critically Endangered', statusColor: '#dc2626',
    population: '~60', habitat: 'Ujung Kulon, Java',
    funFact: 'The entire surviving wild population of Javan Rhinoceroses lives in a single national park, smaller than Singapore. Six months of daily action. You are extraordinary.',
  },
  {
    threshold: 270, level: 7,
    name: 'Vaquita', icon: '🐬',
    status: 'Critically Endangered', statusColor: '#dc2626',
    population: '<10', habitat: 'Gulf of California',
    funFact: 'The Vaquita — a tiny porpoise found nowhere else on Earth — may be extinct before most people learn it exists. Nine months of showing up every single day. Words genuinely fall short.',
  },
  {
    threshold: 365, level: 8,
    name: 'Kakapo', icon: '🦜',
    status: 'Critically Endangered', statusColor: '#dc2626',
    population: '~248', habitat: 'New Zealand island sanctuaries',
    funFact: 'The Kakapo is the world\'s only flightless parrot, the heaviest parrot alive, and possibly the longest-lived bird — up to 90 years. An entire year of daily sustainable action. You are, without qualification, one in a million.',
  },
]

export function getBadgeByThreshold(threshold: number): BadgeData | undefined {
  return BADGE_DATA.find(b => b.threshold === threshold)
}

export function getBadgeByLevel(level: number): BadgeData | undefined {
  return BADGE_DATA.find(b => b.level === level)
}

export function getCurrentBadgeData(streak: number): BadgeData | undefined {
  return [...BADGE_DATA].reverse().find(b => streak >= b.threshold)
}

export function getNextBadgeData(streak: number): BadgeData | undefined {
  return BADGE_DATA.find(b => streak < b.threshold)
}
