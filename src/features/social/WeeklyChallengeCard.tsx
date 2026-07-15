import { useEffect, useMemo, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
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

  const handleClaim = () => {
    if (!complete) return
    const ok = masteryEngine.claimWeeklyChallengeBonus(group.id, weekKey, WEEKLY_CHALLENGE_BONUS_XP)
    if (ok) setClaimed(true)
  }

  return (
    <section className="enlight-weekly-challenge" aria-label="Weekly challenge">
      <div className="enlight-weekly-challenge__head">
        <div>
          <h2 className="enlight-weekly-challenge__title">Weekly challenge</h2>
          <p className="enlight-weekly-challenge__group">
            {group.name} · Earn {WEEKLY_GROUP_XP_TARGET.toLocaleString()} XP together this week
          </p>
        </div>
      </div>

      <div className="enlight-weekly-challenge__body">
        <div className="enlight-daily-goal-bar" aria-hidden>
          <div className="enlight-daily-goal-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="enlight-body-text">
          {groupXp.toLocaleString()} / {WEEKLY_GROUP_XP_TARGET.toLocaleString()} group XP · {memberCount}{' '}
          member{memberCount === 1 ? '' : 's'}
        </p>
        {complete && !claimed && (
          <EnlightButton onClick={handleClaim}>
            Claim +{WEEKLY_CHALLENGE_BONUS_XP} XP
          </EnlightButton>
        )}
        {claimed && (
          <p className="enlight-weekly-challenge__lead">Bonus claimed — nice work, team!</p>
        )}
        {!complete && (
          <p className="enlight-weekly-challenge__empty">
            Every quiz and note session counts toward the group total.
          </p>
        )}
      </div>
    </section>
  )
}
