import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface WelcomeSplashProps {
  onFinish: () => void
}

const AUTO_DISMISS_MS = 4200

export default function WelcomeSplash({ onFinish }: WelcomeSplashProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] overflow-hidden bg-apple-bg"
          onClick={() => setVisible(false)}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(10,132,255,0.14),transparent_55%)]" />

          {/* soft vignette behind the center text only — sits below the corner scenes so it never washes them out */}
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_54%,rgba(9,9,11,0)_0%,rgba(9,9,11,0.3)_42%,rgba(9,9,11,0.55)_100%)]" />

          <MoneyPassScene className="absolute left-[4%] top-[10%] z-10 scale-[0.85] sm:scale-100" />
          <UpiScene className="absolute right-[4%] top-[8%] z-10 scale-[0.85] sm:scale-100" />
          <BarterScene className="absolute left-[3%] bottom-[17%] z-10 scale-[0.85] sm:scale-100" />
          <TreasureScene className="absolute right-[5%] bottom-[14%] z-10 scale-[0.85] sm:scale-100" />

          <div className="safe-top safe-bottom safe-x relative z-20 flex h-full w-full flex-col items-center justify-center gap-5 px-6 text-center">
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 210, damping: 14, delay: 0.1 }}
              className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-apple-border shadow-apple-intense text-4xl backdrop-blur-xl"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                🪙
              </motion.span>
            </motion.div>

            <div className="flex flex-col gap-1.5">
              <TextLine
                text="Welcome to"
                delayBase={0.4}
                className="text-lg font-semibold text-apple-text-secondary"
              />
              <TextLine
                text="Settle Madro"
                delayBase={0.65}
                className="text-4xl font-extrabold tracking-tight text-apple-text"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              className="max-w-[240px] text-sm font-medium text-apple-text-secondary"
            >
              Split, settle, and square up — the fun way.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: AUTO_DISMISS_MS / 1000 - 0.8, duration: 0.4 }}
              className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-apple-text-secondary/60"
            >
              Tap to continue
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TextLine({ text, delayBase, className }: { text: string; delayBase: number; className: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-2">
      {text.split(' ').map((word, wi) => (
        <motion.span
          key={word + wi}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: delayBase + wi * 0.08, ease: [0.25, 1, 0.5, 1], duration: 0.5 }}
          className={className}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

function SceneGlow({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl"
      style={{ background: `radial-gradient(circle, ${color}66, transparent 70%)` }}
    />
  )
}

function MoneyPassScene({ className = '' }: { className?: string }) {
  const glow = '0 0 10px #fbbf24cc'
  return (
    <div className={className}>
      <div className="relative">
        <SceneGlow color="#fbbf24" />
        <div className="relative flex h-20 w-28 items-center justify-between">
          <motion.span
            className="text-2xl"
            style={{ filter: `drop-shadow(${glow})` }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            🧑‍💼
          </motion.span>
          <motion.span
            className="text-2xl"
            style={{ filter: `drop-shadow(${glow})` }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            🧑‍🎨
          </motion.span>
          <motion.span
            className="absolute left-6 top-4 text-lg"
            style={{ filter: `drop-shadow(${glow})` }}
            animate={{ x: [0, 42, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🪙
          </motion.span>
        </div>
      </div>
    </div>
  )
}

function UpiScene({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative">
        <SceneGlow color="#0a84ff" />
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="relative flex h-16 w-11 items-center justify-center overflow-hidden rounded-xl border bg-white/[0.07]"
            style={{ borderColor: 'rgba(10,132,255,0.5)', boxShadow: '0 0 16px rgba(10,132,255,0.35)' }}
          >
            <span className="text-xl leading-none">🔲</span>
            <motion.div
              className="absolute inset-x-1 h-0.5 rounded-full"
              style={{ background: '#0a84ff', boxShadow: '0 0 8px #0a84ff' }}
              animate={{ top: ['10%', '82%', '10%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <motion.span
            className="text-[9px] font-bold tracking-widest"
            style={{ color: '#5ab3ff' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            SCAN & PAY
          </motion.span>
        </div>
      </div>
    </div>
  )
}

function BarterScene({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative">
        <SceneGlow color="#34d399" />
        <div className="relative flex h-16 w-24 items-center justify-between">
          <motion.span
            className="text-2xl"
            style={{ filter: 'drop-shadow(0 0 10px #34d399cc)' }}
            animate={{ x: [0, 46, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌾
          </motion.span>
          <motion.span
            className="text-2xl"
            style={{ filter: 'drop-shadow(0 0 10px #f59e0bcc)' }}
            animate={{ x: [0, -46, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            🧺
          </motion.span>
        </div>
      </div>
    </div>
  )
}

function TreasureScene({ className = '' }: { className?: string }) {
  const items = [
    { icon: '💰', glow: '#fbbf24' },
    { icon: '💎', glow: '#22d3ee' },
    { icon: '🪙', glow: '#facc15' },
  ]
  return (
    <div className={className}>
      <div className="relative">
        <SceneGlow color="#a78bfa" />
        <div className="relative h-24 w-16">
          {items.map((item, i) => (
            <motion.span
              key={item.icon}
              className="absolute bottom-0 left-1/2 text-xl -translate-x-1/2"
              style={{ filter: `drop-shadow(0 0 10px ${item.glow}cc)` }}
              initial={{ y: 0, opacity: 0, rotate: 0 }}
              animate={{ y: [-4, -64], opacity: [0, 1, 1, 0], rotate: [0, i % 2 ? 16 : -16] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
            >
              {item.icon}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}
