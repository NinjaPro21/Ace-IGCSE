import { EnlightButton } from '@/components/EnlightButton'
import { EnlightCard, EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'

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

export function LandingPage() {
  return (
    <div className="enlight-app">
      <EnlightHeader />
      <section className="enlight-hero enlight-container">
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
          <EnlightButton to="/subjects/add-maths-0606">Browse Add Maths →</EnlightButton>
          <EnlightButton to="/demo" variant="outline">
            Try Live Demo
          </EnlightButton>
        </div>
        <p className="enlight-hero__micro">
          No sign-up needed to explore · Instant access after purchase
        </p>
      </section>

      <section className="enlight-container enlight-page-padding">
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

      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight. All rights reserved.</footer>
    </div>
  )
}
