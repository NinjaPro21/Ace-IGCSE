import { EnlightButton } from '@/components/EnlightButton'
import type { ChapterMeta } from '@/lib/contentTypes'

interface ChapterQuizPopoutProps {
  chapter: ChapterMeta
  onDismiss: () => void
  onReviewTopics: () => void
}

export function ChapterQuizPopout({ chapter, onDismiss, onReviewTopics }: ChapterQuizPopoutProps) {
  return (
    <div
      className="enlight-popout-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-popout-title"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss() }}
    >
      <div className="enlight-popout enlight-popout--card">
        {/* Confetti + badge row */}
        <div className="enlight-popout__hero">
          <span className="enlight-popout__confetti" aria-hidden>🎉</span>
          <span className="enlight-popout__badge enlight-badge enlight-badge--gold">
            Chapter {chapter.number} complete
          </span>
        </div>

        <h2 id="chapter-popout-title" className="enlight-heading-serif enlight-popout__title">
          Ready to test yourself?
        </h2>
        <p className="enlight-body-text enlight-popout__text">
          You&apos;ve studied every topic in{' '}
          <strong>{chapter.title}</strong>. Tackle the chapter quiz to confirm your understanding
          — then revisit any weak spots.
        </p>

        {/* Divider */}
        <hr className="enlight-popout__divider" />

        <div className="enlight-popout__actions">
          <EnlightButton to={`/quiz/${chapter.id}/easy`}>
            Start Easy quiz →
          </EnlightButton>
          <EnlightButton variant="outline" onClick={onReviewTopics}>
            Review topics
          </EnlightButton>
        </div>

        <button
          type="button"
          className="enlight-popout__close"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}
