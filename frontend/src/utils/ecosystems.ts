export interface Ecosystem {
  id: string
  emoji: string
  name: string
}

export const ECOSYSTEMS: Ecosystem[] = [
  { id: 'rainforest',    emoji: '🌿', name: 'Rainforest'       },
  { id: 'ocean',         emoji: '🌊', name: 'Deep Ocean'       },
  { id: 'coral_reef',    emoji: '🪸', name: 'Coral Reef'       },
  { id: 'savanna',       emoji: '🦁', name: 'Savanna'          },
  { id: 'desert',        emoji: '🏜️', name: 'Desert'           },
  { id: 'arctic',        emoji: '❄️', name: 'Arctic Tundra'    },
  { id: 'wetlands',      emoji: '🦢', name: 'Wetlands'         },
  { id: 'boreal',        emoji: '🌲', name: 'Boreal Forest'    },
  { id: 'temperate',     emoji: '🍂', name: 'Temperate Forest' },
  { id: 'alpine',        emoji: '🏔️', name: 'Alpine'           },
  { id: 'grassland',     emoji: '🌾', name: 'Grassland'        },
  { id: 'mangrove',      emoji: '🌴', name: 'Mangrove'         },
  { id: 'mediterranean', emoji: '🫒', name: 'Mediterranean'    },
  { id: 'kelp',          emoji: '🎋', name: 'Kelp Forest'      },
  { id: 'cloud_forest',  emoji: '☁️', name: 'Cloud Forest'     },
  { id: 'freshwater',    emoji: '🏞️', name: 'Freshwater'       },
]

export function getEcosystem(id: string | undefined, fallbackSeed?: string): Ecosystem {
  if (id) {
    const found = ECOSYSTEMS.find(e => e.id === id)
    if (found) return found
  }
  // Deterministic random based on seed (userId or email) so it's always the same for the user
  const seed = fallbackSeed ?? 'default'
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff
  return ECOSYSTEMS[Math.abs(hash) % ECOSYSTEMS.length]
}
