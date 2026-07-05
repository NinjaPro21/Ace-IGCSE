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
    <section className="enlight-weekly-challenge" aria-label="Weekly challenge">
      <div className="enlight-weekly-challenge__head">
        <div>
          <h2 className="enlight-weekly-challenge__title">Weekly challenge</h2>
          <p className="enlight-weekly-challenge__group">{group.name} · This week&apos;s XP race</p>
        </div>
      </div>

      {rank == null ? (
        <p className="enlight-weekly-challenge__empty">Study this week to appear on the board.</p>
      ) : (
        <div className="enlight-weekly-challenge__body">
          <div className="enlight-weekly-challenge__placement">
            <span className="enlight-weekly-challenge__rank-num">#{rank}</span>
            <span className="enlight-weekly-challenge__rank-of">of {total}</span>
          </div>

          {rank === 1 ? (
            <p className="enlight-weekly-challenge__lead">You&apos;re in the lead this week.</p>
          ) : gap != null && gap > 0 ? (
            <div className="enlight-weekly-challenge__gap">
              <span className="enlight-weekly-challenge__gap-value">{gap.toLocaleString()}</span>
              <span className="enlight-weekly-challenge__gap-label">XP behind #{rank - 1}</span>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
