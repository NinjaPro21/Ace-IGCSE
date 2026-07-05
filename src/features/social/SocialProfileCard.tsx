import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getAchievements } from '@/features/mastery/progressStats'
import { useAuth } from '@/features/social/AuthContext'
import { ProfileHero } from '@/features/social/ProfileHero'
import { cloudToProfileView, getEarnedMedalTiers } from '@/features/social/profileShowcase'
import { fetchProfile, type CloudProfile } from '@/features/social/socialApi'

export function SocialProfileCard() {
  const { user, school, clans } = useAuth()
  const { progress, levelProfile } = useMastery()
  const [cloud, setCloud] = useState<CloudProfile | null>(null)
  const [earnedMedals, setEarnedMedals] = useState<Awaited<ReturnType<typeof getEarnedMedalTiers>>>([])

  useEffect(() => {
    if (!user) return
    void fetchProfile(user.id).then(setCloud)
    void getEarnedMedalTiers(user.id, school, clans).then(setEarnedMedals)
  }, [user, school, clans])

  if (!user) {
    return (
      <section className="enlight-social-profile enlight-social-profile--guest">
        <div>
          <h2 className="enlight-heading-serif">Your profile</h2>
          <p className="enlight-body-text">Sign in to customize your profile, medals, and achievements.</p>
        </div>
        <EnlightButton to="/features">Sign in →</EnlightButton>
      </section>
    )
  }

  if (!cloud) {
    return <p className="enlight-body-text">Loading profile…</p>
  }

  const merged: CloudProfile = {
    ...cloud,
    displayName: progress.displayName || user.displayName,
    avatarUrl: user.avatarUrl ?? cloud.avatarUrl,
    xp: progress.xp,
    streakDays: progress.streakDays,
    longestStreak: progress.longestStreak ?? progress.streakDays,
  }

  const viewModel = cloudToProfileView(
    merged,
    getAchievements(progress),
    earnedMedals,
    levelProfile.level,
  )
  viewModel.avatarUrl = user.avatarUrl

  return <ProfileHero profile={viewModel} userId={user.id} isOwn compact />
}
