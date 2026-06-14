import { useEffect } from 'react'
import { masteryEngine } from './MasteryEngine'
import { isStudyPaused } from './studySession'

/** Tracks time spent and visits while a chapter lesson or quiz is open. */
export function useChapterSession(chapterId: string): void {
  useEffect(() => {
    if (!chapterId) return

    masteryEngine.recordChapterVisit(chapterId)
    masteryEngine.notify()

    const started = Date.now()
    const interval = setInterval(() => {
      if (isStudyPaused()) return
      masteryEngine.addChapterTime(chapterId, 30)
      masteryEngine.notify()
    }, 30000)

    return () => {
      clearInterval(interval)
      if (isStudyPaused()) return
      const elapsedSec = Math.max(1, Math.round((Date.now() - started) / 1000))
      const remainder = elapsedSec % 30
      if (remainder > 0) masteryEngine.addChapterTime(chapterId, remainder)
      masteryEngine.notify()
    }
  }, [chapterId])
}
