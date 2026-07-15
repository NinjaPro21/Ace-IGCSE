import { lazy, Suspense, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { SignInButton } from '@/features/social/SocialPanels'
import { useAuth } from '@/features/social/AuthContext'
import { BRAND } from '@/lib/brand'
import { getNotesForTopic } from '@/lib/contentLoader'
import { DemoQuizStep } from './DemoQuizStep'
import { getShowcaseTopic } from './showcaseNote'

const MarkdownLesson = lazy(() =>
  import('@/components/MarkdownLesson').then((m) => ({ default: m.MarkdownLesson })),
)

function HeroMockCards() {
  return (
    <div className="ace-landing-hero__cards" aria-label="Sample lesson cards">
      <article className="ace-landing-note-card ace-landing-note-card--quiz ace-landing-note-card--1">
        <p className="ace-landing-note-card__label">Trig graphs · Easy</p>
        <h3 className="ace-landing-note-card__title">Quick check</h3>
        <p className="ace-landing-note-card__prompt">
          What is the amplitude of y = 4 cos x?
        </p>
        <ul className="ace-landing-mock-opts">
          <li className="ace-landing-mock-opts__opt ace-landing-mock-opts__opt--correct">
            <span className="ace-landing-mock-opts__letter">A</span>
            <span>4</span>
            <span className="ace-landing-mock-opts__tick" aria-hidden>
              ✓
            </span>
          </li>
          <li className="ace-landing-mock-opts__opt">
            <span className="ace-landing-mock-opts__letter">B</span>
            <span>1</span>
          </li>
          <li className="ace-landing-mock-opts__opt">
            <span className="ace-landing-mock-opts__letter">C</span>
            <span>8</span>
          </li>
        </ul>
      </article>

      <article className="ace-landing-note-card ace-landing-note-card--worked ace-landing-note-card--2">
        <p className="ace-landing-note-card__label">Worked example</p>
        <h3 className="ace-landing-note-card__title">Amplitude and period</h3>
        <p className="ace-landing-note-card__body">
          For y = 4 sin(3x), amplitude = 4 and period = 360° ÷ 3 = 120°. Sketch one full wave in
          every 120° interval.
        </p>
      </article>
    </div>
  )
}

function LandingDemoNotes() {
  const topic = getShowcaseTopic()
  const content = useMemo(() => {
    if (!topic) return ''
    return getNotesForTopic(topic)
  }, [])

  if (!topic) return null

  return (
    <div className="ace-landing-demo-notes">
      <Suspense fallback={<div className="ace-route-fallback">Loading lesson…</div>}>
        <MarkdownLesson
          content={content}
          subjectId={topic.subjectId}
          explorerId={topic.explorerId}
          explorerPanels={topic.explorerPanels}
        />
      </Suspense>
    </div>
  )
}

export function MarketingLanding() {
  const { user, signInWithGoogle, loading } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="ace-landing">
      <section className="ace-landing-hero" aria-labelledby="landing-headline">
        <div className="ace-landing-hero__inner">
          <div className="ace-landing-hero__copy">
            <p className="ace-landing-hero__wordmark">{BRAND.full}</p>
            <h2 id="landing-headline" className="ace-landing-hero__headline">
              Study notes built for CIE exams
            </h2>
            <p className="ace-landing-hero__lead">
              Compressed cards, inline graphs, and tiered quizzes — so you understand the topic, not
              just memorise it.
            </p>
            <div className="ace-landing-hero__cta">
              <EnlightButton
                onClick={() => {
                  if (!loading) void signInWithGoogle()
                }}
              >
                Sign in with Google
              </EnlightButton>
              <a className="ace-landing-hero__demo-link" href="#demo">
                Try a demo
              </a>
            </div>
          </div>
          <HeroMockCards />
        </div>
      </section>

      <section id="demo" className="ace-landing__demo ace-container">
        <header className="ace-landing__demo-header">
          <p className="ace-section-label">Demo</p>
          <h3 className="ace-landing__demo-title">Open a sample lesson</h3>
          <p className="ace-body-text">
            Scroll the notes, then try a short quiz — no account required for this preview.
          </p>
        </header>

        <LandingDemoNotes />

        <div className="ace-landing__quiz-wrap">
          <h3 className="ace-landing__demo-title">Try a 3-question quiz</h3>
          <DemoQuizStep embedded />
        </div>
      </section>

      <section id="about" className="ace-landing__about ace-container">
        <p className="ace-section-label">About</p>
        <h3 className="ace-landing__demo-title">Built for CIE Add Maths, Maths, and Physics</h3>
        <p className="ace-body-text">
          AceIGCSE is a free study platform for students sitting Cambridge IGCSE — notes, interactive
          diagrams, and mastery tiers that unlock Easy → Medium → Hard → PYP.
        </p>
        <div className="ace-landing__about-cta">
          <SignInButton />
        </div>
      </section>

      <section id="privacy" className="ace-landing__about ace-container">
        <p className="ace-section-label">Privacy</p>
        <h3 className="ace-landing__demo-title">Your study data stays yours</h3>
        <p className="ace-body-text">
          We use anonymous analytics to improve the product. Progress syncs to your Google account when
          you sign in. Personal study data is not sold or shared for advertising.
        </p>
      </section>
    </div>
  )
}
