import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import Modal from './Modal'
import Button from './Button'
import { useInstallPrompt } from '../../lib/useInstallPrompt'

export default function AppMenu() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { canInstall, isStandalone, promptInstall, showIosInstructions, setShowIosInstructions } =
    useInstallPrompt()

  useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

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
            className="glass-surface-elevated absolute right-0 top-[calc(100%+8px)] z-30 w-60 rounded-2xl p-1.5 shadow-apple-intense"
          >
            {!isStandalone && (
              <button
                onClick={() => {
                  setOpen(false)
                  promptInstall()
                }}
                disabled={!canInstall}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-apple-text transition-colors duration-150 hover:bg-white/[0.06] disabled:opacity-40"
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
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={showIosInstructions} onClose={() => setShowIosInstructions(false)}>
        <p className="mb-2 text-lg font-semibold text-apple-text">Add to Home Screen</p>
        <p className="text-sm leading-relaxed text-apple-text-secondary">
          Tap the Share button <span aria-hidden>⬆️</span> in Safari, then choose "Add to Home Screen".
        </p>
        <Button className="mt-5 w-full" onClick={() => setShowIosInstructions(false)}>
          Got it
        </Button>
      </Modal>
    </div>
  )
}
