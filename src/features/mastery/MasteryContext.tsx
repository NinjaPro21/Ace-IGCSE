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

  const isNotesRead = useCallback((id: string) => masteryEngine.isNotesRead(id), [])
  const getChapterQuizLevel = useCallback((id: string) => masteryEngine.getChapterQuizLevel(id), [])
  const areChapterNotesComplete = useCallback(
    (id: string) => masteryEngine.areChapterNotesComplete(id),
    [],
  )
  const shouldShowChapterPopout = useCallback(
    (id: string) => masteryEngine.shouldShowChapterPopout(id),
    [],
  )
  const markChapterPopoutSeen = useCallback((id: string) => {
    masteryEngine.markChapterPopoutSeen(id)
    masteryEngine.notify()
  }, [])
  const canTakeChapterQuiz = useCallback(
    (id: string, d: Difficulty) => masteryEngine.canTakeChapterQuiz(id, d),
    [],
  )
  const markNotesRead = useCallback(
    (topicId: string, chapterId: string) => {
      const chapterJustCompleted = masteryEngine.markNotesRead(topicId, chapterId)
      masteryEngine.notify()
      return chapterJustCompleted
    },
    [],
  )
  const recordChapterQuizResult = useCallback(
    (id: string, d: Difficulty, score: number, passed: boolean) => {
      masteryEngine.recordChapterQuizResult(id, d, score, passed)
      masteryEngine.notify()
    },
    [],
  )
  const getTopicNotesReadMap = useCallback(
    () => masteryEngine.getTopicNotesReadMap(),
    [],
  )

  const value = useMemo<MasteryContextValue>(
    () => ({
      progress,
      globalLevel: masteryEngine.getGlobalLevel(),
      isNotesRead,
      getChapterQuizLevel,
      areChapterNotesComplete,
      shouldShowChapterPopout,
      markChapterPopoutSeen,
      canTakeChapterQuiz,
      markNotesRead,
      recordChapterQuizResult,
      getTopicNotesReadMap,
      refresh,
    }),
    [progress, isNotesRead, getChapterQuizLevel, areChapterNotesComplete, shouldShowChapterPopout, markChapterPopoutSeen, canTakeChapterQuiz, markNotesRead, recordChapterQuizResult, getTopicNotesReadMap, refresh],
  )

  return <MasteryContext.Provider value={value}>{children}</MasteryContext.Provider>
}

export function useMastery(): MasteryContextValue {
  const ctx = useContext(MasteryContext)
  if (!ctx) throw new Error('useMastery must be used within MasteryProvider')
  return ctx
}
