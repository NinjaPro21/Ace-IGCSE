import { NOTES_MIN_SECONDS } from '@/features/mastery/levelSystem'
import { cloudRowToUserProgress, type CloudProfile } from '@/features/social/socialApi'
import { getAllSubjects, getChapter, getTopic } from '@/lib/contentLoader'

export interface FunnelStep {
  id: string
  label: string
  count: number
  ratePercent: number
}

export interface RetentionCohortRow {
  cohortLabel: string
  cohortStart: string
  size: number
  /** Retention % for week 0, 1, 2, … up to 8 */
  weeks: number[]
}

export interface TopicPassRateRow {
  topicId: string
  topicTitle: string
  subjectName: string
  chapterTitle: string
  difficulty: 'easy' | 'medium' | 'hard' | 'pyp'
  passed: number
  attempted: number
  passRate: number
}

const PASS_SCORE = 70

function profileProgress(profile: CloudProfile) {
  return cloudRowToUserProgress(profile)
}

function firstActiveDate(profile: CloudProfile): string | null {
  const dates = profile.progress?.activeDates ?? profile.activeDates ?? []
  if (dates.length === 0) return profile.lastActiveDate
  return [...dates].sort()[0] ?? null
}

/** Cohort anchor: createdAt ISO date, else first active date. */
export function getProfileCohortDate(profile: CloudProfile): string | null {
  if (profile.createdAt) return profile.createdAt.slice(0, 10)
  return firstActiveDate(profile)
}

function weekStartMonday(isoDate: string): Date {
  const d = new Date(`${isoDate}T12:00:00`)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatCohortLabel(monday: Date): string {
  return monday.toISOString().slice(0, 10)
}

function isActiveInWeek(profile: CloudProfile, weekMonday: Date): boolean {
  const dates = profile.progress?.activeDates ?? profile.activeDates ?? []
  const start = weekMonday.getTime()
  const end = start + 7 * 24 * 60 * 60 * 1000
  return dates.some((d) => {
    const t = new Date(`${d}T12:00:00`).getTime()
    return t >= start && t < end
  })
}

export function computeActivationFunnel(profiles: CloudProfile[]): FunnelStep[] {
  const n = profiles.length
  if (n === 0) return []

  let notesRead = 0
  let attemptedQuiz = 0
  let passedQuiz = 0
  let pypMastery = 0

  for (const profile of profiles) {
    const progress = profileProgress(profile)
    const topics = Object.values(progress.topics)
    const stats = Object.values(progress.chapterStats ?? {})

    const hasNotes = topics.some(
      (t) => Boolean(t.notesRead) && (t.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS,
    )
    const hasAttempt = stats.some((s) => (s.quizAttempts ?? 0) > 0)
    const hasPass =
      topics.some(
        (t) =>
          (t.easyScore ?? 0) >= PASS_SCORE ||
          (t.mediumScore ?? 0) >= PASS_SCORE ||
          (t.hardScore ?? 0) >= PASS_SCORE ||
          (t.quizLevel ?? 0) >= 2,
      ) ||
      Object.values(progress.chapters).some((c) => (c.quizLevel ?? 0) >= 2)
    const hasPyp =
      topics.some((t) => t.pypComplete) ||
      Object.values(progress.chapters).some((c) => c.pypComplete || c.quizLevel >= 4)

    if (hasNotes) notesRead += 1
    if (hasAttempt) attemptedQuiz += 1
    if (hasPass) passedQuiz += 1
    if (hasPyp) pypMastery += 1
  }

  const steps: Omit<FunnelStep, 'ratePercent'>[] = [
    { id: 'registered', label: 'Registered (synced profile)', count: n },
    { id: 'notes', label: 'Read notes (≥5 min on a topic)', count: notesRead },
    { id: 'attempt', label: 'Attempted a quiz', count: attemptedQuiz },
    { id: 'pass', label: 'Passed a quiz tier', count: passedQuiz },
    { id: 'pyp', label: 'PYP / mastery (level 4)', count: pypMastery },
  ]

  return steps.map((step) => ({
    ...step,
    ratePercent: n > 0 ? Math.round((step.count / n) * 100) : 0,
  }))
}

export function computeRetentionCohorts(
  profiles: CloudProfile[],
  maxWeeks = 8,
): RetentionCohortRow[] {
  const byCohort = new Map<string, CloudProfile[]>()

  for (const profile of profiles) {
    const anchor = getProfileCohortDate(profile)
    if (!anchor) continue
    const monday = formatCohortLabel(weekStartMonday(anchor))
    if (!byCohort.has(monday)) byCohort.set(monday, [])
    byCohort.get(monday)!.push(profile)
  }

  return [...byCohort.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12)
    .map(([cohortStart, members]) => {
      const cohortMonday = weekStartMonday(cohortStart)
      const weeks: number[] = []
      for (let w = 0; w <= maxWeeks; w += 1) {
        const weekDate = new Date(cohortMonday)
        weekDate.setDate(weekDate.getDate() + w * 7)
        const active = members.filter((p) => isActiveInWeek(p, weekDate)).length
        weeks.push(members.length > 0 ? Math.round((active / members.length) * 100) : 0)
      }
      return {
        cohortLabel: `Week of ${cohortStart}`,
        cohortStart,
        size: members.length,
        weeks,
      }
    })
}

export function computeTopicPassRates(
  profiles: CloudProfile[],
  limit = 25,
): TopicPassRateRow[] {
  const agg = new Map<
    string,
    { easy: { pass: number; try: number }; medium: { pass: number; try: number }; hard: { pass: number; try: number }; pyp: { pass: number; try: number } }
  >()

  for (const profile of profiles) {
    const progress = profileProgress(profile)
    for (const [topicId, t] of Object.entries(progress.topics)) {
      if (!agg.has(topicId)) {
        agg.set(topicId, {
          easy: { pass: 0, try: 0 },
          medium: { pass: 0, try: 0 },
          hard: { pass: 0, try: 0 },
          pyp: { pass: 0, try: 0 },
        })
      }
      const bucket = agg.get(topicId)!
      const level = t.quizLevel ?? 0

      if (level >= 1 || t.easyScore != null || t.mediumScore != null) {
        bucket.easy.try += 1
        if ((t.easyScore ?? 0) >= PASS_SCORE || level >= 2) bucket.easy.pass += 1
      }
      if (level >= 2 || t.mediumScore != null) {
        bucket.medium.try += 1
        if ((t.mediumScore ?? 0) >= PASS_SCORE || level >= 3) bucket.medium.pass += 1
      }
      if (level >= 3 || t.hardScore != null) {
        bucket.hard.try += 1
        if ((t.hardScore ?? 0) >= PASS_SCORE || level >= 4) bucket.hard.pass += 1
      }
      if (level >= 3 || t.pypComplete) {
        bucket.pyp.try += 1
        if (t.pypComplete || level >= 4) bucket.pyp.pass += 1
      }
    }
  }

  const rows: TopicPassRateRow[] = []
  for (const [topicId, tiers] of agg) {
    const topic = getTopic(topicId)
    const chapter = topic ? getChapter(topic.chapterId) : undefined
    const subject = chapter
      ? getAllSubjects().find((s) => s.id === chapter.subjectId)
      : undefined
    const meta = {
      topicId,
      topicTitle: topic?.title ?? topicId,
      subjectName: subject?.name ?? '',
      chapterTitle: chapter ? `Ch ${chapter.number}` : '',
    }
    for (const difficulty of ['easy', 'medium', 'hard', 'pyp'] as const) {
      const { pass, try: attempted } = tiers[difficulty]
      if (attempted === 0) continue
      rows.push({
        ...meta,
        difficulty,
        passed: pass,
        attempted,
        passRate: Math.round((pass / attempted) * 100),
      })
    }
  }

  return rows
    .sort((a, b) => a.passRate - b.passRate || b.attempted - a.attempted)
    .slice(0, limit)
}
