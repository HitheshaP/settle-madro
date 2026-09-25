import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import Modal from './Modal'
import Button from './Button'
import Fantastic6Gate from '../fantastic6/Fantastic6Gate'
import { useInstallPrompt } from '../../lib/useInstallPrompt'
import { useAppStore } from '../../lib/store'

export default function AppMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isIos, isStandalone, promptInstall, showInstructions, setShowInstructions } = useInstallPrompt()
  const fantastic6 = useAppStore((state) => state.fantastic6)
  const colorful = useAppStore((state) => state.colorful)
  const setColorful = useAppStore((state) => state.setColorful)

  useEffect(() => {
    if (!open) return
    const handleClick = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [open])

  const openFantastic6 = () => {
    setOpen(false)
    if (fantastic6) {
      setColorful(true)
      navigate(`/groups/${fantastic6.groupId}`)
    } else {
      setGateOpen(true)
    }
  }

  const itemClass =
    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-apple-text transition-colors duration-150 hover:bg-white/[0.06]'

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        className="tap-target flex h-11 w-11 items-center justify-center rounded-2xl border border-apple-border bg-white/[0.05] text-apple-text shadow-apple-smooth"
      >
        <span className="flex flex-col items-center gap-[3px]">
          <span className="h-1 w-1 rounded-full bg-apple-text" />
          <span className="h-1 w-1 rounded-full bg-apple-text" />
          <span className="h-1 w-1 rounded-full bg-apple-text" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ duration: 0.16, ease: [0.25, 1, 0.5, 1] }}
            style={{ transformOrigin: 'top right' }}
            className="glass-surface-elevated absolute right-0 top-[calc(100%+8px)] z-30 w-64 rounded-2xl p-1.5 shadow-apple-intense"
          >
            {!isStandalone && (
              <button
                onClick={() => {
                  setOpen(false)
                  promptInstall()
                }}
                className={itemClass}
              >
                <span className="text-lg">⬇️</span>
                Install App
              </button>
            )}
            <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-3">
              <span className="flex items-center gap-3 text-sm font-medium text-apple-text">
                <span className="text-lg">🌗</span>
                Appearance
              </span>
              <ThemeToggle />
            </div>
            <button onClick={openFantastic6} className={itemClass}>
              <span className="text-lg">✨</span>
              <span className="bg-[linear-gradient(90deg,#ff006e,#8338ec,#3a86ff,#06d6a0,#ffbe0b)] bg-clip-text font-bold text-transparent">
                Fantastic 6
              </span>
            </button>
            {fantastic6 && (
              <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-3">
                <span className="flex items-center gap-3 text-sm font-medium text-apple-text">
                  <span className="text-lg">🌈</span>
                  Colourful mode
                </span>
                <button
                  onClick={() => setColorful(!colorful)}
                  role="switch"
                  aria-checked={colorful}
                  aria-label="Toggle colourful mode"
                  className="tap-target relative flex h-8 w-14 items-center rounded-full border border-apple-border px-1"
                  style={{
                    background: colorful ? 'linear-gradient(90deg,#ff006e,#8338ec,#3a86ff)' : 'rgba(255,255,255,0.06)',
                  }}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className="h-6 w-6 rounded-full bg-white shadow-apple-smooth"
                    style={{ marginLeft: colorful ? 'auto' : 0 }}
                  />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={showInstructions} onClose={() => setShowInstructions(false)}>
        <p className="mb-2 text-lg font-semibold text-apple-text">Install Settle Madro</p>
        {isIos ? (
          <p className="text-sm leading-relaxed text-apple-text-secondary">
            Tap the Share button <span aria-hidden>⬆️</span> in Safari, then choose "Add to Home Screen".
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-apple-text-secondary">
            Open your browser menu <span aria-hidden>⋮</span> and choose "Install app" or "Add to Home screen". If
            you don't see it, reload the page once and try again.
          </p>
        )}
        <Button className="mt-5 w-full" onClick={() => setShowInstructions(false)}>
          Got it
        </Button>
      </Modal>

      <Fantastic6Gate open={gateOpen} onClose={() => setGateOpen(false)} />
    </div>
  )
}
