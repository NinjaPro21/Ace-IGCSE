import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from '@/features/social/AuthContext'
import { fetchClanMemberProfiles, fetchSchoolMemberProfiles, fetchFriendsLeaderboard, fetchProfile, type CloudProfile } from '@/features/social/socialApi'
import { MAX_CLANS } from '@/features/social/socialTypes'
import { periodLabel, type LeaderboardMetric, type LeaderboardPeriod } from '@/features/social/leaderboardUtils'
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
      setMessage(err instanceof Error ? err.message : 'Could not join school')
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
        setMessage(`Clan created! Share code ${group.inviteCode} with friends.`)
      } else {
        const code = queueCreateClan(clanName)
        setMessage(`Clan ready. Share code ${code} — sign in with Google to activate it.`)
      }
      setClanName('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not create clan')
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
        setMessage(`Joined clan ${group.name}!`)
      } else {
        queueJoinClan(joinCode)
        setMessage('Invite saved — sign in with Google to join your clan.')
      }
      setJoinCode('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not join clan')
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
            <div className="enlight-group-card__badge">🏫</div>
            <div>
              <strong>{school.name}</strong>
              <p className="enlight-body-text" style={{ margin: '4px 0 0' }}>
                {school.memberCount !== undefined && `${school.memberCount} student${school.memberCount !== 1 ? 's' : ''}`}
              </p>
            </div>
            <EnlightButton variant="outline" onClick={() => leaveSchoolGroup()}>
              Leave
            </EnlightButton>
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
                      setMessage(err instanceof Error ? err.message : 'Could not register school')
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
        <h2 className="enlight-heading-serif enlight-progress-section__title">Friend clans</h2>
        <p className="enlight-body-text">
          Join up to {MAX_CLANS} friend groups with an invite code (CLN-…). Share codes with your study group.
        </p>

        {clans.length > 0 && (
          <div className="enlight-clan-list">
            {clans.map((clan) => (
              <div key={clan.id} className="enlight-group-card">
                <div className="enlight-group-card__badge">⚔️</div>
                <div>
                  <strong>{clan.name}</strong>
                  <p className="enlight-body-text" style={{ margin: '4px 0 0' }}>
                    Code: <code className="enlight-invite-code">{clan.inviteCode}</code>
                    {clan.memberCount !== undefined && ` · ${clan.memberCount} member${clan.memberCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
                <EnlightButton variant="outline" onClick={() => leaveClanGroup(clan.id)}>
                  Leave
                </EnlightButton>
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
                    Pending clan: <strong>{pendingGroup.name}</strong>
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
                Create clan
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
                  Join clan
                </EnlightButton>
              </div>
            ) : (
              <div className="enlight-profile-form">
                <input
                  type="text"
                  className="enlight-profile-form__input"
                  placeholder="e.g. The Integrators"
                  value={clanName}
                  maxLength={64}
                  onChange={(e) => setClanName(e.target.value)}
                />
                <EnlightButton onClick={handleCreateClan} disabled={busy}>
                  Create clan
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

function MembersList({ members, loading }: { members: CloudProfile[]; loading: boolean }) {
  if (loading) return <p className="enlight-body-text">Loading members…</p>
  if (members.length === 0) {
    return <p className="enlight-body-text">No members yet — invite classmates to join.</p>
  }

  const sorted = [...members].sort((a, b) => b.xp - a.xp)

  return (
    <ol className="enlight-leaderboard">
      {sorted.map((member) => (
        <li key={member.id} className="enlight-leaderboard__row">
          {member.avatarUrl ? (
            <img src={member.avatarUrl} alt="" className="enlight-leaderboard__avatar" />
          ) : (
            <span className="enlight-leaderboard__avatar enlight-leaderboard__avatar--placeholder">
              {(member.displayName ?? '?').slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="enlight-leaderboard__info">
            <span className="enlight-leaderboard__name">{member.displayName ?? 'Student'}</span>
            <span className="enlight-leaderboard__meta">
              {member.streakDays}d streak · {member.longestStreak}d best
            </span>
          </div>
          <span className="enlight-leaderboard__xp">{member.xp.toLocaleString()} XP</span>
        </li>
      ))}
    </ol>
  )
}

export function GroupLeaderboard() {
  const {
    user,
    school,
    clans,
    leaderboard,
    leaderboardGroupId,
    leaderboardMetric,
    leaderboardPeriod,
    isConfigured,
    setLeaderboardGroup,
    setLeaderboardFilters,
  } = useAuth()

  const [panelMode, setPanelMode] = useState<'leaderboard' | 'members'>('leaderboard')
  const [members, setMembers] = useState<CloudProfile[]>([])
  const [membersLoading, setMembersLoading] = useState(false)
  const [friendsBoard, setFriendsBoard] = useState<typeof leaderboard>([])
  const [friendIds, setFriendIds] = useState<string[]>([])
  const [scope, setScope] = useState<'group' | 'friends'>('group')

  const groups: { id: string; name: string; type: 'school' | 'clan' }[] = []
  if (school) groups.push({ id: school.id, name: school.name, type: 'school' })
  for (const c of clans) groups.push({ id: c.id, name: c.name, type: 'clan' })

  const activeGroup = groups.find((g) => g.id === leaderboardGroupId) ?? groups[0]

  useEffect(() => {
    if (!user) return
    void fetchProfile(user.id).then((p) => setFriendIds(p?.friendIds ?? []))
  }, [user])

  useEffect(() => {
    if (scope !== 'friends' || !user || friendIds.length === 0) {
      setFriendsBoard([])
      return
    }
    void fetchFriendsLeaderboard(friendIds, user.id, {
      metric: leaderboardMetric,
      period: leaderboardPeriod,
    }).then(setFriendsBoard)
  }, [scope, user, friendIds, leaderboardMetric, leaderboardPeriod])

  const displayBoard = scope === 'friends' ? friendsBoard : leaderboard
  const friendIdSet = new Set(friendIds)

  useEffect(() => {
    if (panelMode !== 'members' || !activeGroup) {
      setMembers([])
      return
    }
    let cancelled = false
    setMembersLoading(true)
    void (async () => {
      const rows =
        activeGroup.type === 'school'
          ? await fetchSchoolMemberProfiles(activeGroup.id)
          : await fetchClanMemberProfiles(activeGroup.id)
      if (!cancelled) {
        setMembers(rows)
        setMembersLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [panelMode, activeGroup?.id, activeGroup?.type])

  const handleMetric = (metric: LeaderboardMetric) => {
    const period = metric === 'longestStreak' ? 'all' : leaderboardPeriod
    void setLeaderboardFilters(metric, period)
  }

  const handlePeriod = (period: LeaderboardPeriod) => {
    void setLeaderboardFilters('xp', period)
  }

  if (groups.length === 0 && friendIds.length === 0) {
    return (
      <section className="enlight-progress-section enlight-dashboard-card">
        <h2 className="enlight-heading-serif enlight-progress-section__title">Leaderboard</h2>
        <div className="enlight-leaderboard-placeholder">
          <span className="enlight-leaderboard-placeholder__icon">🏅</span>
          <div>
            <strong>Join your school or a clan to compete</strong>
            <p className="enlight-body-text" style={{ margin: '4px 0 0' }}>
              Pick your school from the list below, or join a friend clan with an invite code.
              {!isConfigured && ' Enable Google sign-in first.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="enlight-progress-section enlight-dashboard-card">
      <div className="enlight-progress-section__header">
        <h2 className="enlight-heading-serif enlight-progress-section__title">
          {activeGroup.type === 'school' ? 'School' : 'Friends'}
        </h2>
        <span className="enlight-progress-section__meta">
          {panelMode === 'leaderboard' && leaderboardMetric === 'xp'
            ? periodLabel(leaderboardPeriod)
            : panelMode === 'leaderboard'
              ? 'All time'
              : `${members.length || '…'} members`}
        </span>
      </div>

      <div className="enlight-group-tabs enlight-group-tabs--compact">
        <button
          type="button"
          className={`enlight-group-tab${panelMode === 'leaderboard' ? ' enlight-group-tab--active' : ''}`}
          onClick={() => setPanelMode('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          type="button"
          className={`enlight-group-tab${panelMode === 'members' ? ' enlight-group-tab--active' : ''}`}
          onClick={() => setPanelMode('members')}
        >
          {activeGroup.type === 'school' ? 'Classmates' : 'Friends'}
        </button>
      </div>

      <div className="enlight-group-tabs enlight-group-tabs--compact">
        <button
          type="button"
          className={`enlight-group-tab${scope === 'group' ? ' enlight-group-tab--active' : ''}`}
          onClick={() => setScope('group')}
          disabled={groups.length === 0}
        >
          School / Clan
        </button>
        <button
          type="button"
          className={`enlight-group-tab${scope === 'friends' ? ' enlight-group-tab--active' : ''}`}
          onClick={() => setScope('friends')}
          disabled={friendIds.length === 0}
        >
          My friends
        </button>
      </div>

      {groups.length > 1 && scope === 'group' && (
        <div className="enlight-group-tabs enlight-group-tabs--leaderboard">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`enlight-group-tab${g.id === activeGroup.id ? ' enlight-group-tab--active' : ''}`}
              onClick={() => setLeaderboardGroup(g.id, g.type)}
            >
              {g.type === 'school' ? '🏫' : '⚔️'} {g.name}
            </button>
          ))}
        </div>
      )}

      {panelMode === 'leaderboard' && (
      <>
      <div className="enlight-leaderboard-filters">
        <div className="enlight-group-tabs enlight-group-tabs--compact">
          <button
            type="button"
            className={`enlight-group-tab${leaderboardMetric === 'xp' ? ' enlight-group-tab--active' : ''}`}
            onClick={() => handleMetric('xp')}
          >
            XP earned
          </button>
          <button
            type="button"
            className={`enlight-group-tab${leaderboardMetric === 'longestStreak' ? ' enlight-group-tab--active' : ''}`}
            onClick={() => handleMetric('longestStreak')}
          >
            Longest streak
          </button>
        </div>

        {leaderboardMetric === 'xp' && (
          <div className="enlight-group-tabs enlight-group-tabs--compact">
            {(['day', 'week', 'month', 'all'] as LeaderboardPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`enlight-group-tab${leaderboardPeriod === p ? ' enlight-group-tab--active' : ''}`}
                onClick={() => handlePeriod(p)}
              >
                {periodLabel(p)}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="enlight-body-text enlight-leaderboard__heading">
        {activeGroup.type === 'school' ? '🏫' : '⚔️'} {activeGroup.name}
      </p>

      {!user && (
        <p className="enlight-body-text">Sign in to appear on the board and sync your progress.</p>
      )}
      {displayBoard.length === 0 ? (
        <p className="enlight-body-text">No members yet — invite classmates to join.</p>
      ) : (
        <ol className="enlight-leaderboard">
          {displayBoard.map((entry, index) => (
            <li
              key={entry.userId}
              className={[
                'enlight-leaderboard__row',
                entry.isYou ? 'enlight-leaderboard__row--you' : '',
                friendIdSet.has(entry.userId) && !entry.isYou ? 'enlight-leaderboard__row--friend' : '',
              ].join(' ')}
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
                  Lv {entry.level} · {entry.streakDays}d current streak
                </span>
              </div>
              <span className="enlight-leaderboard__xp">
                {leaderboardMetric === 'longestStreak'
                  ? `${entry.score}d best`
                  : `${entry.score} XP`}
              </span>
            </li>
          ))}
        </ol>
      )}
      </>
      )}

      {panelMode === 'members' && (
        <>
          <p className="enlight-body-text enlight-leaderboard__heading">
            {activeGroup.type === 'school' ? '🏫' : '⚔️'} {activeGroup.name}
          </p>
          <MembersList members={members} loading={membersLoading} />
        </>
      )}
    </section>
  )
}
