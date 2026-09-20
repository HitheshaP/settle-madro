import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ExpenseCategory } from '../../lib/expenseCategory'

interface ExpenseCelebrationProps {
  category: ExpenseCategory
  onComplete: () => void
}

const DURATION_MS = 1250

const LABELS: Record<ExpenseCategory, string> = {
  cake: 'Cake time!',
  'non-veg': 'Dig in!',
  veg: 'Fresh & healthy!',
  coffee: 'Coffee break!',
  food: "Order's in!",
  drinks: 'Cheers!',
  movie: 'Movie night!',
  shopping: 'Nice haul!',
  rent: 'Rent sorted',
  medical: 'Feel better soon',
  bills: 'Bill settled',
  gift: 'How thoughtful!',
  sports: 'Game on!',
  transport: 'Wheels up!',
  default: 'Expense Added',
}

const ICON_BURST: Partial<Record<ExpenseCategory, string>> = {
  veg: '🥗',
  coffee: '☕',
  movie: '🎬',
  shopping: '🛍️',
  rent: '🏠',
  medical: '💊',
  bills: '💡',
  gift: '🎁',
  sports: '⚽',
}

export default function ExpenseCelebration({ category, onComplete }: ExpenseCelebrationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, DURATION_MS)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-black/40 backdrop-blur-sm"
    >
      <div className="relative flex h-24 w-64 items-center justify-center">
        {category === 'cake' && <CakeScene />}
        {category === 'non-veg' && <NonVegScene />}
        {category === 'food' && <FoodScene />}
        {category === 'drinks' && <DrinksScene />}
        {category === 'transport' && <TransportScene />}
        {category === 'default' && <DefaultScene />}
        {ICON_BURST[category] && <IconBurstScene icon={ICON_BURST[category]!} />}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-sm font-bold text-apple-text"
      >
        {LABELS[category]}
      </motion.p>
    </motion.div>
  )
}

function CakeScene() {
  const confetti = ['✨', '🎉', '🎊', '✨', '🎉', '🎊']
  return (
    <>
      <motion.span
        className="text-6xl"
        initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
        animate={{ scale: [0.5, 1.15, 1], opacity: 1, rotate: [-12, 6, 0] }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        🎂
      </motion.span>
      {confetti.map((icon, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 text-xl"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: Math.cos((i / confetti.length) * Math.PI * 2) * 80,
            y: Math.sin((i / confetti.length) * Math.PI * 2) * 60 - 10,
            opacity: [0, 1, 0],
            scale: 1,
          }}
          transition={{ duration: 0.9, delay: 0.35 + i * 0.05, ease: 'easeOut' }}
        >
          {icon}
        </motion.span>
      ))}
    </>
  )
}

function NonVegScene() {
  return (
    <>
      <motion.span
        className="text-6xl"
        initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
        animate={{ scale: [0.5, 1.15, 1], opacity: 1, rotate: [-8, 6, 0] }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        🍗
      </motion.span>
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 block h-6 w-1.5 rounded-full bg-white/70 blur-[2px]"
          style={{ left: `calc(50% + ${(i - 1) * 12}px)`, top: '18%' }}
          initial={{ opacity: 0, y: 0, scaleY: 0.6 }}
          animate={{ opacity: [0, 0.8, 0], y: [-6, -34], x: [0, i % 2 ? 6 : -6, 0], scaleY: [0.6, 1.2, 0.8] }}
          transition={{ duration: 1.1, delay: 0.3 + i * 0.15, repeat: Infinity, repeatDelay: 0.2, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

function IconBurstScene({ icon }: { icon: string }) {
  const sparkle = ['✨', '✨', '✨', '✨']
  return (
    <>
      <motion.span
        className="text-6xl"
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: [0.5, 1.15, 1], opacity: 1, rotate: [-10, 6, 0] }}
        transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
      >
        {icon}
      </motion.span>
      {sparkle.map((s, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 text-lg"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: Math.cos((i / sparkle.length) * Math.PI * 2) * 70,
            y: Math.sin((i / sparkle.length) * Math.PI * 2) * 50,
            opacity: [0, 1, 0],
            scale: 1,
          }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
        >
          {s}
        </motion.span>
      ))}
    </>
  )
}

function FoodScene() {
  return (
    <>
      <motion.span
        className="pointer-events-none absolute left-1/2 top-1/2 text-5xl"
        initial={{ x: -90, opacity: 0, rotate: -20 }}
        animate={{ x: -18, opacity: 1, rotate: [-20, 8, 0] }}
        transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
      >
        🍕
      </motion.span>
      <motion.span
        className="pointer-events-none absolute left-1/2 top-1/2 text-5xl"
        initial={{ x: 90, opacity: 0, rotate: 20 }}
        animate={{ x: 18, opacity: 1, rotate: [20, -8, 0] }}
        transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
      >
        🥤
      </motion.span>
      <motion.span
        className="pointer-events-none absolute left-1/2 top-1/2 text-xl"
        initial={{ opacity: 0, scale: 0.5, x: -6, y: -34 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1], y: [-34, -46] }}
        transition={{ duration: 0.7, delay: 0.55 }}
      >
        ✨
      </motion.span>
    </>
  )
}

function DrinksScene() {
  return (
    <>
      <motion.span
        className="text-6xl"
        initial={{ scale: 0.6, opacity: 0, rotate: 0 }}
        animate={{ scale: [0.6, 1.1, 1], opacity: 1, rotate: [0, -28, -8, -18, 0] }}
        transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
      >
        🍺
      </motion.span>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 text-sm"
          initial={{ opacity: 0, x: 10 + i * 4, y: 10 }}
          animate={{ opacity: [0, 0.9, 0], y: -40 - i * 6 }}
          transition={{ duration: 1, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
        >
          🫧
        </motion.span>
      ))}
    </>
  )
}

function TransportScene() {
  return (
    <>
      <motion.span
        className="pointer-events-none absolute left-1/2 bottom-1 h-2 w-16 rounded-full bg-white/10 blur-md"
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: [0, 0.6, 0], scaleX: [0.4, 1.4, 1.8] }}
        transition={{ duration: 1, delay: 0.05 }}
      />
      <motion.span
        className="pointer-events-none absolute left-1/2 top-1/2 text-5xl"
        initial={{ x: -110, y: 6, opacity: 0, rotate: -6 }}
        animate={{
          x: [-110, 0, 110],
          y: [6, -8, 6],
          opacity: [0, 1, 1, 0],
          rotate: [-6, 0, 0, 6],
        }}
        transition={{ duration: 1.1, times: [0, 0.45, 0.85, 1], ease: [0.25, 1, 0.5, 1] }}
      >
        <motion.span
          className="inline-block"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 0.08, repeat: Infinity }}
        >
          🚁
        </motion.span>
      </motion.span>
    </>
  )
}

function DefaultScene() {
  return (
    <>
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/15 text-4xl"
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.5 }}
      >
        💸
      </motion.div>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute left-1/2 top-2 text-lg"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], x: (i - 2.5) * 16, y: -60 - i * 4 }}
          transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
        >
          🪙
        </motion.span>
      ))}
    </>
  )
}
