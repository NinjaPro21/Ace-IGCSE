import { useEffect } from 'react'
import { masteryEngine } from './MasteryEngine'
import { isStudyPaused } from './studySession'

/** Tracks active study time on a single topic lesson page. */
export function useTopicSession(topicId: string): void {
  useEffect(() => {
    if (!topicId) return

    const started = Date.now()
    const interval = setInterval(() => {
      if (isStudyPaused()) return
      masteryEngine.addTopicTime(topicId, 10)
      masteryEngine.notify()
    }, 10000)

    return () => {
      clearInterval(interval)
      if (isStudyPaused()) return
      const elapsedSec = Math.max(1, Math.round((Date.now() - started) / 1000))
      const remainder = elapsedSec % 10
      if (remainder > 0) masteryEngine.addTopicTime(topicId, remainder)
      masteryEngine.notify()
    }
  }, [topicId])
}
