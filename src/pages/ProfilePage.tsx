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
import { normalizeProfileTheme, type ProfileTheme } from '@/features/social/profileTypes'
import { fetchProfile, updateProfileExtras, type CloudProfile } from '@/features/social/socialApi'
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
    if (!userId) {
      setLoading(false)
      return
    }
    void fetchProfile(userId, { includeSecure: user?.id === userId }).then((p) => {
      setProfile(p)
      if (p) {
        setBio(p.bio ?? '')
        setExamYear(p.examYear ?? 2026)
        setTheme(normalizeProfileTheme(p.profileTheme))
        setShowcaseAchievementIds(p.showcaseAchievementIds ?? [])
        setShowcaseMedalTiers(p.showcaseMedalTiers ?? [])
      }
      setLoading(false)
    })
  }, [userId, user?.id])

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
      privacy: 'public',
      profileTheme: theme,
      showcaseAchievementIds,
      showcaseMedalTiers,
    })
    setMessage('Profile saved')
  }

  const handleShare = () => {
    void navigator.clipboard.writeText(`Study with me on AceIGCSE! Friend code: ${friendCode}`)
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
      <div className="ace-app">
        <EnlightHeader />
        <div className="ace-container ace-page-padding">
          <p className="ace-body-text">Loading profile…</p>
        </div>
      </div>
    )
  }

  if (!profile && !isOwn) {
    return (
      <div className="ace-app">
        <EnlightHeader />
        <div className="ace-container ace-page-padding">
          <p className="ace-body-text">Profile not found.</p>
          <EnlightButton to="/social">Back to social</EnlightButton>
        </div>
      </div>
    )
  }

  // Other users only get a social card — never full study/quiz progress.
  const achievements = isOwn
    ? getAchievements(progress)
    : getAchievements(progress).map((a) => ({
        ...a,
        unlocked: (profile?.achievementIds ?? []).includes(a.id),
      }))
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
    <div className="ace-app">
      <EnlightHeader />
      <div className="ace-container ace-page-padding ace-profile-page">
        <ProfileHero profile={viewModel} userId={userId} isOwn={isOwn} />

        {!isOwn && user && (
          <div className="ace-profile-page__actions">
            {friendshipStatus === 'friends' ? (
              <span className="ace-body-text">You are friends</span>
            ) : friendshipStatus === 'pending_sent' ? (
              <span className="ace-body-text">Friend request pending…</span>
            ) : friendshipStatus === 'pending_received' ? (
              <span className="ace-body-text">This person sent you a request — check your notifications.</span>
            ) : (
              <EnlightButton onClick={() => void handleAddFriend()} disabled={addingFriend}>
                {addingFriend ? 'Sending…' : 'Add friend'}
              </EnlightButton>
            )}
          </div>
        )}

        {isOwn && (
          <>
            <section className="ace-dashboard-card">
              <h2 className="ace-heading-serif">Basic info</h2>
              <input
                className="ace-profile-form__input"
                value={progress.displayName}
                maxLength={24}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
              />
              <textarea
                className="ace-profile-form__input"
                value={bio}
                maxLength={80}
                rows={2}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio (optional)"
              />
              <label className="ace-body-text">
                Exam year{' '}
                <select className="ace-select" value={examYear} onChange={(e) => setExamYear(Number(e.target.value))}>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </label>
              <p className="ace-body-text" style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                Other students can open your profile to add you as a friend. Your email, quiz history,
                and detailed study data stay private — only you (and site admins) can access those.
              </p>
              <p className="ace-body-text">Friend code: <strong>{friendCode}</strong></p>
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

        {isOwn && (
          <>
            <section className="ace-dashboard-card">
              <h2 className="ace-heading-serif">Subject mastery</h2>
              <div className="ace-subject-overview">
                {getAllSubjects().map((subject) => {
                  const summary = getSubjectSummary(subject.id, progress)
                  if (summary.total === 0) return null
                  return (
                    <div key={subject.id} className="ace-subject-fold__summary">
                      <span>{subject.name}</span>
                      <span>{summary.avgMastery}% avg · {summary.mastered}/{summary.total} mastered</span>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="ace-dashboard-card">
              <h2 className="ace-heading-serif">All achievements</h2>
              <div className="ace-achievement-grid">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={`ace-achievement${a.unlocked ? ' ace-achievement--unlocked' : ' ace-achievement--locked'}`}
                  >
                    <span className="ace-achievement__icon">{a.icon}</span>
                    <div>
                      <div className="ace-achievement__title">{a.title}</div>
                      <div className="ace-achievement__desc">{a.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <EnlightButton to="/social" variant="outline">← Social</EnlightButton>
      </div>
      <footer className="ace-footer">© {new Date().getFullYear()} AceIGCSE</footer>
    </div>
  )
}
