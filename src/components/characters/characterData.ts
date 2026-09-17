export interface CharacterOption {
  id: string
  name: string
  emoji: string
  gradientFrom: string
  gradientTo: string
}

// Placeholder colored-shape avatars — swap the emoji/gradients here for real
// Rive character files later without touching any calling code.
export const CHARACTERS: CharacterOption[] = [
  { id: 'coral-fox', name: 'Foxy', emoji: '🦊', gradientFrom: '#FF9E7D', gradientTo: '#FF6F91' },
  { id: 'mint-panda', name: 'Panda', emoji: '🐼', gradientFrom: '#8FE3C6', gradientTo: '#5EC8A6' },
  { id: 'butter-duck', name: 'Ducky', emoji: '🦆', gradientFrom: '#FFE9A8', gradientTo: '#FFC65C' },
  { id: 'sky-cat', name: 'Kitty', emoji: '🐱', gradientFrom: '#A8D8FF', gradientTo: '#6FB3F2' },
  { id: 'berry-bunny', name: 'Bunny', emoji: '🐰', gradientFrom: '#F3B3FF', gradientTo: '#C77DFF' },
  { id: 'cloud-koala', name: 'Koala', emoji: '🐨', gradientFrom: '#D8D8E8', gradientTo: '#A9A9C1' },
  { id: 'sunny-lion', name: 'Leo', emoji: '🦁', gradientFrom: '#FFD166', gradientTo: '#FF9E44' },
  { id: 'ocean-penguin', name: 'Pingu', emoji: '🐧', gradientFrom: '#B4E4FF', gradientTo: '#6FCF97' },
]

export function getCharacter(characterId: string) {
  return CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0]
}
