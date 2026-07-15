import { useEffect, useRef } from 'react'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getTopicsForChapter } from '@/lib/contentLoader'
import { PomodoroControl } from '@/components/PomodoroControl'
import type { TopicMeta } from '@/lib/contentTypes'

interface LessonTopBarProps {
  topic: TopicMeta
  chapterTitle: string
  hasChapterQuiz?: boolean
  fontScale: number
  onFontDecrease: () => void
  onFontIncrease: () => void
}

export function LessonTopBar({
  topic,
  chapterTitle,
  hasChapterQuiz = false,
  fontScale,
  onFontDecrease,
  onFontIncrease,
}: LessonTopBarProps) {
  const { isNotesRead, getChapterQuizLevel, areChapterNotesComplete } = useMastery()
  const chapterTopics = getTopicsForChapter(topic.chapterId)
  const notesReadCount = chapterTopics.filter((t) => isNotesRead(t.id)).length
  const notesComplete = areChapterNotesComplete(topic.chapterId)
  const quizLevel = getChapterQuizLevel(topic.chapterId)
  const done = notesComplete ? quizLevel : notesReadCount
  const totalSteps = notesComplete ? 4 : Math.max(chapterTopics.length, 1)
  const checklistLabel = notesComplete
    ? hasChapterQuiz
      ? `Chapter quiz ${done}/4`
      : `Quiz ${done}/4`
    : `Sections ${done}/${totalSteps}`
  const checklistAria = notesComplete
    ? hasChapterQuiz
      ? `Chapter quiz progress: ${done} of 4 tiers complete`
      : `Quiz progress: ${done} of 4 tiers complete`
    : `Notes progress: ${done} of ${totalSteps} sections read`

  const barRef = useRef<HTMLDivElement>(null)

  // Keep sticky offsets in sync with real topbar height (wrap / font scale)
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const syncHeight = () => {
      const h = Math.round(el.getBoundingClientRect().height)
      document.documentElement.style.setProperty('--enlight-lesson-topbar-height', `${h}px`)
    }
    syncHeight()
    const ro = new ResizeObserver(syncHeight)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--enlight-lesson-topbar-height')
    }
  }, [])

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

          <PomodoroControl />

          {/* Session progress: sections read, then quiz tiers */}
          <div className="enlight-checklist" aria-label={checklistAria}>
            <div className="enlight-checklist__steps">
              {Array.from({ length: totalSteps }, (_, i) => (
                <span
                  key={i}
                  className={`enlight-checklist__step${i < done ? ' enlight-checklist__step--done' : ''}`}
                  aria-hidden
                />
              ))}
            </div>
            <span className="enlight-checklist__count">{checklistLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
