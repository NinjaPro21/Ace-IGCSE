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

/** Static fallback from trig-graphs easy quiz — used when loadQuiz fails or returns empty. */
const TRIG_DEMO_FALLBACK: McqQuestion[] = [
  {
    id: 'demo-trig-fallback-q1',
    type: 'mcq',
    question: 'What is the amplitude of the trigonometric function $y = 4 \\cos x$?',
    options: ['4', '1', '8', '360°'],
    correctIndex: 0,
    explanation:
      'Amplitude is the absolute value of the coefficient of the trig term — here $|4| = 4$.',
  },
  {
    id: 'demo-trig-fallback-q2',
    type: 'mcq',
    question: 'State the period of the function $y = \\tan x$.',
    options: ['180° (or π rad)', '360° (or 2π rad)', '90°', 'Infinite'],
    correctIndex: 0,
    explanation: 'Unlike sine and cosine (period 360°), tangent repeats every 180°.',
  },
  {
    id: 'demo-trig-fallback-q3',
    type: 'mcq',
    question: 'What is the period of $y = \\sin 2x$?',
    options: ['180°', '360°', '720°', '90°'],
    correctIndex: 0,
    explanation: 'Period of $\\sin bx$ is $360°/|b|$, so $360°/2 = 180°$.',
  },
]

type Phase = 'intro' | 'quiz' | 'result'

interface DemoQuizStepProps {
  onBack?: () => void
  onNext?: () => void
  /** Landing embed: no walkthrough back/next chrome */
  embedded?: boolean
}

export function DemoQuizStep({ onBack, onNext, embedded = false }: DemoQuizStepProps) {
  const { user } = useAuth()
  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [quizLoading, setQuizLoading] = useState(true)
  const [demoQuestions, setDemoQuestions] = useState<McqQuestion[]>(TRIG_DEMO_FALLBACK)

  useEffect(() => {
    let cancelled = false
    const topic = getShowcaseTopic()
    const quizId = topic?.quizIds?.easy ?? '9-4-9-5-graphs-of-trig-and-modulus-functions-harder-topi-easy'

    setQuizLoading(true)
    loadQuiz(quizId)
      .then((quiz) => {
        if (cancelled) return
        const loaded = quiz
          ? (quiz.questions.slice(0, DEMO_QUESTION_COUNT) as McqQuestion[])
          : []
        setDemoQuestions(loaded.length > 0 ? loaded : TRIG_DEMO_FALLBACK)
        setQuizLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setDemoQuestions(TRIG_DEMO_FALLBACK)
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

  if (quizLoading) {
    return <p className="ace-body-text">Loading demo quiz…</p>
  }

  if (phase === 'intro') {
    const previewQ = questions[0]
    return (
      <div className={embedded ? 'ace-landing-demo-quiz' : 'ace-walkthrough__step ace-container ace-walkthrough__step-inner'}>
        <div className="ace-tour-quiz-layout">
          <div className="ace-tour-panel">
            <p className="ace-tour-section__label">Try it yourself</p>
            <h2 className="ace-tour-section__title">
              Take a quick Easy quiz
            </h2>
            <p className="ace-tour-lead ace-tour-lead--left">
              Three questions from <strong>{getShowcaseTopic()?.title ?? 'Trig graphs'}</strong> —
              the same tiered MCQs in every topic. No account needed.
            </p>
            <ul className="ace-tour-quiz-perks">
              <li>Instant feedback after each question</li>
              <li>Explanations for every answer</li>
              <li>Earn demo XP at the end</li>
            </ul>
            <div className="ace-walkthrough__nav ace-walkthrough__nav--inline">
              {!embedded && onBack && (
                <EnlightButton variant="outline" onClick={onBack}>
                  ← Back
                </EnlightButton>
              )}
              <EnlightButton onClick={() => setPhase('quiz')}>Start quiz →</EnlightButton>
            </div>
          </div>

          {previewQ && (
            <div className="ace-tour-mock-quiz" aria-hidden="true">
              <div className="ace-tour-mock-quiz__bar">
                <span>Add Maths 0606 · Easy</span>
                <span className="ace-tour-mock-quiz__badge">Live preview</span>
              </div>
              <div className="ace-tour-mock-quiz__q">
                <MathText content={previewQ.question} />
              </div>
              <div className="ace-tour-mock-quiz__opts">
                {previewQ.options.slice(0, 4).map((opt, i) => (
                  <div
                    key={i}
                    className={`ace-tour-mock-quiz__opt${i === 0 ? ' ace-tour-mock-quiz__opt--hl' : ''}`}
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
      <div className={embedded ? 'ace-landing-demo-quiz' : 'ace-walkthrough__step ace-container ace-walkthrough__step--quiz-result'}>
        <div className="ace-demo-xp-burst" aria-live="polite">
          <span className="ace-demo-xp-burst__icon" aria-hidden>
            ⚡
          </span>
          <p className="ace-demo-xp-burst__value">+{xpEarned} XP</p>
          <p className="ace-demo-xp-burst__sub">
            You scored {correctCount}/{questions.length} ({scorePercent}%)
          </p>
        </div>

        <div className="ace-demo-signup-pitch">
          <h2 className="ace-heading-serif">Keep that progress.</h2>
          <p className="ace-body-text">
            {user
              ? 'Your XP and quiz history sync to your dashboard — keep going to level up.'
              : 'Sign in to save your XP, track mastery across every subject, and climb the leaderboard.'}
          </p>
          {!user && (
            <div className="ace-walkthrough__signin-actions">
              <SignInButton />
            </div>
          )}
        </div>

        {!embedded && onNext && (
          <div className="ace-walkthrough__nav">
            <EnlightButton onClick={onNext}>
              {user ? 'Continue tour →' : 'Next — our subjects →'}
            </EnlightButton>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={embedded ? 'ace-landing-demo-quiz' : 'ace-walkthrough__step ace-container ace-walkthrough__step--quiz'}>
      <p className="ace-walkthrough__quiz-meta">
        Question {index + 1} of {questions.length} · Easy · Add Maths 0606
      </p>

      <div className="ace-demo-quiz">
        <div className="ace-demo-quiz__question">
          {question && <MathText content={question.question} block />}
        </div>
        <div className="ace-demo-quiz__options">
          {question?.options.map((opt, i) => {
            let cls = 'ace-demo-quiz__option'
            if (showFeedback && i === question.correctIndex) cls += ' ace-demo-quiz__option--correct'
            if (showFeedback && i === selected && i !== question.correctIndex) {
              cls += ' ace-demo-quiz__option--wrong'
            }
            return (
              <button key={i} type="button" className={cls} onClick={() => pick(i)} disabled={showFeedback}>
                <span className="ace-demo-quiz__letter">{OPTION_LETTERS[i]}</span>
                <MathText content={opt} />
              </button>
            )
          })}
        </div>
        {showFeedback && question?.explanation && (
          <div className="ace-demo-quiz__explain">
            <MathText content={question.explanation} block />
          </div>
        )}
        {showFeedback && (
          <div className="ace-demo-quiz__next">
            <EnlightButton onClick={advance}>
              {index + 1 >= questions.length ? 'See your XP →' : 'Next question →'}
            </EnlightButton>
          </div>
        )}
      </div>

      {!embedded && onBack && (
        <div className="ace-walkthrough__nav ace-walkthrough__nav--compact">
          <EnlightButton variant="outline" onClick={onBack}>
            ← Back
          </EnlightButton>
        </div>
      )}
    </div>
  )
}
