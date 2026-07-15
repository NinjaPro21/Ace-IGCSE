import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AceFooter } from '@/components/AceFooter'
import { EnlightHeader } from '@/components/EnlightHeader'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { GroupHubPanel } from '@/features/social/GroupHubPanel'
import { ClassInsightsPanel } from '@/features/social/SocialPanels'
import { FriendsPanel } from '@/features/social/FriendsPanel'
import { DuelsPanel } from '@/features/social/DuelsPanel'
import { WeeklyChallengeCard } from '@/features/social/WeeklyChallengeCard'
import { LeaderboardHub } from '@/features/social/LeaderboardHub'
import { SocialProfileCard } from '@/features/social/SocialProfileCard'
import { useAuth } from '@/features/social/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle'

export function SocialPage() {
  const { hash } = useLocation()
  const { isAdmin } = useAuth()
  usePageTitle('Social')

  useEffect(() => {
    if (hash === '#friends') {
      document.getElementById('friends')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <div className="ace-app">
      <EnlightHeader />
      <div className="ace-container ace-page-padding ace-social-page">
        <EnlightSectionLabel>Social</EnlightSectionLabel>
        <Link to="/dashboard" className="ace-back-link">
          ← Back to dashboard
        </Link>
        <h1 className="ace-heading-serif">Social</h1>
        <p className="ace-body-text ace-social-page__intro">
          Your profile, rankings, friends, and school groups — all in one place.
        </p>

        <SocialProfileCard />
        <div data-tour="social-profile">
          <LeaderboardHub />
        </div>
        <WeeklyChallengeCard />

        <section id="friends" className="ace-social-anchor">
          <FriendsPanel />
        </section>

        <DuelsPanel />
        <div data-tour="social-groups">
          <GroupHubPanel />
        </div>
        {isAdmin && <ClassInsightsPanel />}
      </div>
      <AceFooter />
    </div>
  )
}
