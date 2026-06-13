import { useEffect, useRef } from 'react'
import { useMastery } from '@/features/mastery/MasteryContext'
import { usePomodoro } from '@/hooks/usePomodoro'
import type { TopicMeta } from '@/lib/contentTypes'

interface LessonTopBarProps {
  topic: TopicMeta
  chapterTitle: string
  fontScale: number
  onFontDecrease: () => void
  onFontIncrease: () => void
}

export function LessonTopBar({
  topic,
  chapterTitle,
  fontScale,
  onFontDecrease,
  onFontIncrease,
}: LessonTopBarProps) {
  const { isNotesRead, getChapterQuizLevel, areChapterNotesComplete } = useMastery()
  const notesComplete = areChapterNotesComplete(topic.chapterId)
  const done = notesComplete ? getChapterQuizLevel(topic.chapterId) : isNotesRead(topic.id) ? 1 : 0

  const { display, running, finished, toggle, reset } = usePomodoro()
  const barRef = useRef<HTMLDivElement>(null)

  // Add shadow when page is scrolled
  useEffect(() => {
    const onScroll = () => {
      if (barRef.current) {
        barRef.current.classList.toggle('is-scrolled', window.scrollY > 10)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const timerTitle = finished
    ? 'Session complete! Double-click to reset.'
    : running
      ? 'Click to pause · Double-click to reset'
      : 'Click to start · Double-click to reset'

  return (
    <div ref={barRef} className="enlight-lesson-topbar">
      <div className="enlight-lesson-topbar__inner">
        <div className="enlight-lesson-topbar__left">
          <span className="enlight-section-label">{chapterTitle}</span>
        </div>

        <div className="enlight-lesson-tools">
          {/* Font size controls */}
          <button
            type="button"
            className="enlight-tool-btn"
            onClick={onFontDecrease}
            disabled={fontScale <= 0.85}
            aria-label="Decrease font size"
            title="Smaller text"
          >
            A−
          </button>
          <button
            type="button"
            className="enlight-tool-btn"
            onClick={onFontIncrease}
            disabled={fontScale >= 1.3}
            aria-label="Increase font size"
            title="Larger text"
          >
            A+
          </button>

          {/* Pomodoro timer */}
          <button
            type="button"
            className={`enlight-timer${running ? ' enlight-timer--running' : ''}${finished ? ' enlight-timer--finished' : ''}`}
            onClick={toggle}
            onDoubleClick={(e) => { e.preventDefault(); reset() }}
            title={timerTitle}
            aria-label={`Pomodoro timer: ${display}. ${timerTitle}`}
          >
            <span className="enlight-timer__icon" aria-hidden>
              {finished ? '✓' : running ? '⏸' : '▶'}
            </span>
            <span className="enlight-timer__display">{display}</span>
          </button>

          {/* Mastery checklist */}
          <div className="enlight-checklist" aria-label={`Mastery: ${done} of 4 levels complete`}>
            <div className="enlight-checklist__steps">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`enlight-checklist__step${i < done ? ' enlight-checklist__step--done' : ''}`}
                  aria-hidden
                />
              ))}
            </div>
            <span className="enlight-checklist__count">✓ {done}/4</span>
          </div>
        </div>
      </div>
    </div>
  )
}
