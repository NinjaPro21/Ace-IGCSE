const CONSENT_KEY = 'enlight-analytics-consent'

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

export function setAnalyticsConsent(accepted: boolean): void {
  try {
    if (accepted) {
      localStorage.setItem(CONSENT_KEY, 'accepted')
    } else {
      localStorage.setItem(CONSENT_KEY, 'declined')
    }
  } catch {
    // ignore
  }
}

export function analyticsConsentPending(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === null
  } catch {
    return false
  }
}
