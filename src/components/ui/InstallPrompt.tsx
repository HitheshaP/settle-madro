import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from './Button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'settle-madro-install-dismissed'

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosInstructions, setShowIosInstructions] = useState(false)
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === 'true')

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (isInStandaloneMode() || dismissed) return null
  if (!deferredPrompt && !isIos()) return null

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') setDeferredPrompt(null)
      return
    }
    setShowIosInstructions(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="safe-bottom safe-x fixed inset-x-0 bottom-3 z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-[var(--radius-card)] bg-white px-4 py-3 shadow-[var(--shadow-lift)]"
      >
        <p className="text-sm text-ink">Install Settle Madro for quick access</p>
        <div className="flex items-center gap-2">
          <button onClick={dismiss} className="tap-target text-sm text-muted">
            Later
          </button>
          <Button className="px-4 py-2 text-sm" onClick={handleInstall}>
            Install
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showIosInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="safe-x fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={() => setShowIosInstructions(false)}
          >
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="safe-bottom w-full max-w-sm rounded-t-[var(--radius-card)] bg-white p-6 text-center"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="mb-2 text-lg font-semibold text-ink">Add to Home Screen</p>
              <p className="text-muted">
                Tap the Share button <span aria-hidden>⬆️</span> in Safari, then choose "Add to Home
                Screen".
              </p>
              <Button className="mt-4 w-full" onClick={() => setShowIosInstructions(false)}>
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
