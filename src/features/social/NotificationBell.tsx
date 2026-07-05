import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { getChapter, getTopic } from '@/lib/contentLoader'
import { useAuth } from './AuthContext'
import { useSocialInbox } from './SocialInboxProvider'
import { fetchProfile } from './socialApi'
import {
  duelNeedsAction,
  duelUserScoreSubmitted,
  getDuelQuizPath,
} from './duelsApi'

const DIFF_LABEL: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  pyp: 'PYP',
}

export function NotificationBell() {
  const { user } = useAuth()
  const { friendRequests, visibleDuels, pendingCount, clearableCount, clearInbox, acceptFriend, declineFriend, acceptDuel, declineDuel } =
    useSocialInbox()
  const [open, setOpen] = useState(false)
  const [names, setNames] = useState<Record<string, string>>({})
  const [inboxError, setInboxError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const uids = new Set<string>()
    friendRequests.forEach((r) => uids.add(r.fromUid))
    visibleDuels.forEach((d) => {
      uids.add(d.challengerUid)
      uids.add(d.opponentUid)
    })
    for (const uid of uids) {
      if (names[uid]) continue
      void fetchProfile(uid).then((p) => {
        if (p?.displayName) setNames((n) => ({ ...n, [uid]: p.displayName! }))
      })
    }
  }, [visibleDuels, friendRequests, user, names])

  if (!user) return null

  const duelLabel = (d: (typeof visibleDuels)[0]) => {
    const topic = d.topicId ? getTopic(d.topicId) : null
    const chapter = d.chapterId ? getChapter(d.chapterId) : null
    const scope = topic?.title ?? chapter?.title ?? 'Quiz'
    return `${scope} · ${DIFF_LABEL[d.difficulty] ?? d.difficulty}`
  }

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
          <div className="enlight-notif-bell__head">
            <h3 className="enlight-notif-bell__title">Inbox</h3>
            {clearableCount > 0 && (
              <button type="button" className="enlight-notif-bell__clear" onClick={clearInbox}>
                Clear inbox
              </button>
            )}
          </div>
          {friendRequests.length === 0 && visibleDuels.length === 0 && (
            <p className="enlight-body-text">Nothing pending — you&apos;re all caught up.</p>
          )}
          {inboxError && <p className="enlight-body-text enlight-form-message enlight-form-message--error">{inboxError}</p>}
          {friendRequests.map((r) => (
            <div key={r.id} className="enlight-notif-item">
              <span>Friend request from {names[r.fromUid] ?? '…'}</span>
              <div className="enlight-notif-item__actions">
                <button type="button" onClick={() => void acceptFriend(r.id)}>Accept</button>
                <button type="button" onClick={() => void declineFriend(r.id)}>Decline</button>
              </div>
            </div>
          ))}
          {visibleDuels.map((d) => {
            const quizPath = getDuelQuizPath(d)
            const otherUid = d.challengerUid === user.id ? d.opponentUid : d.challengerUid
            const label = duelLabel(d)

            if (d.status === 'pending' && d.opponentUid === user.id) {
              return (
                <div key={d.id} className="enlight-notif-item enlight-notif-item--duel">
                  <div>
                    <span className="enlight-notif-item__eyebrow">Duel challenge</span>
                    <span>{names[d.challengerUid] ?? 'Someone'} — {label}</span>
                  </div>
                  <div className="enlight-notif-item__actions">
                    <button
                      type="button"
                      onClick={() => {
                        setInboxError(null)
                        void acceptDuel(d.id).catch((e) => {
                          setInboxError(e instanceof Error ? e.message : 'Could not accept duel.')
                        })
                      }}
                    >
                      Accept
                    </button>
                    <button type="button" onClick={() => void declineDuel(d.id)}>Decline</button>
                  </div>
                </div>
              )
            }

            if (d.status === 'pending' && d.challengerUid === user.id) {
              return (
                <div key={d.id} className="enlight-notif-item enlight-notif-item--duel enlight-notif-item--muted">
                  <div>
                    <span className="enlight-notif-item__eyebrow">Duel sent</span>
                    <span>Waiting for {names[otherUid] ?? 'friend'} — {label}</span>
                  </div>
                </div>
              )
            }

            if (d.status === 'active' && duelNeedsAction(d, user.id) && quizPath) {
              return (
                <div key={d.id} className="enlight-notif-item enlight-notif-item--duel enlight-notif-item--action">
                  <div>
                    <span className="enlight-notif-item__eyebrow">Duel live</span>
                    <span>vs {names[otherUid] ?? '…'} — {label}</span>
                  </div>
                  <Link to={quizPath} className="enlight-notif-item__cta" onClick={() => setOpen(false)}>
                    Take quiz →
                  </Link>
                </div>
              )
            }

            if (d.status === 'active' && duelUserScoreSubmitted(d, user.id)) {
              return (
                <div key={d.id} className="enlight-notif-item enlight-notif-item--duel enlight-notif-item--muted">
                  <div>
                    <span className="enlight-notif-item__eyebrow">Duel submitted</span>
                    <span>Waiting for {names[otherUid] ?? 'opponent'} — {label}</span>
                  </div>
                </div>
              )
            }

            return null
          })}
          <EnlightButton variant="outline" onClick={() => setOpen(false)}>Close</EnlightButton>
        </div>
      )}
    </div>
  )
}
