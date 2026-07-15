import { FirebaseError } from 'firebase/app'

const FIREBASE_MESSAGES: Record<string, string> = {
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Try again when you are ready.',
  'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.',
  'auth/cancelled-popup-request': 'Sign-in was interrupted. Please try again.',
  'auth/network-request-failed': 'Network error — check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Wait a minute and try again.',
  'auth/user-disabled': 'This account has been disabled. Contact your school admin for help.',
  'auth/operation-not-allowed': 'Sign-in is not available right now. Try again later.',
  'auth/unauthorized-domain': 'This site domain is not authorized for sign-in yet. Try again in a minute or contact support.',
  'permission-denied': 'You do not have permission to do that. Sign in again or contact support.',
  'unavailable': 'The service is temporarily unavailable. Try again in a moment.',
  'failed-precondition': 'That action could not be completed. Refresh the page and try again.',
  'not-found': 'We could not find what you were looking for. It may have been removed.',
  'already-exists': 'That already exists — try a different name or code.',
  'resource-exhausted': 'Too many requests. Wait a moment and try again.',
}

export function friendlyErrorMessage(err: unknown, fallback = 'Something went wrong. Try again.'): string {
  if (err instanceof FirebaseError) {
    return FIREBASE_MESSAGES[err.code] ?? fallback
  }
  if (err instanceof Error) {
    const msg = err.message.trim()
    if (msg.startsWith('Firebase:') || msg.startsWith('auth/')) {
      const code = msg.match(/\(([^)]+)\)/)?.[1]
      if (code && FIREBASE_MESSAGES[code]) return FIREBASE_MESSAGES[code]
    }
    if (/permission/i.test(msg)) return FIREBASE_MESSAGES['permission-denied']
    if (/network/i.test(msg)) return FIREBASE_MESSAGES['auth/network-request-failed']
    return msg.length > 0 && msg.length < 120 ? msg : fallback
  }
  return fallback
}
