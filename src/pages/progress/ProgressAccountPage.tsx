import { useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useMastery } from '@/features/mastery/MasteryContext'
import { SignInButton } from '@/features/social/SocialPanels'
import { useAuth } from '@/features/social/AuthContext'

export function ProgressAccountPage() {
  usePageTitle('Account')
  const { progress, setDisplayName } = useMastery()
  const { user, syncProgressNow } = useAuth()
  const [nameInput, setNameInput] = useState(progress.displayName)

  const handleSaveName = () => setDisplayName(nameInput)

  return (
    <>
      <EnlightSectionLabel>Account</EnlightSectionLabel>
      <h1 className="ace-heading-serif">Account & sync</h1>
      <p className="ace-body-text ace-progress-page__intro">
        {user
          ? `Signed in as ${user.displayName}. Progress syncs to your Google account.`
          : 'Sign in with Google to save progress across devices and join leaderboards.'}
      </p>

      <section className="ace-dashboard-card">
        <div style={{ marginBottom: 16 }}>
          <SignInButton />
        </div>
        {user && (
          <div className="ace-progress-account__actions">
            <EnlightButton to={`/profile/${user.id}`} variant="outline">View profile</EnlightButton>
            <EnlightButton variant="outline" onClick={() => syncProgressNow()}>
              Sync progress now
            </EnlightButton>
          </div>
        )}
        <div className="ace-profile-form ace-progress-account__form">
          <label className="ace-profile-form__label" htmlFor="display-name">
            Display name on leaderboard
          </label>
          <input
            id="display-name"
            type="text"
            className="ace-profile-form__input"
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
