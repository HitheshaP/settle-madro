import { useState, useSyncExternalStore } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

// The browser fires `beforeinstallprompt` once, early — usually before the (lazy-loaded) menu
// mounts. Capture it at module load (imported from main.tsx) so it's never missed.
let deferredPrompt: BeforeInstallPromptEvent | null = null
let installed = isInStandaloneMode()
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  notify()
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  installed = true
  notify()
})

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useInstallPrompt() {
  const prompt = useSyncExternalStore(subscribe, () => deferredPrompt)
  const standalone = useSyncExternalStore(subscribe, () => installed)
  const [showInstructions, setShowInstructions] = useState(false)

  const promptInstall = async () => {
    if (prompt) {
      await prompt.prompt()
      const choice = await prompt.userChoice
      if (choice.outcome === 'accepted') {
        deferredPrompt = null
        notify()
      }
      return
    }
    // No native prompt available (iOS Safari, Firefox, or Chrome hasn't offered one yet) —
    // show manual steps instead of leaving a dead button.
    setShowInstructions(true)
  }

  return {
    isIos: isIos(),
    isStandalone: standalone,
    promptInstall,
    showInstructions,
    setShowInstructions,
  }
}
