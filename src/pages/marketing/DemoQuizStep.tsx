import { useEffect, useMemo, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { MathText } from '@/components/MathText'
import { SignInButton } from '@/features/social/SocialPanels'
import { useAuth } from '@/features/social/AuthContext'
import { loadQuiz } from '@/lib/contentLoader'
import type { McqQuestion } from '@/lib/contentTypes'
import { OPTION_LETTERS } from '@/features/quiz/quizUtils'
import { getShowcaseTopic } from './showcaseNote'

const DEMO_QUESTION_COUNT = 3
const DEMO_XP_PER_CORRECT = 5

type Phase = 'intro' | 'quiz' | 'result'

interface DemoQuizStepProps {
  onBack: () => void
  onNext: () => void
}

export function DemoQuizStep({ onBack, onNext }: DemoQuizStepProps) {
  const { user } = useAuth()
  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [quizLoading, setQuizLoading] = useState(true)
  const [demoQuestions, setDemoQuestions] = useState<McqQuestion[]>([])

  useEffect(() => {
    let cancelled = false
    const topic = getShowcaseTopic()
    const quizId = topic?.quizIds?.easy
    if (!quizId) {
      setDemoQuestions([])
      setQuizLoading(false)
      return
    }
    setQuizLoading(true)
    loadQuiz(quizId)
      .then((quiz) => {
        if (cancelled) return
        setDemoQuestions(
          quiz ? (quiz.questions.slice(0, DEMO_QUESTION_COUNT) as McqQuestion[]) : [],
        )
        setQuizLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setDemoQuestions([])
          setQuizLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const questions = useMemo(() => demoQuestions, [demoQuestions])

  const question = questions[index]
  const xpEarned = correctCount * DEMO_XP_PER_CORRECT
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  const pick = (i: number) => {
    if (showFeedback || !question) return
    setSelected(i)
    setShowFeedback(true)
    if (i === question.correctIndex) setCorrectCount((c) => c + 1)
  }

  const advance = () => {
    if (index + 1 >= questions.length) {
      setPhase('result')
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setShowFeedback(false)
  }

  const resetQuiz = () => {
    setPhase('intro')
    setIndex(0)
    setSelected(null)
    setShowFeedback(false)
    setCorrectCount(0)
  }

  if (quizLoading) {
    return (
      <div className="enlight-walkthrough__step enlight-container">
        <p className="enlight-body-text">Loading demo quiz…</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="enlight-walkthrough__step enlight-container">
        <p className="enlight-body-text">Demo quiz unavailable.</p>
        <EnlightButton onClick={onNext}>Continue →</EnlightButton>
      </div>
    )
  }

  if (phase === 'intro') {
    const previewQ = questions[0]
    return (
      <div className="enlight-walkthrough__step enlight-container enlight-walkthrough__step-inner">
        <div className="enlight-tour-quiz-layout">
          <div className="enlight-tour-panel">
            <p className="enlight-tour-section__label">Try it yourself</p>
            <h2 className="enlight-tour-section__title">
              Take a quick <span className="enlight-tour-headline__accent">Easy quiz</span>.
            </h2>
            <p className="enlight-tour-lead enlight-tour-lead--left">
              Three questions from <strong>{getShowcaseTopic()?.title ?? 'Interpreting Graphs'}</strong> —
              the same tiered MCQs in every topic. No account needed.
            </p>
            <ul className="enlight-tour-quiz-perks">
              <li>Instant feedback after each question</li>
              <li>Explanations for every answer</li>
              <li>Earn demo XP at the end</li>
            </ul>
            <div className="enlight-walkthrough__nav enlight-walkthrough__nav--inline">
              <EnlightButton variant="outline" onClick={onBack}>
                ← Back
              </EnlightButton>
              <EnlightButton onClick={() => setPhase('quiz')}>Start quiz →</EnlightButton>
            </div>
          </div>

          {previewQ && (
            <div className="enlight-tour-mock-quiz" aria-hidden="true">
              <div className="enlight-tour-mock-quiz__bar">
                <span>Maths 0580 · Easy</span>
                <span className="enlight-tour-mock-quiz__badge">Live preview</span>
              </div>
              <p className="enlight-tour-mock-quiz__q">
                <MathText content={previewQ.question} />
              </p>
              <div className="enlight-tour-mock-quiz__opts">
                {previewQ.options.slice(0, 4).map((opt, i) => (
                  <div
                    key={i}
                    className={`enlight-tour-mock-quiz__opt${i === 0 ? ' enlight-tour-mock-quiz__opt--hl' : ''}`}
                  >
                    <span>{OPTION_LETTERS[i]}</span>
                    <MathText content={opt} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div className="enlight-walkthrough__step enlight-container enlight-walkthrough__step--quiz-result">
        <div className="enlight-demo-xp-burst" aria-live="polite">
          <span className="enlight-demo-xp-burst__icon" aria-hidden>
            ⚡
          </span>
          <p className="enlight-demo-xp-burst__value">+{xpEarned} XP</p>
          <p className="enlight-demo-xp-burst__sub">
            You scored {correctCount}/{questions.length} ({scorePercent}%)
          </p>
        </div>

        <div className="enlight-demo-signup-pitch">
          <h2 className="enlight-heading-serif">Keep that progress.</h2>
          <p className="enlight-body-text">
            {user
              ? 'Your XP and quiz history sync to your dashboard — keep going to level up.'
              : 'Sign up to save your XP, track mastery across every subject, and climb the leaderboard.'}
          </p>
          {!user && (
            <div className="enlight-walkthrough__signin-actions">
              <SignInButton />
            </div>
          )}
        </div>

        <div className="enlight-walkthrough__nav">
          <EnlightButton variant="outline" onClick={resetQuiz}>
            Retry quiz
          </EnlightButton>
          <EnlightButton onClick={onNext}>
            {user ? 'Continue tour →' : 'Next — our subjects →'}
          </EnlightButton>
        </div>
      </div>
    )
  }

  return (
    <div className="enlight-walkthrough__step enlight-container enlight-walkthrough__step--quiz">
      <p className="enlight-walkthrough__quiz-meta">
        Question {index + 1} of {questions.length} · Easy · Maths 0580
      </p>

      <div className="enlight-demo-quiz">
        <div className="enlight-demo-quiz__question">
          {question && <MathText content={question.question} block />}
        </div>
        <div className="enlight-demo-quiz__options">
          {question?.options.map((opt, i) => {
            let cls = 'enlight-demo-quiz__option'
            if (showFeedback && i === question.correctIndex) cls += ' enlight-demo-quiz__option--correct'
            if (showFeedback && i === selected && i !== question.correctIndex) {
              cls += ' enlight-demo-quiz__option--wrong'
            }
            return (
              <button key={i} type="button" className={cls} onClick={() => pick(i)} disabled={showFeedback}>
                <span className="enlight-demo-quiz__letter">{OPTION_LETTERS[i]}</span>
                <MathText content={opt} />
              </button>
            )
          })}
        </div>
        {showFeedback && question?.explanation && (
          <div className="enlight-demo-quiz__explain">
            <MathText content={question.explanation} block />
          </div>
        )}
        {showFeedback && (
          <div className="enlight-demo-quiz__next">
            <EnlightButton onClick={advance}>
              {index + 1 >= questions.length ? 'See your XP →' : 'Next question →'}
            </EnlightButton>
          </div>
        )}
      </div>

      <div className="enlight-walkthrough__nav enlight-walkthrough__nav--compact">
        <EnlightButton variant="outline" onClick={onBack}>
          ← Back
        </EnlightButton>
      </div>
    </div>
  )
}
