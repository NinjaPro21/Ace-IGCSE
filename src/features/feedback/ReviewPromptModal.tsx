import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from '@/features/social/AuthContext'
import { submitAppReview } from './feedbackApi'
import {
  markReviewSkipped,
  markReviewSubmittedLocally,
  shouldShowReviewPrompt,
} from './reviewUsageStorage'

export function ReviewPromptModal() {
  const { user, profileHydrated } = useAuth()
  const [visible, setVisible] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remoteSubmitted, setRemoteSubmitted] = useState(false)

  useEffect(() => {
    if (!user?.id || !profileHydrated) return
    let cancelled = false
    void import('./feedbackApi').then(({ fetchReviewSubmitted }) =>
      fetchReviewSubmitted(user.id).then((submitted) => {
        if (!cancelled) setRemoteSubmitted(submitted)
      }),
    )
    return () => {
      cancelled = true
    }
  }, [user?.id, profileHydrated])

  useEffect(() => {
    if (!user?.id || !profileHydrated) {
      setVisible(false)
      return
    }
    setVisible(shouldShowReviewPrompt(user.id, remoteSubmitted))
  }, [user?.id, profileHydrated, remoteSubmitted])

  useEffect(() => {
    const onUsageTick = () => {
      if (!user?.id) return
      if (shouldShowReviewPrompt(user.id, remoteSubmitted)) {
        setVisible(true)
      }
    }
    window.addEventListener('enlight-usage-tick', onUsageTick)
    return () => window.removeEventListener('enlight-usage-tick', onUsageTick)
  }, [user?.id, remoteSubmitted])

  if (!visible || !user) return null

  const handleSkip = () => {
    markReviewSkipped(user.id)
    setVisible(false)
    setRating(0)
    setComment('')
    setError(null)
  }

  const handleSubmit = async () => {
    if (rating < 1) {
      setError('Please select a star rating.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await submitAppReview(user.id, rating, comment)
      markReviewSubmittedLocally(user.id)
      setRemoteSubmitted(true)
      setVisible(false)
    } catch {
      setError('Could not save your review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="enlight-popout-overlay" role="dialog" aria-modal="true" aria-labelledby="review-prompt-title">
      <div className="enlight-popout enlight-popout--card enlight-review-prompt">
        <h2 id="review-prompt-title" className="enlight-heading-serif">
          How is AceIGCSE?
        </h2>
        <p className="enlight-body-text">
          You have been studying for a while — we would love a quick rating out of 5 stars and an optional comment.
        </p>

        <div className="enlight-review-prompt__stars" role="group" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`enlight-review-prompt__star${star <= displayRating ? ' enlight-review-prompt__star--active' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              aria-pressed={star <= rating}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="enlight-profile-form__input enlight-review-prompt__comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional: what do you like or what could be better?"
          maxLength={500}
          rows={3}
        />

        {error && <p className="enlight-review-prompt__error">{error}</p>}

        <div className="enlight-popout__actions">
          <EnlightButton onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit review'}
          </EnlightButton>
          <EnlightButton variant="outline" onClick={handleSkip} disabled={submitting}>
            Skip for now
          </EnlightButton>
        </div>
      </div>
    </div>
  )
}
