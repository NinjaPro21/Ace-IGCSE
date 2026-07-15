const USAGE_KEY_PREFIX = 'ace-usage-ms'
const SKIP_KEY_PREFIX = 'ace-review-skipped-at'
const SUBMITTED_KEY_PREFIX = 'ace-review-submitted'

export const FIRST_REVIEW_PROMPT_MS = 60 * 60 * 1000
export const REVIEW_SKIP_RETRY_MS = 30 * 60 * 1000

function usageKey(uid: string): string {
  return `${USAGE_KEY_PREFIX}-${uid}`
}

function skipKey(uid: string): string {
  return `${SKIP_KEY_PREFIX}-${uid}`
}

function submittedKey(uid: string): string {
  return `${SUBMITTED_KEY_PREFIX}-${uid}`
}

export function getAccumulatedUsageMs(uid: string): number {
  try {
    const raw = localStorage.getItem(usageKey(uid))
    return raw ? Math.max(0, parseInt(raw, 10)) : 0
  } catch {
    return 0
  }
}

export function addUsageMs(uid: string, deltaMs: number): number {
  const next = getAccumulatedUsageMs(uid) + deltaMs
  try {
    localStorage.setItem(usageKey(uid), String(next))
  } catch {
    // ignore quota errors
  }
  return next
}

export function getReviewSkippedAt(uid: string): number | null {
  try {
    const raw = localStorage.getItem(skipKey(uid))
    return raw ? parseInt(raw, 10) : null
  } catch {
    return null
  }
}

export function markReviewSkipped(uid: string): void {
  try {
    localStorage.setItem(skipKey(uid), String(Date.now()))
  } catch {
    // ignore
  }
}

export function isReviewSubmittedLocally(uid: string): boolean {
  try {
    return localStorage.getItem(submittedKey(uid)) === '1'
  } catch {
    return false
  }
}

export function markReviewSubmittedLocally(uid: string): void {
  try {
    localStorage.setItem(submittedKey(uid), '1')
    localStorage.removeItem(skipKey(uid))
  } catch {
    // ignore
  }
}

export function shouldShowReviewPrompt(
  uid: string,
  remoteSubmitted: boolean,
): boolean {
  if (remoteSubmitted || isReviewSubmittedLocally(uid)) return false
  if (getAccumulatedUsageMs(uid) < FIRST_REVIEW_PROMPT_MS) return false
  const skippedAt = getReviewSkippedAt(uid)
  if (!skippedAt) return true
  return Date.now() - skippedAt >= REVIEW_SKIP_RETRY_MS
}
