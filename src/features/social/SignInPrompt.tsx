import { useCallback, useEffect, useRef, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { isStudyPaused } from '@/features/mastery/studySession'
import { useAuth } from './AuthContext'

/** Active study time before nudging guests to sign in */
export const SIGN_IN_PROMPT_MS = 3 * 60 * 1000

const TICK_MS = 1000
const ENGAGED_IDLE_MS = 2 * 60 * 1000
const SESSION_DISMISSED_KEY = 'ace-signin-prompt-dismissed'

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
      className="ace-popout-overlay ace-signin-prompt-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-prompt-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div className="ace-popout ace-popout--card ace-signin-prompt">
        <div className="ace-popout__hero">
          <span className="ace-popout__confetti" aria-hidden>✨</span>
          <span className="ace-popout__badge ace-badge ace-badge--gold">Save your progress</span>
        </div>
        <h2 id="signin-prompt-title" className="ace-heading-serif ace-popout__title">
          Keep your XP and streaks
        </h2>
        <p className="ace-body-text ace-popout__text">
          Sign in with your school Google account to unlock:
        </p>
        <ul className="ace-signin-unlocks">
          <li>☁️ Cloud save across devices</li>
          <li>School &amp; study group leaderboards</li>
          <li>👥 Friends &amp; study together</li>
          <li>⚔️ Head-to-head quiz duels</li>
        </ul>
        <hr className="ace-popout__divider" />
        <div className="ace-popout__actions">
          <EnlightButton onClick={() => signInWithGoogle()}>Sign in with Google</EnlightButton>
          <EnlightButton variant="outline" onClick={dismiss}>Maybe later</EnlightButton>
        </div>
        {syncError && <p className="ace-signin-error ace-signin-prompt__error">{syncError}</p>}
        <button
          type="button"
          className="ace-popout__close"
          onClick={dismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}
