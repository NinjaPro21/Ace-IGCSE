import { Link } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getTopicsForChapter } from '@/lib/contentLoader'
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
  const chapterTopics = getTopicsForChapter(topic.chapterId)
  const notesComplete = areChapterNotesComplete(topic.chapterId)
  const done = notesComplete ? getChapterQuizLevel(topic.chapterId) : isNotesRead(topic.id) ? 1 : 0

  const { display, running, finished, toggle, reset } = usePomodoro()

  const timerTitle = finished
    ? 'Session complete! Double-click to reset.'
    : running
      ? 'Click to pause · Double-click to reset'
      : 'Click to start · Double-click to reset'

  return (
    <div className="enlight-lesson-topbar">
      <div className="enlight-lesson-topbar__left">
        <span className="enlight-section-label">{chapterTitle}</span>
        <nav className="enlight-lesson-nav" aria-label="Chapter topics">
          {chapterTopics.map((t) => (
            <Link
              key={t.id}
              to={`/subjects/${topic.subjectId}/chapters/${topic.chapterId}/topics/${t.id}`}
              className={`enlight-lesson-nav__link${t.id === topic.id ? ' enlight-lesson-nav__link--active' : ''}`}
            >
              {t.subtitle}
            </Link>
          ))}
        </nav>
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
  )
}
