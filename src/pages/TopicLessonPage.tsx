import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightHeader } from '@/components/EnlightHeader'
import { ChapterQuizPopout } from '@/components/ChapterQuizPopout'
import { LessonSidebar } from '@/components/LessonSidebar'
import { LessonTopBar } from '@/components/LessonTopBar'
import { MarkdownLesson } from '@/components/MarkdownLesson'
import { MasteryPath } from '@/components/MasteryPath'
import { useMastery } from '@/features/mastery/MasteryContext'
import { decodeHTMLEntities } from '@/lib/mathMarkdown'
import {
  getChapter,
  getNotesForTopic,
  getSubject,
  getTopic,
  getTopicsForChapter,
} from '@/lib/contentLoader'

const FONT_STEPS = [0.85, 1.0, 1.15, 1.3]

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
    shouldShowChapterPopout,
    markChapterPopoutSeen,
    canTakeChapterQuiz,
  } = useMastery()

  const [showPopout, setShowPopout] = useState(false)
  const [fontStep, setFontStep] = useState(1)

  const fontScale = FONT_STEPS[fontStep]

  const topic = getTopic(topicId)
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
    const t = setTimeout(() => {
      const chapterJustCompleted = markNotesRead(topicId, chapterId)
      if (chapterJustCompleted || shouldShowChapterPopout(chapterId)) {
        setShowPopout(true)
      }
    }, 1500)
    return () => clearTimeout(t)
  }, [topicId, chapterId, topic, chapter, markNotesRead, shouldShowChapterPopout])

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
  const notesComplete = areChapterNotesComplete(chapterId)
  const isAnchor = topic.isChapterQuizAnchor && chapter.hasChapterQuiz
  const canStartQuiz = canTakeChapterQuiz(chapterId, 'easy')

  const dismissPopout = () => {
    setShowPopout(false)
    markChapterPopoutSeen(chapterId)
  }

  const chapterLabel = `${subject.name} · ${chapter.title}`

  return (
    <div className="enlight-app">
      <EnlightHeader />

      {/* Sticky lesson nav bar */}
      <LessonTopBar
        topic={topic}
        chapterTitle={chapterLabel}
        fontScale={fontScale}
        onFontDecrease={() => setFontStep((s) => Math.max(0, s - 1))}
        onFontIncrease={() => setFontStep((s) => Math.min(FONT_STEPS.length - 1, s + 1))}
      />

      <div
        className="enlight-container enlight-page-padding"
        style={{ '--enlight-font-scale': fontScale } as React.CSSProperties}
      >
        <div className="enlight-lesson-layout">
          <LessonSidebar topic={topic} chapterTitle={chapterLabel} />

          <main className="enlight-lesson-main">
            <EnlightSectionLabel>
              Chapter {chapter.number} · {subject.code}
            </EnlightSectionLabel>
            <h1 className="enlight-heading-serif">{decodeHTMLEntities(topic.title)}</h1>
            <p className="enlight-body-text">{topic.subtitle}</p>

            <div className="enlight-lesson-card">
              <MarkdownLesson content={notes} explorerId={topic.explorerId} />
            </div>

            <div className="enlight-topic-nav">
              {prevTopic ? (
                <EnlightButton
                  to={`/subjects/${subjectId}/chapters/${chapterId}/topics/${prevTopic.id}`}
                  variant="outline"
                >
                  ← {decodeHTMLEntities(prevTopic.title)}
                </EnlightButton>
              ) : (
                <span />
              )}
              {nextTopic ? (
                <EnlightButton
                  to={`/subjects/${subjectId}/chapters/${chapterId}/topics/${nextTopic.id}`}
                >
                  {decodeHTMLEntities(nextTopic.title)} →
                </EnlightButton>
              ) : isAnchor && canStartQuiz ? (
                <EnlightButton onClick={() => setShowPopout(true)}>Test chapter →</EnlightButton>
              ) : (
                <span />
              )}
            </div>

            {isAnchor && (
              <>
                <h2 className="enlight-heading-serif" style={{ fontSize: '1.5rem', marginTop: 48 }}>
                  Chapter mastery
                </h2>
                <p className="enlight-body-text">
                  {notesComplete
                    ? 'All topics studied — work through each quiz tier. Aim for 70%+ to advance.'
                    : 'Read every topic in this chapter to unlock the chapter quiz.'}
                </p>
                <MasteryPath chapterId={chapterId} notesComplete={notesComplete} />
              </>
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

      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
