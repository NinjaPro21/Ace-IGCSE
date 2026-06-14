export const XP_PER_LEVEL = 100

/** Minimum seconds on a topic before notes-read XP is awarded */
export const NOTES_MIN_SECONDS = 300

export const XP_REWARDS = {
  notesRead: 5,
  easy: 10,
  medium: 20,
  hard: 35,
  pyp: 50,
} as const

const LEVEL_TITLES = [
  'Novice',
  'Student',
  'Apprentice',
  'Practitioner',
  'Specialist',
  'Expert',
  'Master',
  'Grandmaster',
  'Sage',
  'Enlightened',
] as const

export interface LevelProfile {
  level: number
  title: string
  xp: number
  xpInLevel: number
  xpToNextLevel: number
  levelProgressPercent: number
}

export function getGlobalLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getLevelTitle(level: number): string {
  const idx = Math.min(level - 1, LEVEL_TITLES.length - 1)
  return LEVEL_TITLES[Math.max(0, idx)]
}

export function getLevelProfile(xp: number): LevelProfile {
  const level = getGlobalLevel(xp)
  const xpInLevel = xp % XP_PER_LEVEL
  const xpToNextLevel = xpInLevel === 0 && xp > 0 ? XP_PER_LEVEL : XP_PER_LEVEL - xpInLevel
  const levelProgressPercent =
    xp === 0 ? 0 : Math.round((xpInLevel / XP_PER_LEVEL) * 100)

  return {
    level,
    title: getLevelTitle(level),
    xp,
    xpInLevel,
    xpToNextLevel,
    levelProgressPercent,
  }
}
