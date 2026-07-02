export type LeaderboardPeriod = 'day' | 'week' | 'month' | 'all'
export type LeaderboardMetric = 'xp' | 'longestStreak'

export function getPeriodStartIso(period: LeaderboardPeriod): string | null {
  if (period === 'all') return null
  const d = new Date()
  if (period === 'day') return d.toISOString().slice(0, 10)
  if (period === 'week') {
    d.setDate(d.getDate() - 6)
    return d.toISOString().slice(0, 10)
  }
  d.setDate(d.getDate() - 29)
  return d.toISOString().slice(0, 10)
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
