import { useEffect, useRef } from 'react'
import { useAuth } from '@/features/social/AuthContext'
import { addUsageMs } from './reviewUsageStorage'

const TICK_MS = 1000

export function ReviewUsageTracker() {
  const { user } = useAuth()
  const lastTickRef = useRef(Date.now())

  useEffect(() => {
    if (!user?.id) return

    lastTickRef.current = Date.now()

    const tick = () => {
      if (document.visibilityState !== 'visible') return
      const now = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      if (delta > 0 && delta < TICK_MS * 5) {
        addUsageMs(user.id, delta)
        window.dispatchEvent(new CustomEvent('enlight-usage-tick'))
      }
    }

    const interval = window.setInterval(tick, TICK_MS)

    const onVisible = () => {
      lastTickRef.current = Date.now()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [user?.id])

  return null
}
