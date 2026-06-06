import type { Difficulty } from '@/lib/contentTypes'

export type MasteryLevel = 0 | 1 | 2 | 3 | 4

export interface TopicProgress {
  level: MasteryLevel
  easyScore?: number
  mediumScore?: number
  hardScore?: number
  pypComplete?: boolean
  notesRead?: boolean
}

export interface UserProgress {
  xp: number
  streakDays: number
  lastActiveDate: string
  topics: Record<string, TopicProgress>
}

const STORAGE_KEY = 'enlight-progress-v1'

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
  }
}

function loadState(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return { ...defaultState(), ...JSON.parse(raw) }
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
  return state.topics[topicId] ?? { level: 0, notesRead: false }
}

export class MasteryEngine {
  private state: UserProgress

  constructor() {
    this.state = loadState()
  }

  getState(): UserProgress {
    return this.state
  }

  getTopicLevel(topicId: string): MasteryLevel {
    return ensureTopic(this.state, topicId).level
  }

  getGlobalLevel(): number {
    return Math.floor(this.state.xp / 100) + 1
  }

  canTakeQuiz(topicId: string, difficulty: Difficulty): boolean {
    const level = this.getTopicLevel(topicId)
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

  markNotesRead(topicId: string): void {
    this.state = touchStreak(this.state)
    const topic = ensureTopic(this.state, topicId)
    const updated: TopicProgress = { ...topic, notesRead: true }
    if (topic.level < 1) {
      updated.level = 1
    }
    this.state = {
      ...this.state,
      topics: { ...this.state.topics, [topicId]: updated },
    }
    saveState(this.state)
  }

  recordQuizResult(
    topicId: string,
    difficulty: Difficulty,
    scorePercent: number,
    passed: boolean,
  ): void {
    if (!passed) return

    this.state = touchStreak(this.state)
    const topic = ensureTopic(this.state, topicId)
    const updated: TopicProgress = { ...topic }

    if (difficulty === 'easy') {
      updated.easyScore = scorePercent
      if (topic.level < 2) updated.level = 2
    } else if (difficulty === 'medium') {
      updated.mediumScore = scorePercent
      if (topic.level < 3) updated.level = 3
    } else if (difficulty === 'hard') {
      updated.hardScore = scorePercent
      if (topic.level < 4) updated.level = 4
    } else if (difficulty === 'pyp') {
      updated.pypComplete = true
      updated.level = 4
    }

    this.state = {
      ...this.state,
      xp: this.state.xp + XP_REWARDS[difficulty],
      topics: { ...this.state.topics, [topicId]: updated },
    }
    saveState(this.state)
  }

  getChecklistCount(topicId: string): number {
    return this.getTopicLevel(topicId)
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
