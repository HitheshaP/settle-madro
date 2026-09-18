export type Universe = 'marvel' | 'anime' | 'dc'

export interface CharacterOption {
  id: string
  name: string
  emoji: string
  universe: Universe
  gradientFrom: string
  gradientTo: string
  glow: string
}

export const CHARACTERS: CharacterOption[] = [
  // Marvel — MCU
  { id: 'mcu-iron-man', name: 'Iron Man', emoji: '🦾', universe: 'marvel', gradientFrom: '#7f1d1d', gradientTo: '#b45309', glow: '#f59e0b' },
  { id: 'mcu-captain-america', name: 'Captain America', emoji: '🛡️', universe: 'marvel', gradientFrom: '#1e3a8a', gradientTo: '#991b1b', glow: '#60a5fa' },
  { id: 'mcu-black-widow', name: 'Black Widow', emoji: '🕷️', universe: 'marvel', gradientFrom: '#18181b', gradientTo: '#7f1d1d', glow: '#f87171' },
  { id: 'mcu-thor', name: 'Thor', emoji: '⚡', universe: 'marvel', gradientFrom: '#1e40af', gradientTo: '#ca8a04', glow: '#60a5fa' },
  { id: 'mcu-doctor-strange', name: 'Doctor Strange', emoji: '🪄', universe: 'marvel', gradientFrom: '#581c87', gradientTo: '#991b1b', glow: '#c084fc' },
  // Marvel — X-Men
  { id: 'xmen-wolverine', name: 'Wolverine', emoji: '🐺', universe: 'marvel', gradientFrom: '#ca8a04', gradientTo: '#1e3a8a', glow: '#facc15' },
  { id: 'xmen-storm', name: 'Storm', emoji: '🌩️', universe: 'marvel', gradientFrom: '#0e7490', gradientTo: '#334155', glow: '#22d3ee' },
  { id: 'xmen-cyclops', name: 'Cyclops', emoji: '👁️', universe: 'marvel', gradientFrom: '#b91c1c', gradientTo: '#1e3a8a', glow: '#f87171' },
  { id: 'xmen-jean-grey', name: 'Jean Grey', emoji: '🔥', universe: 'marvel', gradientFrom: '#b91c1c', gradientTo: '#c2410c', glow: '#fb923c' },
  { id: 'xmen-magneto', name: 'Magneto', emoji: '🧲', universe: 'marvel', gradientFrom: '#312e81', gradientTo: '#6d28d9', glow: '#a78bfa' },
  // DC
  { id: 'dc-batman', name: 'Batman', emoji: '🦇', universe: 'dc', gradientFrom: '#09090b', gradientTo: '#27272a', glow: '#a1a1aa' },
  { id: 'dc-superman', name: 'Superman', emoji: '🦸', universe: 'dc', gradientFrom: '#1d4ed8', gradientTo: '#b91c1c', glow: '#60a5fa' },
  { id: 'dc-wonder-woman', name: 'Wonder Woman', emoji: '⭐', universe: 'dc', gradientFrom: '#b91c1c', gradientTo: '#ca8a04', glow: '#fbbf24' },
  { id: 'dc-flash', name: 'The Flash', emoji: '⚡', universe: 'dc', gradientFrom: '#b91c1c', gradientTo: '#eab308', glow: '#f87171' },
  { id: 'dc-aquaman', name: 'Aquaman', emoji: '🌊', universe: 'dc', gradientFrom: '#0e7490', gradientTo: '#c2410c', glow: '#22d3ee' },
  { id: 'dc-green-lantern', name: 'Green Lantern', emoji: '💚', universe: 'dc', gradientFrom: '#14532d', gradientTo: '#052e16', glow: '#4ade80' },
  { id: 'dc-cyborg', name: 'Cyborg', emoji: '🤖', universe: 'dc', gradientFrom: '#3f3f46', gradientTo: '#1d4ed8', glow: '#60a5fa' },
  // Anime
  { id: 'anime-goku', name: 'Goku', emoji: '🐉', universe: 'anime', gradientFrom: '#c2410c', gradientTo: '#1d4ed8', glow: '#fb923c' },
  { id: 'anime-naruto', name: 'Naruto', emoji: '🍥', universe: 'anime', gradientFrom: '#c2410c', gradientTo: '#ca8a04', glow: '#fb923c' },
  { id: 'anime-luffy', name: 'Luffy', emoji: '🏴‍☠️', universe: 'anime', gradientFrom: '#b91c1c', gradientTo: '#ca8a04', glow: '#f87171' },
  { id: 'anime-gojo', name: 'Gojo', emoji: '👁️', universe: 'anime', gradientFrom: '#1e3a8a', gradientTo: '#475569', glow: '#93c5fd' },
  { id: 'anime-levi', name: 'Levi', emoji: '⚔️', universe: 'anime', gradientFrom: '#18181b', gradientTo: '#3f3f46', glow: '#a1a1aa' },
  { id: 'anime-saitama', name: 'Saitama', emoji: '👊', universe: 'anime', gradientFrom: '#ca8a04', gradientTo: '#b91c1c', glow: '#fde047' },
  { id: 'anime-light', name: 'Light Yagami', emoji: '📓', universe: 'anime', gradientFrom: '#18181b', gradientTo: '#7f1d1d', glow: '#f87171' },
]

export const UNIVERSES: { id: Universe; label: string; icon: string }[] = [
  { id: 'marvel', label: 'Marvel', icon: '🕸️' },
  { id: 'anime', label: 'Anime', icon: '🌀' },
  { id: 'dc', label: 'DC', icon: '🦇' },
]

export function getCharacter(characterId: string) {
  return CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0]
}

export function getCharactersByUniverse(universe: Universe) {
  return CHARACTERS.filter((c) => c.universe === universe)
}
