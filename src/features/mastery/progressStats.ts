import {
  getChapter,
  getChapterMasteryPercent,
  getChaptersForSubject,
  getTopic,
  getTopicsForChapter,
  getAllSubjects,
} from '@/lib/contentLoader'
import type { ChapterMeta } from '@/lib/contentTypes'
import type { UserProgress } from './MasteryEngine'
import { STREAK_WINDOW_MS } from './MasteryEngine'
import { getGlobalLevel, NOTES_MIN_SECONDS } from './levelSystem'
import { getPersonalChapterInsights, countStuckChaptersBySubject } from './tutorInsights'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export interface ChapterProgressRow {
  chapter: ChapterMeta
  masteryPercent: number
  quizLevel: number
  status: 'available' | 'in_progress' | 'mastered'
}

export interface ActivityStats {
  topicsRead: number
  chaptersMastered: number
  chaptersInProgress: number
  quizzesPassed: number
  perfectScores: number
  totalXp: number
  globalLevel: number
}

export interface StreakDay {
  date: string
  label: string
  active: boolean
  isToday: boolean
  intensity: 0 | 1 | 2 | 3 | 4
  xp: number
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked'>[] = [
  { id: 'first-note', title: 'First Steps', description: 'Read your first topic notes', icon: '📖' },
  { id: 'first-quiz', title: 'Quiz Taker', description: 'Pass your first chapter quiz', icon: '✅' },
  { id: 'streak-3', title: 'On Fire', description: 'Maintain a 3-day study streak', icon: '🔥' },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day study streak', icon: '⚡' },
  { id: 'streak-30', title: 'Unstoppable', description: 'Maintain a 30-day study streak', icon: '💎' },
  { id: 'chapter-master', title: 'Chapter Champion', description: 'Fully master a chapter (PYP complete)', icon: '🏆' },
  { id: 'perfect-quiz', title: 'Perfect Score', description: 'Score 100% on any quiz tier', icon: '🎯' },
  { id: 'level-5', title: 'Rising Star', description: 'Reach level 5', icon: '⭐' },
  { id: 'level-10', title: 'Enlightened Scholar', description: 'Reach level 10', icon: '🌟' },
  { id: 'xp-500', title: 'XP Hunter', description: 'Earn 500 total XP', icon: '💫' },
]

function notesReadMap(progress: UserProgress): Record<string, boolean> {
  const map: Record<string, boolean> = {}
  for (const [id, t] of Object.entries(progress.topics)) {
    map[id] = Boolean(t.notesRead) && (t.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS
  }
  return map
}

export function getActivityStats(progress: UserProgress): ActivityStats {
  let chaptersMastered = 0
  let chaptersInProgress = 0
  let quizzesPassed = 0
  let perfectScores = 0

  for (const ch of Object.values(progress.chapters)) {
    if (ch.quizLevel >= 4) chaptersMastered += 1
    else if (ch.quizLevel > 0) chaptersInProgress += 1

    if (ch.quizLevel >= 2) quizzesPassed += 1
    if (ch.quizLevel >= 3) quizzesPassed += 1
    if (ch.quizLevel >= 4) quizzesPassed += 1
    if (ch.pypComplete) quizzesPassed += 1

    for (const score of [ch.easyScore, ch.mediumScore, ch.hardScore]) {
      if (score === 100) perfectScores += 1
    }
  }

  const topicsRead = Object.values(progress.topics).filter(
    (t) => Boolean(t.notesRead) && (t.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS,
  ).length

  return {
    topicsRead,
    chaptersMastered,
    chaptersInProgress,
    quizzesPassed,
    perfectScores,
    totalXp: progress.xp,
    globalLevel: getGlobalLevel(progress.xp),
  }
}

export interface DashboardStats {
  notesCompleted: number
  notesTotal: number
  quizMasteryPercent: number
  weakTopicCount: number
  streakDays: number
  longestStreak: number
}

export function getDashboardStats(progress: UserProgress): DashboardStats {
  const notesMap = notesReadMap(progress)
  let notesTotal = 0
  let notesCompleted = 0
  let masterySum = 0
  let chapterCount = 0

  for (const subject of getAllSubjects()) {
    for (const chapter of getChaptersForSubject(subject.id)) {
      chapterCount += 1
      const quizLevel = progress.chapters[chapter.id]?.quizLevel ?? 0
      masterySum += getChapterMasteryPercent(chapter.id, notesMap, quizLevel)
      for (const topic of getTopicsForChapter(chapter.id)) {
        notesTotal += 1
        if (notesMap[topic.id]) notesCompleted += 1
      }
    }
  }

  const weakTopicCount = countStuckChaptersBySubject(getPersonalChapterInsights(progress), 3)

  return {
    notesCompleted,
    notesTotal,
    quizMasteryPercent: chapterCount === 0 ? 0 : Math.round(masterySum / chapterCount),
    weakTopicCount,
    streakDays: progress.streakDays,
    longestStreak: progress.longestStreak ?? progress.streakDays,
  }
}

export function getAchievements(progress: UserProgress): Achievement[] {
  const stats = getActivityStats(progress)
  const longest = progress.longestStreak ?? progress.streakDays
  const current = progress.streakDays

  const checks: Record<string, boolean> = {
    'first-note': stats.topicsRead >= 1,
    'first-quiz': Object.values(progress.chapters).some((c) => c.quizLevel >= 2),
    'streak-3': longest >= 3 || current >= 3,
    'streak-7': longest >= 7 || current >= 7,
    'streak-30': longest >= 30 || current >= 30,
    'chapter-master': stats.chaptersMastered >= 1,
    'perfect-quiz': stats.perfectScores >= 1,
    'level-5': stats.globalLevel >= 5,
    'level-10': stats.globalLevel >= 10,
    'xp-500': progress.xp >= 500,
  }

  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: checks[a.id] ?? false,
  }))
}

function intensityFromXp(xp: number, active: boolean): 0 | 1 | 2 | 3 | 4 {
  if (!active) return 0
  if (xp <= 0) return 1
  if (xp < 15) return 2
  if (xp < 40) return 3
  return 4
}

export function getStreakCalendar(progress: UserProgress, days = 14): StreakDay[] {
  const activeSet = new Set(progress.activeDates ?? [])
  const xpByDate = progress.xpByDate ?? {}
  const today = new Date()
  const result: StreakDay[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const xp = xpByDate[iso] ?? 0
    const active =
      activeSet.has(iso) ||
      xp > 0 ||
      (i === 0 && progress.lastActiveDate === iso)
    result.push({
      date: iso,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
      active,
      isToday: i === 0,
      intensity: intensityFromXp(xp, active),
      xp,
    })
  }

  return result
}

export function getStreakTimeRemaining(progress: UserProgress): number {
  if (progress.streakDays === 0 || !progress.lastActiveAt) return 0
  const elapsed = Date.now() - new Date(progress.lastActiveAt).getTime()
  return Math.max(0, STREAK_WINDOW_MS - elapsed)
}

export function formatStreakCountdown(progress: UserProgress): string | null {
  const ms = getStreakTimeRemaining(progress)
  if (progress.streakDays === 0 || ms <= 0) return null
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h > 0) return `${h}h ${m}m left`
  return `${m}m left`
}

export function isStreakAtRisk(progress: UserProgress): boolean {
  if (progress.streakDays === 0 || !progress.lastActiveAt) return false
  const remaining = getStreakTimeRemaining(progress)
  return remaining > 0 && remaining <= 6 * 60 * 60 * 1000
}

export function getChapterProgressRows(
  subjectId: string,
  progress: UserProgress,
): ChapterProgressRow[] {
  const notesMap = notesReadMap(progress)
  return getChaptersForSubject(subjectId).map((chapter) => {
    const quizLevel = progress.chapters[chapter.id]?.quizLevel ?? 0
    const masteryPercent = getChapterMasteryPercent(chapter.id, notesMap, quizLevel)
    let status: ChapterProgressRow['status'] = 'available'
    if (quizLevel >= 4) status = 'mastered'
    else if (quizLevel > 0 || getTopicsForChapter(chapter.id).some((t) => notesMap[t.id])) {
      status = 'in_progress'
    }
    return { chapter, masteryPercent, quizLevel, status }
  })
}

export function getSubjectSummary(subjectId: string, progress: UserProgress) {
  const rows = getChapterProgressRows(subjectId, progress)
  const mastered = rows.filter((r) => r.status === 'mastered').length
  const inProgress = rows.filter((r) => r.status === 'in_progress').length
  const avgMastery =
    rows.length === 0
      ? 0
      : Math.round(rows.reduce((sum, r) => sum + r.masteryPercent, 0) / rows.length)

  return { total: rows.length, mastered, inProgress, avgMastery, rows }
}

export interface ContinueStudying {
  subjectId: string
  chapterId: string
  topicId: string
  chapterTitle: string
  topicTitle: string
  topicPath: string
}

export function getContinueStudying(progress: UserProgress): ContinueStudying | null {
  if (progress.lastVisitedTopicId && progress.lastVisitedChapterId && progress.lastVisitedSubjectId) {
    const topic = getTopic(progress.lastVisitedTopicId)
    const chapter = getChapter(progress.lastVisitedChapterId)
    if (topic && chapter) {
      return {
        subjectId: progress.lastVisitedSubjectId,
        chapterId: progress.lastVisitedChapterId,
        topicId: progress.lastVisitedTopicId,
        chapterTitle: chapter.title,
        topicTitle: topic.title,
        topicPath: `/subjects/${progress.lastVisitedSubjectId}/chapters/${progress.lastVisitedChapterId}/topics/${progress.lastVisitedTopicId}`,
      }
    }
  }

  let bestChapterId = ''
  let bestDate = ''
  for (const [chapterId, stats] of Object.entries(progress.chapterStats ?? {})) {
    if (stats.lastVisited && stats.lastVisited >= bestDate) {
      bestDate = stats.lastVisited
      bestChapterId = chapterId
    }
  }
  if (!bestChapterId) return null

  const chapter = getChapter(bestChapterId)
  if (!chapter) return null
  const topics = getTopicsForChapter(bestChapterId)
  const notesMap = notesReadMap(progress)
  const nextTopic =
    topics.find((t) => !notesMap[t.id]) ??
    topics.find((t) => (progress.topics[t.id]?.quizLevel ?? 0) < 4) ??
    topics[0]
  if (!nextTopic) return null

  return {
    subjectId: chapter.subjectId,
    chapterId: bestChapterId,
    topicId: nextTopic.id,
    chapterTitle: chapter.title,
    topicTitle: nextTopic.title,
    topicPath: `/subjects/${chapter.subjectId}/chapters/${bestChapterId}/topics/${nextTopic.id}`,
  }
}

export function getTodayStudyMinutes(progress: UserProgress): number {
  const today = new Date().toISOString().slice(0, 10)
  const sec = progress.studySecByDate?.[today] ?? 0
  return Math.round(sec / 60)
}

export interface WeeklyRecap {
  xp: number
  activeDays: number
  streakDays: number
  studyMinutes: number
}

export function getWeeklyRecap(progress: UserProgress): WeeklyRecap {
  const calendar = getStreakCalendar(progress, 7)
  const xp = calendar.reduce((sum, d) => sum + d.xp, 0)
  const activeDays = calendar.filter((d) => d.active).length
  const today = new Date()
  let studySec = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    studySec += progress.studySecByDate?.[iso] ?? 0
  }
  return {
    xp,
    activeDays,
    streakDays: progress.streakDays,
    studyMinutes: Math.round(studySec / 60),
  }
}

export function getWeakTopicLessonPath(chapterId: string): string | null {
  const chapter = getChapter(chapterId)
  if (!chapter) return null
  const topics = getTopicsForChapter(chapterId)
  const first = topics[0]
  if (!first) return null
  return `/subjects/${chapter.subjectId}/chapters/${chapterId}/topics/${first.id}`
}
