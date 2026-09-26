import { useEffect } from 'react'

/**
 * Turns on the Fantastic 6 colourful theme while the calling screen is mounted and `active`.
 * Leaving the Fantastic 6 screens (or unmounting) switches it back off.
 */
export function useColorfulMode(active: boolean) {
  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    root.setAttribute('data-f6', 'on')
    return () => root.removeAttribute('data-f6')
  }, [active])
}
