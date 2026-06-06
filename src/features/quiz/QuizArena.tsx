import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { MathText } from '@/components/MathText'
import { useMastery } from '@/features/mastery/MasteryContext'
import {
  getChapter,
  getChapterQuizAnchor,
  getQuizByChapterAndDifficulty,
  getTopicsForChapter,
  getWeakTopicsInChapter,
} from '@/lib/contentLoader'
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

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

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
              ? 'Read all topic notes in this chapter before attempting the quiz.'
              : `Complete the previous mastery level before attempting ${DIFF_LABEL[diff]}.`}
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

  if (quiz.questions.length === 0) {
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

  const question: McqQuestion | undefined = quiz.questions[index]
  const progress = ((index + (finished ? 1 : 0)) / quiz.questions.length) * 100
  const weakTopics = getWeakTopicsInChapter(chapterId, getTopicNotesReadMap())

  const handleSelect = (optionIndex: number) => {
    if (showFeedback || finished) return
    setSelected(optionIndex)
    setShowFeedback(true)
    if (optionIndex === question?.correctIndex) {
      setCorrectCount((c) => c + 1)
    }
  }

  const resolveCorrectCount = () => {
    // handleSelect schedules setCorrectCount before handleNext runs — account for stale state
    const lastAnswerCorrect = selected === question?.correctIndex
    return lastAnswerCorrect ? correctCount + 1 : correctCount
  }

  const handleNext = () => {
    if (index + 1 >= quiz.questions.length) {
      const totalCorrect = resolveCorrectCount()
      const scorePercent = Math.round((totalCorrect / quiz.questions.length) * 100)
      const passed = scorePercent >= quiz.passPercent
      setFinalScore(scorePercent)
      setCorrectCount(totalCorrect)
      setFinished(true)
      recordChapterQuizResult(chapterId, diff, scorePercent, passed)
      return
    }
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
              {passed
                ? `You passed (${quiz.passPercent}% required). XP awarded!`
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
                    setSelected(null)
                    setShowFeedback(false)
                    setFinished(false)
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
          Question {index + 1} of {quiz.questions.length}
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
              {index + 1 >= quiz.questions.length ? 'See results' : 'Next question'}
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
