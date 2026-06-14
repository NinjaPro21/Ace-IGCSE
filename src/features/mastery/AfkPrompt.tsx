import { useCallback, useEffect, useRef, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { AFK_IDLE_MS, pauseStudy, resumeStudy } from './studySession'

const CHECK_MS = 30_000

export function AfkPrompt() {
  const [open, setOpen] = useState(false)
  const lastActivity = useRef(Date.now())

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
      if (Date.now() - lastActivity.current >= AFK_IDLE_MS) {
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
    lastActivity.current = Date.now()
    resumeStudy()
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="enlight-popout-overlay enlight-afk-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="afk-prompt-title"
    >
      <div className="enlight-popout enlight-popout--card enlight-afk-prompt">
        <h2 id="afk-prompt-title" className="enlight-heading-serif enlight-popout__title">
          Still studying?
        </h2>
        <p className="enlight-body-text enlight-popout__text">
          No activity for 10 minutes — study time is paused so your progress stays accurate.
        </p>
        <div className="enlight-popout__actions">
          <EnlightButton onClick={handleStillHere}>I&apos;m still here</EnlightButton>
          <EnlightButton variant="outline" onClick={handleWasAway}>I was away</EnlightButton>
        </div>
      </div>
    </div>
  )
}
