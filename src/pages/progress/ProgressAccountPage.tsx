import { useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import { SignInButton } from '@/features/social/SocialPanels'
import { useAuth } from '@/features/social/AuthContext'

export function ProgressAccountPage() {
  const { progress, setDisplayName } = useMastery()
  const { user, syncProgressNow } = useAuth()
  const [nameInput, setNameInput] = useState(progress.displayName)

  const handleSaveName = () => setDisplayName(nameInput)

  return (
    <>
      <EnlightSectionLabel>Account</EnlightSectionLabel>
      <h1 className="enlight-heading-serif">Account & sync</h1>
      <p className="enlight-body-text enlight-progress-page__intro">
        {user
          ? `Signed in as ${user.displayName}. Progress syncs to your Google account.`
          : 'Sign in with Google to save progress across devices and join leaderboards.'}
      </p>

      <section className="enlight-dashboard-card">
        <div style={{ marginBottom: 16 }}>
          <SignInButton />
        </div>
        {user && (
          <div className="enlight-progress-account__actions">
            <EnlightButton to={`/profile/${user.id}`} variant="outline">View profile</EnlightButton>
            <EnlightButton variant="outline" onClick={() => syncProgressNow()}>
              Sync progress now
            </EnlightButton>
          </div>
        )}
        <div className="enlight-profile-form enlight-progress-account__form">
          <label className="enlight-profile-form__label" htmlFor="display-name">
            Display name on leaderboard
          </label>
          <input
            id="display-name"
            type="text"
            className="enlight-profile-form__input"
            placeholder="Display name on leaderboard"
            value={nameInput}
            maxLength={24}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
          />
          <EnlightButton onClick={handleSaveName}>Save name</EnlightButton>
        </div>
      </section>
    </>
  )
}
