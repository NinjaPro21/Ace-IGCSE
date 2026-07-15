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
      <div className="ace-mistake-log ace-mistake-log--clean">
        <p className="ace-mistake-log__empty">No wrong answers logged — check the score breakdown above.</p>
      </div>
    )
  }

  return (
    <div className="ace-mistake-log">
      <div className="ace-mistake-log__header">
        <span className="ace-mistake-log__icon" aria-hidden>
          📋
        </span>
        <div>
          <h3 className="ace-mistake-log__title">Mistake log</h3>
          <p className="ace-mistake-log__sub">
            {log.entries.length} miss{log.entries.length === 1 ? '' : 'es'} this run
            {log.hotSubtopics.length > 0
              ? ` · ${log.hotSubtopics.length} subtopic${log.hotSubtopics.length === 1 ? '' : 's'} under fire`
              : ''}
          </p>
        </div>
      </div>

      {log.hotSubtopics.length > 0 && (
        <ul className="ace-mistake-log__flags">
          {log.hotSubtopics.map((hot) => (
            <li key={hot.scopeId} className="ace-mistake-log__flag">
              <span className="ace-mistake-log__flag-badge">Hot zone</span>
              Multiple misses in one subtopic ({hot.missCount}× this quiz)
            </li>
          ))}
        </ul>
      )}

      <ol className="ace-mistake-log__entries">
        {log.entries.map((entry, i) => (
          <li
            key={`${entry.questionId}-${i}`}
            className={[
              'ace-mistake-log__entry',
              entry.isRepeatConcept ? 'ace-mistake-log__entry--repeat' : '',
            ].join(' ')}
          >
            <div className="ace-mistake-log__entry-head">
              <span className="ace-mistake-log__round">#{i + 1}</span>
              {entry.isRepeatConcept && (
                <span className="ace-mistake-log__repeat-badge" title="Missed this concept before">
                  ⚠ Recurring ({entry.totalMisses}× total)
                </span>
              )}
            </div>
            <p className="ace-mistake-log__question">
              <MathText content={entry.questionText} />
            </p>
            <div className="ace-mistake-log__verdict">
              <span className="ace-mistake-log__wrong">
                You: {OPTION_LETTERS[entry.selectedIndex] ?? entry.selectedIndex + 1}{' '}
                <MathText content={entry.selectedLabel} />
              </span>
              <span className="ace-mistake-log__right">
                Correct: {OPTION_LETTERS[entry.correctIndex] ?? entry.correctIndex + 1}{' '}
                <MathText content={entry.correctLabel} />
              </span>
            </div>
            {entry.explanation && (
              <div className="ace-mistake-log__tip">
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
