export interface CharacterOption {
  id: string
  name: string
  glow: string
}

const GUYS: CharacterOption[] = [
  { id: 'guy-nerdy', name: 'Nerdy Guy', glow: '#7dd3fc' },
  { id: 'guy-rich', name: 'Rich Guy', glow: '#fbbf24' },
  { id: 'guy-handsome', name: 'Handsome Guy', glow: '#f8fafc' },
  { id: 'guy-athletic', name: 'Athletic Guy', glow: '#ef4444' },
  { id: 'guy-bearded', name: 'Bearded Guy', glow: '#4ade80' },
  { id: 'guy-curly', name: 'Curly Guy', glow: '#fb923c' },
  { id: 'guy-slickback', name: 'Slickback Guy', glow: '#60a5fa' },
]

const GIRLS: CharacterOption[] = [
  { id: 'girl-nerdy', name: 'Nerdy Girl', glow: '#facc15' },
  { id: 'girl-rich', name: 'Rich Girl', glow: '#fbbf24' },
  { id: 'girl-pretty', name: 'Pretty Girl', glow: '#f472b6' },
  { id: 'girl-athletic', name: 'Athletic Girl', glow: '#2dd4bf' },
  { id: 'girl-curly', name: 'Curly Girl', glow: '#c084fc' },
  { id: 'girl-braided', name: 'Braided Girl', glow: '#fb923c' },
  { id: 'girl-slickbun', name: 'Slick Bun Girl', glow: '#34d399' },
]

const FLOWERS: CharacterOption[] = [
  { id: 'flower-rose', name: 'Rose', glow: '#f43f5e' },
  { id: 'flower-hibiscus', name: 'Hibiscus', glow: '#fb7185' },
  { id: 'flower-lotus', name: 'Lotus', glow: '#f9a8d4' },
  { id: 'flower-lily', name: 'Lily', glow: '#fef08a' },
  { id: 'flower-sunflower', name: 'Sunflower', glow: '#facc15' },
]

const ANIMALS: CharacterOption[] = [
  { id: 'animal-lion', name: 'Lion', glow: '#eab308' },
  { id: 'animal-tiger', name: 'Tiger', glow: '#f97316' },
  { id: 'animal-cow', name: 'Cow', glow: '#f9a8d4' },
  { id: 'animal-horse', name: 'Horse', glow: '#b45309' },
  { id: 'animal-elephant', name: 'Elephant', glow: '#94a3b8' },
]

const CARDS: CharacterOption[] = [
  { id: 'card-king', name: 'King', glow: '#facc15' },
  { id: 'card-queen', name: 'Queen', glow: '#e879f9' },
  { id: 'card-joker', name: 'Joker', glow: '#a3e635' },
  { id: 'card-ace', name: 'Ace', glow: '#f1f5f9' },
  { id: 'goat', name: 'G.O.A.T', glow: '#c7c7cc' },
]

const LOGOS: CharacterOption[] = [
  { id: 'logo-batman', name: 'Batman', glow: '#facc15' },
  { id: 'logo-spiderman', name: 'Spider-Man', glow: '#dc2626' },
  { id: 'logo-captain', name: 'Captain America', glow: '#60a5fa' },
]

// Interleaved round-robin across every group so the picker shows one mixed grid
// instead of separate people/flower/animal/card sections.
function interleave(...groups: CharacterOption[][]): CharacterOption[] {
  const merged: CharacterOption[] = []
  const max = Math.max(...groups.map((g) => g.length))
  for (let i = 0; i < max; i++) {
    for (const group of groups) {
      if (group[i]) merged.push(group[i])
    }
  }
  return merged
}

export const CHARACTERS: CharacterOption[] = interleave(GUYS, FLOWERS, ANIMALS, GIRLS, CARDS, LOGOS)

export function getCharacter(characterId: string) {
  return CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0]
}
