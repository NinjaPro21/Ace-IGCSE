import { lazy, Suspense, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { SignInButton } from '@/features/social/SocialPanels'
import { useAuth } from '@/features/social/AuthContext'
import { BRAND } from '@/lib/brand'
import { getChapter, getNotesForTopic } from '@/lib/contentLoader'
import { DemoQuizStep } from './DemoQuizStep'
import { ShowcaseLessonBar } from './ShowcaseLessonBar'
import { TourBrowserMock } from './TourBrowserMock'
import { getShowcaseTopic, trimNoteForShowcase } from './showcaseNote'

const MarkdownLesson = lazy(() =>
  import('@/components/MarkdownLesson').then((m) => ({ default: m.MarkdownLesson })),
)

function LandingDemoNotes() {
  const topic = getShowcaseTopic()
  const chapter = topic ? getChapter(topic.chapterId) : undefined
  const content = useMemo(() => {
    if (!topic) return ''
    return trimNoteForShowcase(getNotesForTopic(topic))
  }, [])

  if (!topic) return null

  const sectionLabel = topic.subtitle ?? 'Section'

  return (
    <TourBrowserMock url="aceigcse.my/lesson" className="ace-tour-browser--lesson">
      <div className="ace-showcase-note ace-showcase-note--embedded">
        <ShowcaseLessonBar
          chapterTitle={chapter?.title ?? 'Graphs'}
          sectionLabel={sectionLabel}
          explorerId={topic.explorerId}
        />
        <div className="ace-showcase-note__preview ace-showcase-note__preview--lesson">
          <Suspense fallback={<div className="ace-route-fallback">Loading lesson…</div>}>
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
  )
}

export function MarketingLanding() {
  const { user, signInWithGoogle, loading } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="ace-landing">
      <section className="ace-landing__hero ace-container" aria-labelledby="landing-headline">
        <p className="ace-landing__brand">{BRAND.full}</p>
        <h2 id="landing-headline" className="ace-landing__headline">
          Notes, quizzes, and mastery for CIE IGCSE
        </h2>
        <p className="ace-landing__lead">
          Compressed revision cards with inline graphs and tiered quizzes — built so you understand the
          topic, not just memorise it.
        </p>
        <div className="ace-landing__cta">
          <EnlightButton
            onClick={() => {
              if (!loading) void signInWithGoogle()
            }}
          >
            Sign in with Google
          </EnlightButton>
          <a className="ace-landing__demo-link" href="#demo">
            Try a demo
          </a>
        </div>
      </section>

      <section id="demo" className="ace-landing__demo ace-container">
        <header className="ace-landing__demo-header">
          <p className="ace-section-label">Demo</p>
          <h3 className="ace-landing__demo-title">See a sample lesson</h3>
          <p className="ace-body-text">
            Scroll the notes, then try a short quiz below — no account required for this preview.
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
    </div>
  )
}
