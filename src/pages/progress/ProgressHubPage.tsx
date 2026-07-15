import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { ProgressGatewayCard } from '@/components/ProgressGatewayCard'
import { StudyHubPanel } from '@/features/study/StudyHubPanel'
import { DailyQuestsPanel } from '@/features/mastery/DailyQuestsPanel'
import { PushNotificationPrompt } from '@/features/social/PushNotificationPrompt'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getXpForLevel } from '@/features/mastery/levelSystem'
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

function quizScoreTone(score: number): 'high' | 'mid' | 'low' {
  if (score >= 70) return 'high'
  if (score < 50) return 'low'
  return 'mid'
}

export function ProgressHubPage() {
  usePageTitle('Dashboard')
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
  const goalMet = todayMin >= dailyGoal
  const quizSummaries = useMemo(() => getQuizSummariesBySubject(progress), [progress])

  const xpFloor = getXpForLevel(levelProfile.level)
  const xpCeiling = xpFloor + levelProfile.xpRequiredForNextLevel

  const weakMeta =
    weakCount === 0
      ? 'All clear — keep going'
      : `${weakCount} chapter${weakCount === 1 ? '' : 's'} need review`

  return (
    <>
      <div className="ace-dashboard-top">
        <EnlightSectionLabel>Dashboard</EnlightSectionLabel>
        {isAdmin && (
          <EnlightButton to="/analytics" variant="outline">Analytics →</EnlightButton>
        )}
      </div>

      <section className="ace-dash-hero" data-tour="dashboard-hero" aria-label="Level progress">
        <div className="ace-dash-hero__row">
          <div className="ace-dash-hero__level">
            <div className="ace-dash-hero__badge" aria-hidden>
              <span className="ace-dash-hero__badge-num">{levelProfile.level}</span>
              <span className="ace-dash-hero__badge-lv">LV</span>
            </div>
            <div>
              <h1 className="ace-dash-hero__title">{levelProfile.title}</h1>
              <p className="ace-dash-hero__sub">
                {levelProfile.xpToNextLevel} XP to level {levelProfile.level + 1}
              </p>
            </div>
          </div>
          <div className="ace-dash-hero__total">
            <span className="ace-dash-hero__total-value">{levelProfile.xp.toLocaleString()}</span>
            <span className="ace-dash-hero__total-label">Total XP</span>
          </div>
        </div>
        <div className="ace-dash-hero__bar-meta">
          <span>{xpFloor.toLocaleString()} XP</span>
          <span>
            Level {levelProfile.level + 1} at {xpCeiling.toLocaleString()} XP
          </span>
        </div>
        <div className="ace-dash-hero__bar" aria-label="XP progress to next level">
          <div
            className="ace-dash-hero__bar-fill"
            style={{ width: `${levelProfile.levelProgressPercent}%` }}
          />
        </div>
        {streakAtRisk && progress.streakDays > 0 && (
          <p className="ace-dash-hero__warning">
            {streakCountdown
              ? `Study within ${streakCountdown} to keep your ${progress.streakDays}-day streak!`
              : `Study today to keep your ${progress.streakDays}-day streak!`}
          </p>
        )}
      </section>

      {continueStudying && (
        <section className="ace-welcome-back">
          <div className="ace-welcome-back__content">
            <p className="ace-welcome-back__eyebrow">Welcome back</p>
            <h2 className="ace-welcome-back__title">{continueStudying.chapterTitle}</h2>
            <p className="ace-welcome-back__sub">{continueStudying.topicTitle}</p>
          </div>
          <EnlightButton to={continueStudying.topicPath}>Continue →</EnlightButton>
        </section>
      )}

      <section className="ace-dash-stats" aria-label="This week">
        <div className="ace-dash-stat">
          <span className="ace-dash-stat__value">{weeklyRecap.studyMinutes}</span>
          <span className="ace-dash-stat__label">min studied</span>
        </div>
        <div className="ace-dash-stat">
          <span className="ace-dash-stat__value">{weeklyRecap.xp}</span>
          <span className="ace-dash-stat__label">XP this week</span>
        </div>
        <div className="ace-dash-stat">
          <span className="ace-dash-stat__value">{weeklyRecap.activeDays}/7</span>
          <span className="ace-dash-stat__label">active days</span>
        </div>
        <div className="ace-dash-stat">
          <span className="ace-dash-stat__value">{weeklyRecap.streakDays}</span>
          <span className="ace-dash-stat__label">day streak</span>
        </div>
      </section>

      <section className="ace-dash-goal" aria-label="Today's goal">
        <div className="ace-dash-goal__row">
          <span className="ace-dash-goal__label">Today&apos;s goal</span>
          <span className={`ace-dash-goal__value${goalMet ? ' ace-dash-goal__value--met' : ''}`}>
            {todayMin} / {dailyGoal} min
            {goalMet ? <span className="ace-dash-goal__check" aria-label="Goal met">✓</span> : null}
          </span>
        </div>
        <div className="ace-daily-goal-bar">
          <div className="ace-daily-goal-bar__fill" style={{ width: `${goalPct}%` }} />
        </div>
      </section>

      <DailyQuestsPanel />

      <StudyHubPanel />

      <PushNotificationPrompt />

      <div className="ace-dashboard-grid ace-dashboard-grid--compact">
        <div className="ace-dash-card ace-dash-card--notes">
          <span className="ace-dash-card__icon-wrap ace-dash-card__icon-wrap--notes" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <div className="ace-dash-card__body">
            <span className="ace-dash-card__value">
              {dashboard.notesCompleted} / {dashboard.notesTotal}
            </span>
            <span className="ace-dash-card__label">Topics read</span>
          </div>
        </div>
        <div className="ace-dash-card ace-dash-card--quiz">
          <span className="ace-dash-card__icon-wrap ace-dash-card__icon-wrap--quiz" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.2 4.2 3 5.5V17h8v-2.5c1.8-1.3 3-3 3-5.5a7 7 0 0 0-7-7z" />
              <path d="M9 21h6" />
            </svg>
          </span>
          <div className="ace-dash-card__body">
            <span className="ace-dash-card__value">{dashboard.quizMasteryPercent}%</span>
            <span className="ace-dash-card__label">Quiz mastery</span>
          </div>
        </div>
        <Link to="/dashboard/review" className="ace-dash-card ace-dash-card--warn ace-dash-card--link">
          <span className="ace-dash-card__icon-wrap ace-dash-card__icon-wrap--warn" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          <div className="ace-dash-card__body">
            <span className="ace-dash-card__value">{weakCount}</span>
            <span className="ace-dash-card__label">Weak topics</span>
            <span className="ace-dash-card__sub">Review →</span>
          </div>
        </Link>
      </div>

      <section className="ace-dashboard-card ace-dash-activity">
        <h2 className="ace-heading-serif ace-dashboard-card__title">Study activity</h2>
        <p className="ace-activity-legend">Last 7 days</p>
        <div className="ace-activity-bars" role="img" aria-label="Study activity for the last 7 days">
          {weekActivity.map((day) => (
            <div key={day.date} className="ace-activity-bar-col">
              <div className="ace-activity-bar-track">
                <div
                  className={[
                    'ace-activity-bar',
                    `ace-activity-bar--lvl-${day.intensity}`,
                    day.isToday ? 'ace-activity-bar--today' : '',
                  ].join(' ')}
                  style={{ height: `${Math.max(8, day.intensity * 20)}%` }}
                  title={
                    day.active
                      ? `${day.date}: ${day.xp > 0 ? `${day.xp} XP` : 'studied'}`
                      : `${day.date}: no activity`
                  }
                />
              </div>
              <span className="ace-activity-day__label">{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ace-dashboard-card">
        <div className="ace-progress-page__title-row">
          <h2 className="ace-heading-serif ace-dashboard-card__title">Quiz history</h2>
          {quizSummaries.length > 0 && (
            <EnlightButton to="/dashboard/quiz-history" variant="outline">
              View all →
            </EnlightButton>
          )}
        </div>
        {quizSummaries.length === 0 ? (
          <p className="ace-body-text">No quizzes yet — complete one from any subject to start tracking scores.</p>
        ) : (
          <div className="ace-quiz-history-grid ace-quiz-history-grid--compact">
            {quizSummaries.slice(0, 3).map((s) => (
              <Link
                key={s.subjectId}
                to={`/dashboard/quiz-history/${s.subjectId}`}
                className="ace-quiz-history-card"
              >
                <h3 className="ace-quiz-history-card__title">{s.subjectName}</h3>
                <span
                  className={`ace-quiz-history-card__score ace-quiz-history-card__score--${quizScoreTone(s.averageScore)}`}
                >
                  {s.averageScore}%
                </span>
                <span className="ace-quiz-history-card__meta">
                  avg · {s.attemptCount} attempt{s.attemptCount === 1 ? '' : 's'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="ace-progress-gateways" data-tour="dashboard-explore">
        <h2 className="ace-heading-serif ace-progress-gateways__title">Explore</h2>
        <div className="ace-progress-gateways__grid">
          <ProgressGatewayCard
            to="/dashboard/quiz-history"
            icon="Q"
            title="Quiz history & mistake log"
            description="Average scores per subject — drill into each attempt to review mistakes."
            meta={quizSummaries.length > 0 ? `${quizSummaries.length} subject${quizSummaries.length === 1 ? '' : 's'} tracked` : 'No attempts yet'}
            accent="gold"
          />
          <ProgressGatewayCard
            to="/dashboard/review"
            icon="W"
            title="Weak topics"
            description="Top weak chapters per subject — quiz fails and study time."
            meta={weakMeta}
            accent="warn"
          />
          <ProgressGatewayCard
            to="/social"
            icon="S"
            title="Social"
            description="Profile, leaderboards, friends, and study groups."
            meta={user ? 'Rankings & connections' : 'Sign in to compete'}
            accent="gold"
          />
          <ProgressGatewayCard
            to="/dashboard/subjects"
            icon="P"
            title="Subject progress"
            description="Chapter-by-chapter mastery for Add Maths, Maths, and Physics."
            accent="gold"
          />
          <ProgressGatewayCard
            to="/dashboard/achievements"
            icon="A"
            title="Achievements"
            description="Badges unlocked from streaks, quizzes, and study milestones."
            meta={`${unlockedCount}/${achievements.length} unlocked`}
            accent="gold"
          />
          <ProgressGatewayCard
            to="/dashboard/account"
            icon="⚙"
            title="Account & sync"
            description="Sign in, display name, profile, and manual progress sync."
            meta={user ? `Signed in as ${user.displayName}` : 'Guest mode'}
            accent="gold"
          />
        </div>
      </section>
    </>
  )
}
