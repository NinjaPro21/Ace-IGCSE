import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { MathText } from '@/components/MathText'
import { useMastery } from '@/features/mastery/MasteryContext'
import { useChapterSession } from '@/features/mastery/useChapterSession'
import {
  getChapter,
  getChapterQuizAnchor,
  getQuizByChapterAndDifficulty,
  getTopicsForChapter,
  getWeakTopicsInChapter,
} from '@/lib/contentLoader'
import type { Difficulty, McqQuestion } from '@/lib/contentTypes'
import { XP_REWARDS } from '@/features/mastery/levelSystem'
import { OPTION_LETTERS, prepareQuizSession } from './quizUtils'

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
  const { chapterId = '', difficulty = 'easy' } = useParams<{
    chapterId: string
    difficulty: Difficulty
  }>()
  const navigate = useNavigate()
  const { canTakeChapterQuiz, recordChapterQuizResult, getTopicNotesReadMap } = useMastery()

  const chapter = getChapter(chapterId)
  const anchor = getChapterQuizAnchor(chapterId)
  const quiz = getQuizByChapterAndDifficulty(chapterId, difficulty as Difficulty)
  const diff = difficulty as Difficulty

  useChapterSession(chapterId)

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [shuffleKey, setShuffleKey] = useState(0)

  const questions = useMemo(
    () => (quiz ? prepareQuizSession(quiz.questions, quiz.questionsPerAttempt) : []),
    [quiz, shuffleKey],
  )

  // Reset all internal state when chapterId or difficulty changes (prevents stale state on Easy→Medium navigation)
  const resetKey = useRef(`${chapterId}-${difficulty}`)
  useEffect(() => {
    const newKey = `${chapterId}-${difficulty}`
    if (newKey !== resetKey.current) {
      resetKey.current = newKey
      setIndex(0)
      setSelected(null)
      setCorrectCount(0)
      setShowFeedback(false)
      setFinished(false)
      setFinalScore(0)
      setXpEarned(0)
      setShuffleKey(0)
    }
  }, [chapterId, difficulty])

  if (!chapter || !quiz || !anchor) {
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

  if (!canTakeChapterQuiz(chapterId, diff)) {
    const firstTopic = getTopicsForChapter(chapterId)[0]
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <h2 className="enlight-heading-serif">Locked</h2>
          <p className="enlight-body-text">
            {diff === 'easy'
              ? 'This quiz could not be loaded.'
              : `Pass ${diff === 'medium' ? 'Easy' : diff === 'hard' ? 'Medium' : 'Hard'} first before attempting ${DIFF_LABEL[diff]}.`}
          </p>
          {firstTopic && (
            <EnlightButton
              to={`/subjects/${chapter.subjectId}/chapters/${chapterId}/topics/${firstTopic.id}`}
              variant="outline"
            >
              Back to chapter
            </EnlightButton>
          )}
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <p>No questions are available for this quiz.</p>
          <Link to={`/subjects/${chapter.subjectId}`}>
            Return to chapter
          </Link>
        </div>
      </div>
    )
  }

  const question: McqQuestion | undefined = questions[index]
  const progress = ((index + (finished ? 1 : 0)) / questions.length) * 100
  const weakTopics = getWeakTopicsInChapter(chapterId, getTopicNotesReadMap())

  const handleSelect = (optionIndex: number) => {
    if (showFeedback || finished) return
    setSelected(optionIndex)
    setShowFeedback(true)
  }

  const handleNext = () => {
    const isCorrect = selected === question?.correctIndex
    const totalCorrect = isCorrect ? correctCount + 1 : correctCount

    if (index + 1 >= questions.length) {
      const scorePercent = Math.min(
        100,
        Math.round((totalCorrect / questions.length) * 100),
      )
      const passed = scorePercent >= quiz.passPercent
      setFinalScore(scorePercent)
      setCorrectCount(totalCorrect)
      setXpEarned(recordChapterQuizResult(chapterId, diff, scorePercent, passed))
      setFinished(true)
      return
    }
    setCorrectCount(totalCorrect)
    setIndex((i) => i + 1)
    setSelected(null)
    setShowFeedback(false)
  }

  if (finished) {
    const passed = finalScore >= quiz.passPercent
    const next = NEXT_DIFF[diff]

    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <div className="enlight-quiz__result">
            <EnlightSectionLabel>{quiz.title}</EnlightSectionLabel>
            <h2 className="enlight-heading-serif">{passed ? 'Well done!' : 'Keep practising'}</h2>
            <div className="enlight-quiz__score">{finalScore}%</div>
            <p className="enlight-body-text">
              {correctCount} of {questions.length} correct
            </p>
            <p className="enlight-body-text">
              {passed
                ? `You passed (${quiz.passPercent}% required). +${xpEarned || XP_REWARDS[diff]} XP awarded!`
                : `You need ${quiz.passPercent}% to advance. Try again.`}
            </p>
            {!passed && weakTopics.length > 0 && (
              <div className="enlight-quiz__weak-topics">
                <p className="enlight-body-text" style={{ marginBottom: 8 }}>
                  <strong>Revisit these topics:</strong>
                </p>
                <ul className="enlight-quiz__weak-list">
                  {weakTopics.map((t) => (
                    <li key={t.id}>
                      <Link
                        to={`/subjects/${chapter.subjectId}/chapters/${chapterId}/topics/${t.id}`}
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="enlight-quiz__actions">
              {!passed && (
                <EnlightButton
                  onClick={() => {
                    setIndex(0)
                    setCorrectCount(0)
                    setFinalScore(0)
                    setXpEarned(0)
                    setSelected(null)
                    setShowFeedback(false)
                    setFinished(false)
                    setShuffleKey((k) => k + 1)
                  }}
                >
                  Retry
                </EnlightButton>
              )}
              {passed && next && (
                <EnlightButton to={`/quiz/${chapterId}/${next}`}>
                  Continue to {DIFF_LABEL[next]}
                </EnlightButton>
              )}
              <EnlightButton
                to={`/subjects/${chapter.subjectId}/chapters/${chapterId}/topics/${anchor.id}`}
                variant="outline"
              >
                Back to chapter
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
          Chapter {chapter.number}: {chapter.title} — {DIFF_LABEL[diff]}
        </EnlightSectionLabel>
        <div className="enlight-quiz__progress">
          <div className="enlight-quiz__progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="enlight-quiz__meta">
          Question {index + 1} of {questions.length}
        </p>
        <h2 className="enlight-quiz__question">
          {question && <MathText content={question.question} block />}
        </h2>
        <div className="enlight-quiz__options">
          {question?.options.map((opt, i) => {
            let cls = 'enlight-quiz__option'
            if (showFeedback && i === question.correctIndex) cls += ' enlight-quiz__option--correct'
            else if (showFeedback && i === selected) cls += ' enlight-quiz__option--wrong'
            else if (i === selected) cls += ' enlight-quiz__option--selected'
            return (
              <button key={i} type="button" className={cls} onClick={() => handleSelect(i)}>
                <span className="enlight-quiz__option-letter">{OPTION_LETTERS[i] ?? i + 1}</span>
                <MathText content={opt} />
              </button>
            )
          })}
        </div>
        {showFeedback && question?.explanation && (
          <div className="enlight-quiz__explanation">
            <MathText content={question.explanation} block />
          </div>
        )}
        {showFeedback && (
          <div className="enlight-quiz__next">
            <EnlightButton onClick={handleNext}>
              {index + 1 >= questions.length ? 'See results' : 'Next question'}
            </EnlightButton>
          </div>
        )}
        <div className="enlight-quiz__exit">
          <button
            type="button"
            className="enlight-header__link"
            onClick={() => navigate(-1)}
          >
            ← Exit quiz
          </button>
        </div>
      </div>
    </div>
  )
}
