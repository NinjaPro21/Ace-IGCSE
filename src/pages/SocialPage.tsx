import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-container enlight-page-padding enlight-social-page">
        <EnlightSectionLabel>Social</EnlightSectionLabel>
        <Link to="/dashboard" className="enlight-back-link">
          ← Back to dashboard
        </Link>
        <h1 className="enlight-heading-serif">Social</h1>
        <p className="enlight-body-text enlight-social-page__intro">
          Your profile, rankings, friends, and school groups — all in one place.
        </p>

        <SocialProfileCard />
        <div data-tour="social-profile">
          <LeaderboardHub />
        </div>
        <WeeklyChallengeCard />

        <section id="friends" className="enlight-social-anchor">
          <FriendsPanel />
        </section>

        <DuelsPanel />
        <div data-tour="social-groups">
          <GroupHubPanel />
        </div>
        {isAdmin && <ClassInsightsPanel />}
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
