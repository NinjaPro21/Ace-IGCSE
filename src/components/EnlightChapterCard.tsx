import { Link } from 'react-router-dom'
import type { ChapterMeta } from '@/lib/contentTypes'
import { getTopicsForChapter } from '@/lib/contentLoader'

type Status = 'available' | 'in_progress' | 'mastered'

const STATUS_LABEL: Record<Status, string> = {
  available: 'Available',
  in_progress: 'In progress',
  mastered: 'Mastered',
}

interface EnlightChapterCardProps {
  chapter: ChapterMeta
  status: Status
}

export function EnlightChapterCard({ chapter, status }: EnlightChapterCardProps) {
  const topics = getTopicsForChapter(chapter.id)
  const firstTopic = topics[0]
  const to = firstTopic
    ? `/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${firstTopic.id}`
    : `/subjects/${chapter.subjectId}`

  const accentClass =
    chapter.accentColor === 'blue' ? 'enlight-card--accent-blue' : 'enlight-card--accent-gold'

  const statusClass =
    status === 'mastered'
      ? 'enlight-status-dot--mastered'
      : status === 'in_progress'
        ? 'enlight-status-dot--progress'
        : ''

  return (
    <Link to={to} className={`enlight-card enlight-card--hover ${accentClass}`}>
      <span className="enlight-chapter-card__badge">{chapter.badge}</span>
      <h3 className="enlight-chapter-card__title">{chapter.title}</h3>
      <p className="enlight-chapter-card__summary">{chapter.summary}</p>
      <div className="enlight-chapter-card__footer">
        <span className={`enlight-status-dot ${statusClass}`}>{STATUS_LABEL[status]}</span>
        <div className="enlight-chapter-card__meta">
          <span className="enlight-chapter-card__count">{topics.length} topic{topics.length !== 1 ? 's' : ''}</span>
          {chapter.hasChapterQuiz && (
            <span className="enlight-chapter-card__quiz-badge">Quiz</span>
          )}
          <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  )
}
