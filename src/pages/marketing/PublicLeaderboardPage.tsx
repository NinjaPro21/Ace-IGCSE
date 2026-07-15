import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useAuth } from '@/features/social/AuthContext'
import { GlobalLeaderboardPanel } from '@/features/social/LeaderboardHub'
import { WeeklyChallengeCard } from '@/features/social/WeeklyChallengeCard'

export function PublicLeaderboardPage() {
  const { user } = useAuth()

  return (
    <div className="ace-container ace-page-padding ace-marketing-page">
      <EnlightSectionLabel>Compete</EnlightSectionLabel>
      <h1 className="ace-heading-serif">Leaderboards</h1>
      <p className="ace-body-text ace-marketing-page__lead">
        See who&apos;s studying hardest this week. Sign in to appear on the board and challenge friends.
      </p>

      <div style={{ marginTop: 24 }}>
        <GlobalLeaderboardPanel />
        {user ? (
          <>
            <WeeklyChallengeCard />
            <p className="ace-body-text" style={{ marginTop: 16 }}>
              <Link to="/social">Open social hub →</Link>
            </p>
          </>
        ) : (
          <div className="ace-dashboard-card" style={{ marginTop: 24, textAlign: 'center', padding: 32 }}>
            <p className="ace-body-text">Sign in to join the weekly challenge and appear on school &amp; clan boards.</p>
            <EnlightButton to="/features" className="ace-marketing-cta-btn">
              Get started →
            </EnlightButton>
          </div>
        )}
      </div>
    </div>
  )
}
