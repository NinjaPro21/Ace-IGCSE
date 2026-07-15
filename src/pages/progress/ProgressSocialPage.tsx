import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { LeaderboardHub } from '@/features/social/LeaderboardHub'
import { SchoolClanPanel, ClassInsightsPanel } from '@/features/social/SocialPanels'
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
      <h1 className="ace-heading-serif">Leaderboards & friends</h1>
      <p className="ace-body-text ace-progress-page__intro">
        Compare progress with classmates, add friends, and join weekly challenges.
      </p>

      <LeaderboardHub />
      <WeeklyChallengeCard />

      <section id="friends" className="ace-progress-anchor-section">
        <FriendsPanel />
      </section>

      <DuelsPanel />
      <SchoolClanPanel />
      <ClassInsightsPanel />
    </>
  )
}
