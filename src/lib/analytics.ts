import { logEvent } from 'firebase/analytics'
import { analytics } from './firebase'

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!analytics) return
  try {
    logEvent(analytics, name, params)
  } catch {
    // Analytics unavailable (e.g. blocked by browser)
  }
}

export function trackSignIn(method: string): void {
  trackEvent('login', { method })
}

export function trackQuizComplete(
  chapterId: string,
  difficulty: string,
  scorePercent: number,
  passed: boolean,
): void {
  trackEvent('quiz_complete', {
    chapter_id: chapterId,
    difficulty,
    score: scorePercent,
    passed,
  })
}

export function trackChapterNotesComplete(chapterId: string): void {
  trackEvent('chapter_notes_complete', { chapter_id: chapterId })
}

export function trackLevelUp(level: number): void {
  trackEvent('level_up', { level })
}
