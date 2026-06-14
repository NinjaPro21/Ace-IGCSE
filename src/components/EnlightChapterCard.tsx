import { Link } from 'react-router-dom'
import type { ChapterMeta } from '@/lib/contentTypes'
import { getTopicsForChapter } from '@/lib/contentLoader'

type Status = 'available' | 'in_progress' | 'mastered'

const STATUS_LABEL: Record<Status, string> = {
  available: 'Not started',
  in_progress: 'In progress',
  mastered: 'Mastered',
}

const STATUS_CLASS: Record<Status, string> = {
  available: 'enlight-chapter-card__status--available',
  in_progress: 'enlight-chapter-card__status--progress',
  mastered: 'enlight-chapter-card__status--mastered',
}

interface EnlightChapterCardProps {
  chapter: ChapterMeta
  status: Status
  masteryPercent?: number
}

export function EnlightChapterCard({ chapter, status, masteryPercent }: EnlightChapterCardProps) {
  const topics = getTopicsForChapter(chapter.id)
  const firstTopic = topics[0]
  const to = firstTopic
    ? `/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${firstTopic.id}`
    : `/subjects/${chapter.subjectId}`

  return (
    <Link to={to} className="enlight-card enlight-card--chapter enlight-card--hover">
      <span className="enlight-chapter-card__badge">Chapter {chapter.number}</span>
      <h3 className="enlight-chapter-card__title">{chapter.title}</h3>
      <p className="enlight-chapter-card__summary">{chapter.summary}</p>
      {masteryPercent !== undefined && masteryPercent > 0 && (
        <div className="enlight-chapter-card__progress">
          <div className="enlight-chapter-card__progress-bar">
            <div
              className="enlight-chapter-card__progress-fill"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <span className="enlight-chapter-card__progress-label">{masteryPercent}% mastery</span>
        </div>
      )}
      <div className="enlight-chapter-card__footer">
        <span className={`enlight-chapter-card__status ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>
        <div className="enlight-chapter-card__meta">
          <span className="enlight-chapter-card__count">{topics.length} topic{topics.length !== 1 ? 's' : ''}</span>
          {chapter.hasChapterQuiz && (
            <span className="enlight-chapter-card__quiz-badge">Quiz</span>
          )}
          <span className="enlight-chapter-card__arrow" aria-hidden>→</span>
        </div>
      </div>
    </Link>
  )
}
