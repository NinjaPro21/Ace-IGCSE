import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from './AuthContext'
import {
  ensureFriendCode,
  fetchFriendProfiles,
  removeFriend,
  sendFriendRequest,
  sendFriendRequestByCode,
} from './friendsApi'
import { subscribePresence, isPresenceStale, type PresenceDoc } from './presenceApi'
import { fetchBuddyStreak } from './buddyStreaksApi'
import { createDuel } from './duelsApi'
import type { CloudProfile } from './socialApi'

function FriendRow({
  friend,
  userId,
  presence,
}: {
  friend: CloudProfile
  userId: string
  presence: PresenceDoc | null
}) {
  const [buddyStreak, setBuddyStreak] = useState<number | null>(null)

  useEffect(() => {
    void fetchBuddyStreak(userId, friend.id).then((s) => setBuddyStreak(s?.streakDays ?? null))
  }, [userId, friend.id])

  const online = presence && !isPresenceStale(presence) && presence.status !== 'offline'
  const studying = online && (presence.status === 'studying' || presence.status === 'in_quiz')

  const joinPath =
    studying && presence?.subjectId && presence?.currentChapterId && presence?.currentTopicId
      ? `/subjects/${presence.subjectId}/chapters/${presence.currentChapterId}/topics/${presence.currentTopicId}`
      : null

  return (
    <li className="enlight-friend-row">
      <Link to={`/profile/${friend.id}`} className="enlight-friend-row__main">
        {friend.avatarUrl ? (
          <img src={friend.avatarUrl} alt="" className="enlight-leaderboard__avatar" />
        ) : (
          <span className="enlight-leaderboard__avatar enlight-leaderboard__avatar--placeholder">
            {(friend.displayName ?? '?').slice(0, 1)}
          </span>
        )}
        <span className={`enlight-presence-dot${online ? ' enlight-presence-dot--on' : ''}`} />
        <div>
          <div className="enlight-friend-row__name">{friend.displayName}</div>
          <div className="enlight-friend-row__meta">
            Lv {Math.floor(friend.xp / 100) + 1} · {friend.streakDays}d streak
            {buddyStreak != null && buddyStreak > 0 && ` · 🤝 ${buddyStreak}d buddy`}
          </div>
          {studying && presence?.topicTitle && (
            <div className="enlight-friend-row__studying">Studying {presence.topicTitle}</div>
          )}
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
          onClick={() =>
            void createDuel(userId, friend.id, { difficulty: 'medium' }).catch(() => {})
          }
        >
          Duel
        </EnlightButton>
        <button type="button" className="enlight-friend-row__remove" onClick={() => void removeFriend(userId, friend.id)}>
          Remove
        </button>
      </div>
    </li>
  )
}

export function FriendsPanel() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<CloudProfile[]>([])
  const [friendCode, setFriendCode] = useState('')
  const [addCode, setAddCode] = useState('')
  const [addUid, setAddUid] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceDoc | null>>({})

  useEffect(() => {
    if (!user) return
    void ensureFriendCode(user.id).then(setFriendCode)
    void fetchFriendProfiles(user.id).then(setFriends)
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
    try {
      await sendFriendRequestByCode(user.id, addCode)
      setMessage('Friend request sent!')
      setAddCode('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not send request')
    }
  }

  const handleAddFromLeaderboard = async () => {
    if (!addUid.trim()) return
    try {
      await sendFriendRequest(user.id, addUid.trim())
      setMessage('Friend request sent!')
      setAddUid('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not send request')
    }
  }

  return (
    <section className="enlight-dashboard-card">
      <h2 className="enlight-heading-serif">Friends</h2>
      <p className="enlight-body-text">
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
      <div className="enlight-profile-form">
        <input
          className="enlight-profile-form__input"
          placeholder="Add by friend code (FRD-…)"
          value={addCode}
          onChange={(e) => setAddCode(e.target.value)}
        />
        <EnlightButton onClick={() => void handleAddByCode()}>Add friend</EnlightButton>
      </div>
      <div className="enlight-profile-form" style={{ marginTop: 8 }}>
        <input
          className="enlight-profile-form__input"
          placeholder="Or user ID from leaderboard"
          value={addUid}
          onChange={(e) => setAddUid(e.target.value)}
        />
        <EnlightButton variant="outline" onClick={() => void handleAddFromLeaderboard()}>Request</EnlightButton>
      </div>
      {message && <p className="enlight-body-text">{message}</p>}
      {friends.length === 0 ? (
        <p className="enlight-body-text">No friends yet — share your code with classmates.</p>
      ) : (
        <ul className="enlight-friends-list">
          {friends.map((f) => (
            <FriendRow key={f.id} friend={f} userId={user.id} presence={presenceMap[f.id] ?? null} />
          ))}
        </ul>
      )}
    </section>
  )
}
