import type { LeaderboardMedalTier } from '@/features/social/leaderboardUtils'

export type ProfilePrivacy = 'public' | 'friends' | 'school'

export const PROFILE_THEMES = [
  'light',
  'dark',
  'scholar',
  'aurora',
  'parchment',
  'dusk',
  'slate',
  'ember',
] as const

export type ProfileTheme = (typeof PROFILE_THEMES)[number]

export const PROFILE_THEME_LABELS: Record<ProfileTheme, string> = {
  light: 'Classic',
  dark: 'Midnight',
  scholar: 'Scholar',
  aurora: 'Aurora',
  parchment: 'Parchment',
  dusk: 'Dusk',
  slate: 'Slate',
  ember: 'Ember',
}

export const PROFILE_DARK_THEMES: ProfileTheme[] = [
  'dark',
  'scholar',
  'aurora',
  'dusk',
  'slate',
  'ember',
]

export function normalizeProfileTheme(theme: string | undefined): ProfileTheme {
  if (theme && PROFILE_THEMES.includes(theme as ProfileTheme)) {
    return theme as ProfileTheme
  }
  return 'light'
}

export interface ProfileExtras {
  bio?: string
  examYear?: number
  subjects?: string[]
  privacy?: ProfilePrivacy
  showOnLeaderboard?: boolean
  dailyGoalMin?: number
  achievementIds?: string[]
  friendIds?: string[]
  friendCode?: string
  onboardingComplete?: boolean
  showStudyActivity?: boolean
  profileTheme?: ProfileTheme
  /** Up to 3 achievement ids pinned on profile */
  showcaseAchievementIds?: string[]
  /** Up to 3 earned medal tiers pinned on profile */
  showcaseMedalTiers?: LeaderboardMedalTier[]
}

export const FRIEND_CODE_PATTERN = /^FRD-[A-Z0-9]{6}$/

export function isValidFriendCode(raw: string): boolean {
  return FRIEND_CODE_PATTERN.test(raw.trim().toUpperCase())
}

export function generateFriendCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `FRD-${code}`
}
