import { useCallback, useEffect, useRef, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { isStudyPaused } from '@/features/mastery/studySession'
import { useAuth } from './AuthContext'

/** Active study time before nudging guests to sign in */
export const SIGN_IN_PROMPT_MS = 3 * 60 * 1000

const TICK_MS = 1000
const ENGAGED_IDLE_MS = 2 * 60 * 1000
const SESSION_DISMISSED_KEY = 'enlight-signin-prompt-dismissed'

export function SignInPrompt() {
  const { user, loading, signInWithGoogle, syncError } = useAuth()
  const [open, setOpen] = useState(false)
  const activeMs = useRef(0)
  const lastActivity = useRef(Date.now())

  const markActive = useCallback(() => {
    if (!open) lastActivity.current = Date.now()
  }, [open])

  useEffect(() => {
    if (loading || user) return
    if (sessionStorage.getItem(SESSION_DISMISSED_KEY)) return

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
    ]

    for (const event of events) {
      window.addEventListener(event, markActive, { passive: true })
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !open) {
        lastActivity.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const interval = setInterval(() => {
      if (open) return
      if (document.visibilityState !== 'visible') return
      if (isStudyPaused()) return
      if (Date.now() - lastActivity.current > ENGAGED_IDLE_MS) return

      activeMs.current += TICK_MS
      if (activeMs.current >= SIGN_IN_PROMPT_MS) {
        setOpen(true)
      }
    }, TICK_MS)

    return () => {
      for (const event of events) {
        window.removeEventListener(event, markActive)
      }
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(interval)
    }
  }, [loading, user, open, markActive])

  useEffect(() => {
    if (user) setOpen(false)
  }, [user])

  const dismiss = () => {
    sessionStorage.setItem(SESSION_DISMISSED_KEY, '1')
    setOpen(false)
  }

  if (!open || user) return null

  return (
    <div
      className="enlight-popout-overlay enlight-signin-prompt-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-prompt-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div className="enlight-popout enlight-popout--card enlight-signin-prompt">
        <div className="enlight-popout__hero">
          <span className="enlight-popout__confetti" aria-hidden>✨</span>
          <span className="enlight-popout__badge enlight-badge enlight-badge--gold">Save your progress</span>
        </div>
        <h2 id="signin-prompt-title" className="enlight-heading-serif enlight-popout__title">
          Keep your XP and streaks
        </h2>
        <p className="enlight-body-text enlight-popout__text">
          Sign in with your school Google account to unlock:
        </p>
        <ul className="enlight-signin-unlocks">
          <li>☁️ Cloud save across devices</li>
          <li>🏅 School &amp; clan leaderboards</li>
          <li>👥 Friends &amp; study together</li>
          <li>⚔️ Head-to-head quiz duels</li>
        </ul>
        <hr className="enlight-popout__divider" />
        <div className="enlight-popout__actions">
          <EnlightButton onClick={() => signInWithGoogle()}>Sign in with Google</EnlightButton>
          <EnlightButton variant="outline" onClick={dismiss}>Maybe later</EnlightButton>
        </div>
        {syncError && <p className="enlight-signin-error enlight-signin-prompt__error">{syncError}</p>}
        <button
          type="button"
          className="enlight-popout__close"
          onClick={dismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}
