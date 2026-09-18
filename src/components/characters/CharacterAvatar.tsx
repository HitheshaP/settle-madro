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
      whileTap={onClick ? { scale: 0.94 } : undefined}
      whileHover={onClick ? { scale: 1.06 } : undefined}
      animate={selected ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22, duration: 0.2 }}
      className="relative flex shrink-0 items-center justify-center rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})`,
        fontSize: size * 0.45,
        border: selected ? `2px solid ${character.glow}` : '2px solid rgba(255,255,255,0.08)',
        boxShadow: selected
          ? `0 0 0 3px ${character.glow}33, 0 0 22px ${character.glow}55, 0 8px 24px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      aria-label={character.name}
    >
      <span className="relative z-10 text-white drop-shadow-md" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
        {character.emoji}
      </span>
      {selected && (
        <span
          className="absolute inset-0 rounded-full ring-1 ring-inset"
          style={{ boxShadow: `inset 0 0 0 1px ${character.glow}66` }}
        />
      )}
    </Comp>
  )
}
