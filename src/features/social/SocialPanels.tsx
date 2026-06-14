import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from '@/features/social/AuthContext'
import { fetchSchoolMemberProfiles } from '@/features/social/socialApi'
import type { GroupType } from '@/features/social/socialTypes'
import { getClassChapterInsights, getStuckChapters, type ChapterInsight } from '@/features/mastery/tutorInsights'

export function SignInButton({ compact = false }: { compact?: boolean }) {
  const { user, loading, signInWithGoogle, signOut, syncError } = useAuth()

  if (loading) {
    return (
      <button type="button" className="enlight-btn enlight-btn--sm enlight-btn--outline" disabled>
        …
      </button>
    )
  }

  if (user) {
    return (
      <div className="enlight-signin-user">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="enlight-signin-user__avatar" />
        ) : (
          <span className="enlight-signin-user__avatar enlight-signin-user__avatar--placeholder">
            {user.displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
        {!compact && <span className="enlight-signin-user__name">{user.displayName}</span>}
        <button
          type="button"
          className="enlight-btn enlight-btn--sm enlight-btn--outline"
          onClick={() => {
            if (window.confirm('Sign out of Project Enlight? Your progress stays saved to your Google account.')) {
              signOut()
            }
          }}
        >
          Sign out
        </button>
        {syncError && <span className="enlight-signin-error">{syncError}</span>}
      </div>
    )
  }

  return (
    <div className="enlight-signin-wrap">
      <button type="button" className="enlight-btn enlight-btn--primary enlight-btn--sm" onClick={() => signInWithGoogle()}>
        Sign in with Google
      </button>
      {syncError && <span className="enlight-signin-error">{syncError}</span>}
    </div>
  )
}

export function SchoolClanPanel() {
  const {
    user,
    isConfigured,
    school,
    pendingGroup,
    localInviteCode,
    queueCreateGroup,
    queueJoinGroup,
    createGroupNow,
    joinGroupNow,
    leaveGroup,
    syncError,
  } = useAuth()

  const [mode, setMode] = useState<'create' | 'join'>('join')
  const [groupType, setGroupType] = useState<GroupType>('school')
  const [groupName, setGroupName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleCreate = async () => {
    if (!groupName.trim()) return
    setBusy(true)
    setMessage(null)
    try {
      if (user) {
        const group = await createGroupNow(groupName, groupType)
        setMessage(`${group.type === 'school' ? 'School' : 'Clan'} created! Share code ${group.inviteCode}`)
      } else {
        const code = queueCreateGroup(groupName, groupType)
        setMessage(
          `${groupType === 'school' ? 'School' : 'Clan'} ready. Share code ${code} — sign in with Google to activate it.`,
        )
      }
      setGroupName('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not create group')
    } finally {
      setBusy(false)
    }
  }

  const handleJoin = async () => {
    if (!joinCode.trim()) return
    setBusy(true)
    setMessage(null)
    try {
      if (user) {
        const group = await joinGroupNow(joinCode)
        setMessage(`Joined ${group.name}!`)
      } else {
        queueJoinGroup(joinCode)
        setMessage('Invite saved — sign in with Google to join your school or clan.')
      }
      setJoinCode('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not join group')
    } finally {
      setBusy(false)
    }
  }

  if (school) {
    return (
      <section className="enlight-progress-section">
        <h2 className="enlight-heading-serif enlight-progress-section__title">
          Your {school.type === 'school' ? 'school' : 'clan'}
        </h2>
        <div className="enlight-group-card">
          <div className="enlight-group-card__badge">{school.type === 'school' ? '🏫' : '⚔️'}</div>
          <div>
            <strong>{school.name}</strong>
            <p className="enlight-body-text" style={{ margin: '4px 0 0' }}>
              Invite code: <code className="enlight-invite-code">{school.inviteCode}</code>
              {school.memberCount !== undefined && ` · ${school.memberCount} member${school.memberCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          <EnlightButton variant="outline" onClick={() => leaveGroup()}>
            Leave
          </EnlightButton>
        </div>
      </section>
    )
  }

  return (
    <section className="enlight-progress-section">
      <h2 className="enlight-heading-serif enlight-progress-section__title">School or clan</h2>
      <p className="enlight-body-text">
        Create a group for your class or join with an invite code. {isConfigured ? 'Sign in with Google to sync progress and appear on the leaderboard.' : 'Add Firebase config to .env.local (see .env.example).'}
      </p>

      {(pendingGroup || localInviteCode) && !user && (
        <div className="enlight-group-pending">
          {pendingGroup?.action === 'create' && (
            <p>
              Pending {pendingGroup.type}: <strong>{pendingGroup.name}</strong>
              {localInviteCode && (
                <>
                  {' '}
                  — code <code className="enlight-invite-code">{localInviteCode}</code>
                </>
              )}
            </p>
          )}
          {pendingGroup?.action === 'join' && (
            <p>
              Pending join: <code className="enlight-invite-code">{pendingGroup.inviteCode}</code>
            </p>
          )}
          <p className="enlight-body-text">Sign in with Google to finish setup.</p>
        </div>
      )}

      <div className="enlight-group-tabs">
        <button
          type="button"
          className={`enlight-group-tab${mode === 'join' ? ' enlight-group-tab--active' : ''}`}
          onClick={() => setMode('join')}
        >
          Join with code
        </button>
        <button
          type="button"
          className={`enlight-group-tab${mode === 'create' ? ' enlight-group-tab--active' : ''}`}
          onClick={() => setMode('create')}
        >
          Create new
        </button>
      </div>

      {mode === 'join' ? (
        <div className="enlight-profile-form">
          <input
            type="text"
            className="enlight-profile-form__input"
            placeholder="SCH-ABC123 or CLN-ABC123"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <EnlightButton onClick={handleJoin} disabled={busy}>
            Join
          </EnlightButton>
        </div>
      ) : (
        <>
          <div className="enlight-group-type-picker">
            <label className={`enlight-group-type${groupType === 'school' ? ' enlight-group-type--active' : ''}`}>
              <input
                type="radio"
                name="groupType"
                value="school"
                checked={groupType === 'school'}
                onChange={() => setGroupType('school')}
              />
              🏫 School
            </label>
            <label className={`enlight-group-type${groupType === 'clan' ? ' enlight-group-type--active' : ''}`}>
              <input
                type="radio"
                name="groupType"
                value="clan"
                checked={groupType === 'clan'}
                onChange={() => setGroupType('clan')}
              />
              ⚔️ Clan
            </label>
          </div>
          <div className="enlight-profile-form">
            <input
              type="text"
              className="enlight-profile-form__input"
              placeholder={groupType === 'school' ? 'e.g. Nexus International' : 'e.g. The Integrators'}
              value={groupName}
              maxLength={64}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <EnlightButton onClick={handleCreate} disabled={busy}>
              Create
            </EnlightButton>
          </div>
        </>
      )}

      {(message || syncError) && (
        <p className={`enlight-group-message${syncError ? ' enlight-group-message--error' : ''}`}>
          {syncError ?? message}
        </p>
      )}
    </section>
  )
}

function InsightsTable({ rows, emptyMessage }: { rows: ChapterInsight[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <p className="enlight-body-text">{emptyMessage}</p>
  }

  return (
    <div className="enlight-insights-table">
      {rows.map((row) => (
        <div key={row.chapterId} className="enlight-insights-row">
          <div className="enlight-insights-row__main">
            <span className="enlight-insights-row__title">{row.chapterTitle}</span>
            <span className="enlight-insights-row__subject">{row.subjectName}</span>
          </div>
          <div className="enlight-insights-row__stats">
            <span>{row.timeSpentMin} min avg</span>
            <span>{row.quizAttempts} attempts</span>
            {row.failRate > 0 && <span>{row.failRate}% fail rate</span>}
            {row.studentCount > 1 && <span>{row.studentCount} students</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ClassInsightsPanel() {
  const { school, user } = useAuth()
  const [rows, setRows] = useState<ChapterInsight[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!school || !user) {
      setRows([])
      return
    }

    let cancelled = false
    setLoading(true)
    void fetchSchoolMemberProfiles(school.id).then((profiles) => {
      if (cancelled) return
      const insights = getClassChapterInsights(profiles)
      setRows(getStuckChapters(insights, 8))
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [school, user])

  if (!school) return null

  return (
    <section className="enlight-progress-section">
      <div className="enlight-progress-section__header">
        <h2 className="enlight-heading-serif enlight-progress-section__title">Class focus areas</h2>
        <span className="enlight-progress-section__meta">Tutor view · {school.name}</span>
      </div>
      <p className="enlight-body-text">
        Chapters where your students spend the most time or fail quizzes most often — useful for
        planning lessons and revision.
      </p>
      {loading ? (
        <p className="enlight-body-text">Loading class data…</p>
      ) : (
        <InsightsTable
          rows={rows}
          emptyMessage="No study data yet. Students need to read notes and attempt quizzes while signed in."
        />
      )}
    </section>
  )
}

export function GroupLeaderboard() {
  const { user, school, leaderboard, isConfigured } = useAuth()

  if (!school) {
    return (
      <section className="enlight-progress-section">
        <h2 className="enlight-heading-serif enlight-progress-section__title">Leaderboard</h2>
        <div className="enlight-leaderboard-placeholder">
          <span className="enlight-leaderboard-placeholder__icon">🏅</span>
          <div>
            <strong>Join a school or clan to compete</strong>
            <p className="enlight-body-text" style={{ margin: '4px 0 0' }}>
              Classmates on the same invite code rank by XP and streak. {!isConfigured && 'Enable Google sign-in first.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="enlight-progress-section">
      <div className="enlight-progress-section__header">
        <h2 className="enlight-heading-serif enlight-progress-section__title">
          {school.name} leaderboard
        </h2>
        <span className="enlight-progress-section__meta">Ranked by XP</span>
      </div>
      {!user && (
        <p className="enlight-body-text">Sign in to appear on the board and sync your progress.</p>
      )}
      {leaderboard.length === 0 ? (
        <p className="enlight-body-text">No members yet — share invite code {school.inviteCode}.</p>
      ) : (
        <ol className="enlight-leaderboard">
          {leaderboard.map((entry, index) => (
            <li
              key={entry.userId}
              className={`enlight-leaderboard__row${entry.isYou ? ' enlight-leaderboard__row--you' : ''}`}
            >
              <span className="enlight-leaderboard__rank">{index + 1}</span>
              {entry.avatarUrl ? (
                <img src={entry.avatarUrl} alt="" className="enlight-leaderboard__avatar" />
              ) : (
                <span className="enlight-leaderboard__avatar enlight-leaderboard__avatar--placeholder">
                  {entry.displayName.slice(0, 1)}
                </span>
              )}
              <div className="enlight-leaderboard__info">
                <span className="enlight-leaderboard__name">
                  {entry.displayName}
                  {entry.isYou && ' (you)'}
                </span>
                <span className="enlight-leaderboard__meta">
                  Lv {entry.level} · {entry.streakDays}d streak
                </span>
              </div>
              <span className="enlight-leaderboard__xp">{entry.xp} XP</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
