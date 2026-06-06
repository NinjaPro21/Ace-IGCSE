import { Link } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getTopicsForChapter } from '@/lib/contentLoader'
import type { TopicMeta } from '@/lib/contentTypes'

interface LessonSidebarProps {
  topic: TopicMeta
  chapterTitle: string
}

export function LessonSidebar({ topic, chapterTitle }: LessonSidebarProps) {
  const { isNotesRead, getChapterQuizLevel, areChapterNotesComplete } = useMastery()
  const chapterTopics = getTopicsForChapter(topic.chapterId)
  const notesComplete = areChapterNotesComplete(topic.chapterId)
  const done = notesComplete ? getChapterQuizLevel(topic.chapterId) : isNotesRead(topic.id) ? 1 : 0

  return (
    <aside className="enlight-lesson-sidebar">
      <span className="enlight-section-label">{chapterTitle}</span>
      <nav className="enlight-lesson-sidebar__nav" aria-label="Section navigation">
        {chapterTopics.map((t) => (
          <Link
            key={t.id}
            to={`/subjects/${topic.subjectId}/chapters/${topic.chapterId}/topics/${t.id}`}
            className={`enlight-lesson-sidebar__link${
              t.id === topic.id ? ' enlight-lesson-sidebar__link--active' : ''
            }`}
          >
            {t.subtitle}
          </Link>
        ))}
      </nav>
      <div className="enlight-lesson-sidebar__tools">
        <div className="enlight-checklist">
          <div className="enlight-checklist__steps" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`enlight-checklist__step${i < done ? ' enlight-checklist__step--done' : ''}`}
              />
            ))}
          </div>
          <span>Mastery {done}/4</span>
        </div>
      </div>
    </aside>
  )
}
