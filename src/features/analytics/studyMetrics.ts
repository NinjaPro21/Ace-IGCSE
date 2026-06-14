import type { UserProgress } from '@/features/mastery/MasteryEngine'
import { NOTES_MIN_SECONDS } from '@/features/mastery/levelSystem'
import { cloudRowToUserProgress, type CloudProfile } from '@/features/social/socialApi'

export interface StudyMetrics {
  totalStudySec: number
  topicStudySec: number
  chapterStudySec: number
  quizAttempts: number
  quizFails: number
  topicsCompleted: number
  chaptersMastered: number
}

export function computeStudyMetrics(progress: UserProgress): StudyMetrics {
  let topicStudySec = 0
  let chapterStudySec = 0
  let quizAttempts = 0
  let quizFails = 0
  let topicsCompleted = 0
  let chaptersMastered = 0

  for (const t of Object.values(progress.topics)) {
    topicStudySec += t.timeSpentSec ?? 0
    if (t.notesRead && (t.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS) topicsCompleted += 1
  }

  for (const ch of Object.values(progress.chapters)) {
    if (ch.quizLevel >= 4) chaptersMastered += 1
  }

  for (const s of Object.values(progress.chapterStats ?? {})) {
    chapterStudySec += s.timeSpentSec ?? 0
    quizAttempts += s.quizAttempts ?? 0
    quizFails += s.quizFails ?? 0
  }

  return {
    totalStudySec: topicStudySec + chapterStudySec,
    topicStudySec,
    chapterStudySec,
    quizAttempts,
    quizFails,
    topicsCompleted,
    chaptersMastered,
  }
}

export function metricsFromProfile(profile: CloudProfile): StudyMetrics {
  return computeStudyMetrics(cloudRowToUserProgress(profile))
}

export function formatDuration(totalSec: number): string {
  if (totalSec < 60) return `${totalSec}s`
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function formatDurationHours(totalSec: number): string {
  const hours = totalSec / 3600
  if (hours >= 10) return `${Math.round(hours)}h`
  if (hours >= 1) return `${hours.toFixed(1)}h`
  return formatDuration(totalSec)
}

export function countActiveInLastDays(profiles: CloudProfile[], days = 7): number {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffIso = cutoff.toISOString().slice(0, 10)

  return profiles.filter((p) => {
    if (p.lastActiveDate && p.lastActiveDate >= cutoffIso) return true
    return (p.activeDates ?? []).some((d) => d >= cutoffIso)
  }).length
}

export interface MemberStudyRow {
  userId: string
  displayName: string
  studySec: number
  xp: number
  quizAttempts: number
}

export function getMemberStudyRows(profiles: CloudProfile[]): MemberStudyRow[] {
  return profiles
    .map((p) => {
      const m = metricsFromProfile(p)
      return {
        userId: p.id,
        displayName: p.displayName ?? 'Student',
        studySec: m.totalStudySec,
        xp: p.xp,
        quizAttempts: m.quizAttempts,
      }
    })
    .sort((a, b) => b.studySec - a.studySec)
}
