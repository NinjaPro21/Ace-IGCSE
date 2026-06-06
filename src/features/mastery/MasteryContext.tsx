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
  getTopicLevel: (topicId: string) => MasteryLevel
  getChecklistCount: (topicId: string) => number
  canTakeQuiz: (topicId: string, difficulty: Difficulty) => boolean
  markNotesRead: (topicId: string) => void
  recordQuizResult: (
    topicId: string,
    difficulty: Difficulty,
    scorePercent: number,
    passed: boolean,
  ) => void
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
      getTopicLevel: (id) => masteryEngine.getTopicLevel(id),
      getChecklistCount: (id) => masteryEngine.getChecklistCount(id),
      canTakeQuiz: (id, d) => masteryEngine.canTakeQuiz(id, d),
      markNotesRead: (id) => {
        masteryEngine.markNotesRead(id)
        masteryEngine.notify()
      },
      recordQuizResult: (id, d, score, passed) => {
        masteryEngine.recordQuizResult(id, d, score, passed)
        masteryEngine.notify()
      },
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
