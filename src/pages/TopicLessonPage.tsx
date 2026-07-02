import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightHeader } from '@/components/EnlightHeader'
import { ChapterQuizPopout } from '@/components/ChapterQuizPopout'
import { LessonSidebar } from '@/components/LessonSidebar'
import { LessonTopBar } from '@/components/LessonTopBar'
import { MarkdownLesson } from '@/components/MarkdownLesson'
import { MathText } from '@/components/MathText'
import { TopicMasteryPath } from '@/components/TopicMasteryPath'
import { useMastery } from '@/features/mastery/MasteryContext'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import { useChapterSession } from '@/features/mastery/useChapterSession'
import { useTopicSession } from '@/features/mastery/useTopicSession'
import { useAuth } from '@/features/social/AuthContext'
import { usePresence } from '@/features/social/usePresence'
import {
  getChapter,
  getNotesForTopic,
  getSubject,
  getTopic,
  getTopicsForChapter,
  getTopicSectionLabel,
} from '@/lib/contentLoader'
import { isRedundantSectionSubtitle } from '@/lib/mathMarkdown'

const FONT_STEPS = [0.85, 1.0, 1.15, 1.3]

function formatStudyClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function TopicLessonPage() {
  const {
    subjectId = '',
    chapterId = '',
    topicId = '',
  } = useParams()
  const navigate = useNavigate()
  const {
    markNotesRead,
    areChapterNotesComplete,
    markChapterPopoutSeen,
    canTakeTopicQuiz,
    getTopicQuizLevel,
    isNotesRead,
    getTopicTimeSpent,
    hasTopicStudyTime,
    notesMinSeconds,
  } = useMastery()

  const [showPopout, setShowPopout] = useState(false)
  const [fontStep, setFontStep] = useState(1)
  const [readProgress, setReadProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const lessonCardRef = useRef<HTMLDivElement>(null)

  useChapterSession(chapterId)
  useTopicSession(topicId)

  const { user } = useAuth()

  useEffect(() => {
    if (subjectId && chapterId && topicId) {
      masteryEngine.recordLastVisited(subjectId, chapterId, topicId)
      masteryEngine.notify()
    }
  }, [subjectId, chapterId, topicId])

  const topic = getTopic(topicId)
  usePresence(user?.id, {
    status: 'studying',
    subjectId,
    currentChapterId: chapterId,
    currentTopicId: topicId,
    topicTitle: topic?.title,
    enabled: Boolean(user),
  })

  const topicTimeSpent = getTopicTimeSpent(topicId)
  const studyComplete = hasTopicStudyTime(topicId)
  const studyProgressPct = Math.min(100, Math.round((topicTimeSpent / notesMinSeconds) * 100))

  const fontScale = FONT_STEPS[fontStep]

  // Reading progress + scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setReadProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
      setShowScrollTop(scrolled > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reset progress on topic change
  useEffect(() => {
    setReadProgress(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [topicId])

  const chapter = getChapter(chapterId)
  const subject = getSubject(subjectId)
  const chapterTopics = chapter ? getTopicsForChapter(chapter.id) : []
  const topicIndex = chapterTopics.findIndex((t) => t.id === topicId)
  const prevTopic = topicIndex > 0 ? chapterTopics[topicIndex - 1] : null
  const nextTopic =
    topicIndex >= 0 && topicIndex < chapterTopics.length - 1
      ? chapterTopics[topicIndex + 1]
      : null

  useEffect(() => {
    if (!topicId || !chapterId || !topic || !chapter) return
    if (isNotesRead(topicId)) return
    if (!hasTopicStudyTime(topicId)) return

    const chapterJustCompleted = markNotesRead(topicId, chapterId)
    if (chapterJustCompleted) {
      setShowPopout(true)
    }
  }, [
    topicId,
    chapterId,
    topic,
    chapter,
    topicTimeSpent,
    isNotesRead,
    hasTopicStudyTime,
    markNotesRead,
  ])

  if (!topic || !chapter || !subject) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-container enlight-page-padding">
          <p>Lesson not found.</p>
          <Link to="/">Home</Link>
        </div>
      </div>
    )
  }

  const notes = getNotesForTopic(topic)
  const sectionLabel = getTopicSectionLabel(chapterId, topicId)
  const lessonMetaLine =
    topic.lessonMeta ??
    (isRedundantSectionSubtitle(topic.subtitle) ? chapter.title : topic.subtitle)
  const notesComplete = areChapterNotesComplete(chapterId)
  const sectionNotesComplete = isNotesRead(topicId)
  const canStartSectionQuiz = canTakeTopicQuiz(topicId, 'easy')
  const sectionQuizLevel = getTopicQuizLevel(topicId)

  const dismissPopout = () => {
    setShowPopout(false)
    markChapterPopoutSeen(chapterId)
  }

  const chapterLabel = chapter.badge ?? `Ch.${chapter.number} · ${chapter.title}`

  return (
    <div className="enlight-app">
      <EnlightHeader />

      <LessonTopBar
        topic={topic}
        chapterTitle={chapterLabel}
        fontScale={fontScale}
        onFontDecrease={() => setFontStep((s) => Math.max(0, s - 1))}
        onFontIncrease={() => setFontStep((s) => Math.min(FONT_STEPS.length - 1, s + 1))}
      />

      {/* Page-level reading progress bar */}
      <div className="enlight-read-progress" aria-hidden="true">
        <div className="enlight-read-progress__bar" style={{ width: `${readProgress}%` }} />
      </div>

      <div
        className="enlight-container enlight-page-padding"
        style={{ '--enlight-font-scale': fontScale } as React.CSSProperties}
      >
        <div className="enlight-lesson-layout">
          <LessonSidebar topic={topic} chapterTitle={chapterLabel} />

          <main className="enlight-lesson-main">
            <Link to={`/subjects/${subjectId}`} className="enlight-lesson-back">
              ← Back to {subject.name}
            </Link>
            <EnlightSectionLabel>{sectionLabel}</EnlightSectionLabel>
            <h1 className="enlight-heading-serif">
              <MathText content={topic.title} title />
            </h1>
            {lessonMetaLine && (
              <p className="enlight-lesson-meta">
                <MathText content={lessonMetaLine} title />
              </p>
            )}

            {!isNotesRead(topicId) ? (
              <div className="enlight-study-timer" role="status">
                <div className="enlight-study-timer__row">
                  <span className="enlight-study-timer__label">
                    {studyComplete
                      ? 'Study time complete — +5 XP awarded!'
                      : `Study this section · ${formatStudyClock(topicTimeSpent)} / ${formatStudyClock(notesMinSeconds)} for +5 XP`}
                  </span>
                  <span className="enlight-study-timer__pct">{studyProgressPct}%</span>
                </div>
                <div className="enlight-study-timer__bar" aria-hidden="true">
                  <div
                    className="enlight-study-timer__fill"
                    style={{ width: `${studyProgressPct}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="enlight-study-timer enlight-study-timer--done" role="status">
                <div className="enlight-study-timer__row">
                  <span className="enlight-study-timer__label">
                    Section complete · {formatStudyClock(topicTimeSpent)} studied · +5 XP earned
                  </span>
                  <span className="enlight-study-timer__pct">✓</span>
                </div>
                <div className="enlight-study-timer__bar" aria-hidden="true">
                  <div className="enlight-study-timer__fill" style={{ width: '100%' }} />
                </div>
              </div>
            )}

            <div ref={lessonCardRef} className="enlight-lesson-card">
              <MarkdownLesson
                content={notes}
                explorerId={topic.explorerId}
                explorerPanels={topic.explorerPanels}
                subjectId={subjectId}
              />
            </div>

            <div className="enlight-topic-nav">
              {prevTopic ? (
                <EnlightButton
                  to={`/subjects/${subjectId}/chapters/${chapterId}/topics/${prevTopic.id}`}
                  variant="outline"
                >
                  ← <MathText content={prevTopic.title} />
                </EnlightButton>
              ) : (
                <span />
              )}
              {nextTopic ? (
                <EnlightButton
                  to={`/subjects/${subjectId}/chapters/${chapterId}/topics/${nextTopic.id}`}
                >
                  <MathText content={nextTopic.title} /> →
                </EnlightButton>
              ) : sectionNotesComplete && canStartSectionQuiz && sectionQuizLevel < 2 ? (
                <EnlightButton to={`/quiz/topic/${topicId}/easy`}>
                  Section quiz →
                </EnlightButton>
              ) : (
                <span />
              )}
            </div>

            {topic.quizIds && (
              <>
                <h2 className="enlight-heading-serif" style={{ fontSize: '1.5rem', marginTop: 48 }}>
                  Section mastery
                </h2>
                <p className="enlight-body-text">
                  Pass each tier to master this section. Retries shuffle numbers and question order.
                  {!sectionNotesComplete && (
                    <> Study notes for 5 minutes to earn the notes-read XP bonus.</>
                  )}
                </p>
                <TopicMasteryPath topicId={topicId} notesComplete={sectionNotesComplete} />
              </>
            )}

            {chapter.hasChapterQuiz && notesComplete && (
              <p className="enlight-body-text" style={{ marginTop: 24 }}>
                Chapter review:{' '}
                <Link to={`/quiz/${chapterId}/easy`}>combined Easy quiz</Link> (all sections)
              </p>
            )}

            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
              <EnlightButton to={`/subjects/${subjectId}`} variant="outline">
                All chapters
              </EnlightButton>
            </div>
          </main>
        </div>
      </div>

      {showPopout && chapter.hasChapterQuiz && notesComplete && (
        <ChapterQuizPopout
          chapter={chapter}
          onDismiss={dismissPopout}
          onReviewTopics={() => {
            dismissPopout()
            navigate(`/subjects/${subjectId}`)
          }}
        />
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          type="button"
          className="enlight-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          title="Back to top"
        >
          ↑
        </button>
      )}

      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
