import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from './AuthContext'
import { useSocialInbox } from './useSocialInbox'
import { fetchProfile } from './socialApi'

export function NotificationBell() {
  const { user } = useAuth()
  const { friendRequests, duels, pendingCount, acceptFriend, declineFriend, acceptDuel, declineDuel } =
    useSocialInbox()
  const [open, setOpen] = useState(false)
  const [names, setNames] = useState<Record<string, string>>({})

  if (!user) return null

  const loadName = async (uid: string) => {
    if (names[uid]) return
    const p = await fetchProfile(uid)
    if (p?.displayName) setNames((n) => ({ ...n, [uid]: p.displayName! }))
  }

  friendRequests.forEach((r) => void loadName(r.fromUid))
  duels.forEach((d) => void loadName(d.challengerUid))

  return (
    <div className="enlight-notif-bell">
      <button
        type="button"
        className="enlight-notif-bell__btn"
        aria-label={`Notifications${pendingCount ? `, ${pendingCount} pending` : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        🔔
        {pendingCount > 0 && <span className="enlight-notif-bell__badge">{pendingCount}</span>}
      </button>
      {open && (
        <div className="enlight-notif-bell__panel">
          <h3 className="enlight-notif-bell__title">Inbox</h3>
          {friendRequests.length === 0 && duels.length === 0 && (
            <p className="enlight-body-text">Nothing pending — you&apos;re all caught up.</p>
          )}
          {friendRequests.map((r) => (
            <div key={r.id} className="enlight-notif-item">
              <span>Friend request from {names[r.fromUid] ?? '…'}</span>
              <div className="enlight-notif-item__actions">
                <button type="button" onClick={() => void acceptFriend(r.id)}>Accept</button>
                <button type="button" onClick={() => void declineFriend(r.id)}>Decline</button>
              </div>
            </div>
          ))}
          {duels.map((d) =>
            d.status === 'pending' && d.opponentUid === user.id ? (
              <div key={d.id} className="enlight-notif-item">
                <span>Duel challenge from {names[d.challengerUid] ?? '…'}</span>
                <div className="enlight-notif-item__actions">
                  <button type="button" onClick={() => void acceptDuel(d.id)}>Accept</button>
                  <button type="button" onClick={() => void declineDuel(d.id)}>Decline</button>
                </div>
              </div>
            ) : d.status === 'active' ? (
              <div key={d.id} className="enlight-notif-item">
                <span>Active duel — take the quiz!</span>
                <Link to={`/quiz/topic/${d.topicId}/${d.difficulty}?duel=${d.id}`}>Go →</Link>
              </div>
            ) : null,
          )}
          <EnlightButton variant="outline" onClick={() => setOpen(false)}>Close</EnlightButton>
        </div>
      )}
    </div>
  )
}
