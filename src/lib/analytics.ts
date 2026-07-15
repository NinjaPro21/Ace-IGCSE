import { logEvent } from 'firebase/analytics'
import { hasAnalyticsConsent } from '@/lib/analyticsConsent'
import {
  updatePersonalAnalytics,
  type AnalyticsEventPayload,
} from '@/features/analytics/personalAnalytics'
import { analytics, initAnalyticsIfConsented } from './firebase'

export type TrackEventOptions = {
  /** When set, also write profiles/{uid}/analytics/learning */
  uid?: string
  /** Skip GA4 / PostHog (personal Firestore only) */
  personalOnly?: boolean
  /** Skip personal Firestore write */
  skipPersonal?: boolean
}

function toGaParams(
  params?: AnalyticsEventPayload,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    out[key] = value
  }
  return out
}

/** PostHog stub — no-op until VITE_PUBLIC_POSTHOG_KEY is set (posthog-js not installed yet). */
function capturePostHog(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined
  if (!key) return
  try {
    // Reserved for future: import('posthog-js').then(ph => ph.default.capture(name, params))
    void name
    void params
  } catch {
    // silent
  }
}

/**
 * Product + research analytics sink.
 * - GA4 (consent-gated)
 * - PostHog stub (no-op without key)
 * - Personal Firestore analytics when uid provided (consent-gated)
 * Never throws into the UI.
 */
export function trackEvent(
  name: string,
  params?: AnalyticsEventPayload,
  options?: TrackEventOptions,
): void {
  try {
    const consented = hasAnalyticsConsent()
    const gaParams = toGaParams(params)

    if (!options?.personalOnly && consented) {
      void initAnalyticsIfConsented()
      if (analytics) {
        try {
          logEvent(analytics, name, gaParams)
        } catch {
          // Analytics unavailable (e.g. blocked by browser)
        }
      }
      try {
        capturePostHog(name, gaParams)
      } catch {
        // silent
      }
    }

    if (!options?.skipPersonal && options?.uid && consented) {
      void updatePersonalAnalytics(options.uid, name, params ?? {}).catch(() => undefined)
    }
  } catch {
    // Never crash the UI for analytics
  }
}

export function trackSignIn(method: string, uid?: string): void {
  trackEvent('login', { method }, { uid })
}

export function trackQuizComplete(
  chapterId: string,
  difficulty: string,
  scorePercent: number,
  passed: boolean,
  extras?: {
    uid?: string
    subjectId?: string
    topicId?: string
    attemptNumber?: number
  },
): void {
  trackEvent(
    'quiz_complete',
    {
      chapter_id: chapterId,
      chapterId,
      difficulty,
      score: scorePercent,
      passed,
      subject: extras?.subjectId,
      subjectId: extras?.subjectId,
      topicId: extras?.topicId,
      attemptNumber: extras?.attemptNumber ?? 1,
    },
    { uid: extras?.uid },
  )
}

export function trackChapterNotesComplete(chapterId: string, uid?: string): void {
  trackEvent('chapter_notes_complete', { chapter_id: chapterId, chapterId }, { uid })
}

export function trackLevelUp(level: number, uid?: string): void {
  trackEvent('level_up', { level }, { uid })
}
