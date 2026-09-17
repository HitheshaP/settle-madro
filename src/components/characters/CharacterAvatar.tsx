import { motion } from 'framer-motion'
import { getCharacter } from './characterData'

interface CharacterAvatarProps {
  characterId: string
  size?: number
  selected?: boolean
  onClick?: () => void
}

export default function CharacterAvatar({ characterId, size = 56, selected, onClick }: CharacterAvatarProps) {
  const character = getCharacter(characterId)
  const Comp = onClick ? motion.button : motion.div

  return (
    <Comp
      onClick={onClick}
      whileTap={onClick ? { scale: 0.9 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})`,
        fontSize: size * 0.5,
        border: selected ? '3px solid var(--color-coral)' : '3px solid transparent',
        boxShadow: selected
          ? '0 0 0 2px var(--color-cream), var(--shadow-lift)'
          : 'var(--shadow-soft)',
      }}
    >
      <span>{character.emoji}</span>
    </Comp>
  )
}
