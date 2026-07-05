import { useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import type { Achievement } from '@/features/mastery/progressStats'
import { MedalIcon } from '@/features/social/MedalIcon'
import {
  MAX_SHOWCASE,
  medalLabel,
  toggleShowcaseId,
  toggleShowcaseMedal,
} from '@/features/social/profileShowcase'
import { PROFILE_THEME_LABELS, PROFILE_THEMES, type ProfileTheme } from '@/features/social/profileTypes'
import type { LeaderboardMedalTier } from '@/features/social/leaderboardUtils'

interface ProfileCustomizeSectionProps {
  theme: ProfileTheme
  onThemeChange: (t: ProfileTheme) => void
  achievements: Achievement[]
  showcaseAchievementIds: string[]
  onShowcaseAchievementsChange: (ids: string[]) => void
  earnedMedals: LeaderboardMedalTier[]
  showcaseMedalTiers: LeaderboardMedalTier[]
  onShowcaseMedalsChange: (tiers: LeaderboardMedalTier[]) => void
  onSave: () => void
  message?: string | null
}

const THEMES: ProfileTheme[] = [...PROFILE_THEMES]

export function ProfileCustomizeSection({
  theme,
  onThemeChange,
  achievements,
  showcaseAchievementIds,
  onShowcaseAchievementsChange,
  earnedMedals,
  showcaseMedalTiers,
  onShowcaseMedalsChange,
  onSave,
  message,
}: ProfileCustomizeSectionProps) {
  const [open, setOpen] = useState(true)
  const unlocked = achievements.filter((a) => a.unlocked)

  return (
    <section className="enlight-profile-customize">
      <button type="button" className="enlight-profile-customize__toggle" onClick={() => setOpen((v) => !v)}>
        <h2 className="enlight-heading-serif">Customize profile</h2>
        <span aria-hidden>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="enlight-profile-customize__body">
          <div className="enlight-profile-customize__block">
            <h3 className="enlight-profile-customize__label">Background theme</h3>
            <div className="enlight-profile-theme-picker">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`enlight-profile-theme-picker__opt enlight-profile-theme-picker__opt--${t}${theme === t ? ' enlight-profile-theme-picker__opt--active' : ''}`}
                  onClick={() => onThemeChange(t)}
                >
                  <span className="enlight-profile-theme-picker__swatch" />
                  <span>{PROFILE_THEME_LABELS[t]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="enlight-profile-customize__block">
            <h3 className="enlight-profile-customize__label">
              Showcase achievements <span className="enlight-profile-customize__hint">(pick up to {MAX_SHOWCASE})</span>
            </h3>
            {unlocked.length === 0 ? (
              <p className="enlight-body-text">Unlock achievements by studying to pin them here.</p>
            ) : (
              <div className="enlight-profile-pick-grid">
                {unlocked.map((a) => {
                  const selected = showcaseAchievementIds.includes(a.id)
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className={`enlight-profile-pick${selected ? ' enlight-profile-pick--selected' : ''}`}
                      onClick={() =>
                        onShowcaseAchievementsChange(toggleShowcaseId(showcaseAchievementIds, a.id))
                      }
                    >
                      <span className="enlight-profile-pick__icon">{a.icon}</span>
                      <span className="enlight-profile-pick__title">{a.title}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="enlight-profile-customize__block">
            <h3 className="enlight-profile-customize__label">
              Showcase medals <span className="enlight-profile-customize__hint">(earned from rankings)</span>
            </h3>
            {earnedMedals.length === 0 ? (
              <p className="enlight-body-text">Climb school, study group, or site-wide leaderboards to earn medals.</p>
            ) : (
              <div className="enlight-profile-pick-grid enlight-profile-pick-grid--medals">
                {earnedMedals.map((tier) => {
                  const selected = showcaseMedalTiers.includes(tier)
                  return (
                    <button
                      key={tier}
                      type="button"
                      className={`enlight-profile-pick enlight-profile-pick--medal${selected ? ' enlight-profile-pick--selected' : ''}`}
                      onClick={() =>
                        onShowcaseMedalsChange(toggleShowcaseMedal(showcaseMedalTiers, tier))
                      }
                    >
                      <MedalIcon tier={tier} size="md" />
                      <span className="enlight-profile-pick__title">{medalLabel(tier)}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <EnlightButton onClick={onSave}>Save profile</EnlightButton>
          {message && <p className="enlight-body-text">{message}</p>}
        </div>
      )}
    </section>
  )
}
