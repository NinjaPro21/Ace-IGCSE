import { useEffect, useMemo, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useAuth } from './AuthContext'
import { fetchClanMemberProfiles, fetchSchoolMemberProfiles } from './socialApi'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import {
  currentWeekKey,
  sumGroupWeekXp,
  WEEKLY_CHALLENGE_BONUS_XP,
  WEEKLY_GROUP_XP_TARGET,
} from './weeklyChallenge'

export function WeeklyChallengeCard() {
  const { user, school, clans } = useAuth()
  const [groupXp, setGroupXp] = useState(0)
  const [memberCount, setMemberCount] = useState(0)
  const [claimed, setClaimed] = useState(false)
  const weekKey = useMemo(() => currentWeekKey(), [])

  const group = school ?? clans[0]

  useEffect(() => {
    if (!user || !group) return
    void (async () => {
      const profiles =
        group.type === 'school'
          ? await fetchSchoolMemberProfiles(group.id)
          : await fetchClanMemberProfiles(group.id)

      setMemberCount(profiles.length)
      setGroupXp(sumGroupWeekXp(profiles))
      const claims = masteryEngine.getState().weeklyChallengeClaims ?? {}
      setClaimed(claims[group.id] === weekKey)
    })()
  }, [user, group, weekKey])

  if (!group || !user) return null

  const pct = Math.min(100, Math.round((groupXp / WEEKLY_GROUP_XP_TARGET) * 100))
  const complete = groupXp >= WEEKLY_GROUP_XP_TARGET
  const xpLeft = Math.max(0, WEEKLY_GROUP_XP_TARGET - groupXp)

  const handleClaim = () => {
    if (!complete) return
    const ok = masteryEngine.claimWeeklyChallengeBonus(group.id, weekKey, WEEKLY_CHALLENGE_BONUS_XP)
    if (ok) setClaimed(true)
  }

  return (
    <section className="ace-weekly-challenge" aria-label="Weekly challenge">
      <div className="ace-weekly-challenge__head">
        <EnlightSectionLabel>Weekly challenge</EnlightSectionLabel>
        <p className="ace-weekly-challenge__group">{group.name}</p>
      </div>

      <div className="ace-weekly-challenge__hero">
        <p className="ace-weekly-challenge__xp">{groupXp.toLocaleString()}</p>
        <p className="ace-weekly-challenge__of">
          of {WEEKLY_GROUP_XP_TARGET.toLocaleString()} XP this week
        </p>
      </div>

      <div className="ace-daily-goal-bar ace-weekly-challenge__bar" aria-hidden>
        <div className="ace-daily-goal-bar__fill" style={{ width: `${pct}%` }} />
      </div>

      <p className="ace-weekly-challenge__meta">
        {memberCount} member{memberCount === 1 ? '' : 's'}
        {' · '}
        {complete ? 'Target met' : `${xpLeft.toLocaleString()} to go`}
      </p>

      <div className="ace-weekly-challenge__action">
        {complete && !claimed && (
          <EnlightButton onClick={handleClaim}>
            Claim +{WEEKLY_CHALLENGE_BONUS_XP} XP
          </EnlightButton>
        )}
        {claimed && (
          <p className="ace-weekly-challenge__lead">Bonus claimed</p>
        )}
        {!complete && (
          <p className="ace-weekly-challenge__empty">
            Every quiz and note session counts toward the group total.
          </p>
        )}
      </div>
    </section>
  )
}
