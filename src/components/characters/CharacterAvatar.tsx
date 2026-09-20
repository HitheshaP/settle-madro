import { motion } from 'framer-motion'
import { getCharacter } from './characterData'
import CharacterGlyph from './CharacterGlyph'

interface CharacterAvatarProps {
  characterId: string
  size?: number
  selected?: boolean
  onClick?: () => void
  shape?: 'circle' | 'square'
}

export default function CharacterAvatar({
  characterId,
  size = 56,
  selected,
  onClick,
  shape = 'circle',
}: CharacterAvatarProps) {
  const character = getCharacter(characterId)
  const Comp = onClick ? motion.button : motion.div
  const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-[22%]'

  return (
    <Comp
      onClick={onClick}
      whileTap={onClick ? { scale: 0.94 } : undefined}
      whileHover={onClick ? { scale: 1.06 } : undefined}
      animate={selected ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22, duration: 0.2 }}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${rounded}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 32%, ${character.glow}33, #1c1c1e 72%)`,
        border: selected ? `2px solid ${character.glow}` : '2px solid rgba(255,255,255,0.08)',
        boxShadow: selected
          ? `0 0 0 3px ${character.glow}33, 0 0 22px ${character.glow}55, 0 8px 24px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.25)',
      }}
      aria-label={character.name}
    >
      <CharacterGlyph id={character.id} size={size * 0.86} />
      {selected && (
        <span
          className={`absolute inset-0 ring-1 ring-inset ${rounded}`}
          style={{ boxShadow: `inset 0 0 0 1px ${character.glow}66` }}
        />
      )}
    </Comp>
  )
}
