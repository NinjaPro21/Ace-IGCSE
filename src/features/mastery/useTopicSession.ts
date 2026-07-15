import { useEffect } from 'react'
import { masteryEngine } from './MasteryEngine'
import { isStudyPaused } from './studySession'

/** Tracks active study time on a single topic lesson page. */
export function useTopicSession(topicId: string): void {
  useEffect(() => {
    if (!topicId) return

    // Credit actual elapsed time since the last credit point. lastCredit
    // advances even while paused so AFK gaps are never credited later.
    let lastCredit = Date.now()
    const interval = setInterval(() => {
      const now = Date.now()
      if (!isStudyPaused()) {
        const seconds = Math.round((now - lastCredit) / 1000)
        if (seconds > 0) {
          masteryEngine.addTopicTime(topicId, seconds)
          masteryEngine.notify()
        }
      }
      lastCredit = now
    }, 10000)

    return () => {
      clearInterval(interval)
      if (isStudyPaused()) return
      const remainder = Math.round((Date.now() - lastCredit) / 1000)
      if (remainder > 0) {
        masteryEngine.addTopicTime(topicId, remainder)
        masteryEngine.notify()
      }
    }
  }, [topicId])
}
