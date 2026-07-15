import { localDateISO, localDateISODaysAgo } from '@/lib/localDate'

export type LeaderboardPeriod = 'day' | 'week' | 'month' | 'all'
export type LeaderboardMetric = 'xp' | 'longestStreak'

export function getPeriodStartIso(period: LeaderboardPeriod): string | null {
  if (period === 'all') return null
  if (period === 'day') return localDateISO()
  if (period === 'week') return localDateISODaysAgo(6)
  return localDateISODaysAgo(29)
}

export function sumXpInPeriod(
  xpByDate: Record<string, number> | undefined,
  period: LeaderboardPeriod,
  totalXp: number,
): number {
  if (period === 'all') return totalXp
  const start = getPeriodStartIso(period)
  if (!start) return totalXp
  const byDate = xpByDate ?? {}
  let sum = 0
  for (const [date, amount] of Object.entries(byDate)) {
    if (date >= start) sum += amount
  }
  return sum
}

export function periodLabel(period: LeaderboardPeriod): string {
  switch (period) {
    case 'day':
      return 'Today'
    case 'week':
      return 'This week'
    case 'month':
      return 'This month'
    default:
      return 'All time'
  }
}

export type LeaderboardMedalTier = 'gold' | 'silver' | 'bronze' | 'elite' | 'top10'

export type LeaderboardScope = 'global' | 'group'

export function getRankMedal(rank: number, scope: LeaderboardScope): LeaderboardMedalTier | null {
  if (rank < 1) return null
  if (rank <= 3) return (['gold', 'silver', 'bronze'] as const)[rank - 1]
  if (scope === 'global') {
    if (rank <= 5) return 'elite'
    if (rank <= 10) return 'top10'
  }
  return null
}

export function medalLabel(tier: LeaderboardMedalTier): string {
  switch (tier) {
    case 'gold':
      return 'Gold'
    case 'silver':
      return 'Silver'
    case 'bronze':
      return 'Bronze'
    case 'elite':
      return 'Elite'
    case 'top10':
      return 'Top 10'
  }
}

export function medalPoints(tier: LeaderboardMedalTier): number {
  switch (tier) {
    case 'gold':
      return 5
    case 'silver':
      return 3
    case 'bronze':
      return 2
    case 'elite':
      return 1
    case 'top10':
      return 1
  }
}

/** Sum medal points for one ranked user-id list. */
export function medalPointsForBoard(userIds: string[], scope: LeaderboardScope): Map<string, number> {
  const totals = new Map<string, number>()
  userIds.forEach((userId, index) => {
    const tier = getRankMedal(index + 1, scope)
    if (!tier) return
    totals.set(userId, (totals.get(userId) ?? 0) + medalPoints(tier))
  })
  return totals
}

/** Merge multiple medal-point maps. */
export function mergeMedalPoints(...maps: Map<string, number>[]): Map<string, number> {
  const merged = new Map<string, number>()
  for (const map of maps) {
    for (const [id, pts] of map) {
      merged.set(id, (merged.get(id) ?? 0) + pts)
    }
  }
  return merged
}
