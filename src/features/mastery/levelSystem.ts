/** Base XP to advance from level 1 → 2 */
export const BASE_XP_PER_LEVEL = 100

/** Each level adds this much to the XP gap (100 → 120 → 140 …) */
export const XP_LEVEL_INCREMENT = 20

/** @deprecated Use getXpRequiredForNextLevel — kept for legacy imports */
export const XP_PER_LEVEL = BASE_XP_PER_LEVEL

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
  xpRequiredForNextLevel: number
  levelProgressPercent: number
}

/** XP needed to go from `level` to `level + 1` */
export function getXpRequiredForNextLevel(level: number): number {
  if (level < 1) return BASE_XP_PER_LEVEL
  return BASE_XP_PER_LEVEL + (level - 1) * XP_LEVEL_INCREMENT
}

/** Total XP required to reach `level` (level 1 starts at 0 XP) */
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0
  const tiers = level - 1
  return tiers * BASE_XP_PER_LEVEL + (XP_LEVEL_INCREMENT * (tiers - 1) * tiers) / 2
}

export function getGlobalLevel(xp: number): number {
  if (xp <= 0) return 1
  let level = 1
  while (getXpForLevel(level + 1) <= xp) {
    level += 1
    if (level > 999) break
  }
  return level
}

export function getLevelTitle(level: number): string {
  const idx = Math.min(level - 1, LEVEL_TITLES.length - 1)
  return LEVEL_TITLES[Math.max(0, idx)]
}

export function getLevelProfile(xp: number): LevelProfile {
  const level = getGlobalLevel(xp)
  const xpFloor = getXpForLevel(level)
  const xpRequiredForNextLevel = getXpRequiredForNextLevel(level)
  const xpInLevel = xp - xpFloor
  const xpToNextLevel = xpRequiredForNextLevel - xpInLevel
  const levelProgressPercent =
    xpRequiredForNextLevel === 0 ? 0 : Math.round((xpInLevel / xpRequiredForNextLevel) * 100)

  return {
    level,
    title: getLevelTitle(level),
    xp,
    xpInLevel,
    xpToNextLevel,
    xpRequiredForNextLevel,
    levelProgressPercent,
  }
}
