import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { MedalIcon } from '@/features/social/MedalIcon'
import { medalLabel, profileThemeClass, type ProfileViewModel } from '@/features/social/profileShowcase'

interface ProfileHeroProps {
  profile: ProfileViewModel
  userId?: string
  isOwn?: boolean
  compact?: boolean
}

export function ProfileHero({ profile, userId, isOwn, compact }: ProfileHeroProps) {
  return (
    <section className={`enlight-profile-hero ${profileThemeClass(profile.theme)}${compact ? ' enlight-profile-hero--compact' : ''}`}>
      <div className="enlight-profile-hero__bg" aria-hidden />
      <div className="enlight-profile-hero__content">
        <div className="enlight-profile-hero__top">
          <div className="enlight-profile-hero__avatar-wrap">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="enlight-profile-hero__avatar" width={compact ? 68 : 80} height={compact ? 68 : 80} />
            ) : (
              <span className="enlight-profile-hero__avatar enlight-profile-hero__avatar--ph">
                {profile.displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="enlight-profile-hero__info">
            <h2 className="enlight-profile-hero__name">{profile.displayName}</h2>
            {profile.bio && <p className="enlight-profile-hero__bio">{profile.bio}</p>}
            <p className="enlight-profile-hero__stats">
              Lv {profile.level} · {profile.xp.toLocaleString()} XP · 🔥 {profile.streakDays}d streak
              {!compact && profile.longestStreak > profile.streakDays && (
                <> · best {profile.longestStreak}d</>
              )}
            </p>
            {isOwn && userId && (
              <div className="enlight-profile-hero__actions">
                <EnlightButton to={`/profile/${userId}`} variant="outline">
                  Customize profile
                </EnlightButton>
              </div>
            )}
            {!isOwn && userId && (
              <Link to={`/profile/${userId}`} className="enlight-profile-hero__link">
                View profile →
              </Link>
            )}
          </div>
        </div>

        {(profile.showcaseMedals.length > 0 || profile.showcaseAchievements.length > 0) && (
          <div className="enlight-profile-hero__showcase">
            {profile.showcaseMedals.length > 0 && (
              <div className="enlight-profile-hero__showcase-group">
                <span className="enlight-profile-hero__showcase-label">Medals</span>
                <div className="enlight-profile-hero__medals">
                  {profile.showcaseMedals.map((tier) => (
                    <div key={tier} className="enlight-profile-hero__medal-chip" title={medalLabel(tier)}>
                      <MedalIcon tier={tier} size="md" />
                      <span>{medalLabel(tier)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {profile.showcaseAchievements.length > 0 && (
              <div className="enlight-profile-hero__showcase-group">
                <span className="enlight-profile-hero__showcase-label">Achievements</span>
                <div className="enlight-profile-hero__achievements">
                  {profile.showcaseAchievements.map((a) => (
                    <div key={a.id} className="enlight-profile-hero__achievement-chip" title={a.description}>
                      <span aria-hidden>{a.icon}</span>
                      <span>{a.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
