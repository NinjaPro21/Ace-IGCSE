import { useEffect } from 'react'
import { masteryEngine } from './MasteryEngine'
import { isStudyPaused } from './studySession'

/**
 * Tracks time spent and visits while a chapter lesson or quiz is open.
 *
 * Pass `countDailyStudy: false` on pages that also run `useTopicSession`,
 * otherwise the same wall-clock minutes are credited to the daily study goal
 * twice.
 */
export function useChapterSession(chapterId: string, countDailyStudy = true): void {
  useEffect(() => {
    if (!chapterId) return

    masteryEngine.recordChapterVisit(chapterId)
    masteryEngine.notify()

    // Credit actual elapsed time since the last credit point. lastCredit
    // advances even while paused so AFK gaps are never credited later.
    let lastCredit = Date.now()
    const interval = setInterval(() => {
      const now = Date.now()
      if (!isStudyPaused()) {
        const seconds = Math.round((now - lastCredit) / 1000)
        if (seconds > 0) {
          masteryEngine.addChapterTime(chapterId, seconds, countDailyStudy)
          masteryEngine.notify()
        }
      }
      lastCredit = now
    }, 30000)

    return () => {
      clearInterval(interval)
      if (isStudyPaused()) return
      const remainder = Math.round((Date.now() - lastCredit) / 1000)
      if (remainder > 0) {
        masteryEngine.addChapterTime(chapterId, remainder, countDailyStudy)
        masteryEngine.notify()
      }
    }
  }, [chapterId, countDailyStudy])
}
