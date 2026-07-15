import { EnlightSectionLabel } from '@/components/EnlightCard'

export function AboutPage() {
  return (
    <div className="ace-container ace-page-padding ace-marketing-page">
      <EnlightSectionLabel>About</EnlightSectionLabel>
      <h1 className="ace-heading-serif">AceIGCSE</h1>
      <p className="ace-body-text ace-marketing-page__lead">
        AceIGCSE is an IGCSE revision platform built by students, for students. We focus on
        understanding over memorisation — with tools that make abstract maths and physics tangible.
      </p>
      <div className="ace-marketing-prose">
        <h2 className="ace-heading-serif">Our mission</h2>
        <p className="ace-body-text">
          Too many revision sites dump textbook content online and call it done. We compress syllabus
          notes into exam-ready cards, pair them with clear graphs and diagrams, and use tiered
          quizzes so you know exactly where you stand before the real exam.
        </p>
        <h2 className="ace-heading-serif">Syllabus coverage</h2>
        <p className="ace-body-text">
          Cambridge IGCSE Add Maths (0606), Mathematics (0580), and Physics (0625) — with more content
          added continuously.
        </p>
      </div>
    </div>
  )
}
