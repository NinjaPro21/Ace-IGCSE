import { EnlightSectionLabel } from '@/components/EnlightCard'

export function AboutPage() {
  return (
    <div className="enlight-container enlight-page-padding enlight-marketing-page">
      <EnlightSectionLabel>About</EnlightSectionLabel>
      <h1 className="enlight-heading-serif">AceIGCSE</h1>
      <p className="enlight-body-text enlight-marketing-page__lead">
        AceIGCSE is an IGCSE revision platform built by students, for students. We focus on
        understanding over memorisation — with tools that make abstract maths and physics tangible.
      </p>
      <div className="enlight-marketing-prose">
        <h2 className="enlight-heading-serif">Our mission</h2>
        <p className="enlight-body-text">
          Too many revision sites dump textbook content online and call it done. We compress syllabus
          notes into exam-ready cards, pair them with clear graphs and diagrams, and use tiered
          quizzes so you know exactly where you stand before the real exam.
        </p>
        <h2 className="enlight-heading-serif">Syllabus coverage</h2>
        <p className="enlight-body-text">
          Cambridge IGCSE Add Maths (0606), Mathematics (0580), and Physics (0625) — with more content
          added continuously.
        </p>
      </div>
    </div>
  )
}
