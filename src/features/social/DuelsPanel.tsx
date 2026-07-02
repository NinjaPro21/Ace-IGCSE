import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useSocialInbox } from './useSocialInbox'
import { fetchProfile } from './socialApi'
import { useEffect, useState } from 'react'

export function DuelsPanel() {
  const { user } = useAuth()
  const { duels } = useSocialInbox()
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    for (const d of duels) {
      const other = d.challengerUid === user?.id ? d.opponentUid : d.challengerUid
      if (!names[other]) {
        void fetchProfile(other).then((p) => {
          if (p?.displayName) setNames((n) => ({ ...n, [other]: p.displayName! }))
        })
      }
    }
  }, [duels, user, names])

  if (!user) return null

  const active = duels.filter((d) => d.status === 'active' || d.status === 'complete')

  if (active.length === 0) return null

  return (
    <section className="enlight-dashboard-card">
      <h2 className="enlight-heading-serif">Quiz duels</h2>
      <ul className="enlight-duels-list">
        {active.map((d) => {
          const other = d.challengerUid === user.id ? d.opponentUid : d.challengerUid
          const quizPath = d.topicId
            ? `/quiz/topic/${d.topicId}/${d.difficulty}?duel=${d.id}`
            : `/quiz/${d.chapterId}/${d.difficulty}?duel=${d.id}`
          return (
            <li key={d.id} className="enlight-duel-row">
              <div>
                <strong>vs {names[other] ?? '…'}</strong>
                <span className="enlight-duel-row__status">
                  {d.status === 'complete'
                    ? d.winnerUid === user.id
                      ? 'You won! +25 XP'
                      : 'You lost'
                    : 'In progress'}
                </span>
              </div>
              {d.status === 'active' && <Link to={quizPath}>Take quiz →</Link>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
