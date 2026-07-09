import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { QuizScopeBadge } from '@/components/QuizScopeBadge'
import { EnlightHeader } from '@/components/EnlightHeader'
import { MathText } from '@/components/MathText'
import { useMastery } from '@/features/mastery/MasteryContext'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
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
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/features/social/AuthContext'
import { usePresence } from '@/features/social/usePresence'
import { submitDuelScore, fetchDuel, duelMatchesQuiz, duelUserScoreSubmitted, type Duel } from '@/features/social/duelsApi'
import { OPTION_LETTERS, computeQuizScorePercent, prepareQuizSession } from './quizUtils'
import { getConceptKey, getConceptLabel } from './quizConceptKey'
import { QuizMistakeLog } from './QuizMistakeLog'
import { QuizAcademicProgress } from './QuizAcademicProgress'
import { confirmQuizExit, useQuizExitGuard } from './useQuizExitGuard'
import type { QuizMistakeLogResult } from './quizAttemptTypes'
import { trackEnlightEvent } from '@/lib/enlightEvents'

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  pyp: 'PYP Mastery',
}

const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'pyp']

const NEXT_DIFF: Partial<Record<Difficulty, Difficulty>> = {
  easy: 'medium',
  medium: 'hard',
  hard: 'pyp',
}

export function QuizArena() {
  usePageTitle('Quiz')
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
    progress: userProgress,
  } = useMastery()

  const topic = isTopicQuiz ? getTopic(topicId) : undefined
  const chapter = isTopicQuiz
    ? getChapter(topic?.chapterId ?? '')
    : getChapter(chapterId)
  const diff = VALID_DIFFICULTIES.includes(difficulty as Difficulty)
    ? (difficulty as Difficulty)
    : 'easy'
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
  const [finishQuestionCount, setFinishQuestionCount] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [mistakeLog, setMistakeLog] = useState<QuizMistakeLogResult | null>(null)
  const [shuffleKey, setShuffleKey] = useState(0)
  const [duel, setDuel] = useState<Duel | null>(null)
  const [duelSubmitState, setDuelSubmitState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [duelLoading, setDuelLoading] = useState(Boolean(duelId))
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  const quizStartRef = useRef(Date.now())
  const quizStartedTrackedRef = useRef(false)
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

  const quizInProgress = Boolean(quiz && !finished && !quizLoading && questions.length > 0)
  useQuizExitGuard(quizInProgress)

  const requestQuizExit = () => {
    if (confirmQuizExit()) navigate(-1)
  }

  const resetKey = useRef(`${isTopicQuiz ? topicId : chapterId}-${difficulty}`)
  const resetQuizAttempt = (reshuffle = false) => {
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setShowFeedback(false)
    setFinished(false)
    setFinalScore(0)
    setFinishQuestionCount(0)
    setXpEarned(0)
    setMistakeLog(null)
    setDuelSubmitState('idle')
    sessionMistakesRef.current = []
    quizStartRef.current = Date.now()
    quizStartedTrackedRef.current = false
    if (reshuffle) setShuffleKey((k) => k + 1)
  }

  useEffect(() => {
    const newKey = `${isTopicQuiz ? topicId : chapterId}-${difficulty}`
    if (newKey !== resetKey.current) {
      resetKey.current = newKey
      resetQuizAttempt(false)
      setShuffleKey(0)
    }
  }, [chapterId, difficulty, isTopicQuiz, topicId])

  useEffect(() => {
    if (!duelId) {
      setDuel(null)
      setDuelLoading(false)
      return
    }
    setDuelLoading(true)
    void fetchDuel(duelId).then((row) => {
      setDuel(row)
      setDuelLoading(false)
    })
  }, [duelId])

  useEffect(() => {
    if (!user?.id || !chapter || quizLoading || !questions.length || quizStartedTrackedRef.current) return
    quizStartedTrackedRef.current = true
    void trackEnlightEvent(user.id, 'quiz_started', {
      chapterId: chapter.id,
      subject: chapter.subjectId,
    })
  }, [user?.id, chapter, quizLoading, questions.length])

  const countQuizAttempts = () => {
    const attempts = masteryEngine.getState().quizAttempts ?? []
    return (
      attempts.filter((a) => {
        if (a.chapterId !== chapterId && a.chapterId !== chapter?.id) return false
        if (isTopicQuiz) return a.topicId === topicId
        return !a.topicId
      }).length + 1
    )
  }

  const alreadyPassed = isTopicQuiz
    ? masteryEngine.hasPassedTopicQuiz(topicId, diff)
    : masteryEngine.hasPassedChapterQuiz(chapterId, diff)

  const isDuelParticipant =
    Boolean(duel && user && (duel.challengerUid === user.id || duel.opponentUid === user.id))

  const isDuelAttempt =
    Boolean(
      duelId &&
        duel &&
        isDuelParticipant &&
        duelMatchesQuiz(duel, {
          topicId,
          chapterId: activeChapterId,
          difficulty: diff,
          isTopicQuiz,
        }) &&
        (duel.status === 'active') &&
        !duelUserScoreSubmitted(duel, user!.id),
    )

  const canTakeNormally = isTopicQuiz
    ? canTakeTopicQuiz(topicId, diff)
    : canTakeChapterQuiz(chapterId, diff)

  const canTake = isDuelAttempt || canTakeNormally
  const skipStudyRewards = isDuelAttempt && alreadyPassed
  const notesReadMap = getTopicNotesReadMap()

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

  if (quizLoading || (duelId && duelLoading)) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <p className="enlight-body-text">Loading quiz…</p>
        </div>
      </div>
    )
  }

  if (duelId && duel && !isDuelAttempt) {
    const pending = duel.status === 'pending'
    const alreadySubmitted = Boolean(user && duelUserScoreSubmitted(duel, user.id))
    const waitingAccept =
      pending && user && duel.challengerUid === user.id
    const needsAccept =
      pending && user && duel.opponentUid === user.id

    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <h2 className="enlight-heading-serif">
            {alreadySubmitted
              ? 'Score submitted'
              : waitingAccept
                ? 'Waiting for accept'
                : needsAccept
                  ? 'Accept the duel first'
                  : 'Duel unavailable'}
          </h2>
          <p className="enlight-body-text">
            {alreadySubmitted
              ? 'Your duel score is in — waiting for your opponent to finish.'
              : waitingAccept
                ? 'Your friend needs to accept this challenge before either of you can take the quiz.'
                : needsAccept
                  ? 'Open your inbox and accept the duel challenge to start.'
                  : 'This duel link is invalid, expired, or does not match this quiz.'}
          </p>
          <EnlightButton to="/social" variant="outline">
            Back to Social
          </EnlightButton>
        </div>
      </div>
    )
  }

  if (duelId && !duel && !duelLoading) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <h2 className="enlight-heading-serif">Duel not found</h2>
          <p className="enlight-body-text">This duel may have expired or been removed.</p>
          <EnlightButton to="/social" variant="outline">
            Back to Social
          </EnlightButton>
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
          <h2 className="enlight-heading-serif">{alreadyPassed ? 'Already passed' : 'Locked'}</h2>
          <p className="enlight-body-text">
            {alreadyPassed
              ? `You already passed ${DIFF_LABEL[diff]}. Challenge a friend to a duel to play again without XP.`
              : diff === 'easy'
                ? isTopicQuiz
                  ? 'This quiz could not be loaded.'
                  : 'Complete the chapter notes first to unlock this quiz.'
                : `Pass ${diff === 'medium' ? 'Easy' : diff === 'hard' ? 'Medium' : 'Hard'} first before attempting ${DIFF_LABEL[diff]}.`}
          </p>
          {backTopic && (
            <EnlightButton
              to={`/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${backTopic.id}`}
              variant="outline"
            >
              Back to {isTopicQuiz ? 'section' : 'chapter'}
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
            Back to {isTopicQuiz ? 'section' : 'chapter'}
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

    if (user?.id && question) {
      void trackEnlightEvent(user.id, 'question_answered', {
        chapterId: chapter.id,
        subject: chapter.subjectId,
        questionId: question.id,
        correct: isCorrect,
      })
    }

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
      const scorePercent = computeQuizScorePercent(totalCorrect, questions.length)
      const passed = scorePercent >= quiz.passPercent
      const timeTakenSec = Math.round((Date.now() - quizStartRef.current) / 1000)
      const attemptNumber = countQuizAttempts()
      setFinalScore(scorePercent)
      setCorrectCount(totalCorrect)
      setFinishQuestionCount(questions.length)

      let xp = 0
      let log: QuizMistakeLogResult | null = null
      if (!skipStudyRewards) {
        xp = recordResult(scorePercent, passed)
        log = recordQuizFinish({
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
      }
      setXpEarned(xp)
      setMistakeLog(log)

      if (user?.id) {
        void trackEnlightEvent(user.id, 'quiz_completed', {
          chapterId: chapter.id,
          subject: chapter.subjectId,
          score: scorePercent,
          attemptNumber,
          timeTakenSec,
        })
      }

      if (isDuelAttempt && duelId && user) {
        const timeSec = Math.round((Date.now() - quizStartRef.current) / 1000)
        setDuelSubmitState('saving')
        void submitDuelScore(duelId, user.id, scorePercent, timeSec)
          .then(() => setDuelSubmitState('done'))
          .catch(() => setDuelSubmitState('error'))
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
    const answeredCount = finishQuestionCount || questions.length
    const wrongCount = Math.max(0, answeredCount - correctCount)

    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-quiz">
          <div className="enlight-quiz__result">
            <div className="enlight-quiz__scope-header">
              <QuizScopeBadge scope={isTopicQuiz ? 'section' : 'chapter'} />
              <EnlightSectionLabel>{quiz.title}</EnlightSectionLabel>
            </div>
            <h2 className="enlight-heading-serif">{passed ? 'Well done!' : 'Keep practising'}</h2>
            <div className="enlight-quiz__score">{finalScore}%</div>
            <dl className="enlight-quiz__breakdown">
              <div>
                <dt>Answered</dt>
                <dd>{answeredCount}</dd>
              </div>
              <div>
                <dt>Correct</dt>
                <dd>{correctCount}</dd>
              </div>
              <div>
                <dt>Wrong</dt>
                <dd>{wrongCount}</dd>
              </div>
            </dl>
            <p className="enlight-body-text">
              {correctCount} of {answeredCount} correct
            </p>
            <p className="enlight-body-text">
              {passed
                ? skipStudyRewards
                  ? `You passed (${quiz.passPercent}% required). Duel score recorded — no XP (quiz already completed).`
                  : xpEarned > 0
                    ? `You passed (${quiz.passPercent}% required). +${xpEarned} XP awarded!`
                    : `You passed (${quiz.passPercent}% required).`
                : `You need ${quiz.passPercent}% to advance. Review the notes and try again — questions shuffle on retry.`}
            </p>
            {isDuelAttempt && (
              <p className="enlight-body-text enlight-quiz__duel-note">
                Duel mode — score recorded for head-to-head ({finalScore}%)
                {duelSubmitState === 'saving' && ' · Saving…'}
                {duelSubmitState === 'done' && ' · Saved'}
                {duelSubmitState === 'error' && ' · Could not save score — try again from Social'}
              </p>
            )}
            <QuizAcademicProgress
              progress={userProgress}
              subjectId={chapter.subjectId}
              chapterId={chapter.id}
              topicId={isTopicQuiz ? topicId : undefined}
              isTopicQuiz={isTopicQuiz}
              notesReadMap={notesReadMap}
            />
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
                    Review notes
                  </EnlightButton>
                  {!isDuelAttempt && (
                    <EnlightButton onClick={() => resetQuizAttempt(true)}>
                      Retry
                    </EnlightButton>
                  )}
                </>
              )}
              {passed && next && (
                <EnlightButton to={nextQuizPath(next)}>
                  Continue to {DIFF_LABEL[next]}
                </EnlightButton>
              )}
              <EnlightButton to={lessonUrl} variant="outline">
                Back to {isTopicQuiz ? 'section' : 'chapter'}
              </EnlightButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const headerLabel = isTopicQuiz
    ? `${getTopicSectionLabel(topic!.chapterId, topic!.id)} · ${topic!.title} — ${DIFF_LABEL[diff]}`
    : `Chapter ${chapter.number}: ${chapter.title} — ${DIFF_LABEL[diff]}`

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-quiz">
        <div className="enlight-quiz__scope-header">
          <QuizScopeBadge scope={isTopicQuiz ? 'section' : 'chapter'} />
          <EnlightSectionLabel>
            <MathText content={headerLabel} title />
          </EnlightSectionLabel>
        </div>
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
          {exitConfirmOpen ? (
            <span className="enlight-inline-confirm" role="group" aria-label="Confirm exit quiz">
              <span className="enlight-inline-confirm__prompt">Leave quiz? Progress won&apos;t be saved.</span>
              <button type="button" className="enlight-inline-confirm__yes" onClick={requestQuizExit}>
                Yes, leave
              </button>
              <button
                type="button"
                className="enlight-inline-confirm__cancel"
                onClick={() => setExitConfirmOpen(false)}
              >
                Stay
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="enlight-header__link"
              onClick={() => setExitConfirmOpen(true)}
            >
              ← Exit quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
