import type { UserProgress } from '@/features/mastery/MasteryEngine'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import {
  emptyPlatformStats,
  type PlatformStats,
} from './platformStatsTypes'
import { computeStudyMetrics } from './studyMetrics'

export type { PlatformStats } from './platformStatsTypes'

const DEFAULT_PLATFORM_STATS = emptyPlatformStats()

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

function numMap(v: unknown): Record<string, number> {
  if (!v || typeof v !== 'object') return {}
  const out: Record<string, number> = {}
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === 'number' && Number.isFinite(val)) out[k] = val
  }
  return out
}

/** Admin-only read — client never writes platform stats (see firestore.rules). */
export async function fetchPlatformStats(): Promise<PlatformStats> {
  if (!db) return { ...DEFAULT_PLATFORM_STATS }

  try {
    const snap = await getDoc(doc(db, 'platformStats', 'summary'))
    if (!snap.exists()) return { ...DEFAULT_PLATFORM_STATS }

    const data = snap.data()
    const base = emptyPlatformStats()
    return {
      ...base,
      totalSignUps: num(data.totalSignUps),
      totalStudySeconds: num(data.totalStudySeconds),
      totalQuizAttempts: num(data.totalQuizAttempts),
      updatedAt: data.updatedAt?.toDate?.() ?? null,
      dailyActiveUsers: num(data.dailyActiveUsers),
      weeklyActiveUsers: num(data.weeklyActiveUsers),
      returningUsers: num(data.returningUsers),
      averageSessionDurationSeconds: num(data.averageSessionDurationSeconds),
      totalSessions: num(data.totalSessions),
      sessionsPerUserAverage: num(data.sessionsPerUserAverage),
      dropOffAfterFirstSession: num(data.dropOffAfterFirstSession),
      studySecondsBySubject: {
        ...base.studySecondsBySubject,
        ...numMap(data.studySecondsBySubject),
      } as PlatformStats['studySecondsBySubject'],
      studySecondsByHourOfDay: {
        ...base.studySecondsByHourOfDay,
        ...numMap(data.studySecondsByHourOfDay),
      },
      studySecondsByDayOfWeek: {
        ...base.studySecondsByDayOfWeek,
        ...numMap(data.studySecondsByDayOfWeek),
      } as PlatformStats['studySecondsByDayOfWeek'],
      averageStudySessionLengthSeconds: num(data.averageStudySessionLengthSeconds),
      peakStudyHour: num(data.peakStudyHour),
      peakStudyDay: (data.peakStudyDay as PlatformStats['peakStudyDay']) ?? '',
      topicViewCounts: numMap(data.topicViewCounts),
      topicCompletionCounts: numMap(data.topicCompletionCounts),
      topicCompletionRates: numMap(data.topicCompletionRates),
      mostRevisitedTopics: Array.isArray(data.mostRevisitedTopics)
        ? (data.mostRevisitedTopics as string[])
        : [],
      notesReadCounts: numMap(data.notesReadCounts),
      chapterCompletionCounts: numMap(data.chapterCompletionCounts),
      subjectEngagementRatio: {
        ...base.subjectEngagementRatio,
        ...numMap(data.subjectEngagementRatio),
      } as PlatformStats['subjectEngagementRatio'],
      quizAttemptsBySubject: {
        ...base.quizAttemptsBySubject,
        ...numMap(data.quizAttemptsBySubject),
      } as PlatformStats['quizAttemptsBySubject'],
      quizAverageScoreBySubject: {
        ...base.quizAverageScoreBySubject,
        ...numMap(data.quizAverageScoreBySubject),
      } as PlatformStats['quizAverageScoreBySubject'],
      quizPassRateBySubject: {
        ...base.quizPassRateBySubject,
        ...numMap(data.quizPassRateBySubject),
      } as PlatformStats['quizPassRateBySubject'],
      quizAverageScoreByTopic: numMap(data.quizAverageScoreByTopic),
      quizRetakeRate: num(data.quizRetakeRate),
      quizScoreDistribution: {
        ...base.quizScoreDistribution,
        ...numMap(data.quizScoreDistribution),
      } as PlatformStats['quizScoreDistribution'],
      firstAttemptPassRate: num(data.firstAttemptPassRate),
      averageAttemptsBeforePass: num(data.averageAttemptsBeforePass),
      totalXpAwarded: num(data.totalXpAwarded),
      xpBySource: {
        ...base.xpBySource,
        ...numMap(data.xpBySource),
      } as PlatformStats['xpBySource'],
      averageXpPerUser: num(data.averageXpPerUser),
      streakDistribution: {
        ...base.streakDistribution,
        ...numMap(data.streakDistribution),
      } as PlatformStats['streakDistribution'],
      usersWithActiveStreak: num(data.usersWithActiveStreak),
      averageStreakLength: num(data.averageStreakLength),
      leaderboardParticipationRate: num(data.leaderboardParticipationRate),
      day1RetentionRate: num(data.day1RetentionRate),
      day7RetentionRate: num(data.day7RetentionRate),
      day30RetentionRate: num(data.day30RetentionRate),
      averageDaysBetweenSessions: num(data.averageDaysBetweenSessions),
      churnedUsers: num(data.churnedUsers),
      reactivatedUsers: num(data.reactivatedUsers),
      signUpsByDay: numMap(data.signUpsByDay),
      signUpsByReferralSource: {
        ...base.signUpsByReferralSource,
        ...numMap(data.signUpsByReferralSource),
      } as PlatformStats['signUpsByReferralSource'],
    }
  } catch {
    return { ...DEFAULT_PLATFORM_STATS }
  }
}

export async function recordPlatformSync(
  _userId: string,
  progress: UserProgress,
): Promise<{ syncedStudySec: number; syncedQuizAttempts: number }> {
  const m = computeStudyMetrics(progress)
  return { syncedStudySec: m.totalStudySec, syncedQuizAttempts: m.quizAttempts }
}
