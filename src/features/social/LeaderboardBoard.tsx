import type { LeaderboardEntry } from '@/features/social/socialTypes'
import { getRankMedal, type LeaderboardMetric, type LeaderboardScope } from '@/features/social/leaderboardUtils'
import { MedalIcon } from '@/features/social/MedalIcon'

function scoreLabel(metric: LeaderboardMetric, score: number): string {
  return metric === 'longestStreak' ? `${score}d best` : `${score.toLocaleString()} XP`
}

function RankBadge({ rank, scope }: { rank: number; scope: LeaderboardScope }) {
  const medal = getRankMedal(rank, scope)
  if (medal) return <MedalIcon tier={medal} />
  return <span className="enlight-lb-rank">{rank}</span>
}

function Avatar({ entry, size = 'md' }: { entry: LeaderboardEntry; size?: 'sm' | 'md' | 'lg' }) {
  const cls = `enlight-lb-avatar enlight-lb-avatar--${size}`
  const px = size === 'sm' ? 32 : size === 'lg' ? 52 : 40
  if (entry.avatarUrl) {
    return <img src={entry.avatarUrl} alt="" className={cls} width={px} height={px} />
  }
  return (
    <span className={`${cls} enlight-lb-avatar--placeholder`}>
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
  const slotClass = medal ? `enlight-lb-podium__slot--${medal}` : 'enlight-lb-podium__slot--plain'

  return (
    <div className={`enlight-lb-podium__slot ${slotClass}`} style={{ order: podiumFlexOrder(rank) }}>
      <div className="enlight-lb-podium__pedestal">
        <div className="enlight-lb-podium__avatar-wrap">
          <Avatar entry={entry} size="lg" />
          {medal ? (
            <MedalIcon tier={medal} size="lg" />
          ) : (
            <span className="enlight-lb-podium__rank-badge" aria-hidden>
              {rank}
            </span>
          )}
        </div>
        <p className="enlight-lb-podium__name">
          {entry.displayName}
          {entry.isYou && <span className="enlight-lb-you-tag">you</span>}
        </p>
        <p className="enlight-lb-podium__score">{scoreLabel(metric, entry.score)}</p>
        <p className="enlight-lb-podium__meta">Lv {entry.level} · {entry.streakDays}d streak</p>
        {decorationPoints != null && decorationPoints > 0 && (
          <span className="enlight-lb-decor" title="Total medals earned">
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
        'enlight-lb-row',
        entry.isYou ? 'enlight-lb-row--you' : '',
        isFriend && !entry.isYou ? 'enlight-lb-row--friend' : '',
        medal ? `enlight-lb-row--${medal}` : '',
      ].join(' ')}
    >
      <div className="enlight-lb-row__rank">
        <RankBadge rank={rank} scope={scope} />
      </div>
      <Avatar entry={entry} />
      <div className="enlight-lb-row__info">
        <span className="enlight-lb-row__name">
          {entry.displayName}
          {entry.isYou && <span className="enlight-lb-you-tag">you</span>}
          {decorationPoints != null && decorationPoints > 0 && (
            <span className="enlight-lb-decor enlight-lb-decor--inline" title="Total medals earned">
              🎖 {decorationPoints}
            </span>
          )}
        </span>
        <span className="enlight-lb-row__meta">
          Lv {entry.level} · {entry.streakDays}d streak
        </span>
      </div>
      <span className="enlight-lb-row__score">{scoreLabel(metric, entry.score)}</span>
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
    return <p className="enlight-body-text enlight-lb-empty">{emptyMessage}</p>
  }

  const podiumEntries = showPodium ? entries.slice(0, PODIUM_SIZE) : []
  const restEntries = showPodium ? entries.slice(PODIUM_SIZE) : entries
  const podiumLayoutClass =
    podiumEntries.length >= 4
      ? ' enlight-lb-podium--five'
      : podiumEntries.length === 1
        ? ' enlight-lb-podium--solo'
        : ''

  return (
    <div className="enlight-lb">
      {podiumEntries.length > 0 && (
        <div className="enlight-lb-podium-stage">
          <div className="enlight-lb-podium-frame">
            <div className={`enlight-lb-podium${podiumLayoutClass}`} aria-label="Top five">
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
            <div className="enlight-lb-podium-stage__floor" aria-hidden />
          </div>
        </div>
      )}

      {restEntries.length > 0 && (
        <ol className="enlight-lb-list">
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
        <div className="enlight-lb-legend" aria-label="Medal legend">
          <span className="enlight-lb-legend__item"><MedalIcon tier="gold" size="sm" /> Top 1</span>
          <span className="enlight-lb-legend__item"><MedalIcon tier="silver" size="sm" /> Top 2</span>
          <span className="enlight-lb-legend__item"><MedalIcon tier="bronze" size="sm" /> Top 3</span>
          <span className="enlight-lb-legend__item"><MedalIcon tier="elite" size="sm" /> Top 4–5</span>
          <span className="enlight-lb-legend__item"><MedalIcon tier="top10" size="sm" /> Top 6–10</span>
        </div>
      )}
    </div>
  )
}
