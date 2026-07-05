import type { Achievement } from '@/features/mastery/progressStats'
import type { SchoolGroup } from '@/features/social/socialTypes'
import {
  fetchGlobalLeaderboardWithRank,
  fetchLeaderboard,
  type CloudProfile,
} from '@/features/social/socialApi'
import { getRankMedal, medalLabel, type LeaderboardMedalTier } from '@/features/social/leaderboardUtils'
import {
  normalizeProfileTheme,
  PROFILE_DARK_THEMES,
  type ProfileTheme,
} from '@/features/social/profileTypes'

const MAX_SHOWCASE = 3

export async function getEarnedMedalTiers(
  userId: string,
  school: SchoolGroup | null,
  clans: SchoolGroup[],
): Promise<LeaderboardMedalTier[]> {
  const earned = new Set<LeaderboardMedalTier>()

  const global = await fetchGlobalLeaderboardWithRank(userId, { limit: 10 })
  if (global.userRank) {
    const tier = getRankMedal(global.userRank, 'global')
    if (tier) earned.add(tier)
  }

  if (school) {
    const rows = await fetchLeaderboard(school.id, 'school', userId)
    const idx = rows.findIndex((r) => r.userId === userId)
    if (idx >= 0) {
      const tier = getRankMedal(idx + 1, 'group')
      if (tier) earned.add(tier)
    }
  }

  for (const clan of clans) {
    const rows = await fetchLeaderboard(clan.id, 'clan', userId)
    const idx = rows.findIndex((r) => r.userId === userId)
    if (idx >= 0) {
      const tier = getRankMedal(idx + 1, 'group')
      if (tier) earned.add(tier)
    }
  }

  const order: LeaderboardMedalTier[] = ['gold', 'silver', 'bronze', 'elite', 'top10']
  return order.filter((t) => earned.has(t))
}

export function resolveShowcaseAchievements(
  all: Achievement[],
  showcaseIds: string[] | undefined,
): Achievement[] {
  const unlocked = all.filter((a) => a.unlocked)
  const ids = (showcaseIds ?? []).slice(0, MAX_SHOWCASE)
  const picked = ids
    .map((id) => unlocked.find((a) => a.id === id))
    .filter((a): a is Achievement => Boolean(a))
  if (picked.length > 0) return picked
  return unlocked.slice(0, MAX_SHOWCASE)
}

export function resolveShowcaseMedals(
  earned: LeaderboardMedalTier[],
  showcaseTiers: LeaderboardMedalTier[] | undefined,
): LeaderboardMedalTier[] {
  const earnedSet = new Set(earned)
  if (showcaseTiers && showcaseTiers.length > 0) {
    const valid =
      earned.length > 0 ? showcaseTiers.filter((t) => earnedSet.has(t)) : showcaseTiers
    if (valid.length > 0) return valid.slice(0, MAX_SHOWCASE)
  }
  return earned.slice(0, MAX_SHOWCASE)
}

export function toggleShowcaseId(current: string[], id: string, max = MAX_SHOWCASE): string[] {
  if (current.includes(id)) return current.filter((x) => x !== id)
  if (current.length >= max) return [...current.slice(1), id]
  return [...current, id]
}

export function toggleShowcaseMedal(
  current: LeaderboardMedalTier[],
  tier: LeaderboardMedalTier,
  max = MAX_SHOWCASE,
): LeaderboardMedalTier[] {
  if (current.includes(tier)) return current.filter((x) => x !== tier)
  if (current.length >= max) return [...current.slice(1), tier]
  return [...current, tier]
}

export function profileThemeClass(theme: ProfileTheme | string | undefined): string {
  const t = normalizeProfileTheme(theme)
  const dark = PROFILE_DARK_THEMES.includes(t) ? ' enlight-profile-hero--on-dark' : ''
  return `enlight-profile-hero--${t}${dark}`
}

export { medalLabel, MAX_SHOWCASE }

export type ProfileViewModel = {
  displayName: string
  avatarUrl?: string
  xp: number
  streakDays: number
  longestStreak: number
  level: number
  bio?: string | null
  theme: ProfileTheme
  showcaseAchievements: Achievement[]
  showcaseMedals: LeaderboardMedalTier[]
}

export function cloudToProfileView(
  profile: CloudProfile,
  achievements: Achievement[],
  earnedMedals: LeaderboardMedalTier[],
  level: number,
): ProfileViewModel {
  return {
    displayName: profile.displayName ?? 'Student',
    avatarUrl: profile.avatarUrl ?? undefined,
    xp: profile.xp,
    streakDays: profile.streakDays,
    longestStreak: profile.longestStreak,
    level,
    bio: profile.bio,
    theme: normalizeProfileTheme(profile.profileTheme),
    showcaseAchievements: resolveShowcaseAchievements(achievements, profile.showcaseAchievementIds),
    showcaseMedals: resolveShowcaseMedals(earnedMedals, profile.showcaseMedalTiers),
  }
}
