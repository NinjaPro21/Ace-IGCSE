import { EnlightButton } from '@/components/EnlightButton'
import { EnlightCard, EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getContinueStudying } from '@/features/mastery/progressStats'
import { useAuth } from '@/features/social/AuthContext'

const FEATURES = [
  {
    icon: '📊',
    title: 'Interactive Graphs',
    body: 'Manipulate equations with live sliders and see roots, intersections, and trig transformations update instantly.',
  },
  {
    icon: '⚡',
    title: 'Compressed Notes',
    body: 'Exam-ready cards with examiner tips — no walls of text. Just what you need to understand and recall.',
  },
  {
    icon: '🔍',
    title: 'Mastery Progression',
    body: '3 Easy · 3 Medium · 3 Hard sets plus PYP-style questions. Level up each topic before moving on.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Study the Notes',
    body: 'Spend 5 minutes on notes to earn XP — or jump straight into Easy. Pass each tier to unlock the next.',
  },
  {
    step: '02',
    title: 'Practise & Level Up',
    body: 'Work through tiered quizzes (Easy → Medium → Hard → PYP) and track your mastery per chapter.',
  },
  {
    step: '03',
    title: 'Master the Syllabus',
    body: 'Build a full picture of every topic. Go into exams knowing exactly where you stand.',
  },
]

const STATS = [
  { value: '3', label: 'Subjects' },
  { value: '15+', label: 'Chapters' },
  { value: '200+', label: 'Practice Questions' },
  { value: '5-step', label: 'Mastery Path' },
]

export function LandingPage() {
  const { progress } = useMastery()
  const { user } = useAuth()
  const continueStudying = getContinueStudying(progress)

  return (
    <div className="enlight-app">
      <EnlightHeader />

      {/* Hero */}
      <section className="enlight-hero enlight-hero--enhanced enlight-container">
        <div className="enlight-hero__dot-grid" aria-hidden="true" />
        <EnlightSectionLabel>IGCSE · CIE · Add Maths · Maths · Physics</EnlightSectionLabel>
        <h2 className="enlight-hero-title">
          Master IGCSE with clarity,
          <br />
          not cramming.
        </h2>
        <p className="enlight-hero-sub">
          Interactive graphs, compressed exam-ready cards, and examiner tips — so you stop memorising
          and start understanding.
        </p>
        <div className="enlight-hero__actions">
          {continueStudying ? (
            <EnlightButton to={continueStudying.topicPath}>
              Continue: {continueStudying.topicTitle} →
            </EnlightButton>
          ) : (
            <EnlightButton to="/subjects/add-maths-0606">Browse Add Maths →</EnlightButton>
          )}
          <EnlightButton to={user ? '/progress' : '/subjects/add-maths-0606'} variant="outline">
            {user ? 'Dashboard' : 'Browse subjects'}
          </EnlightButton>
        </div>
        <p className="enlight-hero__micro">
          Browse subjects free — sign in with Google to track XP, streaks, and leaderboards.
        </p>
      </section>

      {/* Stats bar */}
      <div className="enlight-stats-bar">
        <div className="enlight-stats-bar__inner enlight-container">
          {STATS.map((s) => (
            <div key={s.label} className="enlight-stats-bar__item">
              <span className="enlight-stats-bar__value">{s.value}</span>
              <span className="enlight-stats-bar__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="enlight-container enlight-section-gap">
        <EnlightSectionLabel>How it works</EnlightSectionLabel>
        <h2 className="enlight-heading-serif">Three steps to exam confidence.</h2>
        <div className="enlight-how-grid">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={item.step} className="enlight-how-card">
              <div className="enlight-how-card__step">{item.step}</div>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="enlight-how-card__connector" aria-hidden="true" />
              )}
              <h3 className="enlight-how-card__title">{item.title}</h3>
              <p className="enlight-body-text">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="enlight-container enlight-section-gap">
        <EnlightSectionLabel>Why we&apos;re different</EnlightSectionLabel>
        <h2 className="enlight-heading-serif">Built for students who want to understand, not just pass.</h2>
        <p className="enlight-body-text">Most revision resources give you walls of text. We give you tools.</p>
        <div className="enlight-feature-grid">
          {FEATURES.map((f) => (
            <EnlightCard key={f.title}>
              <div className="enlight-feature-card__icon">{f.icon}</div>
              <h3 className="enlight-feature-card__title">{f.title}</h3>
              <p className="enlight-body-text">{f.body}</p>
            </EnlightCard>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="enlight-cta-strip">
        <div className="enlight-container enlight-cta-strip__inner">
          <div>
            <h2 className="enlight-cta-strip__title">Ready to start?</h2>
            <p className="enlight-cta-strip__sub">
              Study compressed notes, earn XP from real study time, and climb your class leaderboard.
            </p>
          </div>
          <div className="enlight-cta-strip__actions">
            <EnlightButton to="/subjects/add-maths-0606">Browse Add Maths →</EnlightButton>
            <EnlightButton to="/progress" variant="outline">Your progress</EnlightButton>
          </div>
        </div>
      </section>

      <footer className="enlight-footer">© {new Date().getFullYear()} AceIGCSE. All rights reserved.</footer>
    </div>
  )
}
