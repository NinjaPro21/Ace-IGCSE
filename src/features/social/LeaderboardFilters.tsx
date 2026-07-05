import { periodLabel, type LeaderboardMetric, type LeaderboardPeriod } from '@/features/social/leaderboardUtils'

export type LeaderboardBoardScope = 'global' | 'group' | 'friends'

interface LeaderboardFiltersProps {
  scope: LeaderboardBoardScope
  onScopeChange: (scope: LeaderboardBoardScope) => void
  metric: LeaderboardMetric
  onMetricChange: (metric: LeaderboardMetric) => void
  period: LeaderboardPeriod
  onPeriodChange: (period: LeaderboardPeriod) => void
  hasGroup: boolean
  hasFriends: boolean
  groupLabel?: string
  hideScope?: boolean
}

export function LeaderboardFilters({
  scope,
  onScopeChange,
  metric,
  onMetricChange,
  period,
  onPeriodChange,
  hasGroup,
  hasFriends,
  groupLabel,
  hideScope = false,
}: LeaderboardFiltersProps) {
  const scopes: { id: LeaderboardBoardScope; label: string; disabled?: boolean }[] = [
    { id: 'global', label: 'Site-wide' },
    { id: 'group', label: groupLabel ?? 'School / Clan', disabled: !hasGroup },
    { id: 'friends', label: 'Friends', disabled: !hasFriends },
  ]

  return (
    <div className="enlight-lb-toolbar">
      {!hideScope && (
      <div className="enlight-lb-segment" role="tablist" aria-label="Leaderboard scope">
        {scopes.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={scope === s.id}
            className={`enlight-lb-segment__btn${scope === s.id ? ' enlight-lb-segment__btn--active' : ''}`}
            disabled={s.disabled}
            onClick={() => onScopeChange(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      )}

      <div className="enlight-lb-toolbar__controls">
        <div className="enlight-lb-segment enlight-lb-segment--compact" role="tablist" aria-label="Ranking metric">
          <button
            type="button"
            role="tab"
            aria-selected={metric === 'xp'}
            className={`enlight-lb-segment__btn${metric === 'xp' ? ' enlight-lb-segment__btn--active' : ''}`}
            onClick={() => onMetricChange('xp')}
          >
            XP
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={metric === 'longestStreak'}
            className={`enlight-lb-segment__btn${metric === 'longestStreak' ? ' enlight-lb-segment__btn--active' : ''}`}
            onClick={() => onMetricChange('longestStreak')}
          >
            Streak
          </button>
        </div>

        {metric === 'xp' && (
          <label className="enlight-lb-select-wrap">
            <span className="enlight-lb-select-wrap__label">Period</span>
            <select
              className="enlight-lb-select"
              value={period}
              onChange={(e) => onPeriodChange(e.target.value as LeaderboardPeriod)}
            >
              {(['week', 'month', 'all', 'day'] as LeaderboardPeriod[]).map((p) => (
                <option key={p} value={p}>
                  {periodLabel(p)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  )
}
