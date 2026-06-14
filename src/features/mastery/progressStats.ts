import {
  getChapterMasteryPercent,
  getChaptersForSubject,
  getTopicsForChapter,
} from '@/lib/contentLoader'
import type { ChapterMeta } from '@/lib/contentTypes'
import type { UserProgress } from './MasteryEngine'
import { getGlobalLevel, NOTES_MIN_SECONDS } from './levelSystem'

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

export function getStreakCalendar(progress: UserProgress, days = 14): StreakDay[] {
  const activeSet = new Set(progress.activeDates ?? [])
  const today = new Date()
  const result: StreakDay[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    result.push({
      date: iso,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
      active: activeSet.has(iso) || (i === 0 && progress.lastActiveDate === iso),
      isToday: i === 0,
    })
  }

  return result
}

export function isStreakAtRisk(progress: UserProgress): boolean {
  if (progress.streakDays === 0) return false
  const today = new Date().toISOString().slice(0, 10)
  return progress.lastActiveDate !== today
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
