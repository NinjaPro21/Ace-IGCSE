import { EnlightHeader } from '@/components/EnlightHeader'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { TrigGraphExplorer } from '@/features/explorers/TrigGraphExplorer'

export function DemoPage() {
  return (
    <div className="enlight-app">
      <EnlightHeader />
      <section className="enlight-trig-demo enlight-container">
        <EnlightSectionLabel>Live demo — no login needed</EnlightSectionLabel>
        <h2 className="enlight-heading-serif" style={{ textAlign: 'center', marginBottom: 12 }}>
          Play with a real interactive graph
        </h2>
        <p className="enlight-hero-sub" style={{ marginBottom: 40 }}>
          Adjust amplitude, period, phase, and vertical shift. See how the equation and graph change in
          real time — the same engine used in our Add Maths lessons.
        </p>
        <div className="enlight-trig-card">
          <TrigGraphExplorer />
        </div>
      </section>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
