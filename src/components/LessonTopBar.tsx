import { Link } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getTopicsForChapter } from '@/lib/contentLoader'
import type { TopicMeta } from '@/lib/contentTypes'

interface LessonTopBarProps {
  topic: TopicMeta
  chapterTitle: string
}

export function LessonTopBar({ topic, chapterTitle }: LessonTopBarProps) {
  const { isNotesRead, getChapterQuizLevel, areChapterNotesComplete } = useMastery()
  const chapterTopics = getTopicsForChapter(topic.chapterId)
  const notesComplete = areChapterNotesComplete(topic.chapterId)
  const done = notesComplete ? getChapterQuizLevel(topic.chapterId) : isNotesRead(topic.id) ? 1 : 0

  return (
    <div className="enlight-lesson-topbar">
      <div>
        <span className="enlight-section-label">{chapterTitle}</span>
        <nav className="enlight-lesson-nav">
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
        <span>A−</span>
        <span>A+</span>
        <span>25:00</span>
        <div className="enlight-checklist">
          <div className="enlight-checklist__steps">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`enlight-checklist__step${i < done ? ' enlight-checklist__step--done' : ''}`}
              />
            ))}
          </div>
          <span>{done}/4</span>
        </div>
      </div>
    </div>
  )
}
