import { Link } from 'react-router-dom'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import {
  formatAttemptDate,
  getQuizSummariesBySubject,
} from '@/features/quiz/quizHistoryStats'

export function ProgressQuizHistoryPage() {
  const { progress } = useMastery()
  const summaries = getQuizSummariesBySubject(progress)

  return (
    <>
      <EnlightSectionLabel>Quiz history</EnlightSectionLabel>
      <h1 className="enlight-heading-serif">Your quiz scores</h1>
      <p className="enlight-body-text enlight-progress-page__intro">
        Average scores per subject. Tap a subject to see every attempt and its mistake log.
      </p>

      {summaries.length === 0 ? (
        <section className="enlight-dashboard-card">
          <p className="enlight-body-text">No quizzes completed yet — take one from any subject!</p>
        </section>
      ) : (
        <div className="enlight-quiz-history-grid">
          {summaries.map((s) => (
            <Link
              key={s.subjectId}
              to={`/dashboard/quiz-history/${s.subjectId}`}
              className="enlight-quiz-history-card"
            >
              <h2 className="enlight-quiz-history-card__title">{s.subjectName}</h2>
              <div className="enlight-quiz-history-card__stats">
                <div>
                  <span className="enlight-quiz-history-card__value">{s.averageScore}%</span>
                  <span className="enlight-quiz-history-card__label">Average</span>
                </div>
                <div>
                  <span className="enlight-quiz-history-card__value">{s.bestScore}%</span>
                  <span className="enlight-quiz-history-card__label">Best</span>
                </div>
                <div>
                  <span className="enlight-quiz-history-card__value">{s.attemptCount}</span>
                  <span className="enlight-quiz-history-card__label">Attempts</span>
                </div>
              </div>
              {s.lastAttemptAt && (
                <span className="enlight-quiz-history-card__meta">
                  Last quiz {formatAttemptDate(s.lastAttemptAt)}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
