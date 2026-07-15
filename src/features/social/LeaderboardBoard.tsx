import type { LeaderboardEntry } from '@/features/social/socialTypes'
import { getRankMedal, type LeaderboardMetric, type LeaderboardScope } from '@/features/social/leaderboardUtils'
import { MedalIcon } from '@/features/social/MedalIcon'

function scoreLabel(metric: LeaderboardMetric, score: number): string {
  return metric === 'longestStreak' ? `${score}d best` : `${score.toLocaleString()} XP`
}

function RankBadge({ rank, scope }: { rank: number; scope: LeaderboardScope }) {
  const medal = getRankMedal(rank, scope)
  if (medal) return <MedalIcon tier={medal} />
  return <span className="ace-lb-rank">{rank}</span>
}

function Avatar({ entry, size = 'md' }: { entry: LeaderboardEntry; size?: 'sm' | 'md' | 'lg' }) {
  const cls = `ace-lb-avatar ace-lb-avatar--${size}`
  const px = size === 'sm' ? 32 : size === 'lg' ? 52 : 40
  if (entry.avatarUrl) {
    return <img src={entry.avatarUrl} alt="" className={cls} width={px} height={px} />
  }
  return (
    <span className={`${cls} ace-lb-avatar--placeholder`}>
      {entry.displayName.slice(0, 1).toUpperCase()}
    </span>
  )
}

const PODIUM_SIZE = 5

function podiumFlexOrder(rank: number): number {
  if (rank === 1) return 3
  if (rank === 2) return 2
  if (rank === 3) return 4
  if (rank === 4) return 1
  if (rank === 5) return 5
  return rank
}

function PodiumCard({
  entry,
  rank,
  scope,
  metric,
  decorationPoints,
}: {
  entry: LeaderboardEntry
  rank: number
  scope: LeaderboardScope
  metric: LeaderboardMetric
  decorationPoints?: number
}) {
  const medal = getRankMedal(rank, scope)
  const slotClass = medal ? `ace-lb-podium__slot--${medal}` : 'ace-lb-podium__slot--plain'

  return (
    <div className={`ace-lb-podium__slot ${slotClass}`} style={{ order: podiumFlexOrder(rank) }}>
      <div className="ace-lb-podium__pedestal">
        <div className="ace-lb-podium__avatar-wrap">
          <Avatar entry={entry} size="lg" />
          {medal ? (
            <MedalIcon tier={medal} size="lg" />
          ) : (
            <span className="ace-lb-podium__rank-badge" aria-hidden>
              {rank}
            </span>
          )}
        </div>
        <p className="ace-lb-podium__name">
          {entry.displayName}
          {entry.isYou && <span className="ace-lb-you-tag">you</span>}
        </p>
        <p className="ace-lb-podium__score">{scoreLabel(metric, entry.score)}</p>
        <p className="ace-lb-podium__meta">Lv {entry.level} · {entry.streakDays}d streak</p>
        {decorationPoints != null && decorationPoints > 0 && (
          <span className="ace-lb-decor" title="Total medals earned">
            🎖 {decorationPoints}
          </span>
        )}
      </div>
    </div>
  )
}

function LeaderboardRow({
  entry,
  rank,
  scope,
  metric,
  decorationPoints,
  isFriend,
}: {
  entry: LeaderboardEntry
  rank: number
  scope: LeaderboardScope
  metric: LeaderboardMetric
  decorationPoints?: number
  isFriend?: boolean
}) {
  const medal = getRankMedal(rank, scope)

  return (
    <li
      className={[
        'ace-lb-row',
        entry.isYou ? 'ace-lb-row--you' : '',
        isFriend && !entry.isYou ? 'ace-lb-row--friend' : '',
        medal ? `ace-lb-row--${medal}` : '',
      ].join(' ')}
    >
      <div className="ace-lb-row__rank">
        <RankBadge rank={rank} scope={scope} />
      </div>
      <Avatar entry={entry} />
      <div className="ace-lb-row__info">
        <span className="ace-lb-row__name">
          {entry.displayName}
          {entry.isYou && <span className="ace-lb-you-tag">you</span>}
          {decorationPoints != null && decorationPoints > 0 && (
            <span className="ace-lb-decor ace-lb-decor--inline" title="Total medals earned">
              🎖 {decorationPoints}
            </span>
          )}
        </span>
        <span className="ace-lb-row__meta">
          Lv {entry.level} · {entry.streakDays}d streak
        </span>
      </div>
      <span className="ace-lb-row__score">{scoreLabel(metric, entry.score)}</span>
    </li>
  )
}

export interface LeaderboardBoardProps {
  entries: LeaderboardEntry[]
  metric: LeaderboardMetric
  scope: LeaderboardScope
  decorationMap?: Map<string, number>
  friendIds?: Set<string>
  emptyMessage?: string
  showPodium?: boolean
}

export function LeaderboardBoard({
  entries,
  metric,
  scope,
  decorationMap,
  friendIds,
  emptyMessage = 'No rankings yet.',
  showPodium = true,
}: LeaderboardBoardProps) {
  if (entries.length === 0) {
    return <p className="ace-body-text ace-lb-empty">{emptyMessage}</p>
  }

  const podiumEntries = showPodium ? entries.slice(0, PODIUM_SIZE) : []
  const restEntries = showPodium ? entries.slice(PODIUM_SIZE) : entries
  const podiumLayoutClass =
    podiumEntries.length >= 4
      ? ' ace-lb-podium--five'
      : podiumEntries.length === 1
        ? ' ace-lb-podium--solo'
        : ''

  return (
    <div className="ace-lb">
      {podiumEntries.length > 0 && (
        <div className="ace-lb-podium-stage">
          <div className="ace-lb-podium-frame">
            <div className={`ace-lb-podium${podiumLayoutClass}`} aria-label="Top five">
              {podiumEntries.map((entry, i) => (
                <PodiumCard
                  key={entry.userId}
                  entry={entry}
                  rank={i + 1}
                  scope={scope}
                  metric={metric}
                  decorationPoints={decorationMap?.get(entry.userId)}
                />
              ))}
            </div>
            <div className="ace-lb-podium-stage__floor" aria-hidden />
          </div>
        </div>
      )}

      {restEntries.length > 0 && (
        <ol className="ace-lb-list">
          {restEntries.map((entry, i) => {
            const rank = showPodium ? i + PODIUM_SIZE + 1 : i + 1
            return (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                rank={rank}
                scope={scope}
                metric={metric}
                decorationPoints={decorationMap?.get(entry.userId)}
                isFriend={friendIds?.has(entry.userId)}
              />
            )
          })}
        </ol>
      )}

      {scope === 'global' && entries.length > 0 && (
        <div className="ace-lb-legend" aria-label="Medal legend">
          <span className="ace-lb-legend__item"><MedalIcon tier="gold" size="sm" /> Top 1</span>
          <span className="ace-lb-legend__item"><MedalIcon tier="silver" size="sm" /> Top 2</span>
          <span className="ace-lb-legend__item"><MedalIcon tier="bronze" size="sm" /> Top 3</span>
          <span className="ace-lb-legend__item"><MedalIcon tier="elite" size="sm" /> Top 4–5</span>
          <span className="ace-lb-legend__item"><MedalIcon tier="top10" size="sm" /> Top 6–10</span>
        </div>
      )}
    </div>
  )
}
