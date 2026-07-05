import { useState } from 'react'
import { analyticsConsentPending, setAnalyticsConsent } from '@/lib/analyticsConsent'
import { initAnalyticsIfConsented } from '@/lib/firebase'

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => analyticsConsentPending())

  if (!visible) return null

  const accept = () => {
    setAnalyticsConsent(true)
    void initAnalyticsIfConsented()
    setVisible(false)
  }

  const decline = () => {
    setAnalyticsConsent(false)
    setVisible(false)
  }

  return (
    <div className="enlight-cookie-banner" role="dialog" aria-label="Cookie preferences">
      <p className="enlight-cookie-banner__text">
        We use anonymous analytics to improve Project Enlight. No personal study data is sold or shared.
      </p>
      <div className="enlight-cookie-banner__actions">
        <button type="button" className="enlight-cookie-banner__accept" onClick={accept}>
          Accept
        </button>
        <button type="button" className="enlight-cookie-banner__decline" onClick={decline}>
          Decline
        </button>
      </div>
    </div>
  )
}
