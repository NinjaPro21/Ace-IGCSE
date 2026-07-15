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
import { trackChapterNotesComplete, trackEvent, trackLevelUp, trackQuizComplete } from '@/lib/analytics'
import { getChapter } from '@/lib/contentLoader'
import { masteryEngine, type MasteryLevel, type UserProgress } from './MasteryEngine'
import type { QuizMistakeLogResult, RecordQuizFinishInput } from '@/features/quiz/quizAttemptTypes'
import { NOTES_MIN_SECONDS, XP_REWARDS } from './levelSystem'
import type { Achievement, ActivityStats, StreakDay } from './progressStats'
import type { LevelProfile } from './levelSystem'
import type { DailyQuestState } from './dailyQuests'
import { useAuth } from '@/features/social/AuthContext'

interface MasteryContextValue {
  progress: UserProgress
  globalLevel: number
  levelProfile: LevelProfile
  activityStats: ActivityStats
  achievements: Achievement[]
  streakCalendar: StreakDay[]
  streakAtRisk: boolean
  dailyQuests: DailyQuestState | undefined
  isNotesRead: (topicId: string) => boolean
  getTopicTimeSpent: (topicId: string) => number
  hasTopicStudyTime: (topicId: string) => boolean
  notesMinSeconds: number
  getChapterQuizLevel: (chapterId: string) => MasteryLevel
  areChapterNotesComplete: (chapterId: string) => boolean
  shouldShowChapterPopout: (chapterId: string) => boolean
  markChapterPopoutSeen: (chapterId: string) => void
  canTakeChapterQuiz: (chapterId: string, difficulty: Difficulty) => boolean
  getTopicQuizLevel: (topicId: string) => MasteryLevel
  canTakeTopicQuiz: (topicId: string, difficulty: Difficulty) => boolean
  markNotesRead: (topicId: string, chapterId: string) => boolean
  recordChapterQuizResult: (
    chapterId: string,
    difficulty: Difficulty,
    scorePercent: number,
    passed: boolean,
  ) => number
  recordTopicQuizResult: (
    topicId: string,
    chapterId: string,
    difficulty: Difficulty,
    scorePercent: number,
    passed: boolean,
  ) => number
  recordQuizFinish: (input: RecordQuizFinishInput) => QuizMistakeLogResult
  setDisplayName: (name: string) => void
  getTopicNotesReadMap: () => Record<string, boolean>
  refresh: () => void
}

const MasteryContext = createContext<MasteryContextValue | null>(null)

export function MasteryProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => masteryEngine.getState())
  const { user } = useAuth()
  const uid = user?.id

  const refresh = useCallback(() => {
    setProgress({ ...masteryEngine.getState() })
  }, [])

  useEffect(() => {
    return masteryEngine.subscribe(refresh)
  }, [refresh])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (masteryEngine.checkStreakExpiry()) refresh()
    }, 60000)
    return () => window.clearInterval(id)
  }, [refresh])

  useEffect(() => {
    const onLevelUp = (e: Event) => {
      const level = (e as CustomEvent<{ level: number }>).detail?.level
      if (level) trackLevelUp(level, uid)
    }
    window.addEventListener('enlight-level-up', onLevelUp)
    return () => window.removeEventListener('enlight-level-up', onLevelUp)
  }, [uid])

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
  const canTakeTopicQuiz = useCallback(
    (id: string, d: Difficulty) => masteryEngine.canTakeTopicQuiz(id, d),
    [],
  )
  const getTopicQuizLevel = useCallback((id: string) => masteryEngine.getTopicQuizLevel(id), [])
  const markNotesRead = useCallback(
    (topicId: string, chapterId: string) => {
      const beforeStreak = masteryEngine.getState().streakDays
      const wasRead = masteryEngine.isNotesRead(topicId)
      const chapterJustCompleted = masteryEngine.markNotesRead(topicId, chapterId)
      const after = masteryEngine.getState()
      const newlyRead = !wasRead && masteryEngine.isNotesRead(topicId)
      try {
        if (newlyRead) {
          trackEvent(
            'notes_read',
            { topicId, chapterId, subjectId: getChapter(chapterId)?.subjectId },
            { uid },
          )
          trackEvent(
            'xp_awarded',
            { amount: XP_REWARDS.notesRead, source: 'notes', topicId, chapterId },
            { uid },
          )
        }
        if (chapterJustCompleted) {
          trackChapterNotesComplete(chapterId, uid)
          trackEvent('chapter_completed', { chapterId }, { uid })
        }
        if (newlyRead && (after.streakDays !== beforeStreak || after.streakDays > 0)) {
          trackEvent(
            'streak_updated',
            { currentStreak: after.streakDays, longestStreak: after.longestStreak },
            { uid },
          )
        }
      } catch {
        // analytics silent
      }
      masteryEngine.notify()
      return chapterJustCompleted
    },
    [uid],
  )
  const recordChapterQuizResult = useCallback(
    (id: string, d: Difficulty, score: number, passed: boolean) => {
      const beforeStreak = masteryEngine.getState().streakDays
      const priorAttempts =
        masteryEngine.getState().quizAttempts?.filter((a) => a.chapterId === id).length ?? 0
      const xpGain = masteryEngine.recordChapterQuizResult(id, d, score, passed)
      const subjectId = getChapter(id)?.subjectId
      const after = masteryEngine.getState()
      try {
        trackQuizComplete(id, d, score, passed, {
          uid,
          subjectId,
          attemptNumber: priorAttempts + 1,
        })
        if (xpGain > 0) {
          trackEvent(
            'xp_awarded',
            { amount: xpGain, source: 'quiz', chapterId: id, subjectId },
            { uid },
          )
        }
        if (passed && after.streakDays !== beforeStreak) {
          trackEvent(
            'streak_updated',
            { currentStreak: after.streakDays, longestStreak: after.longestStreak },
            { uid },
          )
        }
      } catch {
        // analytics silent
      }
      if (passed) {
        window.dispatchEvent(
          new CustomEvent('enlight-quiz-pass', { detail: { tier: d, xp: xpGain } }),
        )
      }
      masteryEngine.notify()
      return xpGain
    },
    [uid],
  )
  const recordTopicQuizResult = useCallback(
    (topicId: string, chapterId: string, d: Difficulty, score: number, passed: boolean) => {
      const beforeStreak = masteryEngine.getState().streakDays
      const priorAttempts =
        masteryEngine
          .getState()
          .quizAttempts?.filter((a) => a.topicId === topicId || a.chapterId === chapterId).length ?? 0
      const xpGain = masteryEngine.recordTopicQuizResult(topicId, chapterId, d, score, passed)
      const subjectId = getChapter(chapterId)?.subjectId
      const after = masteryEngine.getState()
      try {
        trackQuizComplete(chapterId, d, score, passed, {
          uid,
          subjectId,
          topicId,
          attemptNumber: priorAttempts + 1,
        })
        if (xpGain > 0) {
          trackEvent(
            'xp_awarded',
            { amount: xpGain, source: 'quiz', topicId, chapterId, subjectId },
            { uid },
          )
        }
        if (passed && after.streakDays !== beforeStreak) {
          trackEvent(
            'streak_updated',
            { currentStreak: after.streakDays, longestStreak: after.longestStreak },
            { uid },
          )
        }
      } catch {
        // analytics silent
      }
      if (passed) {
        window.dispatchEvent(
          new CustomEvent('enlight-quiz-pass', { detail: { tier: d, xp: xpGain } }),
        )
      }
      masteryEngine.notify()
      return xpGain
    },
    [uid],
  )
  const recordQuizFinish = useCallback((input: RecordQuizFinishInput) => {
    const result = masteryEngine.recordQuizFinish(input)
    masteryEngine.notify()
    return result
  }, [])
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
      dailyQuests: progress.dailyQuests,
      isNotesRead,
      getTopicTimeSpent,
      hasTopicStudyTime,
      notesMinSeconds: NOTES_MIN_SECONDS,
      getChapterQuizLevel,
      areChapterNotesComplete,
      shouldShowChapterPopout,
      markChapterPopoutSeen,
      canTakeChapterQuiz,
      getTopicQuizLevel,
      canTakeTopicQuiz,
      markNotesRead,
      recordChapterQuizResult,
      recordTopicQuizResult,
      recordQuizFinish,
      setDisplayName,
      getTopicNotesReadMap,
      refresh,
    }),
    [progress, isNotesRead, getTopicTimeSpent, hasTopicStudyTime, getChapterQuizLevel, areChapterNotesComplete, shouldShowChapterPopout, markChapterPopoutSeen, canTakeChapterQuiz, getTopicQuizLevel, canTakeTopicQuiz, markNotesRead, recordChapterQuizResult, recordTopicQuizResult, recordQuizFinish, setDisplayName, getTopicNotesReadMap, refresh],
  )

  return <MasteryContext.Provider value={value}>{children}</MasteryContext.Provider>
}

export function useMastery(): MasteryContextValue {
  const ctx = useContext(MasteryContext)
  if (!ctx) throw new Error('useMastery must be used within MasteryProvider')
  return ctx
}
