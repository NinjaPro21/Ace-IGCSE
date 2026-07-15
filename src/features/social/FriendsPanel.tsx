import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { InlineConfirm } from '@/components/InlineConfirm'
import { friendlyErrorMessage } from '@/lib/firebaseErrors'
import { useAuth } from './AuthContext'
import {
  ensureFriendCode,
  fetchFriendProfiles,
  fetchPendingFriendRequests,
  removeFriend,
  sendFriendRequest,
  sendFriendRequestByCode,
  type FriendRequest,
} from './friendsApi'
import { isUserOnline, presenceActivityLabel, subscribePresence, type PresenceDoc } from './presenceApi'
import { fetchBuddyStreak, touchBuddyStreaksForFriends } from './buddyStreaksApi'
import { getGlobalLevel } from '@/features/mastery/levelSystem'
import { hasLiveDuel } from './duelsApi'
import { DuelSetupModal } from './DuelSetupModal'
import { useSocialInbox } from './SocialInboxProvider'
import type { CloudProfile } from './socialApi'

function FriendRow({
  friend,
  userId,
  presence,
  onDuel,
  duelBlocked,
}: {
  friend: CloudProfile
  userId: string
  presence: PresenceDoc | null
  onDuel: (friend: CloudProfile) => void
  duelBlocked?: boolean
}) {
  const [buddyStreak, setBuddyStreak] = useState<number | null>(null)

  useEffect(() => {
    void fetchBuddyStreak(userId, friend.id).then((s) => setBuddyStreak(s?.streakDays ?? null))
  }, [userId, friend.id])

  const online = isUserOnline(presence)
  const statusText = presenceActivityLabel(presence)

  const joinPath =
    online && (presence?.status === 'studying' || presence?.status === 'in_quiz') &&
    presence?.subjectId && presence?.currentChapterId && presence?.currentTopicId
      ? `/subjects/${presence.subjectId}/chapters/${presence.currentChapterId}/topics/${presence.currentTopicId}`
      : null

  return (
    <li className="ace-friend-row">
      <Link to={`/profile/${friend.id}`} className="ace-friend-row__main">
        {friend.avatarUrl ? (
          <img src={friend.avatarUrl} alt="" className="ace-leaderboard__avatar" width={36} height={36} />
        ) : (
          <span className="ace-leaderboard__avatar ace-leaderboard__avatar--placeholder">
            {(friend.displayName ?? '?').slice(0, 1)}
          </span>
        )}
        <span className={`ace-presence-dot${online ? ' ace-presence-dot--on' : ''}`} />
        <div>
          <div className="ace-friend-row__name">{friend.displayName}</div>
          <div className="ace-friend-row__meta">
            Lv {getGlobalLevel(friend.xp)} · {friend.streakDays}d streak
            {buddyStreak != null && buddyStreak > 0 && ` · 🤝 ${buddyStreak}d buddy`}
          </div>
          <div className={`ace-friend-row__studying${online ? '' : ' ace-friend-row__studying--off'}`}>
            {statusText}
          </div>
        </div>
      </Link>
      <div className="ace-friend-row__actions">
        {joinPath && (
          <EnlightButton to={joinPath} variant="outline">
            Join
          </EnlightButton>
        )}
        <EnlightButton
          variant="outline"
          onClick={() => onDuel(friend)}
          disabled={duelBlocked}
        >
          Duel
        </EnlightButton>
        <InlineConfirm
          label="Remove"
          textStyle
          onConfirm={() => void removeFriend(userId, friend.id)}
        />
      </div>
    </li>
  )
}

export function FriendsPanel() {
  const { user } = useAuth()
  const { duels } = useSocialInbox()
  const duelBlocked = user ? hasLiveDuel(duels, user.id) : false
  const [friends, setFriends] = useState<CloudProfile[]>([])
  const [friendCode, setFriendCode] = useState('')
  const [addCode, setAddCode] = useState('')
  const [addUid, setAddUid] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceDoc | null>>({})
  const [pendingIncoming, setPendingIncoming] = useState<FriendRequest[]>([])
  const [duelTarget, setDuelTarget] = useState<CloudProfile | null>(null)
  const [duelMessage, setDuelMessage] = useState<string | null>(null)

  const reloadFriends = () => {
    if (!user) return
    void fetchFriendProfiles(user.id).then((profiles) => {
      setFriends(profiles)
      void touchBuddyStreaksForFriends(
        user.id,
        profiles.map((p) => p.id),
      )
    })
    void fetchPendingFriendRequests(user.id).then(setPendingIncoming)
  }

  useEffect(() => {
    if (!user) return
    void ensureFriendCode(user.id).then(setFriendCode)
    reloadFriends()
  }, [user])

  useEffect(() => {
    const onFriendsChanged = () => reloadFriends()
    window.addEventListener('ace-friends-changed', onFriendsChanged)
    return () => window.removeEventListener('ace-friends-changed', onFriendsChanged)
  }, [user])

  useEffect(() => {
    if (!user) return
    const unsubs = friends.map((f) =>
      subscribePresence(f.id, (p) => setPresenceMap((m) => ({ ...m, [f.id]: p }))),
    )
    return () => unsubs.forEach((u) => u())
  }, [friends, user])

  if (!user) {
    return (
      <section className="ace-dashboard-card">
        <h2 className="ace-heading-serif">Friends</h2>
        <p className="ace-body-text">Sign in to add friends and study together.</p>
      </section>
    )
  }

  const handleAddByCode = async () => {
    const code = addCode.trim()
    if (!code) {
      setMessage('Enter a friend code (FRD-…)')
      return
    }
    setAdding(true)
    setMessage(null)
    try {
      await sendFriendRequestByCode(user.id, code)
      setMessage('Friend request sent! They will see it in their notifications.')
      setAddCode('')
    } catch (err) {
      setMessage(friendlyErrorMessage(err, 'Could not send request'))
    } finally {
      setAdding(false)
    }
  }

  const handleAddFromLeaderboard = async () => {
    const uid = addUid.trim()
    if (!uid) {
      setMessage('Enter a user ID from the leaderboard')
      return
    }
    setAdding(true)
    setMessage(null)
    try {
      await sendFriendRequest(user.id, uid)
      setMessage('Friend request sent! They will see it in their notifications.')
      setAddUid('')
    } catch (err) {
      setMessage(friendlyErrorMessage(err, 'Could not send request'))
    } finally {
      setAdding(false)
    }
  }

  return (
    <section className="ace-dashboard-card ace-friends-panel">
      <h2 className="ace-heading-serif">Friends</h2>
      <p className="ace-body-text ace-friends-panel__code">
        Your friend code: <strong>{friendCode || '…'}</strong>
        {friendCode && (
          <button
            type="button"
            className="ace-link-btn"
            onClick={() => void navigator.clipboard.writeText(friendCode)}
          >
            Copy
          </button>
        )}
      </p>

      {duelBlocked && (
        <div className="ace-alert ace-alert--warn" role="status">
          <strong>Duel in progress</strong>
          <p>Finish your current duel in the inbox before starting another.</p>
        </div>
      )}

      <div className="ace-friends-add">
        <label className="ace-friends-add__field">
          <span className="ace-friends-add__label">Add by friend code</span>
          <div className="ace-friends-add__row">
            <input
              className="ace-input"
              placeholder="FRD-ABC123"
              value={addCode}
              onChange={(e) => setAddCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleAddByCode()}
            />
            <EnlightButton onClick={() => void handleAddByCode()} disabled={adding}>
              {adding ? 'Sending…' : 'Add friend'}
            </EnlightButton>
          </div>
        </label>
        <label className="ace-friends-add__field">
          <span className="ace-friends-add__label">Or user ID from leaderboard</span>
          <div className="ace-friends-add__row">
            <input
              className="ace-input"
              placeholder="Paste user ID"
              value={addUid}
              onChange={(e) => setAddUid(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleAddFromLeaderboard()}
            />
            <EnlightButton variant="outline" onClick={() => void handleAddFromLeaderboard()} disabled={adding}>
              Request
            </EnlightButton>
          </div>
        </label>
      </div>

      {duelMessage && <p className="ace-body-text ace-form-message">{duelMessage}</p>}
      {message && <p className="ace-body-text ace-form-message">{message}</p>}
      {pendingIncoming.length > 0 && (
        <div className="ace-friends-pending">
          <p className="ace-body-text">
            <strong>{pendingIncoming.length} pending request{pendingIncoming.length === 1 ? '' : 's'}</strong> — accept from the 🔔 bell in the header.
          </p>
        </div>
      )}
      {friends.length === 0 ? (
        <p className="ace-body-text">No friends yet — share your code with classmates.</p>
      ) : (
        <ul className="ace-friends-list">
          {friends.map((f) => (
            <FriendRow
              key={f.id}
              friend={f}
              userId={user.id}
              presence={presenceMap[f.id] ?? null}
              onDuel={setDuelTarget}
              duelBlocked={duelBlocked}
            />
          ))}
        </ul>
      )}
      {duelTarget && (
        <DuelSetupModal
          userId={user.id}
          friendId={duelTarget.id}
          friendName={duelTarget.displayName ?? 'friend'}
          onClose={() => setDuelTarget(null)}
          onSent={() => setDuelMessage(`Duel sent to ${duelTarget.displayName ?? 'friend'}!`)}
        />
      )}
    </section>
  )
}
