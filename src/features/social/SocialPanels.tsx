import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { InlineConfirm } from '@/components/InlineConfirm'
import { friendlyErrorMessage } from '@/lib/firebaseErrors'
import { useAuth } from '@/features/social/AuthContext'
import { fetchSchoolMemberProfiles } from '@/features/social/socialApi'
import { MAX_CLANS } from '@/features/social/socialTypes'
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
          <img src={user.avatarUrl} alt="" className="enlight-signin-user__avatar" width={28} height={28} />
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
            if (window.confirm('Sign out of AceIGCSE? Your progress stays saved to your Google account.')) {
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
    clans,
    publicSchools,
    pendingGroup,
    localInviteCode,
    queueCreateClan,
    queueJoinClan,
    queueJoinSchool,
    createClanNow,
    joinClanNow,
    joinSchoolNow,
    leaveSchoolGroup,
    leaveClanGroup,
    loadPublicSchools,
    createSchoolNow,
    syncError,
  } = useAuth()

  const [schoolSearch, setSchoolSearch] = useState('')
  const [registerSchoolName, setRegisterSchoolName] = useState('')
  const [showRegisterSchool, setShowRegisterSchool] = useState(false)
  const [clanMode, setClanMode] = useState<'join' | 'create'>('join')
  const [clanName, setClanName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void loadPublicSchools()
  }, [loadPublicSchools])

  const filteredSchools = publicSchools.filter((s) =>
    s.name.toLowerCase().includes(schoolSearch.trim().toLowerCase()),
  )

  const handleJoinSchool = async (schoolId: string, schoolName: string) => {
    setBusy(true)
    setMessage(null)
    try {
      if (user) {
        await joinSchoolNow(schoolId)
        setMessage(`Joined ${schoolName}!`)
      } else {
        queueJoinSchool(schoolId)
        setMessage(`Selected ${schoolName} — sign in with Google to join your school leaderboard.`)
      }
    } catch (err) {
      setMessage(friendlyErrorMessage(err, 'Could not join school'))
    } finally {
      setBusy(false)
    }
  }

  const handleCreateClan = async () => {
    if (!clanName.trim()) return
    setBusy(true)
    setMessage(null)
    try {
      if (user) {
        const group = await createClanNow(clanName)
        setMessage(`Group created! Share code ${group.inviteCode} with friends.`)
      } else {
        const code = queueCreateClan(clanName)
        setMessage(`Group ready. Share code ${code} — sign in with Google to activate it.`)
      }
      setClanName('')
    } catch (err) {
      setMessage(friendlyErrorMessage(err, 'Could not create group'))
    } finally {
      setBusy(false)
    }
  }

  const handleJoinClan = async () => {
    if (!joinCode.trim()) return
    setBusy(true)
    setMessage(null)
    try {
      if (user) {
        const group = await joinClanNow(joinCode)
        setMessage(`Joined ${group.name}!`)
      } else {
        queueJoinClan(joinCode)
        setMessage('Invite saved — sign in with Google to join your group.')
      }
      setJoinCode('')
    } catch (err) {
      setMessage(friendlyErrorMessage(err, 'Could not join group'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* School — one only, browse & join */}
      <section className="enlight-progress-section">
        <h2 className="enlight-heading-serif enlight-progress-section__title">Your school</h2>
        <p className="enlight-body-text">
          Pick your school from the list — no invite code needed. You can only join one school.
          Duplicate school names are blocked when registering.
          {!isConfigured && ' Add Firebase config to .env.local (see .env.example).'}
        </p>

        {school ? (
          <div className="enlight-group-card">
            <div className="enlight-group-card__badge" aria-hidden>S</div>
            <div>
              <strong>{school.name}</strong>
              <p className="enlight-body-text" style={{ margin: '4px 0 0' }}>
                {school.memberCount !== undefined && `${school.memberCount} student${school.memberCount !== 1 ? 's' : ''}`}
              </p>
            </div>
            <InlineConfirm label="Leave" variant="outline" onConfirm={() => leaveSchoolGroup()} />
          </div>
        ) : (
          <>
            {(pendingGroup?.action === 'joinSchool' && pendingGroup.schoolId) && !user && (
              <div className="enlight-group-pending">
                <p>School selected — sign in with Google to finish joining.</p>
              </div>
            )}
            <input
              type="search"
              className="enlight-profile-form__input"
              placeholder="Search schools…"
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
            />
            <div className="enlight-school-list">
              {filteredSchools.length === 0 ? (
                <p className="enlight-body-text">No schools match your search.</p>
              ) : (
                filteredSchools.map((s) => (
                  <div key={s.id} className="enlight-school-row">
                    <div>
                      <strong>{s.name}</strong>
                      {s.memberCount !== undefined && (
                        <span className="enlight-school-row__meta">{s.memberCount} members</span>
                      )}
                    </div>
                    <EnlightButton className="enlight-btn--sm" onClick={() => handleJoinSchool(s.id, s.name)} disabled={busy}>
                      Join
                    </EnlightButton>
                  </div>
                ))
              )}
            </div>
            <button
              type="button"
              className="enlight-group-tab"
              style={{ marginTop: 12 }}
              onClick={() => setShowRegisterSchool((v) => !v)}
            >
              {showRegisterSchool ? 'Hide' : "Can't find your school? Register it"}
            </button>
            {showRegisterSchool && (
              <div className="enlight-profile-form" style={{ marginTop: 8 }}>
                <input
                  type="text"
                  className="enlight-profile-form__input"
                  placeholder="School name"
                  value={registerSchoolName}
                  onChange={(e) => setRegisterSchoolName(e.target.value)}
                />
                <EnlightButton
                  onClick={async () => {
                    if (!registerSchoolName.trim() || !user) return
                    setBusy(true)
                    try {
                      await createSchoolNow(registerSchoolName)
                      setMessage(`Registered ${registerSchoolName.trim()}!`)
                      setRegisterSchoolName('')
                      setShowRegisterSchool(false)
                    } catch (err) {
                      setMessage(friendlyErrorMessage(err, 'Could not register school'))
                    } finally {
                      setBusy(false)
                    }
                  }}
                  disabled={busy || !user}
                >
                  Register school
                </EnlightButton>
              </div>
            )}
          </>
        )}
      </section>

      {/* Clans — up to 3, invite code */}
      <section className="enlight-progress-section">
        <h2 className="enlight-heading-serif enlight-progress-section__title">Study groups</h2>
        <p className="enlight-body-text">
          Join up to {MAX_CLANS} private groups with an invite code (CLN-…). Share codes with classmates.
        </p>

        {clans.length > 0 && (
          <div className="enlight-clan-list">
            {clans.map((clan) => (
              <div key={clan.id} className="enlight-group-card">
                <div className="enlight-group-card__badge" aria-hidden>G</div>
                <div>
                  <strong>{clan.name}</strong>
                  <p className="enlight-body-text" style={{ margin: '4px 0 0' }}>
                    Code: <code className="enlight-invite-code">{clan.inviteCode}</code>
                    {clan.memberCount !== undefined && ` · ${clan.memberCount} member${clan.memberCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
                <InlineConfirm label="Leave" variant="outline" onConfirm={() => leaveClanGroup(clan.id)} />
              </div>
            ))}
          </div>
        )}

        {clans.length < MAX_CLANS && (
          <>
            {(pendingGroup || localInviteCode) && !user && (
              <div className="enlight-group-pending">
                {pendingGroup?.action === 'create' && (
                  <p>
                    Pending group: <strong>{pendingGroup.name}</strong>
                    {localInviteCode && (
                      <>
                        {' '}
                        — code <code className="enlight-invite-code">{localInviteCode}</code>
                      </>
                    )}
                  </p>
                )}
                {pendingGroup?.action === 'joinClan' && (
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
                className={`enlight-group-tab${clanMode === 'join' ? ' enlight-group-tab--active' : ''}`}
                onClick={() => setClanMode('join')}
              >
                Join with code
              </button>
              <button
                type="button"
                className={`enlight-group-tab${clanMode === 'create' ? ' enlight-group-tab--active' : ''}`}
                onClick={() => setClanMode('create')}
              >
                Create group
              </button>
            </div>

            {clanMode === 'join' ? (
              <div className="enlight-profile-form">
                <input
                  type="text"
                  className="enlight-profile-form__input"
                  placeholder="CLN-ABC123"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
                <EnlightButton onClick={handleJoinClan} disabled={busy}>
                  Join group
                </EnlightButton>
              </div>
            ) : (
              <div className="enlight-profile-form">
                <input
                  type="text"
                  className="enlight-profile-form__input"
                  placeholder="e.g. Study circle"
                  value={clanName}
                  maxLength={64}
                  onChange={(e) => setClanName(e.target.value)}
                />
                <EnlightButton onClick={handleCreateClan} disabled={busy}>
                  Create group
                </EnlightButton>
              </div>
            )}
          </>
        )}

        {(message || syncError) && (
          <p className={`enlight-group-message${syncError ? ' enlight-group-message--error' : ''}`}>
            {syncError ?? message}
          </p>
        )}
      </section>
    </>
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
            <span
              className={[
                'enlight-insights-row__subject',
                `enlight-insights-row__subject--${row.subjectId.replace(/[^a-z0-9-]/gi, '')}`,
              ].join(' ')}
            >
              {row.subjectName}
            </span>
            <span className="enlight-insights-row__title">{row.chapterTitle}</span>
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
      setRows(getStuckChapters(insights, 3))
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
