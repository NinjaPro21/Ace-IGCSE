import { useEffect, useRef } from 'react'
import { useAuth } from '@/features/social/AuthContext'
import { trackEnlightEvent } from '@/lib/eventTracking'

export function SessionTracker() {
  const { user } = useAuth()
  const sessionStartRef = useRef<number | null>(null)
  const endedRef = useRef(false)

  useEffect(() => {
    if (!user?.id) {
      sessionStartRef.current = null
      endedRef.current = false
      return
    }

    sessionStartRef.current = Date.now()
    endedRef.current = false
    void trackEnlightEvent(user.id, 'session_started', {})

    const endSession = () => {
      if (endedRef.current || sessionStartRef.current === null) return
      endedRef.current = true
      const durationSec = Math.round((Date.now() - sessionStartRef.current) / 1000)
      void trackEnlightEvent(user.id, 'session_ended', { durationSec })
    }

    window.addEventListener('pagehide', endSession)
    window.addEventListener('beforeunload', endSession)

    return () => {
      window.removeEventListener('pagehide', endSession)
      window.removeEventListener('beforeunload', endSession)
      endSession()
    }
  }, [user?.id])

  return null
}
