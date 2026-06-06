import { EnlightButton } from '@/components/EnlightButton'
import type { ChapterMeta } from '@/lib/contentTypes'

interface ChapterQuizPopoutProps {
  chapter: ChapterMeta
  onDismiss: () => void
  onReviewTopics: () => void
}

export function ChapterQuizPopout({ chapter, onDismiss, onReviewTopics }: ChapterQuizPopoutProps) {
  return (
    <div className="enlight-popout-overlay" role="dialog" aria-modal="true" aria-labelledby="chapter-popout-title">
      <div className="enlight-popout">
        <span className="enlight-popout__badge">Chapter {chapter.number} complete</span>
        <h2 id="chapter-popout-title" className="enlight-heading-serif enlight-popout__title">
          Ready to test your understanding?
        </h2>
        <p className="enlight-body-text enlight-popout__text">
          You&apos;ve studied all topics in <strong>{chapter.title}</strong>. Take the chapter quiz to
          see how well you&apos;ve grasped the material — then revisit any weak topics.
        </p>
        <div className="enlight-popout__actions">
          <EnlightButton to={`/quiz/${chapter.id}/easy`}>Start Easy quiz</EnlightButton>
          <EnlightButton variant="outline" onClick={onReviewTopics}>
            Review topics
          </EnlightButton>
        </div>
        <button type="button" className="enlight-popout__close" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      </div>
    </div>
  )
}
