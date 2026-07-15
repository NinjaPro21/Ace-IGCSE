import { EnlightButton } from '@/components/EnlightButton'
import { QuizScopeBadge } from '@/components/QuizScopeBadge'
import type { ChapterMeta } from '@/lib/contentTypes'

interface ChapterQuizPopoutProps {
  chapter: ChapterMeta
  onDismiss: () => void
  onReviewTopics: () => void
}

export function ChapterQuizPopout({ chapter, onDismiss, onReviewTopics }: ChapterQuizPopoutProps) {
  return (
    <div
      className="ace-popout-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-popout-title"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss() }}
    >
      <div className="ace-popout ace-popout--card">
        {/* Confetti + badge row */}
        <div className="ace-popout__hero">
          <span className="ace-popout__confetti" aria-hidden>🎉</span>
          <span className="ace-popout__badge ace-badge ace-badge--gold">
            Chapter {chapter.number} complete
          </span>
          <QuizScopeBadge scope="chapter" />
        </div>

        <h2 id="chapter-popout-title" className="ace-heading-serif ace-popout__title">
          Ready to test yourself?
        </h2>
        <p className="ace-body-text ace-popout__text">
          You&apos;ve studied every topic in{' '}
          <strong>{chapter.title}</strong>. Tackle the chapter quiz to confirm your understanding
          — then revisit any weak spots.
        </p>

        {/* Divider */}
        <hr className="ace-popout__divider" />

        <div className="ace-popout__actions">
          <EnlightButton to={`/quiz/${chapter.id}/easy`} onClick={onDismiss}>
            Start chapter quiz (Easy) →
          </EnlightButton>
          <EnlightButton variant="outline" onClick={onReviewTopics}>
            Review topics
          </EnlightButton>
        </div>

        <button
          type="button"
          className="ace-popout__close"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}
