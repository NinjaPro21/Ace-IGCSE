import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Difficulty } from '@/lib/contentTypes'
import { masteryEngine, type MasteryLevel, type UserProgress } from './MasteryEngine'

interface MasteryContextValue {
  progress: UserProgress
  globalLevel: number
  isNotesRead: (topicId: string) => boolean
  getChapterQuizLevel: (chapterId: string) => MasteryLevel
  areChapterNotesComplete: (chapterId: string) => boolean
  shouldShowChapterPopout: (chapterId: string) => boolean
  markChapterPopoutSeen: (chapterId: string) => void
  canTakeChapterQuiz: (chapterId: string, difficulty: Difficulty) => boolean
  markNotesRead: (topicId: string, chapterId: string) => boolean
  recordChapterQuizResult: (
    chapterId: string,
    difficulty: Difficulty,
    scorePercent: number,
    passed: boolean,
  ) => void
  getTopicNotesReadMap: () => Record<string, boolean>
  refresh: () => void
}

const MasteryContext = createContext<MasteryContextValue | null>(null)

export function MasteryProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => masteryEngine.getState())

  const refresh = useCallback(() => {
    setProgress({ ...masteryEngine.getState() })
  }, [])

  useEffect(() => {
    return masteryEngine.subscribe(refresh)
  }, [refresh])

  const value = useMemo<MasteryContextValue>(
    () => ({
      progress,
      globalLevel: masteryEngine.getGlobalLevel(),
      isNotesRead: (id) => masteryEngine.isNotesRead(id),
      getChapterQuizLevel: (id) => masteryEngine.getChapterQuizLevel(id),
      areChapterNotesComplete: (id) => masteryEngine.areChapterNotesComplete(id),
      shouldShowChapterPopout: (id) => masteryEngine.shouldShowChapterPopout(id),
      markChapterPopoutSeen: (id) => {
        masteryEngine.markChapterPopoutSeen(id)
        masteryEngine.notify()
      },
      canTakeChapterQuiz: (id, d) => masteryEngine.canTakeChapterQuiz(id, d),
      markNotesRead: (topicId, chapterId) => {
        const chapterJustCompleted = masteryEngine.markNotesRead(topicId, chapterId)
        masteryEngine.notify()
        return chapterJustCompleted
      },
      recordChapterQuizResult: (id, d, score, passed) => {
        masteryEngine.recordChapterQuizResult(id, d, score, passed)
        masteryEngine.notify()
      },
      getTopicNotesReadMap: () => masteryEngine.getTopicNotesReadMap(),
      refresh,
    }),
    [progress, refresh],
  )

  return <MasteryContext.Provider value={value}>{children}</MasteryContext.Provider>
}

export function useMastery(): MasteryContextValue {
  const ctx = useContext(MasteryContext)
  if (!ctx) throw new Error('useMastery must be used within MasteryProvider')
  return ctx
}
