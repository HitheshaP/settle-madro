import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CharacterAvatar from '../characters/CharacterAvatar'

interface SettleAnimationProps {
  fromCharacterId: string
  toCharacterId: string
  variant: 'coin' | 'cake'
  onComplete: () => void
}

export default function SettleAnimation({
  fromCharacterId,
  toCharacterId,
  variant,
  onComplete,
}: SettleAnimationProps) {
  const [stamped, setStamped] = useState(false)

  useEffect(() => {
    const stampTimer = setTimeout(() => setStamped(true), 1300)
    const doneTimer = setTimeout(onComplete, 2100)
    return () => {
      clearTimeout(stampTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black/55 backdrop-blur-sm"
    >
      <div className="relative flex w-64 items-center justify-between">
        <motion.div animate={{ x: [0, 90, 180] }} transition={{ duration: 1.3, ease: 'easeInOut' }}>
          <CharacterAvatar characterId={fromCharacterId} size={64} />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1, 1.15, 1] }}
          transition={{ duration: 1.3, times: [0, 0.85, 0.94, 1] }}
        >
          <CharacterAvatar characterId={toCharacterId} size={64} />
        </motion.div>

        {/* impact glow ring on arrival */}
        <motion.span
          className="pointer-events-none absolute right-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border-2 border-emerald-400/70"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.7], opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.6, delay: 1.2 }}
        />

        {variant === 'coin' &&
          Array.from({ length: 6 }).map((_, index) => (
            <motion.span
              key={index}
              className="pointer-events-none absolute left-1/2 top-1/2 text-2xl"
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: [0, 1, 1, 0], x: -20 + (index - 2.5) * 10, y: [-20, -55 - index * 5] }}
              transition={{ duration: 0.9, delay: 0.5 + index * 0.07 }}
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

      {stamped && (
        <motion.div
          initial={{ opacity: 0, scale: 1.7, rotate: -14 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          className="rounded-xl border-2 border-emerald-400/70 bg-emerald-500/10 px-5 py-2 text-sm font-extrabold tracking-widest text-emerald-400"
        >
          SETTLED ✓
        </motion.div>
      )}
    </motion.div>
  )
}
