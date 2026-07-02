import { countActiveInLastDays, metricsFromProfile } from '@/features/analytics/studyMetrics'
import { getClassChapterInsights, sortByDifficulty } from '@/features/mastery/tutorInsights'
import type { CloudProfile } from '@/features/social/socialApi'
import { getAllSubjects, getChapter, getTopic } from '@/lib/contentLoader'

export interface SiteTopicRank {
  topicId: string
  topicTitle: string
  chapterTitle: string
  subjectName: string
  totalTimeSec: number
  studentCount: number
  avgTimeMin: number
}

export interface SubjectWorstChapter {
  subjectId: string
  subjectName: string
  chapterId: string
  chapterTitle: string
  failRate: number
  timeSpentMin: number
  studentCount: number
  quizFails: number
}

export interface SiteTotals {
  totalUsers: number
  syncedUsers: number
  totalStudySec: number
  totalQuizAttempts: number
  totalQuizFails: number
  totalXp: number
  active7d: number
  active30d: number
}

export function aggregateSiteTotals(profiles: CloudProfile[]): SiteTotals {
  let totalStudySec = 0
  let totalQuizAttempts = 0
  let totalQuizFails = 0
  let totalXp = 0
  let syncedUsers = 0

  for (const profile of profiles) {
    totalXp += profile.xp
    const metrics = metricsFromProfile(profile)
    totalStudySec += metrics.totalStudySec
    totalQuizAttempts += metrics.quizAttempts
    totalQuizFails += metrics.quizFails
    if (metrics.totalStudySec > 0 || profile.xp > 0) syncedUsers += 1
  }

  return {
    totalUsers: profiles.length,
    syncedUsers,
    totalStudySec,
    totalQuizAttempts,
    totalQuizFails,
    totalXp,
    active7d: countActiveInLastDays(profiles, 7),
    active30d: countActiveInLastDays(profiles, 30),
  }
}

export function rankTopicsSiteWide(profiles: CloudProfile[], limit = 25): SiteTopicRank[] {
  const agg: Record<string, { time: number; students: Set<string> }> = {}

  for (const profile of profiles) {
    const topics = profile.progress?.topics ?? {}
    for (const [topicId, topic] of Object.entries(topics)) {
      const sec = topic.timeSpentSec ?? 0
      if (sec <= 0) continue
      if (!agg[topicId]) agg[topicId] = { time: 0, students: new Set() }
      agg[topicId].time += sec
      agg[topicId].students.add(profile.id)
    }
  }

  return Object.entries(agg)
    .map(([topicId, bucket]) => {
      const topic = getTopic(topicId)
      const chapter = topic ? getChapter(topic.chapterId) : undefined
      const subject = chapter
        ? getAllSubjects().find((s) => s.id === chapter.subjectId)
        : undefined
      const studentCount = bucket.students.size
      return {
        topicId,
        topicTitle: topic?.title ?? topicId,
        chapterTitle: chapter ? `Ch ${chapter.number}: ${chapter.title}` : '',
        subjectName: subject?.name ?? '',
        totalTimeSec: bucket.time,
        studentCount,
        avgTimeMin: studentCount > 0 ? Math.round(bucket.time / studentCount / 60) : 0,
      }
    })
    .sort((a, b) => b.totalTimeSec - a.totalTimeSec)
    .slice(0, limit)
}

export function worstChapterPerSubject(profiles: CloudProfile[]): SubjectWorstChapter[] {
  const insights = sortByDifficulty(getClassChapterInsights(profiles))
  const worstBySubject: Record<string, SubjectWorstChapter> = {}

  for (const row of insights) {
    if (!row.subjectId || worstBySubject[row.subjectId]) continue
    worstBySubject[row.subjectId] = {
      subjectId: row.subjectId,
      subjectName: row.subjectName,
      chapterId: row.chapterId,
      chapterTitle: row.chapterTitle,
      failRate: row.failRate,
      timeSpentMin: row.timeSpentMin,
      studentCount: row.studentCount,
      quizFails: row.quizFails,
    }
  }

  return getAllSubjects()
    .map((subject) => worstBySubject[subject.id])
    .filter((row): row is SubjectWorstChapter => row !== undefined)
}

export function rankChaptersSiteWide(profiles: CloudProfile[], limit = 15) {
  return sortByDifficulty(getClassChapterInsights(profiles)).slice(0, limit)
}

export function rankSubjectsByStruggle(profiles: CloudProfile[]) {
  const bySubject: Record<
    string,
    { subjectName: string; timeSec: number; fails: number; attempts: number; chapters: number }
  > = {}

  for (const profile of profiles) {
    const stats = profile.progress?.chapterStats ?? {}
    for (const [chapterId, chapterStat] of Object.entries(stats)) {
      const chapter = getChapter(chapterId)
      if (!chapter) continue
      const subject = getAllSubjects().find((s) => s.id === chapter.subjectId)
      if (!subject) continue
      if (!bySubject[subject.id]) {
        bySubject[subject.id] = {
          subjectName: subject.name,
          timeSec: 0,
          fails: 0,
          attempts: 0,
          chapters: 0,
        }
      }
      const bucket = bySubject[subject.id]
      bucket.timeSec += chapterStat.timeSpentSec ?? 0
      bucket.fails += chapterStat.quizFails ?? 0
      bucket.attempts += chapterStat.quizAttempts ?? 0
      if ((chapterStat.timeSpentSec ?? 0) > 0 || (chapterStat.quizAttempts ?? 0) > 0) {
        bucket.chapters += 1
      }
    }
  }

  return Object.entries(bySubject)
    .map(([subjectId, bucket]) => {
      const failRate =
        bucket.attempts > 0 ? Math.round((bucket.fails / bucket.attempts) * 100) : 0
      return {
        subjectId,
        subjectName: bucket.subjectName,
        totalTimeMin: Math.round(bucket.timeSec / 60),
        failRate,
        struggleScore: bucket.timeSec / 60 + bucket.fails * 3 + failRate,
      }
    })
    .sort((a, b) => b.struggleScore - a.struggleScore)
}

export function computeSiteStudyBreakdown(profiles: CloudProfile[]) {
  let topicStudySec = 0
  let chapterStudySec = 0

  for (const profile of profiles) {
    const metrics = metricsFromProfile(profile)
    topicStudySec += metrics.topicStudySec
    chapterStudySec += metrics.chapterStudySec
  }

  return { topicStudySec, chapterStudySec }
}
