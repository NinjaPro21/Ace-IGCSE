import { Link, useParams } from 'react-router-dom'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import { QuizMistakeLog } from '@/features/quiz/QuizMistakeLog'
import {
  formatAttemptDate,
  formatDifficulty,
  getQuizAttemptsForSubject,
} from '@/features/quiz/quizHistoryStats'
import { getSubject } from '@/lib/contentLoader'
import { useState } from 'react'
import { usePageTitle } from '@/hooks/usePageTitle'

export function ProgressQuizHistorySubjectPage() {
  const { subjectId = '' } = useParams()
  const { progress } = useMastery()
  const subject = getSubject(subjectId)
  usePageTitle(subject ? `${subject.name} quiz history` : 'Quiz history')
  const attempts = getQuizAttemptsForSubject(progress, subjectId)
  const [expandedId, setExpandedId] = useState<string | null>(attempts[0]?.id ?? null)

  if (!subject) {
    return <p className="enlight-body-text">Subject not found.</p>
  }

  const avg =
    attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + a.scorePercent, 0) / attempts.length)
      : 0

  return (
    <>
      <EnlightSectionLabel>{subject.name}</EnlightSectionLabel>
      <h1 className="enlight-heading-serif">Quiz history</h1>
      <p className="enlight-body-text enlight-progress-page__intro">
        {attempts.length} attempt{attempts.length === 1 ? '' : 's'} · {avg}% average
      </p>

      {attempts.length === 0 ? (
        <section className="enlight-dashboard-card">
          <p className="enlight-body-text">No attempts for this subject yet.</p>
          <Link to={`/subjects/${subjectId}`}>Browse {subject.name} →</Link>
        </section>
      ) : (
        <div className="enlight-quiz-attempt-list">
          {attempts.map((attempt) => {
            const open = expandedId === attempt.id
            return (
              <section key={attempt.id} className="enlight-dashboard-card enlight-quiz-attempt">
                <button
                  type="button"
                  className="enlight-quiz-attempt__head"
                  onClick={() => setExpandedId(open ? null : attempt.id)}
                >
                  <div>
                    <strong>{attempt.quizTitle}</strong>
                    <span className="enlight-quiz-attempt__meta">
                      {formatDifficulty(attempt.difficulty)} · {formatAttemptDate(attempt.at)}
                    </span>
                  </div>
                  <div className="enlight-quiz-attempt__score-wrap">
                    <span
                      className={[
                        'enlight-quiz-attempt__score',
                        attempt.passed ? 'enlight-quiz-attempt__score--pass' : '',
                      ].join(' ')}
                    >
                      {attempt.scorePercent}%
                    </span>
                    <span className="enlight-quiz-attempt__chevron">{open ? '▾' : '▸'}</span>
                  </div>
                </button>
                {open && (
                  <div className="enlight-quiz-attempt__body">
                    <p className="enlight-body-text">
                      {attempt.correctCount} of {attempt.questionCount} correct
                      {attempt.mistakes.length > 0
                        ? ` · ${attempt.mistakes.length} mistake${attempt.mistakes.length === 1 ? '' : 's'}`
                        : ' · Perfect score'}
                    </p>
                    {attempt.mistakes.length > 0 && (
                      <QuizMistakeLog
                        log={{ entries: attempt.mistakes, hotSubtopics: [] }}
                        passed={attempt.passed}
                      />
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}
