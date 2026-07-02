import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchClanMemberProfiles, fetchSchoolMemberProfiles } from './socialApi'
import { sumXpInPeriod } from './leaderboardUtils'

export function WeeklyChallengeCard() {
  const { user, school, clans } = useAuth()
  const [rank, setRank] = useState<number | null>(null)
  const [total, setTotal] = useState(0)
  const [gap, setGap] = useState<number | null>(null)

  const group = school ?? clans[0]

  useEffect(() => {
    if (!user || !group) return
    void (async () => {
      const profiles =
        group.type === 'school'
          ? await fetchSchoolMemberProfiles(group.id)
          : await fetchClanMemberProfiles(group.id)

      const scored = profiles
        .map((p) => ({
          id: p.id,
          xp: sumXpInPeriod(p.progress?.xpByDate, 'week', p.xp),
        }))
        .sort((a, b) => b.xp - a.xp)

      setTotal(scored.length)
      const idx = scored.findIndex((s) => s.id === user.id)
      setRank(idx >= 0 ? idx + 1 : null)
      if (idx > 0) {
        setGap(scored[idx - 1].xp - scored[idx].xp)
      } else {
        setGap(null)
      }
    })()
  }, [user, group])

  if (!group || !user) return null

  return (
    <section className="enlight-dashboard-card enlight-weekly-challenge">
      <h2 className="enlight-heading-serif">Weekly challenge</h2>
      <p className="enlight-body-text">
        {group.name} · This week&apos;s XP race
      </p>
      {rank != null ? (
        <p className="enlight-weekly-challenge__rank">
          You&apos;re <strong>#{rank}</strong> of {total}
          {gap != null && gap > 0 && rank > 1 && (
            <> — <strong>{gap} XP</strong> behind #{rank - 1}</>
          )}
        </p>
      ) : (
        <p className="enlight-body-text">Study this week to appear on the board.</p>
      )}
    </section>
  )
}
