import { getAllSubjects } from '@/lib/contentLoader'
import type { Difficulty } from '@/lib/contentTypes'
import type { QuizAttemptRecord } from '@/features/quiz/quizAttemptTypes'
import type { UserProgress } from '@/features/mastery/MasteryEngine'

export interface SubjectQuizSummary {
  subjectId: string
  subjectName: string
  attemptCount: number
  averageScore: number
  bestScore: number
  lastAttemptAt?: string
}

export function getQuizAttempts(progress: UserProgress): QuizAttemptRecord[] {
  return progress.quizAttempts ?? []
}

export function getQuizSummariesBySubject(progress: UserProgress): SubjectQuizSummary[] {
  const attempts = getQuizAttempts(progress)
  const bySubject = new Map<string, QuizAttemptRecord[]>()

  for (const a of attempts) {
    const list = bySubject.get(a.subjectId) ?? []
    list.push(a)
    bySubject.set(a.subjectId, list)
  }

  const subjectOrder = getAllSubjects().map((s) => s.id)

  return [...bySubject.entries()]
    .map(([subjectId, list]) => {
      const subject = getAllSubjects().find((s) => s.id === subjectId)
      const scores = list.map((a) => a.scorePercent)
      const avg = scores.length ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length) : 0
      const sorted = [...list].sort((a, b) => b.at.localeCompare(a.at))
      return {
        subjectId,
        subjectName: subject?.name ?? subjectId,
        attemptCount: list.length,
        averageScore: avg,
        bestScore: scores.length ? Math.max(...scores) : 0,
        lastAttemptAt: sorted[0]?.at,
      }
    })
    .sort((a, b) => {
      const ai = subjectOrder.indexOf(a.subjectId)
      const bi = subjectOrder.indexOf(b.subjectId)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
}

export function getQuizAttemptsForSubject(
  progress: UserProgress,
  subjectId: string,
): QuizAttemptRecord[] {
  return getQuizAttempts(progress)
    .filter((a) => a.subjectId === subjectId)
    .sort((a, b) => b.at.localeCompare(a.at))
}

export function getQuizAttemptsForScope(
  progress: UserProgress,
  opts: { topicId?: string; chapterId: string; difficulty?: Difficulty },
): QuizAttemptRecord[] {
  return getQuizAttempts(progress)
    .filter((a) => {
      if (a.chapterId !== opts.chapterId) return false
      if (opts.topicId) return a.topicId === opts.topicId
      return !a.topicId
    })
    .filter((a) => (opts.difficulty ? a.difficulty === opts.difficulty : true))
    .sort((a, b) => b.at.localeCompare(a.at))
}

export function formatAttemptDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

const DIFF_LABEL: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  pyp: 'PYP',
}

export function formatDifficulty(diff: string): string {
  return DIFF_LABEL[diff] ?? diff
}
