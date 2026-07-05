import type { LeaderboardEntry } from '@/features/social/socialTypes'
import { getRankMedal, type LeaderboardMetric, type LeaderboardScope } from '@/features/social/leaderboardUtils'
import { MedalIcon } from '@/features/social/MedalIcon'

interface YourRankCardProps {
  rank: number | null
  total: number
  entry: LeaderboardEntry | null
  metric: LeaderboardMetric
  scope: LeaderboardScope
  inList: boolean
}

function scoreLabel(metric: LeaderboardMetric, score: number): string {
  return metric === 'longestStreak' ? `${score}d best streak` : `${score.toLocaleString()} XP`
}

export function YourRankCard({ rank, total, entry, metric, scope, inList }: YourRankCardProps) {
  if (!entry || rank == null) {
    return (
      <div className="enlight-lb-your-rank enlight-lb-your-rank--empty">
        <p>Study this period to appear on the board.</p>
      </div>
    )
  }

  const medal = getRankMedal(rank, scope)

  if (inList) {
    return (
      <div className="enlight-lb-your-rank enlight-lb-your-rank--in-list">
        {medal ? <MedalIcon tier={medal} size="sm" /> : <span className="enlight-lb-rank">{rank}</span>}
        <span>
          You&apos;re <strong>#{rank}</strong>
          {total > 0 && <> of {total}</>}
          {inList && ' — highlighted in the board'}
        </span>
      </div>
    )
  }

  return (
    <div className="enlight-lb-your-rank">
      <div className="enlight-lb-your-rank__left">
        {entry.avatarUrl ? (
          <img src={entry.avatarUrl} alt="" className="enlight-lb-avatar enlight-lb-avatar--md" width={40} height={40} />
        ) : (
          <span className="enlight-lb-avatar enlight-lb-avatar--md enlight-lb-avatar--placeholder">
            {entry.displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div>
          <span className="enlight-lb-your-rank__eyebrow">Your placement</span>
          <p className="enlight-lb-your-rank__rank">
            {medal ? <MedalIcon tier={medal} size="md" /> : null}
            <strong>#{rank}</strong>
            {total > 0 && <span className="enlight-lb-your-rank__of"> of {total}</span>}
          </p>
          <p className="enlight-lb-your-rank__meta">Lv {entry.level} · {entry.streakDays}d streak</p>
        </div>
      </div>
      <div className="enlight-lb-your-rank__score">{scoreLabel(metric, entry.score)}</div>
    </div>
  )
}
