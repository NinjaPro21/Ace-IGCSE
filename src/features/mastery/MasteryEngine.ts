import type { Difficulty } from '@/lib/contentTypes'
import { getTopicsForChapter } from '@/lib/contentLoader'

export type MasteryLevel = 0 | 1 | 2 | 3 | 4

export interface TopicProgress {
  notesRead?: boolean
}

export interface ChapterProgress {
  quizLevel: MasteryLevel
  easyScore?: number
  mediumScore?: number
  hardScore?: number
  pypComplete?: boolean
  popoutSeen?: boolean
}

export interface UserProgress {
  xp: number
  streakDays: number
  lastActiveDate: string
  topics: Record<string, TopicProgress>
  chapters: Record<string, ChapterProgress>
}

const STORAGE_KEY = 'enlight-progress-v2'

const XP_REWARDS: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 35,
  pyp: 50,
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function defaultState(): UserProgress {
  return {
    xp: 0,
    streakDays: 0,
    lastActiveDate: '',
    topics: {},
    chapters: {},
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
        for (const [id, t] of Object.entries(parsed.topics ?? {})) {
          const tp = t as { notesRead?: boolean; level?: number }
          topics[id] = { notesRead: tp.notesRead || (tp.level ?? 0) >= 1 }
        }
        return { ...defaultState(), xp: parsed.xp ?? 0, streakDays: parsed.streakDays ?? 0, lastActiveDate: parsed.lastActiveDate ?? '', topics }
      }
      return defaultState()
    }
    const parsed = JSON.parse(raw)
    return {
      ...defaultState(),
      ...parsed,
      topics: parsed.topics ?? {},
      chapters: parsed.chapters ?? {},
    }
  } catch {
    return defaultState()
  }
}

function saveState(state: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function touchStreak(state: UserProgress): UserProgress {
  const today = todayISO()
  if (state.lastActiveDate === today) return state

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  let streak = state.streakDays
  if (state.lastActiveDate === yesterdayStr) {
    streak += 1
  } else if (state.lastActiveDate !== today) {
    streak = 1
  }

  return { ...state, streakDays: streak, lastActiveDate: today }
}

function ensureTopic(state: UserProgress, topicId: string): TopicProgress {
  return state.topics[topicId] ?? { notesRead: false }
}

function ensureChapter(state: UserProgress, chapterId: string): ChapterProgress {
  return state.chapters[chapterId] ?? { quizLevel: 0 }
}

function areChapterNotesComplete(state: UserProgress, chapterId: string): boolean {
  const chapterTopics = getTopicsForChapter(chapterId)
  if (chapterTopics.length === 0) return false
  return chapterTopics.every((t) => ensureTopic(state, t.id).notesRead)
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
  }

  getState(): UserProgress {
    return this.state
  }

  isNotesRead(topicId: string): boolean {
    return ensureTopic(this.state, topicId).notesRead ?? false
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
    return Math.floor(this.state.xp / 100) + 1
  }

  canTakeChapterQuiz(chapterId: string, difficulty: Difficulty): boolean {
    const level = this.getChapterQuizLevel(chapterId)
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
    this.state = touchStreak(this.state)
    const topic = ensureTopic(this.state, topicId)
    if (topic.notesRead) return false

    this.state = {
      ...this.state,
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

  recordChapterQuizResult(
    chapterId: string,
    difficulty: Difficulty,
    scorePercent: number,
    passed: boolean,
  ): void {
    if (!passed) return

    this.state = touchStreak(this.state)
    const ch = ensureChapter(this.state, chapterId)
    const updated: ChapterProgress = { ...ch }

    if (difficulty === 'easy') {
      updated.easyScore = scorePercent
      if (ch.quizLevel < 2) updated.quizLevel = 2
    } else if (difficulty === 'medium') {
      updated.mediumScore = scorePercent
      if (ch.quizLevel < 3) updated.quizLevel = 3
    } else if (difficulty === 'hard') {
      updated.hardScore = scorePercent
      if (ch.quizLevel < 4) updated.quizLevel = 4
    } else if (difficulty === 'pyp') {
      updated.pypComplete = true
      updated.quizLevel = 4
    }

    this.state = {
      ...this.state,
      xp: this.state.xp + XP_REWARDS[difficulty],
      chapters: { ...this.state.chapters, [chapterId]: updated },
    }
    saveState(this.state)
  }

  getTopicNotesReadMap(): Record<string, boolean> {
    const map: Record<string, boolean> = {}
    for (const [id, t] of Object.entries(this.state.topics)) {
      map[id] = t.notesRead ?? false
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
