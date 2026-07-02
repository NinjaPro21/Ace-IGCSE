import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { MathText } from '@/components/MathText'
import { useMastery } from '@/features/mastery/MasteryContext'
import { useChapterSession } from '@/features/mastery/useChapterSession'
import {
  getChapter,
  getQuizByChapterAndDifficulty,
  getQuizByTopicAndDifficulty,
  getTopic,
  getTopicsForChapter,
  getTopicSectionLabel,
  getWeakTopicsInChapter,
} from '@/lib/contentLoader'
import type { Difficulty, McqQuestion } from '@/lib/contentTypes'
import { XP_REWARDS } from '@/features/mastery/levelSystem'
import { useAuth } from '@/features/social/AuthContext'
import { usePresence } from '@/features/social/usePresence'
import { submitDuelScore } from '@/features/social/duelsApi'
import { OPTION_LETTERS, prepareQuizSession } from './quizUtils'
import { getConceptKey, getConceptLabel } from './quizConceptKey'
import { QuizMistakeLog } from './QuizMistakeLog'
import type { QuizMistakeLogResult } from './quizAttemptTypes'

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
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const duelId = searchParams.get('duel')
  const isTopicQuiz = location.pathname.includes('/quiz/topic/')
  const { topicId = '', chapterId = '', difficulty = 'easy' } = useParams<{
    topicId?: string
    chapterId?: string
    difficulty: Difficulty
  }>()
  const navigate = useNavigate()
  const {
    canTakeChapterQuiz,
    canTakeTopicQuiz,
    recordChapterQuizResult,
    recordTopicQuizResult,
    recordQuizFinish,
    getTopicNotesReadMap,
  } = useMastery()

  const topic = isTopicQuiz ? getTopic(topicId) : undefined
  const chapter = isTopicQuiz
    ? getChapter(topic?.chapterId ?? '')
    : getChapter(chapterId)
  const diff = difficulty as Difficulty
  const activeChapterId = chapter?.id ?? ''
  const [quiz, setQuiz] = useState<Awaited<ReturnType<typeof getQuizByTopicAndDifficulty>>>(undefined)
  const [quizLoading, setQuizLoading] = useState(true)
  const [quizError, setQuizError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setQuizLoading(true)
    setQuizError(false)
    const load = isTopicQuiz
      ? getQuizByTopicAndDifficulty(topicId, diff)
      : getQuizByChapterAndDifficulty(chapterId, diff)
    load
      .then((data) => {
        if (!cancelled) {
          setQuiz(data)
          setQuizLoading(false)
          if (!data) setQuizError(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQuiz(undefined)
          setQuizLoading(false)
          setQuizError(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [isTopicQuiz, topicId, chapterId, diff])

  useChapterSession(activeChapterId)

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [mistakeLog, setMistakeLog] = useState<QuizMistakeLogResult | null>(null)
  const [shuffleKey, setShuffleKey] = useState(0)
  const quizStartRef = useRef(Date.now())
  const sessionMistakesRef = useRef<
    Array<{
      questionId: string
      questionText: string
      conceptKey: string
      conceptLabel: string
      selectedIndex: number
      correctIndex: number
      selectedLabel: string
      correctLabel: string
      explanation?: string
      scopeId: string
    }>
  >([])
  const { user } = useAuth()

  usePresence(user?.id, {
    status: 'in_quiz',
    enabled: Boolean(user),
  })

  const activeQuestions = useMemo(
    () => (quiz?.questions ?? []).filter((q) => !q.pending),
    [quiz],
  )

  const questions = useMemo(
    () =>
      activeQuestions.length
        ? prepareQuizSession(activeQuestions, quiz?.questionsPerAttempt)
        : [],
    [activeQuestions, quiz, shuffleKey],
  )

  const resetKey = useRef(`${isTopicQuiz ? topicId : chapterId}-${difficulty}`)
  useEffect(() => {
    const newKey = `${isTopicQuiz ? topicId : chapterId}-${difficulty}`
    if (newKey !== resetKey.current) {
      resetKey.current = newKey
      setIndex(0)
      setSelected(null)
      setCorrectCount(0)
      setShowFeedback(false)
      setFinished(false)
      setFinalScore(0)
      setXpEarned(0)
      setMistakeLog(null)
      setShuffleKey(0)
      sessionMistakesRef.current = []
    }
  }, [chapterId, difficulty, isTopicQuiz, topicId])

  const canTake = isTopicQuiz
    ? canTakeTopicQuiz(topicId, diff)
    : canTakeChapterQuiz(chapterId, diff)

  if (!chapter || (isTopicQuiz && !topic)) {
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

  if (quizLoading) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <p className="enlight-body-text">Loading quiz…</p>
        </div>
      </div>
    )
  }

  if (!quiz || quizError) {
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

  if (!canTake) {
    const backTopic = isTopicQuiz ? topic : getTopicsForChapter(chapterId)[0]
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <h2 className="enlight-heading-serif">Locked</h2>
          <p className="enlight-body-text">
            {diff === 'easy'
              ? isTopicQuiz
                ? 'This quiz could not be loaded.'
                : 'This quiz could not be loaded.'
              : `Pass ${diff === 'medium' ? 'Easy' : diff === 'hard' ? 'Medium' : 'Hard'} first before attempting ${DIFF_LABEL[diff]}.`}
          </p>
          {backTopic && (
            <EnlightButton
              to={`/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${backTopic.id}`}
              variant="outline"
            >
              Back to section
            </EnlightButton>
          )}
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    const lessonUrl =
      isTopicQuiz && topic
        ? `/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${topicId}`
        : `/subjects/${chapter.subjectId}/chapters/${chapter.id}`
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <h2 className="enlight-heading-serif">Quiz coming soon</h2>
          <p className="enlight-body-text">
            {quiz?.pending
              ? 'Questions for this section are being finalised. Check back after the next content import.'
              : 'No questions are available for this quiz yet.'}
          </p>
          <EnlightButton to={lessonUrl} variant="outline">
            Back to section
          </EnlightButton>
        </div>
      </div>
    )
  }

  const question: McqQuestion | undefined = questions[index]
  const progress = ((index + (finished ? 1 : 0)) / questions.length) * 100
  const weakTopics = getWeakTopicsInChapter(chapter.id, getTopicNotesReadMap())

  const lessonUrl = isTopicQuiz
    ? `/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${topicId}`
    : `/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${getTopicsForChapter(chapter.id)[0]?.id ?? topicId}`

  const handleSelect = (optionIndex: number) => {
    if (showFeedback || finished) return
    setSelected(optionIndex)
    setShowFeedback(true)
  }

  const recordResult = (scorePercent: number, passed: boolean) => {
    if (isTopicQuiz) {
      return recordTopicQuizResult(topicId, chapter.id, diff, scorePercent, passed)
    }
    return recordChapterQuizResult(chapter.id, diff, scorePercent, passed)
  }

  const nextQuizPath = (next: Difficulty) =>
    isTopicQuiz ? `/quiz/topic/${topicId}/${next}` : `/quiz/${chapter.id}/${next}`

  const handleNext = () => {
    const isCorrect = selected === question?.correctIndex
    const totalCorrect = isCorrect ? correctCount + 1 : correctCount
    const scopeId = isTopicQuiz ? topicId : chapterId

    if (!isCorrect && question && selected !== null) {
      sessionMistakesRef.current.push({
        questionId: question.id,
        questionText: question.question,
        conceptKey: getConceptKey(scopeId, question),
        conceptLabel: getConceptLabel(question),
        selectedIndex: selected,
        correctIndex: question.correctIndex,
        selectedLabel: question.options[selected] ?? '',
        correctLabel: question.options[question.correctIndex] ?? '',
        explanation: question.explanation,
        scopeId,
      })
    }

    if (index + 1 >= questions.length) {
      const scorePercent = Math.min(100, Math.round((totalCorrect / questions.length) * 100))
      const passed = scorePercent >= quiz.passPercent
      setFinalScore(scorePercent)
      setCorrectCount(totalCorrect)
      const xp = recordResult(scorePercent, passed)
      setXpEarned(xp)

      const log = recordQuizFinish({
        quizId: quiz.id,
        quizTitle: quiz.title,
        topicId: isTopicQuiz ? topicId : undefined,
        chapterId: chapter.id,
        subjectId: chapter.subjectId,
        difficulty: diff,
        scorePercent,
        passed,
        questionCount: questions.length,
        correctCount: totalCorrect,
        mistakes: sessionMistakesRef.current,
      })
      setMistakeLog(log)

      if (duelId && user && passed) {
        const timeSec = Math.round((Date.now() - quizStartRef.current) / 1000)
        void submitDuelScore(duelId, user.id, scorePercent, timeSec)
      }
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
                : `You need ${quiz.passPercent}% to advance. Try again — questions shuffle on retry.`}
            </p>
            {!passed && weakTopics.length > 0 && (
              <div className="enlight-quiz__weak-topics">
                <p className="enlight-body-text" style={{ marginBottom: 8 }}>
                  <strong>Revisit these sections:</strong>
                </p>
                <ul className="enlight-quiz__weak-list">
                  {weakTopics.slice(0, 3).map((t) => (
                    <li key={t.id}>
                      <Link
                        to={`/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${t.id}`}
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {mistakeLog && <QuizMistakeLog log={mistakeLog} passed={passed} />}
            <div className="enlight-quiz__actions">
              {!passed && (
                <>
                  <EnlightButton to={lessonUrl} variant="outline">
                    Review weak area
                  </EnlightButton>
                  <EnlightButton
                    onClick={() => {
                      setIndex(0)
                      setCorrectCount(0)
                      setFinalScore(0)
                      setXpEarned(0)
                      setMistakeLog(null)
                      sessionMistakesRef.current = []
                      setSelected(null)
                      setShowFeedback(false)
                      setFinished(false)
                      setShuffleKey((k) => k + 1)
                      quizStartRef.current = Date.now()
                    }}
                  >
                    Retry
                  </EnlightButton>
                </>
              )}
              {passed && next && (
                <EnlightButton to={nextQuizPath(next)}>
                  Continue to {DIFF_LABEL[next]}
                </EnlightButton>
              )}
              <EnlightButton to={lessonUrl} variant="outline">
                Back to section
              </EnlightButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const headerLabel = isTopicQuiz
    ? `${getTopicSectionLabel(topic!.chapterId, topic!.id)} · ${topic!.title} — ${DIFF_LABEL[diff]}`
    : `Chapter ${chapter.number}: ${chapter.title} — ${DIFF_LABEL[diff]} (full chapter)`

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-quiz">
        <EnlightSectionLabel>
          <MathText content={headerLabel} title />
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
