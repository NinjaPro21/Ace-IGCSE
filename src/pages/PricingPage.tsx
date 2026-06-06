import { EnlightHeader } from '@/components/EnlightHeader'
import { EnlightCard, EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightButton } from '@/components/EnlightButton'

export function PricingPage() {
  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-container enlight-page-padding" style={{ textAlign: 'center' }}>
        <EnlightSectionLabel>Pricing</EnlightSectionLabel>
        <h2 className="enlight-heading-serif">Full access coming soon</h2>
        <p className="enlight-hero-sub">
          Explore the live demo and pilot chapters free. Paid plans will unlock all subjects and chapters.
        </p>
        <div style={{ maxWidth: 400, margin: '32px auto' }}>
          <EnlightCard>
            <p className="enlight-body-text">Single subject · All chapters · Mastery tracking</p>
            <div style={{ marginTop: 16 }}>
              <EnlightButton to="/demo">Try demo first</EnlightButton>
            </div>
          </EnlightCard>
        </div>
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
