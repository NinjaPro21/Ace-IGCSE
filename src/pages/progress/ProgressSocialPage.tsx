import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { GroupLeaderboard, SchoolClanPanel, ClassInsightsPanel } from '@/features/social/SocialPanels'
import { FriendsPanel } from '@/features/social/FriendsPanel'
import { DuelsPanel } from '@/features/social/DuelsPanel'
import { WeeklyChallengeCard } from '@/features/social/WeeklyChallengeCard'

export function ProgressSocialPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#friends') {
      document.getElementById('friends')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <>
      <EnlightSectionLabel>Social</EnlightSectionLabel>
      <h1 className="enlight-heading-serif">Leaderboards & friends</h1>
      <p className="enlight-body-text enlight-progress-page__intro">
        Compare progress with classmates, add friends, and join weekly challenges.
      </p>

      <GroupLeaderboard />
      <WeeklyChallengeCard />

      <section id="friends" className="enlight-progress-anchor-section">
        <FriendsPanel />
      </section>

      <DuelsPanel />
      <SchoolClanPanel />
      <ClassInsightsPanel />
    </>
  )
}
