import { MathText } from '@/components/MathText'
import { OPTION_LETTERS } from './quizUtils'
import type { QuizMistakeLogResult } from './quizAttemptTypes'

interface QuizMistakeLogProps {
  log: QuizMistakeLogResult
  passed: boolean
}

export function QuizMistakeLog({ log, passed }: QuizMistakeLogProps) {
  if (log.entries.length === 0) {
    if (passed) return null
    return (
      <div className="enlight-mistake-log enlight-mistake-log--clean">
        <p className="enlight-mistake-log__empty">No wrong answers logged — check the score breakdown above.</p>
      </div>
    )
  }

  return (
    <div className="enlight-mistake-log">
      <div className="enlight-mistake-log__header">
        <span className="enlight-mistake-log__icon" aria-hidden>
          📋
        </span>
        <div>
          <h3 className="enlight-mistake-log__title">Mistake log</h3>
          <p className="enlight-mistake-log__sub">
            {log.entries.length} miss{log.entries.length === 1 ? '' : 'es'} this run
            {log.hotSubtopics.length > 0
              ? ` · ${log.hotSubtopics.length} subtopic${log.hotSubtopics.length === 1 ? '' : 's'} under fire`
              : ''}
          </p>
        </div>
      </div>

      {log.hotSubtopics.length > 0 && (
        <ul className="enlight-mistake-log__flags">
          {log.hotSubtopics.map((hot) => (
            <li key={hot.scopeId} className="enlight-mistake-log__flag">
              <span className="enlight-mistake-log__flag-badge">Hot zone</span>
              Multiple misses in one subtopic ({hot.missCount}× this quiz)
            </li>
          ))}
        </ul>
      )}

      <ol className="enlight-mistake-log__entries">
        {log.entries.map((entry, i) => (
          <li
            key={`${entry.questionId}-${i}`}
            className={[
              'enlight-mistake-log__entry',
              entry.isRepeatConcept ? 'enlight-mistake-log__entry--repeat' : '',
            ].join(' ')}
          >
            <div className="enlight-mistake-log__entry-head">
              <span className="enlight-mistake-log__round">#{i + 1}</span>
              {entry.isRepeatConcept && (
                <span className="enlight-mistake-log__repeat-badge" title="Missed this concept before">
                  ⚠ Recurring ({entry.totalMisses}× total)
                </span>
              )}
            </div>
            <p className="enlight-mistake-log__question">
              <MathText content={entry.questionText} />
            </p>
            <div className="enlight-mistake-log__verdict">
              <span className="enlight-mistake-log__wrong">
                You: {OPTION_LETTERS[entry.selectedIndex] ?? entry.selectedIndex + 1}{' '}
                <MathText content={entry.selectedLabel} />
              </span>
              <span className="enlight-mistake-log__right">
                Correct: {OPTION_LETTERS[entry.correctIndex] ?? entry.correctIndex + 1}{' '}
                <MathText content={entry.correctLabel} />
              </span>
            </div>
            {entry.explanation && (
              <div className="enlight-mistake-log__tip">
                <MathText content={entry.explanation} block />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** @deprecated use QuizMistakeLog */
export const QuizBattleLog = QuizMistakeLog
