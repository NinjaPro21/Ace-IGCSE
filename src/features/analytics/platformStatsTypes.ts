import type { ResearchSubjectKey } from './researchSubjectKeys'
import { emptySubjectPercents, emptySubjectSeconds } from './researchSubjectKeys'

export type ReferralSource = 'discord' | 'direct' | 'other'

export type XpSource = 'quiz' | 'notes' | 'streak' | 'chapter'

export type DayOfWeekKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type ScoreBucketKey = '0-20' | '21-40' | '41-60' | '61-80' | '81-100'

export type StreakBucketKey = '1-3' | '4-7' | '8-14' | '15+'

export interface StudySessionLogEntry {
  at: string
  seconds: number
  subject?: ResearchSubjectKey
  topicId?: string
  hour?: number
  dayOfWeek?: DayOfWeekKey
}

export interface QuizScoreHistoryEntry {
  at: string
  topicId?: string
  chapterId?: string
  subject: ResearchSubjectKey
  score: number
  passed: boolean
  attemptNumber: number
}

/** Raw per-user learning patterns — clients write only this doc. */
export interface PersonalLearningAnalytics {
  createdAt: string | null
  referralSource: ReferralSource
  sessionCount: number
  totalSessionSeconds: number
  firstSessionAt: string | null
  lastSessionAt: string | null
  lastActiveDate: string | null

  totalStudySeconds: number
  studySecondsBySubject: Record<ResearchSubjectKey, number>
  studySecondsByHourOfDay: Record<string, number>
  studySecondsByDayOfWeek: Record<DayOfWeekKey, number>
  studySessionCount: number
  studySessionLog: StudySessionLogEntry[]
  subjectTimeBreakdown: Record<ResearchSubjectKey, number>

  topicsViewed: string[]
  topicViewCounts: Record<string, number>
  topicRevisitCounts: Record<string, number>
  topicCompletionCounts: Record<string, number>
  notesReadCounts: Record<string, number>
  chapterCompletionCounts: Record<string, number>

  quizAttemptsBySubject: Record<ResearchSubjectKey, number>
  quizScoreSumBySubject: Record<ResearchSubjectKey, number>
  quizPassCountBySubject: Record<ResearchSubjectKey, number>
  quizAttemptCountBySubject: Record<ResearchSubjectKey, number>
  quizScoreSumByTopic: Record<string, number>
  quizAttemptCountByTopic: Record<string, number>
  quizScoreHistory: QuizScoreHistoryEntry[]
  quizRetakeCount: number
  firstAttemptPassCount: number
  firstAttemptCount: number
  attemptsBeforePassSum: number
  passedQuizCount: number
  quizScoreBucketCounts: Record<ScoreBucketKey, number>

  totalXpAwarded: number
  xpBySource: Record<XpSource, number>
  currentStreak: number
  longestStreak: number

  /** Set by cron when user hits 14+ days inactive; cleared on return. */
  wasChurned: boolean
  reactivatedCount: number

  updatedAt?: unknown
}

export interface PlatformStats {
  totalSignUps: number
  totalStudySeconds: number
  totalQuizAttempts: number
  updatedAt: Date | null

  dailyActiveUsers: number
  weeklyActiveUsers: number
  returningUsers: number
  averageSessionDurationSeconds: number
  totalSessions: number
  sessionsPerUserAverage: number
  dropOffAfterFirstSession: number

  studySecondsBySubject: Record<ResearchSubjectKey, number>
  studySecondsByHourOfDay: Record<string, number>
  studySecondsByDayOfWeek: Record<DayOfWeekKey, number>
  averageStudySessionLengthSeconds: number
  peakStudyHour: number
  peakStudyDay: DayOfWeekKey | ''

  topicViewCounts: Record<string, number>
  topicCompletionCounts: Record<string, number>
  topicCompletionRates: Record<string, number>
  mostRevisitedTopics: string[]
  notesReadCounts: Record<string, number>
  chapterCompletionCounts: Record<string, number>
  subjectEngagementRatio: Record<ResearchSubjectKey, number>

  quizAttemptsBySubject: Record<ResearchSubjectKey, number>
  quizAverageScoreBySubject: Record<ResearchSubjectKey, number>
  quizPassRateBySubject: Record<ResearchSubjectKey, number>
  quizAverageScoreByTopic: Record<string, number>
  quizRetakeRate: number
  quizScoreDistribution: Record<ScoreBucketKey, number>
  firstAttemptPassRate: number
  averageAttemptsBeforePass: number

  totalXpAwarded: number
  xpBySource: Record<XpSource, number>
  averageXpPerUser: number
  streakDistribution: Record<StreakBucketKey, number>
  usersWithActiveStreak: number
  averageStreakLength: number
  leaderboardParticipationRate: number

  day1RetentionRate: number
  day7RetentionRate: number
  day30RetentionRate: number
  averageDaysBetweenSessions: number
  churnedUsers: number
  reactivatedUsers: number

  signUpsByDay: Record<string, number>
  signUpsByReferralSource: Record<ReferralSource, number>
}

export function emptyHourMap(): Record<string, number> {
  const m: Record<string, number> = {}
  for (let h = 0; h < 24; h++) m[String(h)] = 0
  return m
}

export function emptyDowMap(): Record<DayOfWeekKey, number> {
  return { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }
}

export function emptyScoreBuckets(): Record<ScoreBucketKey, number> {
  return { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 }
}

export function emptyStreakBuckets(): Record<StreakBucketKey, number> {
  return { '1-3': 0, '4-7': 0, '8-14': 0, '15+': 0 }
}

export function emptyXpBySource(): Record<XpSource, number> {
  return { quiz: 0, notes: 0, streak: 0, chapter: 0 }
}

export function scoreToBucket(score: number): ScoreBucketKey {
  if (score <= 20) return '0-20'
  if (score <= 40) return '21-40'
  if (score <= 60) return '41-60'
  if (score <= 80) return '61-80'
  return '81-100'
}

export function streakToBucket(days: number): StreakBucketKey {
  if (days <= 3) return '1-3'
  if (days <= 7) return '4-7'
  if (days <= 14) return '8-14'
  return '15+'
}

const DOW_KEYS: DayOfWeekKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function dayOfWeekKey(d: Date = new Date()): DayOfWeekKey {
  return DOW_KEYS[d.getDay()]!
}

export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isoWeekKey(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${date.getUTCFullYear()}-${String(weekNo).padStart(2, '0')}`
}

export function emptyPersonalLearningAnalytics(
  partial?: Partial<PersonalLearningAnalytics>,
): PersonalLearningAnalytics {
  return {
    createdAt: null,
    referralSource: 'direct',
    sessionCount: 0,
    totalSessionSeconds: 0,
    firstSessionAt: null,
    lastSessionAt: null,
    lastActiveDate: null,
    totalStudySeconds: 0,
    studySecondsBySubject: emptySubjectSeconds(),
    studySecondsByHourOfDay: emptyHourMap(),
    studySecondsByDayOfWeek: emptyDowMap(),
    studySessionCount: 0,
    studySessionLog: [],
    subjectTimeBreakdown: emptySubjectSeconds(),
    topicsViewed: [],
    topicViewCounts: {},
    topicRevisitCounts: {},
    topicCompletionCounts: {},
    notesReadCounts: {},
    chapterCompletionCounts: {},
    quizAttemptsBySubject: emptySubjectSeconds(),
    quizScoreSumBySubject: emptySubjectSeconds(),
    quizPassCountBySubject: emptySubjectSeconds(),
    quizAttemptCountBySubject: emptySubjectSeconds(),
    quizScoreSumByTopic: {},
    quizAttemptCountByTopic: {},
    quizScoreHistory: [],
    quizRetakeCount: 0,
    firstAttemptPassCount: 0,
    firstAttemptCount: 0,
    attemptsBeforePassSum: 0,
    passedQuizCount: 0,
    quizScoreBucketCounts: emptyScoreBuckets(),
    totalXpAwarded: 0,
    xpBySource: emptyXpBySource(),
    currentStreak: 0,
    longestStreak: 0,
    wasChurned: false,
    reactivatedCount: 0,
    ...partial,
  }
}

export function emptyPlatformStats(): PlatformStats {
  return {
    totalSignUps: 0,
    totalStudySeconds: 0,
    totalQuizAttempts: 0,
    updatedAt: null,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    returningUsers: 0,
    averageSessionDurationSeconds: 0,
    totalSessions: 0,
    sessionsPerUserAverage: 0,
    dropOffAfterFirstSession: 0,
    studySecondsBySubject: emptySubjectSeconds(),
    studySecondsByHourOfDay: emptyHourMap(),
    studySecondsByDayOfWeek: emptyDowMap(),
    averageStudySessionLengthSeconds: 0,
    peakStudyHour: 0,
    peakStudyDay: '',
    topicViewCounts: {},
    topicCompletionCounts: {},
    topicCompletionRates: {},
    mostRevisitedTopics: [],
    notesReadCounts: {},
    chapterCompletionCounts: {},
    subjectEngagementRatio: emptySubjectPercents(),
    quizAttemptsBySubject: emptySubjectSeconds(),
    quizAverageScoreBySubject: emptySubjectSeconds(),
    quizPassRateBySubject: emptySubjectPercents(),
    quizAverageScoreByTopic: {},
    quizRetakeRate: 0,
    quizScoreDistribution: emptyScoreBuckets(),
    firstAttemptPassRate: 0,
    averageAttemptsBeforePass: 0,
    totalXpAwarded: 0,
    xpBySource: emptyXpBySource(),
    averageXpPerUser: 0,
    streakDistribution: emptyStreakBuckets(),
    usersWithActiveStreak: 0,
    averageStreakLength: 0,
    leaderboardParticipationRate: 0,
    day1RetentionRate: 0,
    day7RetentionRate: 0,
    day30RetentionRate: 0,
    averageDaysBetweenSessions: 0,
    churnedUsers: 0,
    reactivatedUsers: 0,
    signUpsByDay: {},
    signUpsByReferralSource: { discord: 0, direct: 0, other: 0 },
  }
}

/** Plain-object defaults for Admin reset scripts / cron (no Date). */
export function platformStatsFirestorePayload(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const base = emptyPlatformStats()
  const { updatedAt: _u, ...rest } = base
  return {
    ...rest,
    updatedAt: null,
    ...overrides,
  }
}
