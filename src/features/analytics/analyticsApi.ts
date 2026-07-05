import type { UserProgress } from '@/features/mastery/MasteryEngine'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { computeStudyMetrics } from './studyMetrics'

export interface PlatformStats {
  totalSignUps: number
  totalStudySeconds: number
  totalQuizAttempts: number
  updatedAt: Date | null
}

const DEFAULT_PLATFORM_STATS: PlatformStats = {
  totalSignUps: 0,
  totalStudySeconds: 0,
  totalQuizAttempts: 0,
  updatedAt: null,
}

/** Admin-only read — client never writes platform stats (see firestore.rules). */
export async function fetchPlatformStats(): Promise<PlatformStats> {
  if (!db) return DEFAULT_PLATFORM_STATS

  try {
    const snap = await getDoc(doc(db, 'platformStats', 'summary'))
    if (!snap.exists()) return DEFAULT_PLATFORM_STATS

    const data = snap.data()
    return {
      totalSignUps: (data.totalSignUps as number) ?? 0,
      totalStudySeconds: (data.totalStudySeconds as number) ?? 0,
      totalQuizAttempts: (data.totalQuizAttempts as number) ?? 0,
      updatedAt: data.updatedAt?.toDate?.() ?? null,
    }
  } catch {
    return DEFAULT_PLATFORM_STATS
  }
}

export async function recordPlatformSync(
  _userId: string,
  progress: UserProgress,
): Promise<{ syncedStudySec: number; syncedQuizAttempts: number }> {
  const m = computeStudyMetrics(progress)
  return { syncedStudySec: m.totalStudySec, syncedQuizAttempts: m.quizAttempts }
}
