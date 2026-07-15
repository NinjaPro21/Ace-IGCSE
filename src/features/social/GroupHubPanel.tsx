import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { InlineConfirm } from '@/components/InlineConfirm'
import { friendlyErrorMessage } from '@/lib/firebaseErrors'
import { getGlobalLevel } from '@/features/mastery/levelSystem'
import { useAuth } from '@/features/social/AuthContext'
import {
  fetchClanMemberProfiles,
  fetchSchoolMemberProfiles,
  type CloudProfile,
} from '@/features/social/socialApi'
import { MAX_CLANS } from '@/features/social/socialTypes'
import { isUserOnline, presenceActivityLabel, subscribePresence, type PresenceDoc } from '@/features/social/presenceApi'

function GroupMemberChip({
  member,
  presence,
  excludeId,
  isSelf,
}: {
  member: CloudProfile
  presence: PresenceDoc | null
  excludeId?: string
  isSelf?: boolean
}) {
  if (member.id === excludeId) return null

  const online = isUserOnline(presence)

  return (
    <Link to={`/profile/${member.id}`} className={`ace-group-member${online ? ' ace-group-member--online' : ''}`}>
      <span className="ace-group-member__avatar-wrap">
        {member.avatarUrl ? (
          <img src={member.avatarUrl} alt="" className="ace-group-member__avatar" width={44} height={44} />
        ) : (
          <span className="ace-group-member__avatar ace-group-member__avatar--ph">
            {(member.displayName ?? '?').slice(0, 1)}
          </span>
        )}
        <span className={`ace-presence-dot${online ? ' ace-presence-dot--on' : ''}`} />
      </span>
      <span className="ace-group-member__name">
        {member.displayName ?? 'Student'}
        {isSelf ? ' (you)' : ''}
      </span>
      <span className="ace-group-member__status">{presenceActivityLabel(presence)}</span>
    </Link>
  )
}

function OnlineMembersStrip({
  members,
  presenceMap,
  currentUserId,
  loading,
}: {
  members: CloudProfile[]
  presenceMap: Record<string, PresenceDoc | null>
  currentUserId?: string
  loading: boolean
}) {
  const onlineCount = members.filter((m) => isUserOnline(presenceMap[m.id] ?? null)).length
  const youOnline = currentUserId ? isUserOnline(presenceMap[currentUserId] ?? null) : false

  const sorted = useMemo(() => {
    return [...members]
      .sort((a, b) => {
        const aOn = isUserOnline(presenceMap[a.id] ?? null)
        const bOn = isUserOnline(presenceMap[b.id] ?? null)
        if (aOn && !bOn) return -1
        if (!aOn && bOn) return 1
        if (a.id === currentUserId) return -1
        if (b.id === currentUserId) return 1
        return b.xp - a.xp
      })
      .slice(0, 12)
  }, [members, presenceMap, currentUserId])

  const countLabel =
    loading
      ? '…'
      : onlineCount === 0
        ? '0 online'
        : youOnline && onlineCount === 1
          ? '1 online (you)'
          : `${onlineCount} online`

  return (
    <div className="ace-group-online">
      <div className="ace-group-online__header">
        <span className="ace-group-online__pulse" aria-hidden />
        <strong>{countLabel}</strong>
        <span className="ace-group-online__meta">{members.length} members</span>
      </div>
      {loading ? (
        <p className="ace-body-text">Loading classmates…</p>
      ) : sorted.length === 0 ? (
        <p className="ace-body-text ace-group-online__empty">No other members yet — invite friends to join.</p>
      ) : (
        <div className="ace-group-online__grid">
          {sorted.map((m) => (
            <GroupMemberChip
              key={m.id}
              member={m}
              presence={presenceMap[m.id] ?? null}
              excludeId={undefined}
              isSelf={m.id === currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function useGroupMembers(groupId: string | undefined, type: 'school' | 'clan', currentUserId?: string) {
  const [members, setMembers] = useState<CloudProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceDoc | null>>({})

  useEffect(() => {
    if (!groupId) {
      setMembers([])
      return
    }
    setLoading(true)
    void (type === 'school' ? fetchSchoolMemberProfiles(groupId) : fetchClanMemberProfiles(groupId)).then((rows) => {
      setMembers(rows)
      setLoading(false)
    })
  }, [groupId, type])

  useEffect(() => {
    const ids = new Set(members.map((m) => m.id))
    if (currentUserId) ids.add(currentUserId)
    const unsubs = [...ids].map((id) =>
      subscribePresence(id, (p) => setPresenceMap((prev) => ({ ...prev, [id]: p }))),
    )
    return () => unsubs.forEach((u) => u())
  }, [members, currentUserId])

  return { members, loading, presenceMap }
}

export function GroupHubPanel() {
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
  const [activeClanId, setActiveClanId] = useState<string | null>(clans[0]?.id ?? null)

  const schoolMembers = useGroupMembers(school?.id, 'school', user?.id)
  const activeClan = clans.find((c) => c.id === activeClanId) ?? clans[0]
  const clanMembers = useGroupMembers(activeClan?.id, 'clan', user?.id)

  useEffect(() => {
    void loadPublicSchools()
  }, [loadPublicSchools])

  useEffect(() => {
    if (clans.length > 0 && !clans.some((c) => c.id === activeClanId)) {
      setActiveClanId(clans[0].id)
    }
  }, [clans, activeClanId])

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
        setMessage(`Selected ${schoolName} — sign in to finish joining.`)
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
        setMessage(`Group created! Share code ${group.inviteCode}`)
      } else {
        const code = queueCreateClan(clanName)
        setMessage(`Group ready. Code ${code} — sign in to activate.`)
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
        setMessage('Invite saved — sign in to join.')
      }
      setJoinCode('')
    } catch (err) {
      setMessage(friendlyErrorMessage(err, 'Could not join group'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ace-group-hub">
      {/* School */}
      <section className="ace-group-hub__card ace-group-hub__card--school">
        <div className="ace-group-hub__banner">
          <span className="ace-group-hub__icon" aria-hidden>S</span>
          <div>
            <h2 className="ace-heading-serif">Your school</h2>
            <p className="ace-group-hub__desc">One school per account · see who&apos;s studying now</p>
          </div>
        </div>

        {school ? (
          <>
            <div className="ace-group-hub__joined">
              <div>
                <strong className="ace-group-hub__joined-name">{school.name}</strong>
                <p className="ace-group-hub__joined-meta">
                  {school.memberCount ?? schoolMembers.members.length} students · Lv avg{' '}
                  {schoolMembers.members.length
                    ? Math.round(
                        schoolMembers.members.reduce((s, m) => s + getGlobalLevel(m.xp), 0) /
                          schoolMembers.members.length,
                      )
                    : '—'}
                </p>
              </div>
              <InlineConfirm label="Leave" variant="outline" onConfirm={() => leaveSchoolGroup()} />
            </div>
            <OnlineMembersStrip
              members={schoolMembers.members}
              presenceMap={schoolMembers.presenceMap}
              currentUserId={user?.id}
              loading={schoolMembers.loading}
            />
          </>
        ) : (
          <div className="ace-group-hub__join">
            {(pendingGroup?.action === 'joinSchool' && pendingGroup.schoolId) && !user && (
              <div className="ace-group-pending">School selected — sign in to finish joining.</div>
            )}
            <input
              type="search"
              className="ace-profile-form__input"
              placeholder="Search schools…"
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
            />
            <div className="ace-school-list ace-school-list--hub">
              {filteredSchools.length === 0 ? (
                <p className="ace-body-text">No schools match.</p>
              ) : (
                filteredSchools.slice(0, 8).map((s) => (
                  <div key={s.id} className="ace-school-row ace-school-row--hub">
                    <div>
                      <strong>{s.name}</strong>
                      {s.memberCount !== undefined && (
                        <span className="ace-school-row__meta">{s.memberCount} members</span>
                      )}
                    </div>
                    <EnlightButton className="ace-btn--sm" onClick={() => handleJoinSchool(s.id, s.name)} disabled={busy}>
                      Join
                    </EnlightButton>
                  </div>
                ))
              )}
            </div>
            <button type="button" className="ace-link-btn" onClick={() => setShowRegisterSchool((v) => !v)}>
              {showRegisterSchool ? 'Hide register' : "Can't find your school?"}
            </button>
            {showRegisterSchool && (
              <div className="ace-profile-form">
                <input
                  className="ace-profile-form__input"
                  placeholder="School name"
                  value={registerSchoolName}
                  onChange={(e) => setRegisterSchoolName(e.target.value)}
                />
                <EnlightButton
                  disabled={busy || !user}
                  onClick={async () => {
                    if (!registerSchoolName.trim() || !user) return
                    setBusy(true)
                    try {
                      await createSchoolNow(registerSchoolName)
                      setMessage(`Registered ${registerSchoolName.trim()}!`)
                      setRegisterSchoolName('')
                      setShowRegisterSchool(false)
                    } catch (err) {
                      setMessage(friendlyErrorMessage(err, 'Could not register'))
                    } finally {
                      setBusy(false)
                    }
                  }}
                >
                  Register
                </EnlightButton>
              </div>
            )}
            {!isConfigured && (
              <p className="ace-body-text">Add Firebase config to .env.local to enable schools.</p>
            )}
          </div>
        )}
      </section>

      {/* Clans */}
      <section className="ace-group-hub__card ace-group-hub__card--clan">
        <div className="ace-group-hub__banner">
          <span className="ace-group-hub__icon" aria-hidden>G</span>
          <div>
            <h2 className="ace-heading-serif">Study groups</h2>
            <p className="ace-group-hub__desc">Up to {MAX_CLANS} private groups · invite with CLN- codes</p>
          </div>
        </div>

        {clans.length > 0 && (
          <>
            <div className="ace-clan-tabs">
              {clans.map((clan) => (
                <button
                  key={clan.id}
                  type="button"
                  className={`ace-clan-tabs__btn${clan.id === activeClan?.id ? ' ace-clan-tabs__btn--active' : ''}`}
                  onClick={() => setActiveClanId(clan.id)}
                >
                  {clan.name}
                </button>
              ))}
            </div>

            {activeClan && (
              <>
                <div className="ace-group-hub__joined">
                  <div>
                    <strong className="ace-group-hub__joined-name">{activeClan.name}</strong>
                    <p className="ace-group-hub__joined-meta">
                      Code <code className="ace-invite-code">{activeClan.inviteCode}</code>
                      {activeClan.memberCount !== undefined && ` · ${activeClan.memberCount} members`}
                    </p>
                  </div>
                  <InlineConfirm label="Leave" variant="outline" onConfirm={() => leaveClanGroup(activeClan.id)} />
                </div>
                <OnlineMembersStrip
                  members={clanMembers.members}
                  presenceMap={clanMembers.presenceMap}
                  currentUserId={user?.id}
                  loading={clanMembers.loading}
                />
              </>
            )}

            <div className="ace-clan-list ace-clan-list--compact">
              {clans.map((clan) => (
                <div key={clan.id} className="ace-clan-mini">
                  <span>{clan.name}</span>
                  <code className="ace-invite-code">{clan.inviteCode}</code>
                </div>
              ))}
            </div>
          </>
        )}

        {clans.length < MAX_CLANS && (
          <div className="ace-group-hub__join">
            {(pendingGroup || localInviteCode) && !user && (
              <div className="ace-group-pending">Pending group — sign in to finish.</div>
            )}
            <div className="ace-lb-segment ace-lb-segment--compact">
              <button
                type="button"
                className={`ace-lb-segment__btn${clanMode === 'join' ? ' ace-lb-segment__btn--active' : ''}`}
                onClick={() => setClanMode('join')}
              >
                Join
              </button>
              <button
                type="button"
                className={`ace-lb-segment__btn${clanMode === 'create' ? ' ace-lb-segment__btn--active' : ''}`}
                onClick={() => setClanMode('create')}
              >
                Create
              </button>
            </div>
            {clanMode === 'join' ? (
              <div className="ace-profile-form">
                <input
                  className="ace-profile-form__input"
                  placeholder="CLN-ABC123"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
                <EnlightButton onClick={handleJoinClan} disabled={busy}>Join group</EnlightButton>
              </div>
            ) : (
              <div className="ace-profile-form">
                <input
                  className="ace-profile-form__input"
                  placeholder="Group name"
                  value={clanName}
                  maxLength={64}
                  onChange={(e) => setClanName(e.target.value)}
                />
                <EnlightButton onClick={handleCreateClan} disabled={busy}>Create group</EnlightButton>
              </div>
            )}
          </div>
        )}
      </section>

      {(message || syncError) && (
        <p className={`ace-group-message${syncError ? ' ace-group-message--error' : ''}`}>
          {syncError ?? message}
        </p>
      )}
    </div>
  )
}
