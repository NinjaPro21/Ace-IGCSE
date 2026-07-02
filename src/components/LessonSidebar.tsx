import { Link } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getTopicsForChapter, getTopicSectionLabel } from '@/lib/contentLoader'
import type { TopicMeta } from '@/lib/contentTypes'

const QUIZ_TIERS = ['Easy', 'Medium', 'Hard', 'PYP'] as const

interface LessonSidebarProps {
  topic: TopicMeta
  chapterTitle: string
}

export function LessonSidebar({ topic, chapterTitle }: LessonSidebarProps) {
  const { isNotesRead, getTopicQuizLevel } = useMastery()
  const chapterTopics = getTopicsForChapter(topic.chapterId)
  const quizLevel = getTopicQuizLevel(topic.id)

  return (
    <aside className="enlight-lesson-sidebar">
      <span className="enlight-section-label">{chapterTitle}</span>
      <nav className="enlight-lesson-sidebar__nav" aria-label="Section navigation">
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
      <div className="enlight-lesson-sidebar__tools">
        <div
          className="enlight-checklist"
          aria-label={`Quiz tiers: ${quizLevel} of 4 complete (Easy, Medium, Hard, PYP)`}
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
            Quiz {quizLevel}/4
          </span>
        </div>
      </div>
    </aside>
  )
}
