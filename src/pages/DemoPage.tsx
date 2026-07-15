import { EnlightHeader } from '@/components/EnlightHeader'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { TrigGraphExplorer } from '@/features/explorers/TrigGraphExplorer'

export function DemoPage() {
  return (
    <div className="ace-app">
      <EnlightHeader />
      <section className="ace-trig-demo ace-container">
        <EnlightSectionLabel>Live demo — no login needed</EnlightSectionLabel>
        <h2 className="ace-heading-serif" style={{ textAlign: 'center', marginBottom: 12 }}>
          Play with a real interactive graph
        </h2>
        <p className="ace-hero-sub" style={{ marginBottom: 40 }}>
          Adjust amplitude, period, phase, and vertical shift. See how the equation and graph change in
          real time — the same engine used in our Add Maths lessons.
        </p>
        <div className="ace-trig-card">
          <TrigGraphExplorer />
        </div>
      </section>
      <footer className="ace-footer">© {new Date().getFullYear()} AceIGCSE</footer>
    </div>
  )
}
