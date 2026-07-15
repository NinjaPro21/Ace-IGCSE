/**
 * Nightly Admin SDK rollup: scans profiles + analytics/learning into
 * platformStats/summary, daily, and weekly docs.
 *
 * Protected by CRON_SECRET. Clients never write platformStats.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app'
import { FieldValue, getFirestore, type QueryDocumentSnapshot } from 'firebase-admin/firestore'

type SubjectKey = 'math' | 'addMath' | 'physics'
type Dow = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
type ScoreBucket = '0-20' | '21-40' | '41-60' | '61-80' | '81-100'
type StreakBucket = '1-3' | '4-7' | '8-14' | '15+'
type Referral = 'discord' | 'direct' | 'other'

function emptyHours(): Record<string, number> {
  const m: Record<string, number> = {}
  for (let h = 0; h < 24; h++) m[String(h)] = 0
  return m
}

function emptyDow(): Record<Dow, number> {
  return { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }
}

function emptySubjects(): Record<SubjectKey, number> {
  return { math: 0, addMath: 0, physics: 0 }
}

function emptyScore(): Record<ScoreBucket, number> {
  return { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 }
}

function emptyStreak(): Record<StreakBucket, number> {
  return { '1-3': 0, '4-7': 0, '8-14': 0, '15+': 0 }
}

function emptyXp(): Record<string, number> {
  return { quiz: 0, notes: 0, streak: 0, chapter: 0 }
}

function localDateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isoWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${date.getUTCFullYear()}-${String(weekNo).padStart(2, '0')}`
}

function daysBetween(a: string, b: string): number {
  const ms = Date.parse(b) - Date.parse(a)
  return Math.floor(ms / 86400000)
}

function addMaps(target: Record<string, number>, source: unknown): void {
  if (!source || typeof source !== 'object') return
  for (const [k, v] of Object.entries(source as Record<string, unknown>)) {
    if (typeof v === 'number' && Number.isFinite(v)) {
      target[k] = (target[k] ?? 0) + v
    }
  }
}

function streakBucket(days: number): StreakBucket {
  if (days <= 3) return '1-3'
  if (days <= 7) return '4-7'
  if (days <= 14) return '8-14'
  return '15+'
}

function peakKey(map: Record<string, number>): string {
  let best = ''
  let bestVal = -1
  for (const [k, v] of Object.entries(map)) {
    if (v > bestVal) {
      bestVal = v
      best = k
    }
  }
  return best
}

function trimSignUpsByDay(map: Record<string, number>, keepDays = 90): Record<string, number> {
  const keys = Object.keys(map).sort()
  if (keys.length <= keepDays) return map
  const keep = new Set(keys.slice(-keepDays))
  const out: Record<string, number> = {}
  for (const k of keys) {
    if (keep.has(k)) out[k] = map[k]!
  }
  return out
}

function initAdmin(): void {
  if (getApps().length) return
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set')
  }
  const sa = JSON.parse(raw) as ServiceAccount
  initializeApp({
    credential: cert(sa),
    projectId: sa.projectId,
  })
}

function emptyPlatformPayload(): Record<string, unknown> {
  return {
    totalSignUps: 0,
    totalStudySeconds: 0,
    totalQuizAttempts: 0,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    returningUsers: 0,
    averageSessionDurationSeconds: 0,
    totalSessions: 0,
    sessionsPerUserAverage: 0,
    dropOffAfterFirstSession: 0,
    studySecondsBySubject: emptySubjects(),
    studySecondsByHourOfDay: emptyHours(),
    studySecondsByDayOfWeek: emptyDow(),
    averageStudySessionLengthSeconds: 0,
    peakStudyHour: 0,
    peakStudyDay: '',
    topicViewCounts: {},
    topicCompletionCounts: {},
    topicCompletionRates: {},
    mostRevisitedTopics: [] as string[],
    notesReadCounts: {},
    chapterCompletionCounts: {},
    subjectEngagementRatio: emptySubjects(),
    quizAttemptsBySubject: emptySubjects(),
    quizAverageScoreBySubject: emptySubjects(),
    quizPassRateBySubject: emptySubjects(),
    quizAverageScoreByTopic: {},
    quizRetakeRate: 0,
    quizScoreDistribution: emptyScore(),
    firstAttemptPassRate: 0,
    averageAttemptsBeforePass: 0,
    totalXpAwarded: 0,
    xpBySource: emptyXp(),
    averageXpPerUser: 0,
    streakDistribution: emptyStreak(),
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

export async function runPlatformStatsRollup(): Promise<Record<string, unknown>> {
  initAdmin()
  const db = getFirestore()
  const today = localDateKey()
  const weekKey = isoWeekKey()

  const weekStart = (() => {
    const d = new Date()
    const day = d.getDay() || 7
    d.setDate(d.getDate() - day + 1)
    return localDateKey(d)
  })()

  let leaderboardCount = 0
  {
    const lb = await db.collection('leaderboard').count().get()
    leaderboardCount = lb.data().count
  }

  const agg = emptyPlatformPayload() as Record<string, unknown>
  const studyBySubject = emptySubjects()
  const studyByHour = emptyHours()
  const studyByDow = emptyDow()
  const topicViews: Record<string, number> = {}
  const topicCompletions: Record<string, number> = {}
  const topicRevisits: Record<string, number> = {}
  const notesRead: Record<string, number> = {}
  const chapterCompletions: Record<string, number> = {}
  const quizAttemptsBySubject = emptySubjects()
  const quizScoreSumBySubject = emptySubjects()
  const quizPassBySubject = emptySubjects()
  const quizAttemptCountBySubject = emptySubjects()
  const quizScoreSumByTopic: Record<string, number> = {}
  const quizAttemptCountByTopic: Record<string, number> = {}
  const scoreDist = emptyScore()
  const xpBySource = emptyXp()
  const streakDist = emptyStreak()
  const signUpsByDay: Record<string, number> = {}
  const signUpsByReferral: Record<Referral, number> = { discord: 0, direct: 0, other: 0 }

  let totalUsers = 0
  let totalStudySeconds = 0
  let totalQuizAttempts = 0
  let totalSessions = 0
  let totalSessionSeconds = 0
  let returningUsers = 0
  let dropOffAfterFirstSession = 0
  let studySessionCount = 0
  let totalXpAwarded = 0
  let usersWithActiveStreak = 0
  let streakSum = 0
  let dailyActiveUsers = 0
  let weeklyActiveUsers = 0
  let churnedUsers = 0
  let reactivatedUsers = 0
  let firstAttemptPassCount = 0
  let firstAttemptCount = 0
  let attemptsBeforePassSum = 0
  let passedQuizCount = 0
  let quizRetakeCount = 0
  let retentionDay1Eligible = 0
  let retentionDay1Returned = 0
  let retentionDay7Eligible = 0
  let retentionDay7Returned = 0
  let retentionDay30Eligible = 0
  let retentionDay30Returned = 0
  let daysBetweenSessionsSum = 0
  let daysBetweenSessionsN = 0

  let lastProfile: QueryDocumentSnapshot | null = null
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let q = db.collection('profiles').orderBy('__name__').limit(200)
    if (lastProfile) q = q.startAfter(lastProfile)
    const snap = await q.get()
    if (snap.empty) break

    for (const profileDoc of snap.docs) {
      totalUsers += 1
      const uid = profileDoc.id
      const profile = profileDoc.data()
      const learningSnap = await db.doc(`profiles/${uid}/analytics/learning`).get()
      const learning = learningSnap.exists ? learningSnap.data()! : {}

      const createdAtRaw =
        (learning.createdAt as string | undefined) ??
        (typeof profile.createdAt === 'string' ? profile.createdAt : null) ??
        (profile.createdAt?.toDate?.()?.toISOString?.() as string | undefined) ??
        null

      const createdDay = createdAtRaw ? createdAtRaw.slice(0, 10) : null
      if (createdDay) {
        signUpsByDay[createdDay] = (signUpsByDay[createdDay] ?? 0) + 1
      }

      const referral = (learning.referralSource as Referral) || 'direct'
      if (referral in signUpsByReferral) signUpsByReferral[referral] += 1
      else signUpsByReferral.other += 1

      const sessionCount = Number(learning.sessionCount) || 0
      const totalSessionSec = Number(learning.totalSessionSeconds) || 0
      totalSessions += sessionCount
      totalSessionSeconds += totalSessionSec
      if (sessionCount > 1) returningUsers += 1
      if (sessionCount === 1) dropOffAfterFirstSession += 1

      const studySec = Number(learning.totalStudySeconds) || 0
      totalStudySeconds += studySec
      studySessionCount += Number(learning.studySessionCount) || 0
      addMaps(studyBySubject, learning.studySecondsBySubject)
      addMaps(studyByHour, learning.studySecondsByHourOfDay)
      addMaps(studyByDow, learning.studySecondsByDayOfWeek)
      addMaps(topicViews, learning.topicViewCounts)
      addMaps(topicCompletions, learning.topicCompletionCounts)
      addMaps(topicRevisits, learning.topicRevisitCounts)
      addMaps(notesRead, learning.notesReadCounts)
      addMaps(chapterCompletions, learning.chapterCompletionCounts)
      addMaps(quizAttemptsBySubject, learning.quizAttemptsBySubject)
      addMaps(quizScoreSumBySubject, learning.quizScoreSumBySubject)
      addMaps(quizPassBySubject, learning.quizPassCountBySubject)
      addMaps(quizAttemptCountBySubject, learning.quizAttemptCountBySubject)
      addMaps(quizScoreSumByTopic, learning.quizScoreSumByTopic)
      addMaps(quizAttemptCountByTopic, learning.quizAttemptCountByTopic)
      addMaps(scoreDist, learning.quizScoreBucketCounts)
      addMaps(xpBySource, learning.xpBySource)

      firstAttemptPassCount += Number(learning.firstAttemptPassCount) || 0
      firstAttemptCount += Number(learning.firstAttemptCount) || 0
      attemptsBeforePassSum += Number(learning.attemptsBeforePassSum) || 0
      passedQuizCount += Number(learning.passedQuizCount) || 0
      quizRetakeCount += Number(learning.quizRetakeCount) || 0
      totalXpAwarded += Number(learning.totalXpAwarded) || 0

      const streak =
        Number(learning.currentStreak) ||
        Number(profile.streakDays) ||
        0
      if (streak > 0) {
        usersWithActiveStreak += 1
        streakSum += streak
        streakDist[streakBucket(streak)] += 1
      }

      const lastActive =
        (learning.lastActiveDate as string | undefined) ||
        (profile.lastActiveDate as string | undefined) ||
        null

      if (lastActive === today) dailyActiveUsers += 1
      if (lastActive && lastActive >= weekStart) weeklyActiveUsers += 1

      if (lastActive) {
        const inactiveDays = daysBetween(lastActive, today)
          if (inactiveDays >= 14) {
            churnedUsers += 1
            if (learningSnap.exists && !learning.wasChurned) {
              await learningSnap.ref.set({ wasChurned: true }, { merge: true }).catch(() => undefined)
            }
          }
      }

      reactivatedUsers += Number(learning.reactivatedCount) || 0

      if (createdDay) {
        const age = daysBetween(createdDay, today)
        const returnedAfter = (n: number) =>
          Boolean(lastActive && daysBetween(createdDay, lastActive) >= n)

        if (age >= 1) {
          retentionDay1Eligible += 1
          if (returnedAfter(1)) retentionDay1Returned += 1
        }
        if (age >= 7) {
          retentionDay7Eligible += 1
          if (returnedAfter(7)) retentionDay7Returned += 1
        }
        if (age >= 30) {
          retentionDay30Eligible += 1
          if (returnedAfter(30)) retentionDay30Returned += 1
        }
      }

      const log = (learning.studySessionLog as Array<{ at?: string }> | undefined) ?? []
      for (let i = 1; i < log.length; i++) {
        const prev = log[i - 1]?.at?.slice(0, 10)
        const cur = log[i]?.at?.slice(0, 10)
        if (prev && cur) {
          daysBetweenSessionsSum += Math.max(0, daysBetween(prev, cur))
          daysBetweenSessionsN += 1
        }
      }
    }

    lastProfile = snap.docs[snap.docs.length - 1]!
    if (snap.size < 200) break
  }

  // Recompute total quiz attempts correctly from subject map
  totalQuizAttempts = Object.values(quizAttemptsBySubject).reduce((a, b) => a + b, 0)

  const topicCompletionRates: Record<string, number> = {}
  for (const [topicId, views] of Object.entries(topicViews)) {
    const done = topicCompletions[topicId] ?? 0
    topicCompletionRates[topicId] = views > 0 ? Math.round((done / views) * 1000) / 10 : 0
  }

  const mostRevisitedTopics = Object.entries(topicRevisits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([id]) => id)

  const subjectEngagementRatio = emptySubjects()
  if (totalStudySeconds > 0) {
    for (const k of Object.keys(studyBySubject) as SubjectKey[]) {
      subjectEngagementRatio[k] =
        Math.round((studyBySubject[k] / totalStudySeconds) * 1000) / 10
    }
  }

  const quizAverageScoreBySubject = emptySubjects()
  const quizPassRateBySubject = emptySubjects()
  for (const k of Object.keys(quizAttemptsBySubject) as SubjectKey[]) {
    const attempts = quizAttemptCountBySubject[k] || quizAttemptsBySubject[k]
    quizAverageScoreBySubject[k] =
      attempts > 0 ? Math.round((quizScoreSumBySubject[k] / attempts) * 10) / 10 : 0
    quizPassRateBySubject[k] =
      attempts > 0 ? Math.round((quizPassBySubject[k] / attempts) * 1000) / 10 : 0
  }

  const quizAverageScoreByTopic: Record<string, number> = {}
  for (const [topicId, sum] of Object.entries(quizScoreSumByTopic)) {
    const n = quizAttemptCountByTopic[topicId] ?? 0
    quizAverageScoreByTopic[topicId] = n > 0 ? Math.round((sum / n) * 10) / 10 : 0
  }

  const peakHour = peakKey(studyByHour)
  const peakDay = peakKey(studyByDow) as Dow | ''

  const payload: Record<string, unknown> = {
    ...agg,
    totalSignUps: totalUsers,
    totalStudySeconds,
    totalQuizAttempts,
    dailyActiveUsers,
    weeklyActiveUsers,
    returningUsers,
    averageSessionDurationSeconds:
      totalSessions > 0 ? Math.round(totalSessionSeconds / totalSessions) : 0,
    totalSessions,
    sessionsPerUserAverage: totalUsers > 0 ? Math.round((totalSessions / totalUsers) * 100) / 100 : 0,
    dropOffAfterFirstSession,
    studySecondsBySubject: studyBySubject,
    studySecondsByHourOfDay: studyByHour,
    studySecondsByDayOfWeek: studyByDow,
    averageStudySessionLengthSeconds:
      studySessionCount > 0 ? Math.round(totalStudySeconds / studySessionCount) : 0,
    peakStudyHour: peakHour ? Number(peakHour) : 0,
    peakStudyDay: peakDay,
    topicViewCounts: topicViews,
    topicCompletionCounts: topicCompletions,
    topicCompletionRates,
    mostRevisitedTopics,
    notesReadCounts: notesRead,
    chapterCompletionCounts: chapterCompletions,
    subjectEngagementRatio,
    quizAttemptsBySubject,
    quizAverageScoreBySubject,
    quizPassRateBySubject,
    quizAverageScoreByTopic,
    quizRetakeRate:
      totalQuizAttempts > 0 ? Math.round((quizRetakeCount / totalQuizAttempts) * 1000) / 10 : 0,
    quizScoreDistribution: scoreDist,
    firstAttemptPassRate:
      firstAttemptCount > 0
        ? Math.round((firstAttemptPassCount / firstAttemptCount) * 1000) / 10
        : 0,
    averageAttemptsBeforePass:
      passedQuizCount > 0
        ? Math.round((attemptsBeforePassSum / passedQuizCount) * 100) / 100
        : 0,
    totalXpAwarded,
    xpBySource,
    averageXpPerUser: totalUsers > 0 ? Math.round(totalXpAwarded / totalUsers) : 0,
    streakDistribution: streakDist,
    usersWithActiveStreak,
    averageStreakLength:
      usersWithActiveStreak > 0
        ? Math.round((streakSum / usersWithActiveStreak) * 100) / 100
        : 0,
    leaderboardParticipationRate:
      totalUsers > 0 ? Math.round((leaderboardCount / totalUsers) * 1000) / 10 : 0,
    day1RetentionRate:
      retentionDay1Eligible > 0
        ? Math.round((retentionDay1Returned / retentionDay1Eligible) * 1000) / 10
        : 0,
    day7RetentionRate:
      retentionDay7Eligible > 0
        ? Math.round((retentionDay7Returned / retentionDay7Eligible) * 1000) / 10
        : 0,
    day30RetentionRate:
      retentionDay30Eligible > 0
        ? Math.round((retentionDay30Returned / retentionDay30Eligible) * 1000) / 10
        : 0,
    averageDaysBetweenSessions:
      daysBetweenSessionsN > 0
        ? Math.round((daysBetweenSessionsSum / daysBetweenSessionsN) * 100) / 100
        : 0,
    churnedUsers,
    reactivatedUsers,
    signUpsByDay: trimSignUpsByDay(signUpsByDay, 90),
    signUpsByReferralSource: signUpsByReferral,
    updatedAt: FieldValue.serverTimestamp(),
    rolledUpAt: new Date().toISOString(),
    rolledUpForDay: today,
    rolledUpForWeek: weekKey,
  }

  await db.doc('platformStats/summary').set(payload, { merge: false })
  await db.doc(`platformStats/summary/daily/${today}`).set(payload, { merge: false })
  await db.doc(`platformStats/summary/weekly/${weekKey}`).set(payload, { merge: false })

  return {
    ok: true,
    totalUsers,
    day: today,
    week: weekKey,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const secret = process.env.CRON_SECRET
  const auth = req.headers.authorization
  if (!secret || auth !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const result = await runPlatformStatsRollup()
    res.status(200).json(result)
  } catch (err) {
    console.error('platform stats rollup failed', err)
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Rollup failed',
    })
  }
}
