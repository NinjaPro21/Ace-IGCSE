import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { EnlightButton } from '@/components/EnlightButton'
import { InlineConfirm } from '@/components/InlineConfirm'
import { friendlyErrorMessage } from '@/lib/firebaseErrors'
import { db } from '@/lib/firebase'
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
import { fetchBuddyStreak } from './buddyStreaksApi'
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
    <li className="enlight-friend-row">
      <Link to={`/profile/${friend.id}`} className="enlight-friend-row__main">
        {friend.avatarUrl ? (
          <img src={friend.avatarUrl} alt="" className="enlight-leaderboard__avatar" width={36} height={36} />
        ) : (
          <span className="enlight-leaderboard__avatar enlight-leaderboard__avatar--placeholder">
            {(friend.displayName ?? '?').slice(0, 1)}
          </span>
        )}
        <span className={`enlight-presence-dot${online ? ' enlight-presence-dot--on' : ''}`} />
        <div>
          <div className="enlight-friend-row__name">{friend.displayName}</div>
          <div className="enlight-friend-row__meta">
            Lv {getGlobalLevel(friend.xp)} · {friend.streakDays}d streak
            {buddyStreak != null && buddyStreak > 0 && ` · 🤝 ${buddyStreak}d buddy`}
          </div>
          <div className={`enlight-friend-row__studying${online ? '' : ' enlight-friend-row__studying--off'}`}>
            {statusText}
          </div>
        </div>
      </Link>
      <div className="enlight-friend-row__actions">
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
    void fetchFriendProfiles(user.id).then(setFriends)
    void fetchPendingFriendRequests(user.id).then(setPendingIncoming)
  }

  useEffect(() => {
    if (!user) return
    void ensureFriendCode(user.id).then(setFriendCode)
    reloadFriends()
  }, [user])

  useEffect(() => {
    if (!user || !db) return
    let timer: ReturnType<typeof setTimeout> | null = null
    const unsub = onSnapshot(doc(db, 'profiles', user.id), () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => reloadFriends(), 800)
    })
    return () => {
      if (timer) clearTimeout(timer)
      unsub()
    }
  }, [user])

  useEffect(() => {
    const onFriendsChanged = () => reloadFriends()
    window.addEventListener('enlight-friends-changed', onFriendsChanged)
    return () => window.removeEventListener('enlight-friends-changed', onFriendsChanged)
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
      <section className="enlight-dashboard-card">
        <h2 className="enlight-heading-serif">Friends</h2>
        <p className="enlight-body-text">Sign in to add friends and study together.</p>
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
    <section className="enlight-dashboard-card enlight-friends-panel">
      <h2 className="enlight-heading-serif">Friends</h2>
      <p className="enlight-body-text enlight-friends-panel__code">
        Your friend code: <strong>{friendCode || '…'}</strong>
        {friendCode && (
          <button
            type="button"
            className="enlight-link-btn"
            onClick={() => void navigator.clipboard.writeText(friendCode)}
          >
            Copy
          </button>
        )}
      </p>

      {duelBlocked && (
        <div className="enlight-alert enlight-alert--warn" role="status">
          <strong>Duel in progress</strong>
          <p>Finish your current duel in the inbox before starting another.</p>
        </div>
      )}

      <div className="enlight-friends-add">
        <label className="enlight-friends-add__field">
          <span className="enlight-friends-add__label">Add by friend code</span>
          <div className="enlight-friends-add__row">
            <input
              className="enlight-input"
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
        <label className="enlight-friends-add__field">
          <span className="enlight-friends-add__label">Or user ID from leaderboard</span>
          <div className="enlight-friends-add__row">
            <input
              className="enlight-input"
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

      {duelMessage && <p className="enlight-body-text enlight-form-message">{duelMessage}</p>}
      {message && <p className="enlight-body-text enlight-form-message">{message}</p>}
      {pendingIncoming.length > 0 && (
        <div className="enlight-friends-pending">
          <p className="enlight-body-text">
            <strong>{pendingIncoming.length} pending request{pendingIncoming.length === 1 ? '' : 's'}</strong> — accept from the 🔔 bell in the header.
          </p>
        </div>
      )}
      {friends.length === 0 ? (
        <p className="enlight-body-text">No friends yet — share your code with classmates.</p>
      ) : (
        <ul className="enlight-friends-list">
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
