import { localDateISO, localDateISODaysAgo } from '@/lib/localDate'

/** Shared weekly XP target for school/clan group challenges. */
export const WEEKLY_GROUP_XP_TARGET = 5000

export const WEEKLY_CHALLENGE_BONUS_XP = 50

/** Stable week bucket key (aligned with leaderboard rolling 7-day window). */
export function currentWeekKey(): string {
  return `week-${localDateISODaysAgo(6)}`
}

export function sumGroupWeekXp(
  profiles: Array<{ xpByDate?: Record<string, number>; xp?: number }>,
): number {
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 6)
  const startIso = localDateISO(weekStart)

  return profiles.reduce((sum, p) => {
    const byDate = p.xpByDate ?? {}
    let week = 0
    for (const [date, amount] of Object.entries(byDate)) {
      if (date >= startIso) week += amount
    }
    return sum + week
  }, 0)
}
