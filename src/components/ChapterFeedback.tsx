import { useState } from 'react'
import { useAuth } from '@/features/social/AuthContext'
import { trackEnlightEvent } from '@/lib/enlightEvents'

interface ChapterFeedbackProps {
  chapterId: string
  subject: string
}

export function ChapterFeedback({ chapterId, subject }: ChapterFeedbackProps) {
  const { user } = useAuth()
  const [vote, setVote] = useState<'up' | 'down' | null>(null)

  const handleVote = (direction: 'up' | 'down') => {
    if (vote || !user?.id) return
    setVote(direction)
    void trackEnlightEvent(
      user.id,
      direction === 'up' ? 'chapter_thumbs_up' : 'chapter_thumbs_down',
      { chapterId, subject },
    )
  }

  return (
    <div className="ace-chapter-feedback">
      <span className="ace-chapter-feedback__label">Was this chapter helpful?</span>
      <div className="ace-chapter-feedback__actions">
        <button
          type="button"
          className={`ace-chapter-feedback__btn${vote === 'up' ? ' ace-chapter-feedback__btn--active' : ''}`}
          onClick={() => handleVote('up')}
          disabled={vote !== null}
          aria-label="Thumbs up"
        >
          👍
        </button>
        <button
          type="button"
          className={`ace-chapter-feedback__btn${vote === 'down' ? ' ace-chapter-feedback__btn--active' : ''}`}
          onClick={() => handleVote('down')}
          disabled={vote !== null}
          aria-label="Thumbs down"
        >
          👎
        </button>
      </div>
      {vote && <span className="ace-chapter-feedback__thanks">Thanks for your feedback!</span>}
    </div>
  )
}
