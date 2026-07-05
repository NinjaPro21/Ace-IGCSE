import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { friendlyErrorMessage } from '@/lib/firebaseErrors'
import { usePageTitle } from '@/hooks/usePageTitle'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightHeader } from '@/components/EnlightHeader'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getSubjectSummary, getAchievements } from '@/features/mastery/progressStats'
import { getGlobalLevel } from '@/features/mastery/levelSystem'
import { useAuth } from '@/features/social/AuthContext'
import { ProfileCustomizeSection } from '@/features/social/ProfileCustomizeSection'
import { ProfileHero } from '@/features/social/ProfileHero'
import { cloudToProfileView, getEarnedMedalTiers } from '@/features/social/profileShowcase'
import { normalizeProfileTheme, type ProfilePrivacy, type ProfileTheme } from '@/features/social/profileTypes'
import { fetchProfile, updateProfileExtras, cloudRowToUserProgress, type CloudProfile } from '@/features/social/socialApi'
import { ensureFriendCode, getFriendshipStatus, sendFriendRequest, type FriendshipStatus } from '@/features/social/friendsApi'
import type { LeaderboardMedalTier } from '@/features/social/leaderboardUtils'
import { getAllSubjects } from '@/lib/contentLoader'

export function ProfilePage() {
  const { userId = '' } = useParams()
  usePageTitle('Profile')
  const { user, school, clans } = useAuth()
  const { progress, setDisplayName } = useMastery()
  const [profile, setProfile] = useState<CloudProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState('')
  const [examYear, setExamYear] = useState(2026)
  const [privacy, setPrivacy] = useState<ProfilePrivacy>('friends')
  const [theme, setTheme] = useState<ProfileTheme>('light')
  const [showcaseAchievementIds, setShowcaseAchievementIds] = useState<string[]>([])
  const [showcaseMedalTiers, setShowcaseMedalTiers] = useState<LeaderboardMedalTier[]>([])
  const [earnedMedals, setEarnedMedals] = useState<LeaderboardMedalTier[]>([])
  const [friendCode, setFriendCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>('none')
  const [addingFriend, setAddingFriend] = useState(false)

  const isOwn = user?.id === userId

  useEffect(() => {
    void fetchProfile(userId).then((p) => {
      setProfile(p)
      if (p) {
        setBio(p.bio ?? '')
        setExamYear(p.examYear ?? 2026)
        setPrivacy(p.privacy ?? 'friends')
        setTheme(normalizeProfileTheme(p.profileTheme))
        setShowcaseAchievementIds(p.showcaseAchievementIds ?? [])
        setShowcaseMedalTiers(p.showcaseMedalTiers ?? [])
      }
      setLoading(false)
    })
  }, [userId])

  useEffect(() => {
    if (isOwn && user) {
      void ensureFriendCode(user.id).then(setFriendCode)
      void getEarnedMedalTiers(user.id, school, clans).then(setEarnedMedals)
    }
  }, [isOwn, user, school, clans])

  useEffect(() => {
    if (!user || isOwn || !userId) {
      setFriendshipStatus('none')
      return
    }
    void getFriendshipStatus(user.id, userId).then(setFriendshipStatus)
  }, [user, userId, isOwn])

  const handleSave = async () => {
    if (!user || !isOwn) return
    setDisplayName(progress.displayName)
    await updateProfileExtras(user.id, {
      bio: bio.slice(0, 80),
      examYear,
      privacy,
      profileTheme: theme,
      showcaseAchievementIds,
      showcaseMedalTiers,
    })
    setMessage('Profile saved')
  }

  const handleShare = () => {
    void navigator.clipboard.writeText(`Study with me on Project Enlight! Friend code: ${friendCode}`)
    setMessage('Link copied!')
  }

  const handleAddFriend = async () => {
    if (!user || isOwn) return
    setAddingFriend(true)
    setMessage(null)
    try {
      await sendFriendRequest(user.id, userId)
      setFriendshipStatus('pending_sent')
      setMessage('Friend request sent! They can accept it from their notification bell.')
    } catch (err) {
      setMessage(friendlyErrorMessage(err, 'Could not send request'))
    } finally {
      setAddingFriend(false)
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

  if (!profile && !isOwn) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-container enlight-page-padding">
          <p className="enlight-body-text">Profile not found or private.</p>
          <EnlightButton to="/social">Back to social</EnlightButton>
        </div>
      </div>
    )
  }

  const viewProgress = isOwn ? progress : profile ? cloudRowToUserProgress(profile) : progress
  const achievements = getAchievements(viewProgress)
  const level = getGlobalLevel(isOwn ? progress.xp : profile?.xp ?? 0)

  const ownCloud: CloudProfile = {
    ...(profile ?? {
      id: userId,
      email: user?.email ?? null,
      schoolId: null,
      clanIds: [],
      activeDates: [],
      progress: {},
      createdAt: null,
      friendIds: [],
    }),
    displayName: progress.displayName || user?.displayName || 'Student',
    avatarUrl: user?.avatarUrl ?? null,
    xp: progress.xp,
    streakDays: progress.streakDays,
    longestStreak: progress.longestStreak ?? progress.streakDays,
    bio: bio || null,
    profileTheme: theme,
    showcaseAchievementIds,
    showcaseMedalTiers,
  } as CloudProfile

  const viewModel = isOwn
    ? cloudToProfileView(ownCloud, achievements, earnedMedals, level)
    : profile
      ? cloudToProfileView(profile, achievements, [], level)
      : null

  if (!viewModel) return null

  if (isOwn) {
    viewModel.displayName = progress.displayName || user?.displayName || viewModel.displayName
    viewModel.avatarUrl = user?.avatarUrl
  }

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-container enlight-page-padding enlight-profile-page">
        <ProfileHero profile={viewModel} userId={userId} isOwn={isOwn} />

        {!isOwn && user && (
          <div className="enlight-profile-page__actions">
            {friendshipStatus === 'friends' ? (
              <span className="enlight-body-text">You are friends</span>
            ) : friendshipStatus === 'pending_sent' ? (
              <span className="enlight-body-text">Friend request pending…</span>
            ) : friendshipStatus === 'pending_received' ? (
              <span className="enlight-body-text">This person sent you a request — check your notifications.</span>
            ) : (
              <EnlightButton onClick={() => void handleAddFriend()} disabled={addingFriend}>
                {addingFriend ? 'Sending…' : 'Add friend'}
              </EnlightButton>
            )}
          </div>
        )}

        {isOwn && (
          <>
            <section className="enlight-dashboard-card">
              <h2 className="enlight-heading-serif">Basic info</h2>
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
                <select className="enlight-select" value={examYear} onChange={(e) => setExamYear(Number(e.target.value))}>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </label>
              <label className="enlight-body-text">
                Privacy{' '}
                <select className="enlight-select" value={privacy} onChange={(e) => setPrivacy(e.target.value as ProfilePrivacy)}>
                  <option value="public">Public</option>
                  <option value="friends">Friends only</option>
                  <option value="school">School only</option>
                </select>
              </label>
              <p className="enlight-body-text">Friend code: <strong>{friendCode}</strong></p>
              <EnlightButton variant="outline" onClick={handleShare}>Share profile</EnlightButton>
            </section>

            <ProfileCustomizeSection
              theme={theme}
              onThemeChange={setTheme}
              achievements={achievements}
              showcaseAchievementIds={showcaseAchievementIds}
              onShowcaseAchievementsChange={setShowcaseAchievementIds}
              earnedMedals={earnedMedals}
              showcaseMedalTiers={showcaseMedalTiers}
              onShowcaseMedalsChange={setShowcaseMedalTiers}
              onSave={() => void handleSave()}
              message={message}
            />
          </>
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
          <h2 className="enlight-heading-serif">All achievements</h2>
          <div className="enlight-achievement-grid">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`enlight-achievement${a.unlocked ? ' enlight-achievement--unlocked' : ' enlight-achievement--locked'}`}
              >
                <span className="enlight-achievement__icon">{a.icon}</span>
                <div>
                  <div className="enlight-achievement__title">{a.title}</div>
                  <div className="enlight-achievement__desc">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <EnlightButton to="/social" variant="outline">← Social</EnlightButton>
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
