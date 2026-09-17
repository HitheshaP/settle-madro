import { useEffect } from 'react'
import { motion } from 'framer-motion'
import CharacterAvatar from '../characters/CharacterAvatar'

interface SettleAnimationProps {
  fromCharacterId: string
  toCharacterId: string
  variant: 'coin' | 'cake'
  onComplete: () => void
}

// Framer-Motion placeholder effects — swap for real Lottie/Rive assets later
// (see components/characters for the same swap pattern with avatars).
export default function SettleAnimation({
  fromCharacterId,
  toCharacterId,
  variant,
  onComplete,
}: SettleAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div className="relative flex w-64 items-center justify-between">
        <motion.div animate={{ x: [0, 90, 180] }} transition={{ duration: 1.4, ease: 'easeInOut' }}>
          <CharacterAvatar characterId={fromCharacterId} size={64} />
        </motion.div>
        <CharacterAvatar characterId={toCharacterId} size={64} />

        {variant === 'coin' &&
          Array.from({ length: 5 }).map((_, index) => (
            <motion.span
              key={index}
              className="pointer-events-none absolute left-1/2 top-1/2 text-2xl"
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-20, -50 - index * 6] }}
              transition={{ duration: 1, delay: 0.5 + index * 0.08 }}
            >
              🪙
            </motion.span>
          ))}

        {variant === 'cake' && (
          <motion.span
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl"
            initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
            animate={{ scale: [0.6, 1.15, 1], opacity: [0, 1, 1], rotate: [0, 8, 0] }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            🍰
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}
