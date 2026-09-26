import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from './store'
import { useColorfulMode } from './useColorfulMode'

/**
 * For screens that belong to Fantastic 6 (when `active`): switches on the colourful theme and
 * sends anyone who hasn't entered the secret code this visit back to the normal Groups list.
 * Returns the crew character picked on the way in.
 */
export function useFantastic6Access(active: boolean) {
  const me = useAppStore((state) => state.fantastic6Me)
  const navigate = useNavigate()
  useColorfulMode(active)

  useEffect(() => {
    if (active && !me) navigate('/groups', { replace: true })
  }, [active, me, navigate])

  return me
}
