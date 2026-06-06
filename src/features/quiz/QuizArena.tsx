import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getQuizByTopicAndDifficulty, getTopic } from '@/lib/contentLoader'
import type { Difficulty, McqQuestion } from '@/lib/contentTypes'

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  pyp: 'PYP Mastery',
}

const NEXT_DIFF: Partial<Record<Difficulty, Difficulty>> = {
  easy: 'medium',
  medium: 'hard',
  hard: 'pyp',
}

export function QuizArena() {
  const { topicId = '', difficulty = 'easy' } = useParams<{
    topicId: string
    difficulty: Difficulty
  }>()
  const navigate = useNavigate()
  const { canTakeQuiz, recordQuizResult } = useMastery()

  const topic = getTopic(topicId)
  const quiz = getQuizByTopicAndDifficulty(topicId, difficulty as Difficulty)
  const diff = difficulty as Difficulty

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished] = useState(false)

  if (!topic || !quiz) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <p>Quiz not found.</p>
          <Link to="/">Go home</Link>
        </div>
      </div>
    )
  }

  if (!canTakeQuiz(topicId, diff)) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <h2 className="enlight-heading-serif">Locked</h2>
          <p className="enlight-body-text">
            Complete the previous mastery level before attempting {DIFF_LABEL[diff]}.
          </p>
          <EnlightButton
            to={`/subjects/${topic.subjectId}/chapters/${topic.chapterId}/topics/${topicId}`}
            variant="outline"
          >
            Back to lesson
          </EnlightButton>
        </div>
      </div>
    )
  }

  const question: McqQuestion | undefined = quiz.questions[index]
  const progress = ((index + (finished ? 1 : 0)) / quiz.questions.length) * 100

  const handleSelect = (optionIndex: number) => {
    if (showFeedback || finished) return
    setSelected(optionIndex)
    setShowFeedback(true)
    if (optionIndex === question?.correctIndex) {
      setCorrectCount((c) => c + 1)
    }
  }

  const handleNext = () => {
    if (index + 1 >= quiz.questions.length) {
      setFinished(true)
      const scorePercent = Math.round((correctCount / quiz.questions.length) * 100)
      const passed = scorePercent >= quiz.passPercent
      recordQuizResult(topicId, diff, scorePercent, passed)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setShowFeedback(false)
  }

  if (finished) {
    const actualScore = Math.round((correctCount / quiz.questions.length) * 100)
    const passed = actualScore >= quiz.passPercent
    const next = NEXT_DIFF[diff]

    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <div className="enlight-quiz__result">
            <EnlightSectionLabel>{quiz.title}</EnlightSectionLabel>
            <h2 className="enlight-heading-serif">{passed ? 'Well done!' : 'Keep practising'}</h2>
            <div className="enlight-quiz__score">{actualScore}%</div>
            <p className="enlight-body-text">
              {passed
                ? `You passed (${quiz.passPercent}% required). XP awarded!`
                : `You need ${quiz.passPercent}% to advance. Try again.`}
            </p>
            <div className="enlight-quiz__actions">
              {!passed && (
                <EnlightButton
                  onClick={() => {
                    setIndex(0)
                    setCorrectCount(0)
                    setSelected(null)
                    setShowFeedback(false)
                    setFinished(false)
                  }}
                >
                  Retry
                </EnlightButton>
              )}
              {passed && next && (
                <EnlightButton to={`/quiz/${topicId}/${next}`}>Continue to {DIFF_LABEL[next]}</EnlightButton>
              )}
              <EnlightButton
                to={`/subjects/${topic.subjectId}/chapters/${topic.chapterId}/topics/${topicId}`}
                variant="outline"
              >
                Back to lesson
              </EnlightButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-quiz">
        <EnlightSectionLabel>
          {topic.title} — {DIFF_LABEL[diff]}
        </EnlightSectionLabel>
        <div className="enlight-quiz__progress">
          <div className="enlight-quiz__progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--enlight-text-light)' }}>
          Question {index + 1} of {quiz.questions.length}
        </p>
        <h2 className="enlight-quiz__question">{question?.question}</h2>
        <div className="enlight-quiz__options">
          {question?.options.map((opt, i) => {
            let cls = 'enlight-quiz__option'
            if (showFeedback && i === question.correctIndex) cls += ' enlight-quiz__option--correct'
            else if (showFeedback && i === selected) cls += ' enlight-quiz__option--wrong'
            else if (i === selected) cls += ' enlight-quiz__option--selected'
            return (
              <button key={i} type="button" className={cls} onClick={() => handleSelect(i)}>
                {opt}
              </button>
            )
          })}
        </div>
        {showFeedback && question?.explanation && (
          <p className="enlight-body-text" style={{ marginTop: 16 }}>
            {question.explanation}
          </p>
        )}
        {showFeedback && (
          <div style={{ marginTop: 24 }}>
            <EnlightButton onClick={handleNext}>
              {index + 1 >= quiz.questions.length ? 'See results' : 'Next question'}
            </EnlightButton>
          </div>
        )}
        <div style={{ marginTop: 32 }}>
          <button
            type="button"
            className="enlight-header__link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate(-1)}
          >
            ← Exit quiz
          </button>
        </div>
      </div>
    </div>
  )
}
