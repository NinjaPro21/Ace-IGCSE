import type { UserProgress } from '@/features/mastery/MasteryEngine'
import { db } from '@/lib/firebase'
import { doc, getDoc, increment, serverTimestamp, setDoc } from 'firebase/firestore'
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

export async function fetchPlatformStats(): Promise<PlatformStats> {
  if (!db) return DEFAULT_PLATFORM_STATS

  const snap = await getDoc(doc(db, 'platformStats', 'summary'))
  if (!snap.exists()) return DEFAULT_PLATFORM_STATS

  const data = snap.data()
  return {
    totalSignUps: (data.totalSignUps as number) ?? 0,
    totalStudySeconds: (data.totalStudySeconds as number) ?? 0,
    totalQuizAttempts: (data.totalQuizAttempts as number) ?? 0,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  }
}

async function syncPlatformDeltas(
  userId: string,
  progress: UserProgress,
  isNewUser: boolean,
): Promise<{ syncedStudySec: number; syncedQuizAttempts: number }> {
  if (!db) {
    const m = computeStudyMetrics(progress)
    return { syncedStudySec: m.totalStudySec, syncedQuizAttempts: m.quizAttempts }
  }

  const metrics = computeStudyMetrics(progress)
  const profileRef = doc(db, 'profiles', userId)
  const platformRef = doc(db, 'platformStats', 'summary')

  const snap = await getDoc(profileRef)
  const prevStudy = (snap.data()?.syncedStudySec as number) ?? 0
  const prevAttempts = (snap.data()?.syncedQuizAttempts as number) ?? 0
  const studyDelta = Math.max(0, metrics.totalStudySec - prevStudy)
  const attemptDelta = Math.max(0, metrics.quizAttempts - prevAttempts)

  if (studyDelta > 0 || attemptDelta > 0 || isNewUser) {
    const platformPatch: Record<string, unknown> = { updatedAt: serverTimestamp() }
    if (studyDelta > 0) platformPatch.totalStudySeconds = increment(studyDelta)
    if (attemptDelta > 0) platformPatch.totalQuizAttempts = increment(attemptDelta)
    if (isNewUser) platformPatch.totalSignUps = increment(1)

    await setDoc(platformRef, platformPatch, { merge: true })
  }

  return { syncedStudySec: metrics.totalStudySec, syncedQuizAttempts: metrics.quizAttempts }
}

export async function recordPlatformSync(
  userId: string,
  progress: UserProgress,
): Promise<{ syncedStudySec: number; syncedQuizAttempts: number }> {
  if (!db) {
    const m = computeStudyMetrics(progress)
    return { syncedStudySec: m.totalStudySec, syncedQuizAttempts: m.quizAttempts }
  }

  const profileRef = doc(db, 'profiles', userId)
  const snap = await getDoc(profileRef)
  return syncPlatformDeltas(userId, progress, !snap.exists())
}
