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
