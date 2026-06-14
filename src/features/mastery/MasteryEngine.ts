import type { Difficulty } from '@/lib/contentTypes'

import { getTopicsForChapter } from '@/lib/contentLoader'

import { getGlobalLevel, getLevelProfile, NOTES_MIN_SECONDS, XP_REWARDS, type LevelProfile } from './levelSystem'

import {

  getAchievements,

  getActivityStats,

  getStreakCalendar,

  isStreakAtRisk,

  type Achievement,

  type ActivityStats,

  type StreakDay,

} from './progressStats'



export type MasteryLevel = 0 | 1 | 2 | 3 | 4



export interface TopicProgress {

  notesRead?: boolean

  timeSpentSec?: number

}



export interface ChapterProgress {

  quizLevel: MasteryLevel

  easyScore?: number

  mediumScore?: number

  hardScore?: number

  pypComplete?: boolean

  popoutSeen?: boolean

}



export interface ChapterStats {

  timeSpentSec: number

  quizAttempts: number

  quizFails: number

  visits: number

  lastVisited: string

}



export interface UserProgress {

  xp: number

  streakDays: number

  longestStreak: number

  lastActiveDate: string

  /** ISO dates (YYYY-MM-DD) when the user studied — kept to last 90 days */

  activeDates: string[]

  displayName: string

  topics: Record<string, TopicProgress>

  chapters: Record<string, ChapterProgress>

  chapterStats: Record<string, ChapterStats>

}



const STORAGE_KEY = 'enlight-progress-v2'

const MAX_ACTIVE_DATES = 90



export { XP_REWARDS }



function todayISO(): string {

  return new Date().toISOString().slice(0, 10)

}



function defaultState(): UserProgress {

  return {

    xp: 0,

    streakDays: 0,

    longestStreak: 0,

    lastActiveDate: '',

    activeDates: [],

    displayName: '',

    topics: {},

    chapters: {},

    chapterStats: {},

  }

}



function normalizeState(parsed: Partial<UserProgress>): UserProgress {

  const streakDays = parsed.streakDays ?? 0

  const activeDates = parsed.activeDates ?? []

  if (activeDates.length === 0 && parsed.lastActiveDate) {

    activeDates.push(parsed.lastActiveDate)

  }

  return {

    ...defaultState(),

    ...parsed,

    streakDays,

    longestStreak: parsed.longestStreak ?? streakDays,

    activeDates,

    displayName: parsed.displayName ?? '',

    topics: repairTopics(parsed.topics ?? {}),

    chapters: parsed.chapters ?? {},

    chapterStats: parsed.chapterStats ?? {},

  }

}



function loadState(): UserProgress {

  try {

    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {

      const legacy = localStorage.getItem('enlight-progress-v1')

      if (legacy) {

        const parsed = JSON.parse(legacy)

        const topics: Record<string, TopicProgress> = {}

        for (const [id] of Object.entries(parsed.topics ?? {})) {

          topics[id] = { notesRead: false, timeSpentSec: 0 }

        }

        return normalizeState({

          xp: parsed.xp ?? 0,

          streakDays: parsed.streakDays ?? 0,

          lastActiveDate: parsed.lastActiveDate ?? '',

          topics,

        })

      }

      return defaultState()

    }

    return normalizeState(JSON.parse(raw))

  } catch {

    return defaultState()

  }

}



function saveState(state: UserProgress): void {

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

}



function recordActiveDay(state: UserProgress): UserProgress {

  const today = todayISO()

  const dates = state.activeDates.includes(today)

    ? state.activeDates

    : [...state.activeDates, today].slice(-MAX_ACTIVE_DATES)

  return { ...state, activeDates: dates }

}



function touchStreak(state: UserProgress): UserProgress {

  const today = todayISO()

  if (state.lastActiveDate === today) {

    return recordActiveDay(state)

  }



  const yesterday = new Date()

  yesterday.setDate(yesterday.getDate() - 1)

  const yesterdayStr = yesterday.toISOString().slice(0, 10)



  let streak = state.streakDays

  if (state.lastActiveDate === yesterdayStr) {

    streak += 1

  } else if (state.lastActiveDate !== today) {

    streak = 1

  }



  const longestStreak = Math.max(state.longestStreak, streak)

  return recordActiveDay({

    ...state,

    streakDays: streak,

    longestStreak,

    lastActiveDate: today,

  })

}



function ensureTopic(state: UserProgress, topicId: string): TopicProgress {

  const raw = state.topics[topicId] ?? { notesRead: false, timeSpentSec: 0 }

  if (raw.notesRead && (raw.timeSpentSec ?? 0) < NOTES_MIN_SECONDS) {

    return { ...raw, notesRead: false }

  }

  return raw

}



function isTopicStudyComplete(topic: TopicProgress): boolean {

  return Boolean(topic.notesRead) && (topic.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS

}



function repairTopics(topics: Record<string, TopicProgress>): Record<string, TopicProgress> {

  const repaired: Record<string, TopicProgress> = {}

  for (const [id, topic] of Object.entries(topics)) {

    if (topic.notesRead && (topic.timeSpentSec ?? 0) < NOTES_MIN_SECONDS) {

      repaired[id] = { ...topic, notesRead: false }

    } else {

      repaired[id] = topic

    }

  }

  return repaired

}



function ensureChapter(state: UserProgress, chapterId: string): ChapterProgress {

  return state.chapters[chapterId] ?? { quizLevel: 0 }

}



function ensureChapterStats(state: UserProgress, chapterId: string): ChapterStats {

  return state.chapterStats?.[chapterId] ?? {

    timeSpentSec: 0,

    quizAttempts: 0,

    quizFails: 0,

    visits: 0,

    lastVisited: '',

  }

}



function areChapterNotesComplete(state: UserProgress, chapterId: string): boolean {

  const chapterTopics = getTopicsForChapter(chapterId)

  if (chapterTopics.length === 0) return false

  return chapterTopics.every((t) => isTopicStudyComplete(ensureTopic(state, t.id)))

}



function syncChapterQuizUnlock(state: UserProgress, chapterId: string): UserProgress {

  if (!areChapterNotesComplete(state, chapterId)) return state

  const ch = ensureChapter(state, chapterId)

  if (ch.quizLevel >= 1) return state

  return {

    ...state,

    chapters: {

      ...state.chapters,

      [chapterId]: { ...ch, quizLevel: 1 },

    },

  }

}



export class MasteryEngine {

  private state: UserProgress



  constructor() {

    this.state = loadState()

    const repairedTopics = repairTopics(this.state.topics)

    if (repairedTopics !== this.state.topics) {

      this.state = { ...this.state, topics: repairedTopics }

      saveState(this.state)

    }

  }



  getState(): UserProgress {

    return this.state

  }



  replaceState(state: UserProgress): void {

    this.state = normalizeState({

      ...state,

      topics: repairTopics(state.topics ?? {}),

    })

    saveState(this.state)

  }



  isNotesRead(topicId: string): boolean {

    return isTopicStudyComplete(ensureTopic(this.state, topicId))

  }



  getTopicTimeSpent(topicId: string): number {

    return ensureTopic(this.state, topicId).timeSpentSec ?? 0

  }



  hasTopicStudyTime(topicId: string): boolean {

    return (ensureTopic(this.state, topicId).timeSpentSec ?? 0) >= NOTES_MIN_SECONDS

  }



  addTopicTime(topicId: string, seconds: number): void {

    if (seconds <= 0) return

    const topic = ensureTopic(this.state, topicId)

    this.state = {

      ...this.state,

      topics: {

        ...this.state.topics,

        [topicId]: {

          ...topic,

          timeSpentSec: (topic.timeSpentSec ?? 0) + seconds,

        },

      },

    }

    saveState(this.state)

  }



  getChapterQuizLevel(chapterId: string): MasteryLevel {

    return ensureChapter(this.state, chapterId).quizLevel

  }



  areChapterNotesComplete(chapterId: string): boolean {

    return areChapterNotesComplete(this.state, chapterId)

  }



  shouldShowChapterPopout(chapterId: string): boolean {

    const ch = ensureChapter(this.state, chapterId)

    return areChapterNotesComplete(this.state, chapterId) && ch.quizLevel === 1 && !ch.popoutSeen

  }



  markChapterPopoutSeen(chapterId: string): void {

    const ch = ensureChapter(this.state, chapterId)

    this.state = {

      ...this.state,

      chapters: {

        ...this.state.chapters,

        [chapterId]: { ...ch, popoutSeen: true },

      },

    }

    saveState(this.state)

  }



  getGlobalLevel(): number {

    return getGlobalLevel(this.state.xp)

  }



  getLevelProfile(): LevelProfile {

    return getLevelProfile(this.state.xp)

  }



  getActivityStats(): ActivityStats {

    return getActivityStats(this.state)

  }



  getAchievements(): Achievement[] {

    return getAchievements(this.state)

  }



  getStreakCalendar(days = 14): StreakDay[] {

    return getStreakCalendar(this.state, days)

  }



  isStreakAtRisk(): boolean {

    return isStreakAtRisk(this.state)

  }



  setDisplayName(name: string): void {

    this.state = { ...this.state, displayName: name.trim().slice(0, 24) }

    saveState(this.state)

  }



  canTakeChapterQuiz(chapterId: string, difficulty: Difficulty): boolean {

    const level = this.getChapterQuizLevel(chapterId)

    switch (difficulty) {

      case 'easy':

        return true

      case 'medium':

        return level >= 2

      case 'hard':

        return level >= 3

      case 'pyp':

        return level >= 3

      default:

        return false

    }

  }



  markNotesRead(topicId: string, chapterId: string): boolean {

    const topic = ensureTopic(this.state, topicId)

    if (topic.notesRead && isTopicStudyComplete(topic)) return false

    if ((topic.timeSpentSec ?? 0) < NOTES_MIN_SECONDS) return false



    this.state = touchStreak(this.state)



    this.state = {

      ...this.state,

      xp: this.state.xp + XP_REWARDS.notesRead,

      topics: {

        ...this.state.topics,

        [topicId]: { ...topic, notesRead: true },

      },

    }

    const wasComplete = areChapterNotesComplete(this.state, chapterId)

    this.state = syncChapterQuizUnlock(this.state, chapterId)

    const nowComplete = areChapterNotesComplete(this.state, chapterId)

    saveState(this.state)

    return !wasComplete && nowComplete

  }



  recordChapterVisit(chapterId: string): void {

    const stats = ensureChapterStats(this.state, chapterId)

    this.state = {

      ...this.state,

      chapterStats: {

        ...this.state.chapterStats,

        [chapterId]: {

          ...stats,

          visits: stats.visits + 1,

          lastVisited: todayISO(),

        },

      },

    }

    saveState(this.state)

  }



  addChapterTime(chapterId: string, seconds: number): void {

    if (seconds <= 0) return

    const stats = ensureChapterStats(this.state, chapterId)

    this.state = {

      ...this.state,

      chapterStats: {

        ...this.state.chapterStats,

        [chapterId]: {

          ...stats,

          timeSpentSec: stats.timeSpentSec + seconds,

          lastVisited: todayISO(),

        },

      },

    }

    saveState(this.state)

  }



  recordChapterQuizResult(

    chapterId: string,

    difficulty: Difficulty,

    scorePercent: number,

    passed: boolean,

  ): number {

    const score = Math.min(100, Math.max(0, scorePercent))

    const stats = ensureChapterStats(this.state, chapterId)

    const updatedStats: ChapterStats = {

      ...stats,

      quizAttempts: stats.quizAttempts + 1,

      quizFails: passed ? stats.quizFails : stats.quizFails + 1,

      lastVisited: todayISO(),

    }



    if (!passed) {

      this.state = {

        ...this.state,

        chapterStats: { ...this.state.chapterStats, [chapterId]: updatedStats },

      }

      saveState(this.state)

      return 0

    }



    const xpGain = XP_REWARDS[difficulty]

    const levelBefore = getGlobalLevel(this.state.xp)



    this.state = touchStreak(this.state)

    const ch = ensureChapter(this.state, chapterId)

    const updated: ChapterProgress = { ...ch }



    if (difficulty === 'easy') {

      updated.easyScore = score

      if (ch.quizLevel < 2) updated.quizLevel = 2

    } else if (difficulty === 'medium') {

      updated.mediumScore = score

      if (ch.quizLevel < 3) updated.quizLevel = 3

    } else if (difficulty === 'hard') {

      updated.hardScore = score

      if (ch.quizLevel < 4) updated.quizLevel = 4

    } else if (difficulty === 'pyp') {

      updated.pypComplete = true

      updated.quizLevel = 4

    }



    this.state = {

      ...this.state,

      xp: this.state.xp + xpGain,

      chapters: { ...this.state.chapters, [chapterId]: updated },

      chapterStats: { ...this.state.chapterStats, [chapterId]: updatedStats },

    }

    saveState(this.state)



    const levelAfter = getGlobalLevel(this.state.xp)

    if (levelAfter > levelBefore) {

      window.dispatchEvent(

        new CustomEvent('enlight-level-up', { detail: { level: levelAfter } }),

      )

    }



    return xpGain

  }



  getTopicNotesReadMap(): Record<string, boolean> {

    const map: Record<string, boolean> = {}

    for (const [id, t] of Object.entries(this.state.topics)) {

      map[id] = isTopicStudyComplete(t)

    }

    return map

  }



  subscribe(listener: () => void): () => void {

    const handler = () => listener()

    window.addEventListener('enlight-progress', handler)

    return () => window.removeEventListener('enlight-progress', handler)

  }



  notify(): void {

    window.dispatchEvent(new Event('enlight-progress'))

  }

}



export const masteryEngine = new MasteryEngine()

