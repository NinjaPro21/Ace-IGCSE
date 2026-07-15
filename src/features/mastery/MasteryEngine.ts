import type { Difficulty } from '@/lib/contentTypes'

import { getChapter, getTopicsForChapter } from '@/lib/contentLoader'

import { localDateISO, localDateISODaysAgo } from '@/lib/localDate'

import type { ConceptMissRecord, QuizAttemptRecord, QuizMistakeLogResult, RecordQuizFinishInput } from '@/features/quiz/quizAttemptTypes'

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

import {
  DAILY_QUEST_BONUS_XP,
  evaluateDailyQuests,
  generateDailyQuests,
  type DailyQuestState,
} from './dailyQuests'



export type MasteryLevel = 0 | 1 | 2 | 3 | 4



export interface TopicProgress {

  notesRead?: boolean

  timeSpentSec?: number

  quizLevel?: MasteryLevel

  easyScore?: number

  mediumScore?: number

  hardScore?: number

  pypComplete?: boolean

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

  /** ISO timestamp of last study activity — streak expires after 24h without activity */

  lastActiveAt?: string

  /** ISO dates (YYYY-MM-DD) when the user studied — kept to last 90 days */

  activeDates: string[]

  /** XP earned per calendar day (YYYY-MM-DD) for period leaderboards */

  xpByDate?: Record<string, number>

  displayName: string

  topics: Record<string, TopicProgress>

  chapters: Record<string, ChapterProgress>

  chapterStats: Record<string, ChapterStats>

  /** Lifetime miss counts keyed by concept (topic/chapter + question id). */
  conceptMisses?: Record<string, ConceptMissRecord>

  /** Recent quiz attempts for history / mistake log (newest first). */
  quizAttempts?: QuizAttemptRecord[]

  lastVisitedTopicId?: string

  lastVisitedChapterId?: string

  lastVisitedSubjectId?: string

  dailyGoalMin?: number

  achievementIds?: string[]

  subjects?: string[]

  onboardingComplete?: boolean

  appTourComplete?: boolean

  studySecByDate?: Record<string, number>

  /** Daily study plan — chapters to cover today */
  studyPlanTasks?: StudyPlanTask[]

  /** Firebase uid that owns this local progress blob (prevents cross-account bleed) */
  ownerUserId?: string

  /** Earned by 7-day streak milestones — auto-consumes one missed calendar day */
  streakFreezes?: number

  /** Auto-generated daily missions + bonus claim state */
  dailyQuests?: import('./dailyQuests').DailyQuestState

  /** groupId → ISO week key when weekly school/clan bonus was claimed */
  weeklyChallengeClaims?: Record<string, string>

}



export interface StudyPlanTask {

  id: string

  subjectId: string

  chapterId: string

  chapterTitle: string

  topicId: string

  topicTitle: string

  done: boolean

  addedAt: string

  forDate: string

}



const STORAGE_KEY = 'enlight-progress-v2'

export function clearLocalProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('enlight-progress-v1')
  } catch {
    // ignore storage errors
  }
}

const MAX_ACTIVE_DATES = 90
const MAX_QUIZ_ATTEMPTS = 150



export { XP_REWARDS }



function todayISO(): string {

  return localDateISO()

}

function awardXp(state: UserProgress, amount: number): UserProgress {
  const today = todayISO()
  const xpByDate = { ...(state.xpByDate ?? {}) }
  xpByDate[today] = (xpByDate[today] ?? 0) + amount
  const trimmed: Record<string, number> = {}
  for (const key of Object.keys(xpByDate).sort().slice(-90)) {
    trimmed[key] = xpByDate[key]
  }
  return { ...state, xp: state.xp + amount, xpByDate: trimmed }
}

function addStudySec(state: UserProgress, seconds: number): UserProgress {
  if (seconds <= 0) return state
  const today = todayISO()
  const studySecByDate = { ...(state.studySecByDate ?? {}) }
  studySecByDate[today] = (studySecByDate[today] ?? 0) + seconds
  const trimmed: Record<string, number> = {}
  for (const key of Object.keys(studySecByDate).sort().slice(-90)) {
    trimmed[key] = studySecByDate[key]
  }
  return { ...state, studySecByDate: trimmed }
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

    conceptMisses: parsed.conceptMisses ?? {},

    quizAttempts: parsed.quizAttempts ?? [],

    xpByDate: parsed.xpByDate ?? {},

    studySecByDate: parsed.studySecByDate ?? {},

    studyPlanTasks: parsed.studyPlanTasks ?? [],

    streakFreezes: parsed.streakFreezes ?? 0,

    dailyQuests: parsed.dailyQuests,

    weeklyChallengeClaims: parsed.weeklyChallengeClaims ?? {},

    ownerUserId: parsed.ownerUserId,

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



function daysBetweenDates(a: string, b: string): number {
  return Math.floor((Date.parse(b) - Date.parse(a)) / 86400000)
}

function applyStreakExpiry(state: UserProgress): UserProgress {
  if (state.streakDays === 0 || !state.lastActiveDate) return state

  const today = todayISO()
  const yesterday = localDateISODaysAgo(1)
  if (state.lastActiveDate === today || state.lastActiveDate === yesterday) {
    return state
  }

  const gap = daysBetweenDates(state.lastActiveDate, today)
  // Missed exactly one calendar day — spend a streak freeze instead of resetting.
  if (gap === 2 && (state.streakFreezes ?? 0) > 0) {
    return { ...state, streakFreezes: (state.streakFreezes ?? 0) - 1 }
  }

  return { ...state, streakDays: 0 }
}

function dispatchStreakUp(prev: number, next: number): void {
  if (next > prev && prev > 0) {
    window.dispatchEvent(
      new CustomEvent('enlight-streak-up', { detail: { streakDays: next, prevStreakDays: prev } }),
    )
  }
}

function touchStreak(state: UserProgress): UserProgress {
  const prevStreak = state.streakDays
  const expired = applyStreakExpiry(state)
  const today = todayISO()
  let streak = expired.streakDays
  let streakFreezes = expired.streakFreezes ?? 0

  if (streak === 0) {
    streak = 1
  } else if (expired.lastActiveDate === today) {
    // same calendar day — keep streak count
  } else {
    streak += 1
    if (streak > 0 && streak % 7 === 0) {
      streakFreezes = Math.min(streakFreezes + 1, 3)
    }
  }

  const longestStreak = Math.max(expired.longestStreak, streak)
  dispatchStreakUp(prevStreak, streak)
  return recordActiveDay({
    ...expired,
    streakDays: streak,
    streakFreezes,
    longestStreak,
    lastActiveDate: today,
    lastActiveAt: new Date().toISOString(),
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



function syncChapterFromTopics(state: UserProgress, chapterId: string): UserProgress {

  const topics = getTopicsForChapter(chapterId)

  if (topics.length === 0) return state

  const levels = topics.map((t) => state.topics[t.id]?.quizLevel ?? 0)

  const quizLevel = Math.min(...levels) as MasteryLevel

  const ch = ensureChapter(state, chapterId)

  return {

    ...state,

    chapters: {

      ...state.chapters,

      [chapterId]: { ...ch, quizLevel: Math.max(ch.quizLevel, quizLevel) as MasteryLevel },

    },

  }

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

    }

    const expired = applyStreakExpiry(this.state)

    if (expired.streakDays !== this.state.streakDays) {

      this.state = expired

      saveState(this.state)

    }

    this.syncDailyQuests()

  }



  checkStreakExpiry(): boolean {

    const expired = applyStreakExpiry(this.state)

    if (expired.streakDays !== this.state.streakDays) {

      this.state = expired

      saveState(this.state)

      return true

    }

    return false

  }



  getState(): UserProgress {

    return this.state

  }



  replaceState(state: UserProgress): void {

    this.state = applyStreakExpiry(normalizeState({

      ...state,

      topics: repairTopics(state.topics ?? {}),

    }))

    saveState(this.state)

  }



  clearLocalState(): void {

    clearLocalProgress()

    this.state = defaultState()

  }



  bindOwnerUserId(userId: string): void {

    if (this.state.ownerUserId === userId) return

    this.state = { ...this.state, ownerUserId: userId }

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

    this.state = addStudySec(this.state, seconds)

    saveState(this.state)

    this.syncDailyQuests()

  }



  recordLastVisited(subjectId: string, chapterId: string, topicId: string): void {

    this.state = {

      ...this.state,

      lastVisitedSubjectId: subjectId,

      lastVisitedChapterId: chapterId,

      lastVisitedTopicId: topicId,

    }

    saveState(this.state)

  }



  setDailyGoal(minutes: number): void {

    this.state = { ...this.state, dailyGoalMin: minutes }

    saveState(this.state)

  }



  recordFocusStudySec(seconds: number): void {

    if (seconds <= 0) return

    this.state = touchStreak(this.state)

    this.state = addStudySec(this.state, seconds)

    saveState(this.state)

  }



  /** Claw back study time credited while the user was actually AFK. */

  deductDailyStudySec(seconds: number): void {

    if (seconds <= 0) return

    const today = todayISO()

    const current = this.state.studySecByDate?.[today] ?? 0

    this.state = {

      ...this.state,

      studySecByDate: {

        ...(this.state.studySecByDate ?? {}),

        [today]: Math.max(0, current - Math.round(seconds)),

      },

    }

    saveState(this.state)

  }



  getStudyPlanTasks(forDate = todayISO()): StudyPlanTask[] {

    return (this.state.studyPlanTasks ?? []).filter((t) => t.forDate === forDate)

  }



  addStudyPlanTask(subjectId: string, chapterId: string, forDate = todayISO()): void {

    const existing = (this.state.studyPlanTasks ?? []).some(

      (t) => t.chapterId === chapterId && t.forDate === forDate,

    )

    if (existing) return

    const chapter = getChapter(chapterId)

    if (!chapter) return

    const topics = getTopicsForChapter(chapterId)

    const topic = topics[0]

    if (!topic) return

    const task: StudyPlanTask = {

      id: `${Date.now()}-${chapterId}`,

      subjectId,

      chapterId,

      chapterTitle: chapter.title,

      topicId: topic.id,

      topicTitle: topic.title,

      done: false,

      addedAt: new Date().toISOString(),

      forDate,

    }

    this.state = {

      ...this.state,

      studyPlanTasks: [...(this.state.studyPlanTasks ?? []), task],

    }

    saveState(this.state)

  }



  toggleStudyPlanTask(taskId: string): void {

    const tasks = (this.state.studyPlanTasks ?? []).map((t) =>

      t.id === taskId ? { ...t, done: !t.done } : t,

    )

    this.state = { ...this.state, studyPlanTasks: tasks }

    saveState(this.state)

  }



  removeStudyPlanTask(taskId: string): void {

    this.state = {

      ...this.state,

      studyPlanTasks: (this.state.studyPlanTasks ?? []).filter((t) => t.id !== taskId),

    }

    saveState(this.state)

  }



  setSubjects(subjects: string[]): void {

    this.state = { ...this.state, subjects }

    saveState(this.state)

  }



  setOnboardingComplete(): void {

    this.state = { ...this.state, onboardingComplete: true }

    saveState(this.state)

    window.dispatchEvent(new CustomEvent('ace-progress'))

  }



  setAppTourComplete(): void {

    this.state = { ...this.state, appTourComplete: true }

    saveState(this.state)

    window.dispatchEvent(new CustomEvent('ace-progress'))

  }



  syncAchievementIds(ids: string[]): void {

    this.state = { ...this.state, achievementIds: ids }

    saveState(this.state)

  }



  getChapterQuizLevel(chapterId: string): MasteryLevel {
    // Match unlock gates: stored chapter level is the min topic level
    // (see syncChapterFromTopics), not an average that can overshoot gates.
    return ensureChapter(this.state, chapterId).quizLevel as MasteryLevel
  }



  getTopicQuizLevel(topicId: string): MasteryLevel {

    return (this.state.topics[topicId]?.quizLevel ?? 0) as MasteryLevel

  }



  hasPassedTopicQuiz(topicId: string, difficulty: Difficulty): boolean {

    const topic = this.state.topics[topicId]

    if (!topic) return false

    switch (difficulty) {

      case 'easy':

        return (topic.quizLevel ?? 0) >= 2

      case 'medium':

        return (topic.quizLevel ?? 0) >= 3

      case 'hard':

        return topic.hardScore !== undefined

      case 'pyp':

        return Boolean(topic.pypComplete)

      default:

        return false

    }

  }



  hasPassedChapterQuiz(chapterId: string, difficulty: Difficulty): boolean {

    const ch = ensureChapter(this.state, chapterId)

    switch (difficulty) {

      case 'easy':

        return ch.quizLevel >= 2

      case 'medium':

        return ch.quizLevel >= 3

      case 'hard':

        return ch.hardScore !== undefined

      case 'pyp':

        return Boolean(ch.pypComplete)

      default:

        return false

    }

  }



  hasAttemptedTopicQuiz(topicId: string, difficulty: Difficulty): boolean {

    if (this.hasPassedTopicQuiz(topicId, difficulty)) return true

    return (this.state.quizAttempts ?? []).some(

      (a) => a.topicId === topicId && a.difficulty === difficulty,

    )

  }



  hasAttemptedChapterQuiz(chapterId: string, difficulty: Difficulty): boolean {

    if (this.hasPassedChapterQuiz(chapterId, difficulty)) return true

    return (this.state.quizAttempts ?? []).some(

      (a) => a.chapterId === chapterId && !a.topicId && a.difficulty === difficulty,

    )

  }



  canTakeTopicQuiz(topicId: string, difficulty: Difficulty): boolean {

    if (this.hasPassedTopicQuiz(topicId, difficulty)) return false

    const level = this.getTopicQuizLevel(topicId)

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

    if (this.hasPassedChapterQuiz(chapterId, difficulty)) return false

    const level = ensureChapter(this.state, chapterId).quizLevel

    switch (difficulty) {

      case 'easy':

        return level >= 1

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



    // Capture completion state before marking this topic read, otherwise the

    // read that completes the chapter reports "already complete".

    const wasComplete = areChapterNotesComplete(this.state, chapterId)

    this.state = touchStreak(this.state)

    this.state = awardXp(this.state, XP_REWARDS.notesRead)

    this.state = {

      ...this.state,

      topics: {

        ...this.state.topics,

        [topicId]: { ...topic, notesRead: true, quizLevel: Math.max(topic.quizLevel ?? 0, 1) as MasteryLevel },

      },

    }

    this.state = syncChapterQuizUnlock(this.state, chapterId)

    const nowComplete = areChapterNotesComplete(this.state, chapterId)

    saveState(this.state)

    this.syncDailyQuests({ chapterId, topicId })

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



  /**

   * `countDailyStudy: false` when a topic session is running on the same page

   * — the topic session already credits studySecByDate for the same wall

   * clock, and crediting both doubles daily-goal progress.

   */

  addChapterTime(chapterId: string, seconds: number, countDailyStudy = true): void {

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

    if (countDailyStudy) {

      this.state = addStudySec(this.state, seconds)

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
    this.state = awardXp(this.state, xpGain)

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



    this.syncDailyQuests({
      chapterId,
      mediumQuizPassed: passed && difficulty === 'medium',
    })

    return xpGain

  }



  recordTopicQuizResult(

    topicId: string,

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

    this.state = awardXp(this.state, xpGain)



    const topic = ensureTopic(this.state, topicId)

    const updatedTopic: TopicProgress = { ...topic }



    if (difficulty === 'easy') {

      updatedTopic.easyScore = score

      if ((topic.quizLevel ?? 0) < 2) updatedTopic.quizLevel = 2

    } else if (difficulty === 'medium') {

      updatedTopic.mediumScore = score

      if ((topic.quizLevel ?? 0) < 3) updatedTopic.quizLevel = 3

    } else if (difficulty === 'hard') {

      updatedTopic.hardScore = score

      if ((topic.quizLevel ?? 0) < 4) updatedTopic.quizLevel = 4

    } else if (difficulty === 'pyp') {

      updatedTopic.pypComplete = true

      updatedTopic.quizLevel = 4

    }



    this.state = {

      ...this.state,

      topics: { ...this.state.topics, [topicId]: updatedTopic },

      chapterStats: { ...this.state.chapterStats, [chapterId]: updatedStats },

    }

    this.state = syncChapterFromTopics(this.state, chapterId)

    saveState(this.state)



    const levelAfter = getGlobalLevel(this.state.xp)

    if (levelAfter > levelBefore) {

      window.dispatchEvent(

        new CustomEvent('enlight-level-up', { detail: { level: levelAfter } }),

      )

    }



    this.syncDailyQuests({
      chapterId,
      topicId,
      mediumQuizPassed: passed && difficulty === 'medium',
    })

    return xpGain

  }



  recordQuizFinish(input: RecordQuizFinishInput): QuizMistakeLogResult {

    const log = this.recordQuizMistakes(input)

    const attempt: QuizAttemptRecord = {

      id: `${Date.now()}-${input.quizId}`,

      at: new Date().toISOString(),

      subjectId: input.subjectId,

      chapterId: input.chapterId,

      topicId: input.topicId,

      quizId: input.quizId,

      quizTitle: input.quizTitle,

      difficulty: input.difficulty,

      scorePercent: input.scorePercent,

      passed: input.passed,

      questionCount: input.questionCount,

      correctCount: input.correctCount,

      mistakes: log.entries,

    }

    const quizAttempts = [attempt, ...(this.state.quizAttempts ?? [])].slice(0, MAX_QUIZ_ATTEMPTS)

    this.state = { ...this.state, quizAttempts }

    saveState(this.state)

    return log

  }



  recordQuizMistakes(input: RecordQuizFinishInput): QuizMistakeLogResult {

    const now = new Date().toISOString()

    const conceptMisses = { ...(this.state.conceptMisses ?? {}) }

    const scopeMisses = new Map<string, { label: string; count: number }>()

    const entries = input.mistakes.map((m) => {

      const prev = conceptMisses[m.conceptKey]

      const totalMisses = (prev?.missCount ?? 0) + 1

      conceptMisses[m.conceptKey] = {

        conceptKey: m.conceptKey,

        conceptLabel: m.conceptLabel,

        scopeId: m.scopeId,

        missCount: totalMisses,

        lastAt: now,

      }



      const scopeBucket = scopeMisses.get(m.scopeId) ?? { label: m.conceptLabel, count: 0 }

      scopeBucket.count += 1

      scopeMisses.set(m.scopeId, scopeBucket)



      return {

        questionId: m.questionId,

        questionText: m.questionText,

        conceptKey: m.conceptKey,

        conceptLabel: m.conceptLabel,

        selectedIndex: m.selectedIndex,

        correctIndex: m.correctIndex,

        selectedLabel: m.selectedLabel,

        correctLabel: m.correctLabel,

        explanation: m.explanation,

        totalMisses,

        isRepeatConcept: totalMisses >= 2,

      }

    })



    this.state = { ...this.state, conceptMisses }

    saveState(this.state)



    const hotSubtopics = [...scopeMisses.entries()]

      .filter(([, v]) => v.count >= 2)

      .map(([scopeId, v]) => ({ scopeId, label: v.label, missCount: v.count }))



    return { entries, hotSubtopics }

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

    window.addEventListener('ace-progress', handler)

    return () => window.removeEventListener('ace-progress', handler)

  }



  notify(): void {

    this.syncDailyQuests()

    window.dispatchEvent(new Event('ace-progress'))

  }



  getDailyQuests(): DailyQuestState {

    this.syncDailyQuests()

    return this.state.dailyQuests!

  }



  claimDailyQuestBonus(): boolean {

    const dq = this.getDailyQuests()

    if (dq.bonusClaimed || !dq.quests.every((q) => q.done)) return false

    this.state = {

      ...this.state,

      dailyQuests: { ...dq, bonusClaimed: true },

    }

    this.state = awardXp(this.state, DAILY_QUEST_BONUS_XP)

    saveState(this.state)

    this.notify()

    return true

  }



  claimWeeklyChallengeBonus(groupId: string, weekKey: string, bonusXp = 50): boolean {

    const claims = this.state.weeklyChallengeClaims ?? {}

    if (claims[groupId] === weekKey) return false

    this.state = {

      ...this.state,

      weeklyChallengeClaims: { ...claims, [groupId]: weekKey },

    }

    this.state = awardXp(this.state, bonusXp)

    saveState(this.state)

    this.notify()

    return true

  }



  private syncDailyQuests(ctx?: {

    chapterId?: string

    topicId?: string

    mediumQuizPassed?: boolean

    notesStudiedSec?: number

  }): void {

    const today = todayISO()

    let dq = this.state.dailyQuests

    if (!dq || dq.forDate !== today) {

      dq = generateDailyQuests(this.state, today)

    } else {

      dq = evaluateDailyQuests(dq, this.state, ctx)

    }

    if (JSON.stringify(dq) !== JSON.stringify(this.state.dailyQuests)) {

      this.state = { ...this.state, dailyQuests: dq }

      saveState(this.state)

    }

  }

}



export const masteryEngine = new MasteryEngine()

