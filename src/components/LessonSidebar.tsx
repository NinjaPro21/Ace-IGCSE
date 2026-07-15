import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getChapter, getTopicsForChapter, getTopicSectionLabel } from '@/lib/contentLoader'
import { QuizScopeBadge } from '@/components/QuizScopeBadge'
import type { TopicMeta } from '@/lib/contentTypes'

const QUIZ_TIERS = ['Easy', 'Medium', 'Hard', 'PYP'] as const

const SIDEBAR_MD = { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }

interface LessonSidebarProps {
  topic: TopicMeta
  chapterTitle: string
  quickCheck?: string
  keyFormula?: string
}

export function LessonSidebar({ topic, chapterTitle, quickCheck, keyFormula }: LessonSidebarProps) {
  const { isNotesRead, getTopicQuizLevel, areChapterNotesComplete } = useMastery()
  const chapterTopics = getTopicsForChapter(topic.chapterId)
  const chapter = getChapter(topic.chapterId)
  const quizLevel = getTopicQuizLevel(topic.id)
  const chapterNotesComplete = areChapterNotesComplete(topic.chapterId)
  const showChapterQuiz = Boolean(chapter?.hasChapterQuiz && chapterNotesComplete)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const active = nav.querySelector('.enlight-lesson-sidebar__link--active')
    if (active instanceof HTMLElement) {
      active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    }
  }, [topic.id])

  return (
    <aside className="enlight-lesson-sidebar">
      <span className="enlight-section-label enlight-lesson-sidebar__chapter">{chapterTitle}</span>
      <nav ref={navRef} className="enlight-lesson-sidebar__nav" aria-label="Section navigation">
        {chapterTopics.map((t) => {
          const topicQuizLevel = getTopicQuizLevel(t.id)
          const done = topicQuizLevel >= 4
          const inProgress = isNotesRead(t.id) || topicQuizLevel > 0
          const sectionLabel = getTopicSectionLabel(topic.chapterId, t.id)
          return (
            <Link
              key={t.id}
              to={`/subjects/${topic.subjectId}/chapters/${topic.chapterId}/topics/${t.id}`}
              className={`enlight-lesson-sidebar__link${
                t.id === topic.id ? ' enlight-lesson-sidebar__link--active' : ''
              }`}
            >
              <span className="enlight-lesson-sidebar__link-text">{sectionLabel}</span>
              {done && <span className="enlight-lesson-sidebar__quiz-dot enlight-lesson-sidebar__quiz-dot--done" aria-label="Section mastered" />}
              {!done && inProgress && topicQuizLevel >= 2 && (
                <span className="enlight-lesson-sidebar__quiz-dot enlight-lesson-sidebar__quiz-dot--progress" aria-label="Quiz in progress" />
              )}
            </Link>
          )
        })}
      </nav>
      <div className="enlight-lesson-sidebar__body">
      <div className="enlight-lesson-sidebar__tools">
        <div
          className="enlight-checklist enlight-checklist--section"
          aria-label={`Section quiz tiers: ${quizLevel} of 4 complete (Easy, Medium, Hard, PYP)`}
        >
          <div className="enlight-checklist__steps" aria-hidden>
            {QUIZ_TIERS.map((tier, i) => (
              <span
                key={tier}
                className={`enlight-checklist__step${quizLevel > i ? ' enlight-checklist__step--done' : ''}`}
                title={tier}
              />
            ))}
          </div>
          <span className="enlight-checklist__count" title="Easy → Medium → Hard → PYP">
            Section quiz {quizLevel}/4
          </span>
        </div>
        {showChapterQuiz && (
          <Link
            to={`/quiz/${topic.chapterId}/easy`}
            className="enlight-lesson-sidebar__chapter-quiz"
          >
            <QuizScopeBadge scope="chapter" />
            <span>End-of-chapter review</span>
          </Link>
        )}
      </div>
      {keyFormula ? (
        <div className="enlight-lesson-sidebar__panel enlight-lesson-sidebar__panel--formula">
          <span className="enlight-lesson-sidebar__panel-title">Key formula</span>
          <div className="enlight-lesson-sidebar__formula">
            <ReactMarkdown remarkPlugins={SIDEBAR_MD.remarkPlugins} rehypePlugins={SIDEBAR_MD.rehypePlugins}>
              {`$$${keyFormula}$$`}
            </ReactMarkdown>
          </div>
        </div>
      ) : null}
      {quickCheck ? (
        <div className="enlight-lesson-sidebar__panel enlight-lesson-sidebar__panel--quick">
          <span className="enlight-lesson-sidebar__panel-title">Quick check</span>
          <div className="enlight-markdown enlight-lesson-sidebar__quick">
            <ReactMarkdown remarkPlugins={SIDEBAR_MD.remarkPlugins} rehypePlugins={SIDEBAR_MD.rehypePlugins}>
              {quickCheck}
            </ReactMarkdown>
          </div>
        </div>
      ) : null}
      </div>
    </aside>
  )
}
