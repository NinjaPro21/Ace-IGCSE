import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { SignInButton } from '@/features/social/SocialPanels'
import { WeeklyChallengeCard } from '@/features/social/WeeklyChallengeCard'
import { useAuth } from '@/features/social/AuthContext'
import { formatStatValue, getPlatformStats, getSubjectStatsList } from '@/lib/platformStats'
import { getChapter, getNotesForTopic } from '@/lib/contentLoader'
import { DemoQuizStep } from './DemoQuizStep'
import { ShowcaseLessonBar } from './ShowcaseLessonBar'
import { TourBrowserMock, TourHeroMock } from './TourBrowserMock'
import { getShowcaseTopic, trimNoteForShowcase } from './showcaseNote'

const MarkdownLesson = lazy(() =>
  import('@/components/MarkdownLesson').then((m) => ({ default: m.MarkdownLesson })),
)

const STEP_LABELS = ['Welcome', 'Notes', 'Quiz', 'Subjects', 'About', 'Leaderboard'] as const
const STEP_COUNT = STEP_LABELS.length
const WALKTHROUGH_STEP_KEY = 'enlight-walkthrough-step'

function readStepFromParam(stepParam: string | null, maxStep: number): number | null {
  if (stepParam === null) return null
  return Math.min(maxStep, Math.max(0, Number(stepParam) || 0))
}

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '📖',
    color: 'blue',
    title: 'Study the notes',
    body: 'Compressed cards with formulas, diagrams, and examiner tips — earn XP from real study time.',
  },
  {
    step: '02',
    icon: '🧠',
    color: 'violet',
    title: 'Pass tiered quizzes',
    body: 'Easy → Medium → Hard. Three mastery tiers per topic — pass to unlock the next.',
  },
  {
    step: '03',
    icon: '📈',
    color: 'teal',
    title: 'Track & improve',
    body: 'Dashboard, mistake logs, and weak-topic review so you know exactly what to fix before exams.',
  },
]

function WalkthroughDots({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  return (
    <div className="enlight-walkthrough__dots" role="tablist" aria-label="Walkthrough progress">
      {STEP_LABELS.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={step === i}
          aria-label={`${label}${step === i ? ', current step' : ''}`}
          className={[
            'enlight-walkthrough__dot',
            step === i ? 'enlight-walkthrough__dot--active' : '',
            i < step ? 'enlight-walkthrough__dot--done' : '',
          ].join(' ')}
          onClick={() => onJump(i)}
        />
      ))}
    </div>
  )
}

function WalkthroughNav({
  step,
  onBack,
  onNext,
  nextLabel = 'Next →',
  showBack = true,
}: {
  step: number
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  showBack?: boolean
}) {
  return (
    <div className="enlight-walkthrough__nav">
      {showBack && step > 0 ? (
        <EnlightButton variant="outline" onClick={onBack}>
          ← Back
        </EnlightButton>
      ) : (
        <span className="enlight-walkthrough__nav-spacer" aria-hidden />
      )}
      <EnlightButton onClick={onNext}>{nextLabel}</EnlightButton>
    </div>
  )
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const stats = getPlatformStats()

  return (
    <div className="enlight-walkthrough__step enlight-walkthrough__step--welcome">
      <section className="enlight-container enlight-tour-hero-split">
        <div className="enlight-tour-hero-split__copy">
          <span className="enlight-tour-badge">IGCSE · CIE · Free to try</span>
          <h2 className="enlight-tour-headline enlight-tour-headline--left">
            #1 revision
            <br />
            for <span className="enlight-tour-oval-accent">IGCSE</span>
          </h2>
          <p className="enlight-tour-lead enlight-tour-lead--left">
            Compressed notes, inline graphs &amp; diagrams, and tiered quizzes — built for students who
            want to understand, not just pass.
          </p>
          <div className="enlight-tour-hero-stats" aria-label="Platform stats">
            <div className="enlight-tour-stat">
              <span className="enlight-tour-stat__value">{stats.subjectCount}</span>
              <span className="enlight-tour-stat__label">Subjects</span>
            </div>
            <div className="enlight-tour-stat">
              <span className="enlight-tour-stat__value">{formatStatValue(stats.chapterCount)}</span>
              <span className="enlight-tour-stat__label">Chapters</span>
            </div>
            <div className="enlight-tour-stat">
              <span className="enlight-tour-stat__value">{formatStatValue(stats.topicCount * 4)}</span>
              <span className="enlight-tour-stat__label">Quiz sets</span>
            </div>
            <div className="enlight-tour-stat">
              <span className="enlight-tour-stat__value">3-tier</span>
              <span className="enlight-tour-stat__label">Mastery</span>
            </div>
          </div>
        </div>
        <TourHeroMock />
      </section>

      <section className="enlight-container enlight-tour-section enlight-tour-section--spaced">
        <p className="enlight-tour-section__label">How it works</p>
        <h2 className="enlight-tour-section__title enlight-tour-section__title--center">
          Everything you need to <span className="enlight-tour-oval-accent">Excel</span>.
        </h2>
        <div className="enlight-tour-features enlight-tour-features--premium">
          {HOW_IT_WORKS.map((item) => (
            <article key={item.step} className="enlight-tour-feature-card enlight-tour-feature-card--premium">
              <span className={`enlight-tour-feature-card__icon enlight-tour-feature-card__icon--${item.color}`}>
                {item.icon}
              </span>
              <h3 className="enlight-tour-feature-card__title">{item.title}</h3>
              <p className="enlight-tour-feature-card__body">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <WalkthroughNav
        step={0}
        onBack={() => {}}
        onNext={onNext}
        showBack={false}
        nextLabel="Next — see our notes →"
      />
    </div>
  )
}

function NotesStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const topic = getShowcaseTopic()
  const chapter = topic ? getChapter(topic.chapterId) : undefined
  const content = useMemo(() => {
    if (!topic) return ''
    return trimNoteForShowcase(getNotesForTopic(topic))
  }, [])

  if (!topic) return null

  const sectionLabel = topic.subtitle ?? 'Section'

  return (
    <div className="enlight-walkthrough__step enlight-walkthrough__step--notes">
      <div className="enlight-container enlight-walkthrough__step-inner enlight-walkthrough__step-inner--wide">
        <header className="enlight-tour-notes-header">
          <p className="enlight-tour-section__label">Sample lesson</p>
          <h2 className="enlight-tour-section__title enlight-tour-section__title--center">
            Notes that <span className="enlight-tour-oval-accent">teach</span>.
          </h2>
          <p className="enlight-tour-lead enlight-tour-notes-header__lead">
            Scroll the lesson — note cards first, then try the <strong>interactive graph</strong>.
            Use the focus timer (customise work & break length with ⚙).
          </p>
        </header>

        <TourBrowserMock url="aceigcse.com/lesson" className="enlight-tour-browser--lesson">
          <div className="enlight-showcase-note enlight-showcase-note--embedded">
            <ShowcaseLessonBar
              chapterTitle={chapter?.title ?? 'Graphs'}
              sectionLabel={sectionLabel}
              explorerId={topic.explorerId}
            />
            <div className="enlight-showcase-note__preview enlight-showcase-note__preview--lesson">
              <Suspense fallback={<div className="enlight-route-fallback">Loading lesson…</div>}>
                <MarkdownLesson
                  content={content}
                  subjectId={topic.subjectId}
                  explorerId={topic.explorerId}
                  explorerPanels={topic.explorerPanels}
                />
              </Suspense>
            </div>
          </div>
        </TourBrowserMock>
      </div>

      <WalkthroughNav step={1} onBack={onBack} onNext={onNext} nextLabel="Next — try a quiz →" />
    </div>
  )
}

function SubjectsStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const stats = getPlatformStats()
  const subjects = useMemo(() => getSubjectStatsList(), [])

  return (
    <div className="enlight-walkthrough__step enlight-walkthrough__step--subjects">
      <div className="enlight-container enlight-walkthrough__step-inner">
        <header className="enlight-tour-subjects-header">
          <p className="enlight-tour-section__label">Syllabus</p>
          <h2 className="enlight-tour-section__title">
            Master every topic. <span className="enlight-tour-headline__accent">Not just papers.</span>
          </h2>
          <p className="enlight-tour-lead enlight-tour-lead--left">
            {formatStatValue(stats.topicCount)} subtopics across three Cambridge IGCSE syllabi — notes,
            tiered quizzes, and inline graphs &amp; diagrams where they help you see the idea.
          </p>
        </header>

        <div className="enlight-tour-subjects">
          {subjects.map((s) => (
            <article key={s.id} className={`enlight-tour-subject-card enlight-tour-subject-card--${s.accent}`}>
              <div className="enlight-tour-subject-card__glow" aria-hidden />
              <div className="enlight-tour-subject-card__head">
                <div>
                  <span className="enlight-tour-subject-card__code">{s.code}</span>
                  <h3 className="enlight-tour-subject-card__name">{s.name}</h3>
                </div>
                <span className="enlight-tour-subject-card__arrow" aria-hidden>
                  →
                </span>
              </div>
              <p className="enlight-tour-subject-card__blurb">{s.description}</p>

              <p className="enlight-tour-subject-card__meta">
                {s.chapterCount} chapters · {s.topicCount} topics · {s.diagramTopicCount} diagrams
              </p>

              <ul className="enlight-tour-subject-card__chapters">
                {s.sampleChapters.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <WalkthroughNav step={3} onBack={onBack} onNext={onNext} nextLabel="Next — about us →" />
    </div>
  )
}

const ABOUT_FEATURES = [
  { icon: '📋', title: 'Mistake logs', body: 'Review every wrong answer after each quiz run.' },
  { icon: '📊', title: 'Graphs & diagrams', body: 'Inline visuals in notes for motion, waves, trig, and more.' },
  { icon: '⏱', title: 'Study XP & streaks', body: 'Earn XP from real study time with a built-in pomodoro.' },
]

function AboutStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="enlight-walkthrough__step enlight-walkthrough__step--about">
      <div className="enlight-container enlight-walkthrough__step-inner">
        <header className="enlight-tour-about__intro">
          <p className="enlight-tour-section__label">About</p>
          <h2 className="enlight-tour-section__title">Built by students, for students.</h2>
          <p className="enlight-tour-lead enlight-tour-lead--left">
            AceIGCSE compresses syllabus content into exam-ready cards, pairs them with clear
            graphs and diagrams, and uses tiered quizzes so you know exactly where you stand.
          </p>
        </header>

        <ul className="enlight-tour-about__list">
          {ABOUT_FEATURES.map((f) => (
            <li key={f.title} className="enlight-tour-about__item">
              <span className="enlight-tour-about__icon" aria-hidden>
                {f.icon}
              </span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <WalkthroughNav step={4} onBack={onBack} onNext={onNext} nextLabel="Next — leaderboard →" />
    </div>
  )
}

function LeaderboardStep({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()

  return (
    <div className="enlight-walkthrough__step enlight-container enlight-walkthrough__step-inner">
      <div className="enlight-tour-panel">
        <p className="enlight-tour-section__label">Compete</p>
        <h2 className="enlight-tour-section__title">
          Climb the <span className="enlight-tour-headline__accent">leaderboard</span>.
        </h2>
        <p className="enlight-tour-lead enlight-tour-lead--left">
          Weekly challenges, school ranks, and quiz duels — sign in to appear on the board.
        </p>
      </div>

      <div className="enlight-tour-leaderboard-wrap">
        {!user && (
          <div className="enlight-tour-rank-mock" aria-hidden="true">
            <p className="enlight-tour-rank-mock__title">Hall of Fame</p>
            <ol className="enlight-tour-rank-mock__list">
              <li><span className="enlight-tour-rank-mock__pos">1</span> You <span>—</span></li>
              <li><span className="enlight-tour-rank-mock__pos">2</span> Alex K. <span>2100 XP</span></li>
              <li><span className="enlight-tour-rank-mock__pos">3</span> Sam T. <span>1980 XP</span></li>
            </ol>
          </div>
        )}

        <div className="enlight-walkthrough__leaderboard-panel">
          {user ? (
            <>
              <WeeklyChallengeCard />
              <p className="enlight-body-text enlight-walkthrough__leaderboard-link">
                <EnlightButton to="/social">Open social hub →</EnlightButton>
              </p>
            </>
          ) : (
            <div className="enlight-tour-cta-card">
              <p>Sign in to view live rankings and sync your XP across devices.</p>
              <SignInButton />
            </div>
          )}
        </div>
      </div>

      <div className="enlight-walkthrough__nav enlight-walkthrough__nav--final">
        <EnlightButton variant="outline" onClick={onBack}>
          ← Back
        </EnlightButton>
        {user ? (
          <EnlightButton
            to="/dashboard"
            onClick={() => {
              try {
                sessionStorage.removeItem(WALKTHROUGH_STEP_KEY)
              } catch {
                /* ignore */
              }
            }}
          >
            Go to dashboard →
          </EnlightButton>
        ) : (
          <div className="enlight-walkthrough__signin-actions">
            <SignInButton />
          </div>
        )}
      </div>
    </div>
  )
}

export function MarketingWalkthrough() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const stepParam = searchParams.get('step')
  const maxStep = STEP_COUNT - 1
  const fromUrl = readStepFromParam(stepParam, maxStep)
  const fromStorage = (() => {
    try {
      const raw = sessionStorage.getItem(WALKTHROUGH_STEP_KEY)
      if (raw === null) return null
      return Math.min(maxStep, Math.max(0, Number(raw) || 0))
    } catch {
      return null
    }
  })()
  const initial = fromUrl ?? fromStorage ?? 0
  const [step, setStep] = useState(initial)

  useEffect(() => {
    const fromParam = readStepFromParam(stepParam, maxStep)
    if (fromParam !== null) {
      setStep(fromParam)
      try {
        sessionStorage.setItem(WALKTHROUGH_STEP_KEY, String(fromParam))
      } catch {
        /* ignore */
      }
    }
  }, [stepParam, maxStep])

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(maxStep, Math.max(0, next))
      setStep(clamped)
      try {
        sessionStorage.setItem(WALKTHROUGH_STEP_KEY, String(clamped))
      } catch {
        /* ignore */
      }
      setSearchParams(clamped === 0 ? {} : { step: String(clamped) }, { replace: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setSearchParams, maxStep],
  )

  const walkthroughInProgress = step > 0 || stepParam !== null || (fromStorage ?? 0) > 0

  if (user && step === 0 && stepParam === null && !walkthroughInProgress) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="enlight-walkthrough enlight-walkthrough--airy">
      <div className="enlight-walkthrough__header enlight-container">
        <WalkthroughDots step={step} onJump={goTo} />
        <p className="enlight-walkthrough__step-label">{STEP_LABELS[step]}</p>
      </div>

      {step === 0 && <WelcomeStep onNext={() => goTo(1)} />}
      {step === 1 && <NotesStep onBack={() => goTo(0)} onNext={() => goTo(2)} />}
      {step === 2 && <DemoQuizStep onBack={() => goTo(1)} onNext={() => goTo(3)} />}
      {step === 3 && <SubjectsStep onBack={() => goTo(2)} onNext={() => goTo(4)} />}
      {step === 4 && <AboutStep onBack={() => goTo(3)} onNext={() => goTo(5)} />}
      {step === 5 && <LeaderboardStep onBack={() => goTo(4)} />}
    </div>
  )
}
