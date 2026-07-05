import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { getChapter, getSubject, getTopic } from '@/lib/contentLoader'
import { subjectAccentClasses } from '@/lib/subjectAccent'
import { useAuth } from './AuthContext'
import { useSocialInbox } from './SocialInboxProvider'
import { fetchProfile } from './socialApi'
import { duelNeedsAction, duelUserScoreSubmitted, getDuelQuizPath } from './duelsApi'

const DIFF_LABEL: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  pyp: 'PYP',
}

export function DuelsPanel() {
  const { user } = useAuth()
  const { duels } = useSocialInbox()
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) return
    for (const d of duels) {
      const other = d.challengerUid === user.id ? d.opponentUid : d.challengerUid
      if (names[other]) continue
      void fetchProfile(other).then((p) => {
        if (p?.displayName) setNames((n) => ({ ...n, [other]: p.displayName! }))
      })
    }
  }, [duels, user, names])

  if (!user) return null

  const live = duels.filter((d) => d.status === 'pending' || d.status === 'active')
  const recent = duels.filter((d) => d.status === 'complete').slice(0, 3)

  if (live.length === 0 && recent.length === 0) return null

  const describe = (d: (typeof duels)[0]) => {
    const topic = d.topicId ? getTopic(d.topicId) : null
    const chapter = d.chapterId ? getChapter(d.chapterId) : null
    const subject = chapter ? getSubject(chapter.subjectId) : undefined
    return {
      scope: topic?.title ?? chapter?.title ?? 'Quiz',
      diff: DIFF_LABEL[d.difficulty] ?? d.difficulty,
      subjectId: chapter?.subjectId ?? '',
      subjectName: subject?.name?.toUpperCase() ?? 'DUEL',
    }
  }

  return (
    <section className="enlight-duels-hub enlight-dashboard-card">
      <div className="enlight-duels-hub__head">
        <div>
          <h2 className="enlight-heading-serif">Quiz duels</h2>
          <p className="enlight-body-text">Head-to-head on the same section — higher score wins.</p>
        </div>
        <span className="enlight-duels-hub__badge">{live.length} live</span>
      </div>

      {live.length > 0 && (
        <div className="enlight-insights-table">
          {live.map((d) => {
            const other = d.challengerUid === user.id ? d.opponentUid : d.challengerUid
            const quizPath = getDuelQuizPath(d)
            const { scope, diff, subjectId, subjectName } = describe(d)
            const { subjectClass } = subjectAccentClasses(subjectId)
            const needsYou = duelNeedsAction(d, user.id)
            const waiting = d.status === 'pending' && d.challengerUid === user.id
            const incoming = d.status === 'pending' && d.opponentUid === user.id
            const statusLabel = incoming
              ? 'Accept in inbox'
              : waiting
                ? 'Waiting for accept'
                : needsYou
                  ? 'Your turn'
                  : duelUserScoreSubmitted(d, user.id)
                    ? 'Waiting for opponent'
                    : 'In progress'

            return (
              <div
                key={d.id}
                className={['enlight-insights-row', needsYou ? 'enlight-insights-row--action' : ''].filter(Boolean).join(' ')}
              >
                <div className="enlight-insights-row__main">
                  <span className={['enlight-insights-row__subject', subjectClass].filter(Boolean).join(' ')}>
                    {subjectName}
                  </span>
                  <span className="enlight-insights-row__title">
                    vs {names[other] ?? '…'} · {scope}
                  </span>
                </div>
                <div className="enlight-insights-row__stats">
                  <span>{diff}</span>
                  <span>{statusLabel}</span>
                  {needsYou && quizPath && (
                    <EnlightButton to={quizPath} variant="outline">
                      Take quiz
                    </EnlightButton>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {recent.length > 0 && (
        <div className="enlight-duels-hub__recent">
          <h3 className="enlight-duels-hub__recent-title">Recent results</h3>
          <ul className="enlight-duels-hub__recent-list">
            {recent.map((d) => {
              const other = d.challengerUid === user.id ? d.opponentUid : d.challengerUid
              const { scope, diff } = describe(d)
              const won = d.winnerUid === user.id
              return (
                <li key={d.id} className="enlight-duel-result">
                  <span>
                    {won ? 'Won' : 'Lost'} vs {names[other] ?? '…'} · {scope} · {diff}
                  </span>
                  <span className={won ? 'enlight-duel-result--win' : 'enlight-duel-result--loss'}>
                    {won ? 'Victory' : 'Defeat'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
