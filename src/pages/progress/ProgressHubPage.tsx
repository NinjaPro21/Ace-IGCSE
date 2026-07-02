import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { ProgressGatewayCard } from '@/components/ProgressGatewayCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getPersonalChapterInsights, countStuckChaptersBySubject } from '@/features/mastery/tutorInsights'
import { getQuizSummariesBySubject } from '@/features/quiz/quizHistoryStats'
import { useAuth } from '@/features/social/AuthContext'
import {
  getDashboardStats,
  getStreakCalendar,
  formatStreakCountdown,
  getContinueStudying,
  getWeeklyRecap,
  getTodayStudyMinutes,
} from '@/features/mastery/progressStats'

export function ProgressHubPage() {
  const { progress, levelProfile, achievements, streakAtRisk } = useMastery()
  const { user, isAdmin } = useAuth()

  const dashboard = useMemo(() => getDashboardStats(progress), [progress])
  const weekActivity = useMemo(() => getStreakCalendar(progress, 7), [progress])
  const weakCount = useMemo(
    () => countStuckChaptersBySubject(getPersonalChapterInsights(progress), 3),
    [progress],
  )
  const unlockedCount = useMemo(() => achievements.filter((a) => a.unlocked).length, [achievements])
  const streakCountdown = useMemo(() => formatStreakCountdown(progress), [progress])
  const continueStudying = useMemo(() => getContinueStudying(progress), [progress])
  const weeklyRecap = useMemo(() => getWeeklyRecap(progress), [progress])
  const todayMin = useMemo(() => getTodayStudyMinutes(progress), [progress])
  const dailyGoal = progress.dailyGoalMin ?? 20
  const goalPct = Math.min(100, Math.round((todayMin / dailyGoal) * 100))
  const quizSummaries = useMemo(() => getQuizSummariesBySubject(progress), [progress])

  const weakMeta =
    weakCount === 0
      ? 'All clear — keep going'
      : `${weakCount} chapter${weakCount === 1 ? '' : 's'} need review`

  return (
    <>
      <EnlightSectionLabel>Dashboard</EnlightSectionLabel>
      <div className="enlight-progress-page__title-row">
        <h1 className="enlight-heading-serif">Study dashboard</h1>
        {isAdmin && (
          <EnlightButton to="/analytics" variant="outline">Analytics →</EnlightButton>
        )}
      </div>

      <div className="enlight-progress-hero enlight-dashboard-hero">
        <div className="enlight-progress-hero__level">
          <div className="enlight-progress-hero__level-badge">Lv {levelProfile.level}</div>
          <div>
            <h2 className="enlight-progress-hero__title">{levelProfile.title}</h2>
            <p className="enlight-body-text">
              {levelProfile.xp} XP · {levelProfile.xpToNextLevel} XP to level {levelProfile.level + 1}
            </p>
          </div>
        </div>
        <div className="enlight-progress-xp-bar" aria-label="XP progress to next level">
          <div
            className="enlight-progress-xp-bar__fill"
            style={{ width: `${levelProfile.levelProgressPercent}%` }}
          />
        </div>
        {streakAtRisk && progress.streakDays > 0 && (
          <p className="enlight-progress-streak-warning">
            {streakCountdown
              ? `Study within ${streakCountdown} to keep your ${progress.streakDays}-day streak!`
              : `Study today to keep your ${progress.streakDays}-day streak!`}
          </p>
        )}
      </div>

      {continueStudying && (
        <section className="enlight-welcome-back">
          <div className="enlight-welcome-back__content">
            <p className="enlight-welcome-back__eyebrow">Welcome back</p>
            <h2 className="enlight-welcome-back__title">
              {continueStudying.chapterTitle} → {continueStudying.topicTitle}
            </h2>
            <p className="enlight-welcome-back__sub">Pick up where you left off</p>
          </div>
          <EnlightButton to={continueStudying.topicPath}>Continue →</EnlightButton>
        </section>
      )}

      <section className="enlight-weekly-recap">
        <h2 className="enlight-weekly-recap__title">This week</h2>
        <div className="enlight-weekly-recap__grid">
          <div className="enlight-weekly-recap__stat">
            <span className="enlight-weekly-recap__stat-icon" aria-hidden>⏱</span>
            <span className="enlight-weekly-recap__stat-value">{weeklyRecap.studyMinutes}</span>
            <span className="enlight-weekly-recap__stat-label">min studied</span>
          </div>
          <div className="enlight-weekly-recap__stat">
            <span className="enlight-weekly-recap__stat-icon" aria-hidden>⚡</span>
            <span className="enlight-weekly-recap__stat-value">{weeklyRecap.xp}</span>
            <span className="enlight-weekly-recap__stat-label">XP earned</span>
          </div>
          <div className="enlight-weekly-recap__stat">
            <span className="enlight-weekly-recap__stat-icon" aria-hidden>📅</span>
            <span className="enlight-weekly-recap__stat-value">{weeklyRecap.activeDays}/7</span>
            <span className="enlight-weekly-recap__stat-label">active days</span>
          </div>
          <div className="enlight-weekly-recap__stat">
            <span className="enlight-weekly-recap__stat-icon" aria-hidden>🔥</span>
            <span className="enlight-weekly-recap__stat-value">{weeklyRecap.streakDays}</span>
            <span className="enlight-weekly-recap__stat-label">day streak</span>
          </div>
        </div>
        <div className="enlight-weekly-recap__goal">
          <div className="enlight-weekly-recap__goal-row">
            <span>Today&apos;s goal</span>
            <span>{todayMin} / {dailyGoal} min</span>
          </div>
          <div className="enlight-daily-goal-bar">
            <div className="enlight-daily-goal-bar__fill" style={{ width: `${goalPct}%` }} />
          </div>
        </div>
      </section>

      <div className="enlight-dashboard-grid enlight-dashboard-grid--compact">
        <div className="enlight-dash-card enlight-dash-card--notes">
          <span className="enlight-dash-card__icon-wrap enlight-dash-card__icon-wrap--notes">📚</span>
          <div className="enlight-dash-card__body">
            <span className="enlight-dash-card__value">
              {dashboard.notesCompleted}/{dashboard.notesTotal}
            </span>
            <span className="enlight-dash-card__label">Notes completed</span>
          </div>
        </div>
        <div className="enlight-dash-card enlight-dash-card--quiz">
          <span className="enlight-dash-card__icon-wrap enlight-dash-card__icon-wrap--quiz">🧠</span>
          <div className="enlight-dash-card__body">
            <span className="enlight-dash-card__value">{dashboard.quizMasteryPercent}%</span>
            <span className="enlight-dash-card__label">Quiz mastery</span>
          </div>
        </div>
        <Link to="/dashboard/review" className="enlight-dash-card enlight-dash-card--warn enlight-dash-card--link">
          <span className="enlight-dash-card__icon-wrap enlight-dash-card__icon-wrap--warn">⚡</span>
          <div className="enlight-dash-card__body">
            <span className="enlight-dash-card__value">{weakCount}</span>
            <span className="enlight-dash-card__label">Weak topics</span>
            <span className="enlight-dash-card__sub">Tap to review →</span>
          </div>
        </Link>
      </div>

      <section className="enlight-dashboard-card">
        <h2 className="enlight-heading-serif enlight-dashboard-card__title">Study activity</h2>
        <p className="enlight-activity-legend">Last 7 days · darker = more XP earned</p>
        <div className="enlight-activity-heatmap">
          {weekActivity.map((day) => (
            <div key={day.date} className="enlight-activity-day">
              <div
                className={[
                  'enlight-activity-cell',
                  `enlight-activity-cell--lvl-${day.intensity}`,
                  day.isToday ? 'enlight-activity-cell--today' : '',
                ].join(' ')}
                title={
                  day.active
                    ? `${day.date}: ${day.xp > 0 ? `${day.xp} XP` : 'studied'}`
                    : `${day.date}: no activity`
                }
              />
              <span className="enlight-activity-day__label">{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="enlight-dashboard-card">
        <div className="enlight-progress-page__title-row">
          <h2 className="enlight-heading-serif enlight-dashboard-card__title">Quiz history</h2>
          {quizSummaries.length > 0 && (
            <EnlightButton to="/dashboard/quiz-history" variant="outline">
              View all →
            </EnlightButton>
          )}
        </div>
        {quizSummaries.length === 0 ? (
          <p className="enlight-body-text">No quizzes yet — complete one from any subject to start tracking scores.</p>
        ) : (
          <div className="enlight-quiz-history-grid enlight-quiz-history-grid--compact">
            {quizSummaries.slice(0, 3).map((s) => (
              <Link
                key={s.subjectId}
                to={`/dashboard/quiz-history/${s.subjectId}`}
                className="enlight-quiz-history-card"
              >
                <h3 className="enlight-quiz-history-card__title">{s.subjectName}</h3>
                <div className="enlight-quiz-history-card__stats">
                  <div>
                    <span className="enlight-quiz-history-card__value">{s.averageScore}%</span>
                    <span className="enlight-quiz-history-card__label">Average</span>
                  </div>
                  <div>
                    <span className="enlight-quiz-history-card__value">{s.attemptCount}</span>
                    <span className="enlight-quiz-history-card__label">Attempts</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="enlight-progress-gateways">
        <h2 className="enlight-heading-serif enlight-progress-gateways__title">Explore</h2>
        <div className="enlight-progress-gateways__grid">
          <ProgressGatewayCard
            to="/dashboard/quiz-history"
            icon="📋"
            title="Quiz history & mistake log"
            description="Average scores per subject — drill into each attempt to review mistakes."
            meta={quizSummaries.length > 0 ? `${quizSummaries.length} subject${quizSummaries.length === 1 ? '' : 's'} tracked` : 'No attempts yet'}
            accent="gold"
          />
          <ProgressGatewayCard
            to="/dashboard/review"
            icon="📉"
            title="Weak topics"
            description="Top weak chapters per subject — quiz fails and study time."
            meta={weakMeta}
            accent="rose"
          />
          <ProgressGatewayCard
            to="/dashboard/social"
            icon="🏆"
            title="Leaderboards & compete"
            description="School ranks, weekly challenges, quiz duels, and clan progress."
            meta={user ? 'See how you rank' : 'Sign in to compete'}
            accent="gold"
          />
          <ProgressGatewayCard
            to="/dashboard/social#friends"
            icon="👥"
            title="Friends"
            description="Add friends, see who is studying, and challenge them to duels."
            meta={user ? 'Manage friend list' : 'Sign in required'}
            accent="purple"
          />
          <ProgressGatewayCard
            to="/dashboard/subjects"
            icon="📚"
            title="Subject progress"
            description="Chapter-by-chapter mastery for Add Maths, Maths, and Physics."
            accent="mint"
          />
          <ProgressGatewayCard
            to="/dashboard/achievements"
            icon="🏅"
            title="Achievements"
            description="Badges unlocked from streaks, quizzes, and study milestones."
            meta={`${unlockedCount}/${achievements.length} unlocked`}
            accent="blue"
          />
          <ProgressGatewayCard
            to="/dashboard/account"
            icon="⚙️"
            title="Account & sync"
            description="Sign in, display name, profile, and manual progress sync."
            meta={user ? `Signed in as ${user.displayName}` : 'Guest mode'}
            accent="sage"
          />
        </div>
      </section>
    </>
  )
}
