export type ProfilePrivacy = 'public' | 'friends' | 'school'

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
}

export function generateFriendCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `FRD-${code}`
}
