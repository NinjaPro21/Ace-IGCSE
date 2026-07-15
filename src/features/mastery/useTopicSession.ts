import { useEffect } from 'react'
import { useAuth } from '@/features/social/AuthContext'
import { trackEvent } from '@/lib/analytics'
import { masteryEngine } from './MasteryEngine'
import { isStudyPaused } from './studySession'

const FLUSH_EVERY_MS = 60_000

/** Tracks active study time on a single topic lesson page. */
export function useTopicSession(topicId: string, subjectId?: string): void {
  const { user } = useAuth()
  const uid = user?.id

  useEffect(() => {
    if (!topicId) return

    // Credit actual elapsed time since the last credit point. lastCredit
    // advances even while paused so AFK gaps are never credited later.
    let lastCredit = Date.now()
    let pendingAnalyticsSec = 0
    let lastAnalyticsFlush = Date.now()

    const flushAnalytics = (force = false) => {
      if (!uid || pendingAnalyticsSec <= 0) return
      const now = Date.now()
      if (!force && now - lastAnalyticsFlush < FLUSH_EVERY_MS) return
      const seconds = pendingAnalyticsSec
      pendingAnalyticsSec = 0
      lastAnalyticsFlush = now
      trackEvent(
        'study_time_credited',
        { seconds, topicId, subjectId, subject: subjectId },
        { uid },
      )
    }

    const interval = setInterval(() => {
      const now = Date.now()
      if (!isStudyPaused()) {
        const seconds = Math.round((now - lastCredit) / 1000)
        if (seconds > 0) {
          masteryEngine.addTopicTime(topicId, seconds)
          masteryEngine.notify()
          pendingAnalyticsSec += seconds
          flushAnalytics(false)
        }
      }
      lastCredit = now
    }, 10000)

    return () => {
      clearInterval(interval)
      if (!isStudyPaused()) {
        const remainder = Math.round((Date.now() - lastCredit) / 1000)
        if (remainder > 0) {
          masteryEngine.addTopicTime(topicId, remainder)
          masteryEngine.notify()
          pendingAnalyticsSec += remainder
        }
      }
      flushAnalytics(true)
    }
  }, [topicId, subjectId, uid])
}
