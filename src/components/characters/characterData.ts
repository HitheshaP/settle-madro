export interface CharacterOption {
  id: string
  name: string
  emoji: string
  gradientFrom: string
  gradientTo: string
}

export const CHARACTERS: CharacterOption[] = [
  // MCU
  { id: 'mcu-iron-man', name: 'Iron Man', emoji: '🦾', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'mcu-captain-america', name: 'Captain America', emoji: '🛡️', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'mcu-black-widow', name: 'Black Widow', emoji: '🕷️', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'mcu-thor', name: 'Thor', emoji: '⚡', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'mcu-doctor-strange', name: 'Doctor Strange', emoji: '🪄', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  // DC
  { id: 'dc-batman', name: 'Batman', emoji: '🦇', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'dc-superman', name: 'Superman', emoji: '🦸', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'dc-wonder-woman', name: 'Wonder Woman', emoji: '⭐', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'dc-flash', name: 'The Flash', emoji: '⚡', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'dc-aquaman', name: 'Aquaman', emoji: '🌊', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  // X-Men
  { id: 'xmen-wolverine', name: 'Wolverine', emoji: '🐺', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'xmen-storm', name: 'Storm', emoji: '🌩️', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'xmen-cyclops', name: 'Cyclops', emoji: '👁️', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'xmen-jean-grey', name: 'Jean Grey', emoji: '🔥', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'xmen-magneto', name: 'Magneto', emoji: '🧲', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  // Anime
  { id: 'anime-goku', name: 'Goku', emoji: '🐉', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'anime-naruto', name: 'Naruto', emoji: '🍥', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'anime-luffy', name: 'Luffy', emoji: '🏴‍☠️', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'anime-gojo', name: 'Gojo', emoji: '👁️', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
  { id: 'anime-levi', name: 'Levi', emoji: '⚔️', gradientFrom: '#2a2a2a', gradientTo: '#1a1a1a' },
]

export function getCharacter(characterId: string) {
  return CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0]
}
