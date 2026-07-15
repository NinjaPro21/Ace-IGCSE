import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/social/AuthContext'
import {
  fetchFriendsLeaderboard,
  fetchGlobalLeaderboardWithRank,
  fetchProfile,
} from '@/features/social/socialApi'
import {
  medalPointsForBoard,
  mergeMedalPoints,
  periodLabel,
  type LeaderboardMetric,
  type LeaderboardPeriod,
} from '@/features/social/leaderboardUtils'
import type { LeaderboardEntry } from '@/features/social/socialTypes'
import { LeaderboardBoard } from '@/features/social/LeaderboardBoard'
import { LeaderboardFilters, type LeaderboardBoardScope } from '@/features/social/LeaderboardFilters'
import { YourRankCard } from '@/features/social/YourRankCard'

export function LeaderboardHub() {
  const {
    user,
    school,
    clans,
    leaderboard,
    leaderboardGroupId,
    setLeaderboardGroup,
    setLeaderboardFilters,
  } = useAuth()

  const [scope, setScope] = useState<LeaderboardBoardScope>('global')
  const [metric, setMetric] = useState<LeaderboardMetric>('xp')
  const [period, setPeriod] = useState<LeaderboardPeriod>('week')
  const [friendIds, setFriendIds] = useState<string[]>([])
  const [friendsBoard, setFriendsBoard] = useState<LeaderboardEntry[]>([])
  const [globalResult, setGlobalResult] = useState<Awaited<ReturnType<typeof fetchGlobalLeaderboardWithRank>> | null>(null)
  const [loading, setLoading] = useState(true)

  const groups: { id: string; name: string; type: 'school' | 'clan' }[] = []
  if (school) groups.push({ id: school.id, name: school.name, type: 'school' })
  for (const c of clans) groups.push({ id: c.id, name: c.name, type: 'clan' })

  const activeGroup = groups.find((g) => g.id === leaderboardGroupId) ?? groups[0]

  useEffect(() => {
    if (!user) return
    void fetchProfile(user.id).then((p) => setFriendIds(p?.friendIds ?? []))
  }, [user])

  useEffect(() => {
    if (scope === 'group' && groups.length > 0 && activeGroup) {
      void setLeaderboardGroup(activeGroup.id, activeGroup.type)
    }
  }, [scope, activeGroup?.id, activeGroup?.type, groups.length, setLeaderboardGroup])

  useEffect(() => {
    if (scope === 'group') {
      void setLeaderboardFilters(metric, metric === 'longestStreak' ? 'all' : period)
    }
  }, [scope, metric, period, setLeaderboardFilters])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    void (async () => {
      if (scope === 'friends') {
        // The friends board doesn't need the global fetch at all.
        if (!user || friendIds.length === 0) {
          setFriendsBoard([])
          setLoading(false)
          return
        }
        const rows = await fetchFriendsLeaderboard(friendIds, user.id, {
          metric,
          period: metric === 'longestStreak' ? 'all' : period,
        })
        if (!cancelled) {
          setFriendsBoard(rows)
          setLoading(false)
        }
        return
      }

      // Global scope shows it directly; group scope uses it for medal points.
      const global = await fetchGlobalLeaderboardWithRank(user?.id ?? '', { metric, period, limit: 10 })
      if (cancelled) return
      setGlobalResult(global)
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [scope, user, friendIds, metric, period])

  const groupBoard = scope === 'group' ? leaderboard : []
  const displayEntries =
    scope === 'global' ? (globalResult?.top ?? []) : scope === 'friends' ? friendsBoard : groupBoard

  const boardScope = scope === 'global' ? 'global' : 'group'

  const userRankInfo = useMemo(() => {
    if (!user) return { rank: null, total: 0, entry: null, inList: false }

    if (scope === 'global' && globalResult) {
      const inList = globalResult.top.some((e) => e.userId === user.id)
      return {
        rank: globalResult.userRank,
        total: globalResult.total,
        entry: globalResult.userEntry,
        inList,
      }
    }

    const board = scope === 'friends' ? friendsBoard : groupBoard
    const idx = board.findIndex((e) => e.userId === user.id)
    const entry = idx >= 0 ? board[idx] : null
    return {
      rank: idx >= 0 ? idx + 1 : null,
      total: board.length,
      entry,
      inList: idx >= 0 && idx < 10,
    }
  }, [user, scope, globalResult, friendsBoard, groupBoard])

  const decorationMap = useMemo(() => {
    if (scope !== 'group' || !user || groups.length === 0) return new Map<string, number>()
    const maps = [
      medalPointsForBoard(groupBoard.map((e) => e.userId), 'group'),
    ]
    if (globalResult?.top.length) {
      maps.push(medalPointsForBoard(globalResult.top.map((e) => e.userId), 'global'))
    }
    return mergeMedalPoints(...maps)
  }, [scope, user, groups.length, groupBoard, globalResult?.top])

  const handleMetric = (m: LeaderboardMetric) => {
    setMetric(m)
    if (m === 'longestStreak') setPeriod('all')
  }

  const groupLabel = activeGroup
    ? activeGroup.type === 'school'
      ? 'School'
      : 'Clan'
    : 'School / Clan'

  return (
    <section className="enlight-social-section enlight-lb-panel">
      <div className="enlight-social-section__header">
        <h2 className="enlight-heading-serif">Rankings</h2>
        <span className="enlight-social-section__meta">
          {metric === 'xp' ? periodLabel(period) : 'All time'}
        </span>
      </div>

      <LeaderboardFilters
        scope={scope}
        onScopeChange={setScope}
        metric={metric}
        onMetricChange={handleMetric}
        period={period}
        onPeriodChange={setPeriod}
        hasGroup={groups.length > 0}
        hasFriends={friendIds.length > 0}
        groupLabel={groupLabel}
      />

      {scope === 'group' && groups.length > 1 && (
        <div className="enlight-lb-group-picker">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`enlight-lb-group-picker__btn${g.id === activeGroup?.id ? ' enlight-lb-group-picker__btn--active' : ''}`}
              onClick={() => void setLeaderboardGroup(g.id, g.type)}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {user && (
        <YourRankCard
          rank={userRankInfo.rank}
          total={userRankInfo.total}
          entry={userRankInfo.entry}
          metric={metric}
          scope={boardScope}
          inList={userRankInfo.inList}
        />
      )}

      {loading ? (
        <p className="enlight-body-text">Loading rankings…</p>
      ) : scope === 'group' && groups.length === 0 ? (
        <div className="enlight-leaderboard-placeholder">
          <span className="enlight-leaderboard-placeholder__icon" aria-hidden>S</span>
          <div>
            <strong>Join a school or study group to compete</strong>
            <p className="enlight-body-text" style={{ margin: '4px 0 0' }}>
              Scroll down to pick your school or join a study group.
            </p>
          </div>
        </div>
      ) : (
        <LeaderboardBoard
          entries={displayEntries}
          metric={metric}
          scope={boardScope}
          decorationMap={scope === 'group' ? decorationMap : undefined}
          friendIds={new Set(friendIds)}
          emptyMessage={
            scope === 'friends'
              ? 'Add friends to compare progress.'
              : 'No rankings yet for this period.'
          }
        />
      )}
    </section>
  )
}

/** Standalone global board for public marketing pages */
export function GlobalLeaderboardPanel() {
  const { user } = useAuth()
  const [metric, setMetric] = useState<LeaderboardMetric>('xp')
  const [period, setPeriod] = useState<LeaderboardPeriod>('week')
  const [result, setResult] = useState<Awaited<ReturnType<typeof fetchGlobalLeaderboardWithRank>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    void fetchGlobalLeaderboardWithRank(user?.id ?? '', { metric, period, limit: 10 }).then((r) => {
      setResult(r)
      setLoading(false)
    })
  }, [user?.id, metric, period])

  return (
    <section className="enlight-social-section enlight-lb-panel enlight-lb-panel--global">
      <div className="enlight-social-section__header">
        <h2 className="enlight-heading-serif">Hall of fame</h2>
        <span className="enlight-social-section__meta">Top 10 · {metric === 'xp' ? periodLabel(period) : 'All time'}</span>
      </div>

      <LeaderboardFilters
        scope="global"
        onScopeChange={() => {}}
        metric={metric}
        onMetricChange={(m) => {
          setMetric(m)
          if (m === 'longestStreak') setPeriod('all')
        }}
        period={period}
        onPeriodChange={setPeriod}
        hasGroup={false}
        hasFriends={false}
        hideScope
      />

      {user && result && (
        <YourRankCard
          rank={result.userRank}
          total={result.total}
          entry={result.userEntry}
          metric={metric}
          scope="global"
          inList={result.top.some((e) => e.isYou)}
        />
      )}

      {loading ? (
        <p className="enlight-body-text">Loading rankings…</p>
      ) : (
        <LeaderboardBoard
          entries={result?.top ?? []}
          metric={metric}
          scope="global"
          emptyMessage="No public rankings yet."
        />
      )}
    </section>
  )
}
