import { Link } from 'react-router-dom'
import { getChapterMasteryPercent } from '@/lib/contentLoader'
import type { Difficulty } from '@/lib/contentTypes'
import type { UserProgress } from '@/features/mastery/MasteryEngine'
import {
  formatAttemptDate,
  formatDifficulty,
  getQuizAttemptsForScope,
} from '@/features/quiz/quizHistoryStats'

const DIFF_ORDER: Difficulty[] = ['easy', 'medium', 'hard', 'pyp']

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  pyp: 'PYP',
}

interface QuizAcademicProgressProps {
  progress: UserProgress
  subjectId: string
  chapterId: string
  topicId?: string
  isTopicQuiz: boolean
  notesReadMap: Record<string, boolean>
}

export function QuizAcademicProgress({
  progress,
  subjectId,
  chapterId,
  topicId,
  isTopicQuiz,
  notesReadMap,
}: QuizAcademicProgressProps) {
  const topicProgress = topicId ? progress.topics[topicId] : undefined
  const chapterProgress = progress.chapters[chapterId]
  const quizLevel = isTopicQuiz
    ? (topicProgress?.quizLevel ?? 0)
    : (chapterProgress?.quizLevel ?? 0)

  const masteryPercent = isTopicQuiz && topicId
    ? Math.round(((topicProgress?.quizLevel ?? 0) / 4) * 100)
    : getChapterMasteryPercent(chapterId, notesReadMap, quizLevel)

  const scopeAttempts = getQuizAttemptsForScope(progress, {
    topicId: isTopicQuiz ? topicId : undefined,
    chapterId,
  })

  const tierStatus = DIFF_ORDER.map((d) => {
    const passed = isTopicQuiz && topicId
      ? (() => {
          const tp = progress.topics[topicId]
          if (!tp) return false
          if (d === 'easy') return (tp.quizLevel ?? 0) >= 2
          if (d === 'medium') return (tp.quizLevel ?? 0) >= 3
          if (d === 'hard') return tp.hardScore !== undefined
          return Boolean(tp.pypComplete)
        })()
      : (() => {
          const ch = progress.chapters[chapterId]
          if (!ch) return false
          if (d === 'easy') return ch.quizLevel >= 2
          if (d === 'medium') return ch.quizLevel >= 3
          if (d === 'hard') return ch.hardScore !== undefined
          return Boolean(ch.pypComplete)
        })()
    const attempts = scopeAttempts.filter((a) => a.difficulty === d)
    const best = attempts.length ? Math.max(...attempts.map((a) => a.scorePercent)) : undefined
    return { difficulty: d, passed, attempts: attempts.length, best }
  })

  return (
    <section className="enlight-quiz-academic">
      <h3 className="enlight-quiz-academic__title">Academic progress</h3>
      <div className="enlight-quiz-academic__summary">
        <div>
          <span className="enlight-quiz-academic__value">{masteryPercent}%</span>
          <span className="enlight-quiz-academic__label">Mastery</span>
        </div>
        <div>
          <span className="enlight-quiz-academic__value">Lv {quizLevel}/4</span>
          <span className="enlight-quiz-academic__label">Quiz level</span>
        </div>
        <div>
          <span className="enlight-quiz-academic__value">{scopeAttempts.length}</span>
          <span className="enlight-quiz-academic__label">Attempts</span>
        </div>
      </div>

      <div className="enlight-quiz-academic__tiers">
        {tierStatus.map((t) => (
          <div
            key={t.difficulty}
            className={[
              'enlight-quiz-academic__tier',
              t.passed ? 'enlight-quiz-academic__tier--passed' : '',
            ].join(' ')}
          >
            <span>{DIFF_LABEL[t.difficulty]}</span>
            <span>
              {t.passed ? `✓ ${t.best ?? '—'}%` : t.attempts > 0 ? `${t.best ?? '—'}% · retry` : '—'}
            </span>
          </div>
        ))}
      </div>

      {scopeAttempts.length > 0 && (
        <>
          <h4 className="enlight-quiz-academic__history-title">Recent attempts</h4>
          <ul className="enlight-quiz-academic__history">
            {scopeAttempts.slice(0, 5).map((a) => (
              <li key={a.id}>
                <span>
                  {formatDifficulty(a.difficulty)} · {formatAttemptDate(a.at)}
                </span>
                <span className={a.passed ? 'enlight-quiz-academic__pass' : ''}>{a.scorePercent}%</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link to={`/dashboard/quiz-history/${subjectId}`} className="enlight-quiz-academic__link">
        Full quiz history →
      </Link>
    </section>
  )
}
