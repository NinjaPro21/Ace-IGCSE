import { useCallback, useEffect, useRef, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { masteryEngine } from './MasteryEngine'
import { AFK_IDLE_MS, pauseStudy, resumeStudy } from './studySession'

const CHECK_MS = 30_000

export function AfkPrompt() {
  const [open, setOpen] = useState(false)
  const lastActivity = useRef(Date.now())
  // Seconds of study time that were credited between the last real activity
  // and the moment we paused — refunded if the user confirms they were away.
  const idleCreditedSec = useRef(0)

  const markActive = useCallback(() => {
    if (!open) lastActivity.current = Date.now()
  }, [open])

  useEffect(() => {
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
      const idleMs = Date.now() - lastActivity.current
      if (idleMs >= AFK_IDLE_MS) {
        idleCreditedSec.current = Math.round(idleMs / 1000)
        pauseStudy()
        setOpen(true)
      }
    }, CHECK_MS)

    return () => {
      for (const event of events) {
        window.removeEventListener(event, markActive)
      }
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(interval)
    }
  }, [markActive, open])

  const handleStillHere = () => {
    lastActivity.current = Date.now()
    resumeStudy()
    setOpen(false)
  }

  const handleWasAway = () => {
    // The session hooks kept ticking until the pause fired — refund that span.
    masteryEngine.deductDailyStudySec(idleCreditedSec.current)
    masteryEngine.notify()
    idleCreditedSec.current = 0
    lastActivity.current = Date.now()
    resumeStudy()
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="ace-popout-overlay ace-afk-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="afk-prompt-title"
    >
      <div className="ace-popout ace-popout--card ace-afk-prompt">
        <h2 id="afk-prompt-title" className="ace-heading-serif ace-popout__title">
          Still studying?
        </h2>
        <p className="ace-body-text ace-popout__text">
          No activity for 10 minutes — study time is paused so your progress stays accurate.
        </p>
        <div className="ace-popout__actions">
          <EnlightButton onClick={handleStillHere}>I&apos;m still here</EnlightButton>
          <EnlightButton variant="outline" onClick={handleWasAway}>I was away</EnlightButton>
        </div>
      </div>
    </div>
  )
}
