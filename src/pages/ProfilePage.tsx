import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightHeader } from '@/components/EnlightHeader'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getSubjectSummary, getAchievements } from '@/features/mastery/progressStats'
import { getGlobalLevel } from '@/features/mastery/levelSystem'
import { useAuth } from '@/features/social/AuthContext'
import { fetchProfile, updateProfileExtras, cloudRowToUserProgress, type CloudProfile } from '@/features/social/socialApi'
import { ensureFriendCode, sendFriendRequest } from '@/features/social/friendsApi'
import { getAllSubjects } from '@/lib/contentLoader'
import type { ProfilePrivacy } from '@/features/social/profileTypes'

export function ProfilePage() {
  const { userId = '' } = useParams()
  const { user } = useAuth()
  const { progress, setDisplayName } = useMastery()
  const [profile, setProfile] = useState<CloudProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState('')
  const [examYear, setExamYear] = useState(2026)
  const [privacy, setPrivacy] = useState<ProfilePrivacy>('friends')
  const [friendCode, setFriendCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const isOwn = user?.id === userId

  useEffect(() => {
    void fetchProfile(userId).then((p) => {
      setProfile(p)
      if (p) {
        setBio(p.bio ?? '')
        setExamYear(p.examYear ?? 2026)
        setPrivacy(p.privacy ?? 'friends')
      }
      setLoading(false)
    })
  }, [userId])

  useEffect(() => {
    if (isOwn && user) void ensureFriendCode(user.id).then(setFriendCode)
  }, [isOwn, user])

  const handleSave = async () => {
    if (!user || !isOwn) return
    setDisplayName(progress.displayName)
    await updateProfileExtras(user.id, { bio: bio.slice(0, 80), examYear, privacy })
    setMessage('Profile saved')
  }

  const handleShare = () => {
    const text = `Study with me on Project Enlight! Friend code: ${friendCode}`
    void navigator.clipboard.writeText(text)
    setMessage('Link copied!')
  }

  const handleAddFriend = async () => {
    if (!user || isOwn) return
    try {
      await sendFriendRequest(user.id, userId)
      setMessage('Friend request sent!')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not send request')
    }
  }

  if (loading) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-container enlight-page-padding">
          <p className="enlight-body-text">Loading profile…</p>
        </div>
      </div>
    )
  }

  const displayProfile = isOwn
    ? {
        displayName: progress.displayName || user?.displayName || 'Student',
        avatarUrl: user?.avatarUrl,
        xp: progress.xp,
        streakDays: progress.streakDays,
        longestStreak: progress.longestStreak,
        achievementIds: progress.achievementIds ?? [],
      }
    : profile
      ? {
          displayName: profile.displayName ?? 'Student',
          avatarUrl: profile.avatarUrl ?? undefined,
          xp: profile.xp,
          streakDays: profile.streakDays,
          longestStreak: profile.longestStreak,
          achievementIds: profile.achievementIds ?? [],
        }
      : null

  if (!displayProfile) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-container enlight-page-padding">
          <p className="enlight-body-text">Profile not found or private.</p>
          <EnlightButton to="/dashboard">Back to dashboard</EnlightButton>
        </div>
      </div>
    )
  }

  const level = getGlobalLevel(displayProfile.xp)
  const viewProgress = isOwn ? progress : profile ? cloudRowToUserProgress(profile) : progress
  const achievements = getAchievements(viewProgress).filter(
    (a) => a.unlocked || displayProfile.achievementIds.includes(a.id),
  )

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-container enlight-page-padding enlight-profile-page">
        <div className="enlight-profile-hero">
          {displayProfile.avatarUrl ? (
            <img src={displayProfile.avatarUrl} alt="" className="enlight-profile-hero__avatar" />
          ) : (
            <span className="enlight-profile-hero__avatar enlight-profile-hero__avatar--ph">
              {displayProfile.displayName.slice(0, 1)}
            </span>
          )}
          <div>
            <h1 className="enlight-heading-serif">{displayProfile.displayName}</h1>
            <p className="enlight-body-text">
              Level {level} · {displayProfile.xp} XP · 🔥 {displayProfile.streakDays}d streak (best{' '}
              {displayProfile.longestStreak}d)
            </p>
            {!isOwn && user && (
              <EnlightButton onClick={() => void handleAddFriend()}>Add friend</EnlightButton>
            )}
          </div>
        </div>

        {isOwn && (
          <section className="enlight-dashboard-card">
            <h2 className="enlight-heading-serif">Edit profile</h2>
            <input
              className="enlight-profile-form__input"
              value={progress.displayName}
              maxLength={24}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
            />
            <textarea
              className="enlight-profile-form__input"
              value={bio}
              maxLength={80}
              rows={2}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio (optional)"
            />
            <label className="enlight-body-text">
              Exam year{' '}
              <select value={examYear} onChange={(e) => setExamYear(Number(e.target.value))}>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </label>
            <label className="enlight-body-text">
              Privacy{' '}
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value as ProfilePrivacy)}>
                <option value="public">Public</option>
                <option value="friends">Friends only</option>
                <option value="school">School only</option>
              </select>
            </label>
            <p className="enlight-body-text">Friend code: <strong>{friendCode}</strong></p>
            <div className="enlight-popout__actions">
              <EnlightButton onClick={() => void handleSave()}>Save</EnlightButton>
              <EnlightButton variant="outline" onClick={handleShare}>Share profile</EnlightButton>
            </div>
            {message && <p className="enlight-body-text">{message}</p>}
          </section>
        )}

        {!isOwn && profile?.bio && (
          <section className="enlight-dashboard-card">
            <p className="enlight-body-text">{profile.bio}</p>
          </section>
        )}

        <section className="enlight-dashboard-card">
          <h2 className="enlight-heading-serif">Subject mastery</h2>
          <div className="enlight-subject-overview">
            {getAllSubjects().map((subject) => {
              const summary = getSubjectSummary(subject.id, viewProgress)
              if (summary.total === 0) return null
              return (
                <div key={subject.id} className="enlight-subject-fold__summary">
                  <span>{subject.name}</span>
                  <span>{summary.avgMastery}% avg · {summary.mastered}/{summary.total} mastered</span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="enlight-dashboard-card">
          <h2 className="enlight-heading-serif">Achievements</h2>
          <div className="enlight-achievement-grid">
            {achievements.map((a) => (
              <div key={a.id} className={`enlight-achievement${a.unlocked ? ' enlight-achievement--unlocked' : ''}`}>
                <span className="enlight-achievement__icon">{a.icon}</span>
                <div>
                  <div className="enlight-achievement__title">{a.title}</div>
                  <div className="enlight-achievement__desc">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <EnlightButton to="/dashboard" variant="outline">← Dashboard</EnlightButton>
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
