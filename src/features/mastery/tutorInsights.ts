import { getChapter, getAllSubjects } from '@/lib/contentLoader'
import type { CloudProfile } from '@/features/social/socialApi'
import type { ChapterStats, UserProgress } from './MasteryEngine'

export interface ChapterInsight {
  chapterId: string
  chapterTitle: string
  subjectId: string
  subjectName: string
  timeSpentMin: number
  quizAttempts: number
  quizFails: number
  failRate: number
  visits: number
  studentCount: number
}

function chapterTitle(chapterId: string): { title: string; subjectId: string; subjectName: string } {
  const chapter = getChapter(chapterId)
  if (!chapter) return { title: chapterId, subjectId: '', subjectName: '' }
  const subjects = getAllSubjects()
  const subject = subjects.find((s) => s.id === chapter.subjectId)
  return {
    title: `Ch ${chapter.number}: ${chapter.title}`,
    subjectId: chapter.subjectId,
    subjectName: subject?.name ?? chapter.subjectId,
  }
}

function statsFromProgress(progress: UserProgress): Record<string, ChapterStats> {
  return progress.chapterStats ?? {}
}

export function getPersonalChapterInsights(progress: UserProgress): ChapterInsight[] {
  const stats = statsFromProgress(progress)
  return Object.entries(stats)
    .filter(([, s]) => s.timeSpentSec > 0 || s.quizAttempts > 0)
    .map(([chapterId, s]) => {
      const meta = chapterTitle(chapterId)
      const attempts = s.quizAttempts ?? 0
      const fails = s.quizFails ?? 0
      return {
        chapterId,
        chapterTitle: meta.title,
        subjectId: meta.subjectId,
        subjectName: meta.subjectName,
        timeSpentMin: Math.round((s.timeSpentSec ?? 0) / 60),
        quizAttempts: attempts,
        quizFails: fails,
        failRate: attempts > 0 ? Math.round((fails / attempts) * 100) : 0,
        visits: s.visits ?? 0,
        studentCount: 1,
      }
    })
}

export function getClassChapterInsights(profiles: CloudProfile[]): ChapterInsight[] {
  const agg: Record<
    string,
    {
      timeSpentSec: number
      quizAttempts: number
      quizFails: number
      visits: number
      studentCount: number
    }
  > = {}

  for (const profile of profiles) {
    const embedded = profile.progress?.chapterStats ?? {}
    for (const [chapterId, s] of Object.entries(embedded)) {
      if (!agg[chapterId]) {
        agg[chapterId] = { timeSpentSec: 0, quizAttempts: 0, quizFails: 0, visits: 0, studentCount: 0 }
      }
      const bucket = agg[chapterId]
      bucket.timeSpentSec += s.timeSpentSec ?? 0
      bucket.quizAttempts += s.quizAttempts ?? 0
      bucket.quizFails += s.quizFails ?? 0
      bucket.visits += s.visits ?? 0
      if ((s.timeSpentSec ?? 0) > 0 || (s.quizAttempts ?? 0) > 0) bucket.studentCount += 1
    }
  }

  return Object.entries(agg)
    .map(([chapterId, bucket]) => {
      const meta = chapterTitle(chapterId)
      const attempts = bucket.quizAttempts
      const fails = bucket.quizFails
      const avgTimeSec =
        bucket.studentCount > 0 ? bucket.timeSpentSec / bucket.studentCount : bucket.timeSpentSec
      return {
        chapterId,
        chapterTitle: meta.title,
        subjectId: meta.subjectId,
        subjectName: meta.subjectName,
        timeSpentMin: Math.round(avgTimeSec / 60),
        quizAttempts: attempts,
        quizFails: fails,
        failRate: attempts > 0 ? Math.round((fails / attempts) * 100) : 0,
        visits: bucket.visits,
        studentCount: bucket.studentCount,
      }
    })
    .filter((r) => r.timeSpentMin > 0 || r.quizAttempts > 0)
}

export function sortByDifficulty(insights: ChapterInsight[]): ChapterInsight[] {
  return [...insights].sort((a, b) => {
    const scoreA = a.timeSpentMin * 2 + a.failRate + a.quizFails * 5
    const scoreB = b.timeSpentMin * 2 + b.failRate + b.quizFails * 5
    return scoreB - scoreA
  })
}

export function getStuckChapters(insights: ChapterInsight[], limit = 5): ChapterInsight[] {
  return sortByDifficulty(insights).slice(0, limit)
}

export interface SubjectWeakTopics {
  subjectId: string
  subjectName: string
  chapters: ChapterInsight[]
}

/** Top N weakest chapters per subject — keeps progress review uncluttered. */
export function getStuckChaptersBySubject(
  insights: ChapterInsight[],
  perSubjectLimit = 3,
): SubjectWeakTopics[] {
  const ranked = sortByDifficulty(insights)
  const bySubject = new Map<string, ChapterInsight[]>()

  for (const row of ranked) {
    if (!row.subjectId) continue
    const list = bySubject.get(row.subjectId) ?? []
    if (list.length >= perSubjectLimit) continue
    list.push(row)
    bySubject.set(row.subjectId, list)
  }

  const subjectOrder = getAllSubjects().map((s) => s.id)
  return [...bySubject.entries()]
    .sort(([a], [b]) => {
      const ai = subjectOrder.indexOf(a)
      const bi = subjectOrder.indexOf(b)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
    .map(([subjectId, chapters]) => ({
      subjectId,
      subjectName: chapters[0]?.subjectName ?? subjectId,
      chapters,
    }))
}

export function countStuckChaptersBySubject(
  insights: ChapterInsight[],
  perSubjectLimit = 3,
): number {
  return getStuckChaptersBySubject(insights, perSubjectLimit).reduce(
    (sum, group) => sum + group.chapters.length,
    0,
  )
}
