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
    <section className="ace-profile-customize">
      <button type="button" className="ace-profile-customize__toggle" onClick={() => setOpen((v) => !v)}>
        <h2 className="ace-heading-serif">Customize profile</h2>
        <span aria-hidden>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="ace-profile-customize__body">
          <div className="ace-profile-customize__block">
            <h3 className="ace-profile-customize__label">Background theme</h3>
            <div className="ace-profile-theme-picker">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`ace-profile-theme-picker__opt ace-profile-theme-picker__opt--${t}${theme === t ? ' ace-profile-theme-picker__opt--active' : ''}`}
                  onClick={() => onThemeChange(t)}
                >
                  <span className="ace-profile-theme-picker__swatch" />
                  <span>{PROFILE_THEME_LABELS[t]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ace-profile-customize__block">
            <h3 className="ace-profile-customize__label">
              Showcase achievements <span className="ace-profile-customize__hint">(pick up to {MAX_SHOWCASE})</span>
            </h3>
            {unlocked.length === 0 ? (
              <p className="ace-body-text">Unlock achievements by studying to pin them here.</p>
            ) : (
              <div className="ace-profile-pick-grid">
                {unlocked.map((a) => {
                  const selected = showcaseAchievementIds.includes(a.id)
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className={`ace-profile-pick${selected ? ' ace-profile-pick--selected' : ''}`}
                      onClick={() =>
                        onShowcaseAchievementsChange(toggleShowcaseId(showcaseAchievementIds, a.id))
                      }
                    >
                      <span className="ace-profile-pick__icon">{a.icon}</span>
                      <span className="ace-profile-pick__title">{a.title}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="ace-profile-customize__block">
            <h3 className="ace-profile-customize__label">
              Showcase medals <span className="ace-profile-customize__hint">(earned from rankings)</span>
            </h3>
            {earnedMedals.length === 0 ? (
              <p className="ace-body-text">Climb school, study group, or site-wide leaderboards to earn medals.</p>
            ) : (
              <div className="ace-profile-pick-grid ace-profile-pick-grid--medals">
                {earnedMedals.map((tier) => {
                  const selected = showcaseMedalTiers.includes(tier)
                  return (
                    <button
                      key={tier}
                      type="button"
                      className={`ace-profile-pick ace-profile-pick--medal${selected ? ' ace-profile-pick--selected' : ''}`}
                      onClick={() =>
                        onShowcaseMedalsChange(toggleShowcaseMedal(showcaseMedalTiers, tier))
                      }
                    >
                      <MedalIcon tier={tier} size="md" />
                      <span className="ace-profile-pick__title">{medalLabel(tier)}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <EnlightButton onClick={onSave}>Save profile</EnlightButton>
          {message && <p className="ace-body-text">{message}</p>}
        </div>
      )}
    </section>
  )
}
