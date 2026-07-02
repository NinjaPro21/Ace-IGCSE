import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useAuth } from '@/features/social/AuthContext'
import { WeeklyChallengeCard } from '@/features/social/WeeklyChallengeCard'

export function PublicLeaderboardPage() {
  const { user } = useAuth()

  return (
    <div className="enlight-container enlight-page-padding enlight-marketing-page">
      <EnlightSectionLabel>Compete</EnlightSectionLabel>
      <h1 className="enlight-heading-serif">Leaderboards</h1>
      <p className="enlight-body-text enlight-marketing-page__lead">
        See who&apos;s studying hardest this week. Sign in to appear on the board and challenge friends.
      </p>

      {user ? (
        <div style={{ marginTop: 24 }}>
          <WeeklyChallengeCard />
          <p className="enlight-body-text" style={{ marginTop: 16 }}>
            <Link to="/dashboard/social">Open full social hub →</Link>
          </p>
        </div>
      ) : (
        <div className="enlight-dashboard-card" style={{ marginTop: 24, textAlign: 'center', padding: 32 }}>
          <p className="enlight-body-text">Sign in to view live rankings and join the weekly challenge.</p>
          <EnlightButton to="/features" className="enlight-marketing-cta-btn">
            Get started →
          </EnlightButton>
        </div>
      )}
    </div>
  )
}
