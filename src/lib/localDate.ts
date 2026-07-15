/**
 * Local-timezone date keys (YYYY-MM-DD).
 *
 * Never use `toISOString().slice(0, 10)` for day buckets: it returns the UTC
 * date, which is yesterday for anyone in a positive-offset timezone (our
 * audience is largely UTC+8) until mid-morning. All streaks, daily XP buckets
 * and leaderboard periods key on the user's local calendar day.
 */
export function localDateISO(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function localDateISODaysAgo(days: number, from: Date = new Date()): string {
  const d = new Date(from)
  d.setDate(d.getDate() - days)
  return localDateISO(d)
}

/**
 * Epoch ms for the end of the local calendar day `daysAfter` days after the
 * given YYYY-MM-DD key. Returns null for malformed keys.
 */
export function endOfLocalDayMs(dateIso: string, daysAfter = 0): number | null {
  const [y, m, d] = dateIso.split('-').map(Number)
  if (!y || !m || !d) return null
  // Day (d + daysAfter + 1) at 00:00 local == end of day (d + daysAfter).
  return new Date(y, m - 1, d + daysAfter + 1).getTime()
}
