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
import { trackChapterNotesComplete, trackLevelUp, trackQuizComplete } from '@/lib/analytics'
import { masteryEngine, type MasteryLevel, type UserProgress } from './MasteryEngine'
import { NOTES_MIN_SECONDS } from './levelSystem'
import type { Achievement, ActivityStats, StreakDay } from './progressStats'
import type { LevelProfile } from './levelSystem'

interface MasteryContextValue {
  progress: UserProgress
  globalLevel: number
  levelProfile: LevelProfile
  activityStats: ActivityStats
  achievements: Achievement[]
  streakCalendar: StreakDay[]
  streakAtRisk: boolean
  isNotesRead: (topicId: string) => boolean
  getTopicTimeSpent: (topicId: string) => number
  hasTopicStudyTime: (topicId: string) => boolean
  notesMinSeconds: number
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
  ) => number
  setDisplayName: (name: string) => void
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

  useEffect(() => {
    const onLevelUp = (e: Event) => {
      const level = (e as CustomEvent<{ level: number }>).detail?.level
      if (level) trackLevelUp(level)
    }
    window.addEventListener('enlight-level-up', onLevelUp)
    return () => window.removeEventListener('enlight-level-up', onLevelUp)
  }, [])

  const isNotesRead = useCallback((id: string) => masteryEngine.isNotesRead(id), [])
  const getTopicTimeSpent = useCallback((id: string) => masteryEngine.getTopicTimeSpent(id), [])
  const hasTopicStudyTime = useCallback((id: string) => masteryEngine.hasTopicStudyTime(id), [])
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
      if (chapterJustCompleted) trackChapterNotesComplete(chapterId)
      masteryEngine.notify()
      return chapterJustCompleted
    },
    [],
  )
  const recordChapterQuizResult = useCallback(
    (id: string, d: Difficulty, score: number, passed: boolean) => {
      const xpGain = masteryEngine.recordChapterQuizResult(id, d, score, passed)
      trackQuizComplete(id, d, score, passed)
      masteryEngine.notify()
      return xpGain
    },
    [],
  )
  const setDisplayName = useCallback((name: string) => {
    masteryEngine.setDisplayName(name)
    masteryEngine.notify()
  }, [])
  const getTopicNotesReadMap = useCallback(
    () => masteryEngine.getTopicNotesReadMap(),
    [],
  )

  const value = useMemo<MasteryContextValue>(
    () => ({
      progress,
      globalLevel: masteryEngine.getGlobalLevel(),
      levelProfile: masteryEngine.getLevelProfile(),
      activityStats: masteryEngine.getActivityStats(),
      achievements: masteryEngine.getAchievements(),
      streakCalendar: masteryEngine.getStreakCalendar(),
      streakAtRisk: masteryEngine.isStreakAtRisk(),
      isNotesRead,
      getTopicTimeSpent,
      hasTopicStudyTime,
      notesMinSeconds: NOTES_MIN_SECONDS,
      getChapterQuizLevel,
      areChapterNotesComplete,
      shouldShowChapterPopout,
      markChapterPopoutSeen,
      canTakeChapterQuiz,
      markNotesRead,
      recordChapterQuizResult,
      setDisplayName,
      getTopicNotesReadMap,
      refresh,
    }),
    [progress, isNotesRead, getTopicTimeSpent, hasTopicStudyTime, getChapterQuizLevel, areChapterNotesComplete, shouldShowChapterPopout, markChapterPopoutSeen, canTakeChapterQuiz, markNotesRead, recordChapterQuizResult, setDisplayName, getTopicNotesReadMap, refresh],
  )

  return <MasteryContext.Provider value={value}>{children}</MasteryContext.Provider>
}

export function useMastery(): MasteryContextValue {
  const ctx = useContext(MasteryContext)
  if (!ctx) throw new Error('useMastery must be used within MasteryProvider')
  return ctx
}
