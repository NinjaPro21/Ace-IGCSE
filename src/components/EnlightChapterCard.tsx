import { Link } from 'react-router-dom'
import { MathText } from '@/components/MathText'
import type { ChapterMeta } from '@/lib/contentTypes'
import { getTopicsForChapter } from '@/lib/contentLoader'

type Status = 'available' | 'in_progress' | 'mastered'

const STATUS_LABEL: Record<Status, string> = {
  available: 'Not started',
  in_progress: 'In progress',
  mastered: 'Mastered',
}

const STATUS_CLASS: Record<Status, string> = {
  available: 'ace-chapter-card__status--available',
  in_progress: 'ace-chapter-card__status--progress',
  mastered: 'ace-chapter-card__status--mastered',
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
    <Link to={to} className="ace-card ace-card--chapter ace-card--hover">
      <span className="ace-chapter-card__badge">
        {chapter.number === 0 ? 'Calculator' : `Chapter ${chapter.number}`}
      </span>
      <h3 className="ace-chapter-card__title">{chapter.title}</h3>
      <p className="ace-chapter-card__summary">
        <MathText content={chapter.summary} title />
      </p>
      {masteryPercent !== undefined && masteryPercent > 0 && (
        <div className="ace-chapter-card__progress">
          <div className="ace-chapter-card__progress-bar">
            <div
              className="ace-chapter-card__progress-fill"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <span className="ace-chapter-card__progress-label">{masteryPercent}% mastery</span>
        </div>
      )}
      <div className="ace-chapter-card__footer">
        <span className={`ace-chapter-card__status ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>
        <div className="ace-chapter-card__meta">
          <span className="ace-chapter-card__count">{topics.length} topic{topics.length !== 1 ? 's' : ''}</span>
          {chapter.hasChapterQuiz && (
            <span className="ace-chapter-card__quiz-badge ace-chapter-card__quiz-badge--chapter">
              Chapter quiz
            </span>
          )}
          <span className="ace-chapter-card__arrow" aria-hidden>→</span>
        </div>
      </div>
    </Link>
  )
}
