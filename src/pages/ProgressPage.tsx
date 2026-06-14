import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getPersonalChapterInsights, getStuckChapters } from '@/features/mastery/tutorInsights'
import { GroupLeaderboard, SchoolClanPanel, SignInButton, ClassInsightsPanel } from '@/features/social/SocialPanels'
import { useAuth } from '@/features/social/AuthContext'
import { XP_PER_LEVEL } from '@/features/mastery/levelSystem'
import { getSubjectSummary } from '@/features/mastery/progressStats'
import { getAllSubjects } from '@/lib/contentLoader'

const STATUS_LABEL = {
  available: 'Not started',
  in_progress: 'In progress',
  mastered: 'Mastered',
} as const

export function ProgressPage() {
  const {
    progress,
    levelProfile,
    activityStats,
    achievements,
    streakCalendar,
    streakAtRisk,
    setDisplayName,
  } = useMastery()
  const { user, syncProgressNow } = useAuth()

  const [nameInput, setNameInput] = useState(progress.displayName)
  const subjects = getAllSubjects()
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const personalStuck = getStuckChapters(getPersonalChapterInsights(progress), 5)

  const handleSaveName = () => {
    setDisplayName(nameInput)
  }

  return (
    <div className="enlight-app">
      <EnlightHeader />

      <div className="enlight-container enlight-page-padding enlight-progress-page">
        <EnlightSectionLabel>Your progress</EnlightSectionLabel>
        <div className="enlight-progress-page__title-row">
          <h1 className="enlight-heading-serif">Study dashboard</h1>
          <EnlightButton to="/analytics" variant="outline">View analytics →</EnlightButton>
        </div>
        <p className="enlight-body-text enlight-progress-page__intro">
          {user
            ? 'Your progress syncs to your Google account. Study data helps you and your tutor spot tough chapters.'
            : 'Track level, streak, and mastery locally — sign in with Google to sync across devices and join school leaderboards.'}
        </p>

        {/* Level + streak hero */}
        <div className="enlight-progress-hero">
          <div className="enlight-progress-hero__level">
            <div className="enlight-progress-hero__level-badge">Lv {levelProfile.level}</div>
            <div>
              <h2 className="enlight-progress-hero__title">{levelProfile.title}</h2>
              <p className="enlight-body-text">
                {levelProfile.xp} XP total · {levelProfile.xpToNextLevel} XP to level{' '}
                {levelProfile.level + 1}
              </p>
            </div>
          </div>
          <div className="enlight-progress-xp-bar" aria-label="XP progress to next level">
            <div
              className="enlight-progress-xp-bar__fill"
              style={{ width: `${levelProfile.levelProgressPercent}%` }}
            />
          </div>
          <div className="enlight-progress-hero__stats">
            <div className="enlight-progress-stat">
              <span className="enlight-progress-stat__value">{progress.streakDays}</span>
              <span className="enlight-progress-stat__label">Day streak</span>
            </div>
            <div className="enlight-progress-stat">
              <span className="enlight-progress-stat__value">{progress.longestStreak}</span>
              <span className="enlight-progress-stat__label">Best streak</span>
            </div>
            <div className="enlight-progress-stat">
              <span className="enlight-progress-stat__value">{activityStats.chaptersMastered}</span>
              <span className="enlight-progress-stat__label">Chapters mastered</span>
            </div>
            <div className="enlight-progress-stat">
              <span className="enlight-progress-stat__value">{activityStats.topicsRead}</span>
              <span className="enlight-progress-stat__label">Topics read</span>
            </div>
          </div>
        </div>

        {/* Streak calendar */}
        <section className="enlight-progress-section">
          <div className="enlight-progress-section__header">
            <h2 className="enlight-heading-serif enlight-progress-section__title">Study streak</h2>
            {streakAtRisk && progress.streakDays > 0 && (
              <span className="enlight-progress-streak-warning">
                Study today to keep your {progress.streakDays}-day streak!
              </span>
            )}
          </div>
          <div className="enlight-streak-calendar">
            {streakCalendar.map((day) => (
              <div
                key={day.date}
                className={[
                  'enlight-streak-day',
                  day.active ? 'enlight-streak-day--active' : '',
                  day.isToday ? 'enlight-streak-day--today' : '',
                ].join(' ')}
                title={day.date}
              >
                <span className="enlight-streak-day__dot" />
                <span className="enlight-streak-day__label">{day.label}</span>
              </div>
            ))}
          </div>
        </section>

        {personalStuck.length > 0 && (
          <section className="enlight-progress-section">
            <div className="enlight-progress-section__header">
              <h2 className="enlight-heading-serif enlight-progress-section__title">Your tough chapters</h2>
              <span className="enlight-progress-section__meta">Based on time spent & quiz attempts</span>
            </div>
            <div className="enlight-insights-table">
              {personalStuck.map((row) => (
                <div key={row.chapterId} className="enlight-insights-row">
                  <div className="enlight-insights-row__main">
                    <span className="enlight-insights-row__title">{row.chapterTitle}</span>
                    <span className="enlight-insights-row__subject">{row.subjectName}</span>
                  </div>
                  <div className="enlight-insights-row__stats">
                    <span>{row.timeSpentMin} min</span>
                    <span>{row.quizAttempts} quiz attempts</span>
                    {row.failRate > 0 && <span>{row.failRate}% failed</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* XP breakdown */}
        <section className="enlight-progress-section">
          <h2 className="enlight-heading-serif enlight-progress-section__title">How you earn XP</h2>
          <div className="enlight-xp-table">
            <div className="enlight-xp-table__row">
              <span>Study a topic (5 min)</span>
              <span>+5 XP</span>
            </div>
            <div className="enlight-xp-table__row">
              <span>Pass Easy quiz</span>
              <span>+10 XP</span>
            </div>
            <div className="enlight-xp-table__row">
              <span>Pass Medium quiz</span>
              <span>+20 XP</span>
            </div>
            <div className="enlight-xp-table__row">
              <span>Pass Hard quiz</span>
              <span>+35 XP</span>
            </div>
            <div className="enlight-xp-table__row">
              <span>Pass PYP mastery</span>
              <span>+50 XP</span>
            </div>
            <div className="enlight-xp-table__row enlight-xp-table__row--muted">
              <span>Level up every</span>
              <span>{XP_PER_LEVEL} XP</span>
            </div>
          </div>
        </section>

        {/* Chapter progress by subject */}
        {subjects.map((subject) => {
          const summary = getSubjectSummary(subject.id, progress)
          if (summary.total === 0) return null

          return (
            <section key={subject.id} className="enlight-progress-section">
              <div className="enlight-progress-section__header">
                <h2 className="enlight-heading-serif enlight-progress-section__title">
                  {subject.name}
                </h2>
                <span className="enlight-progress-section__meta">
                  {summary.mastered}/{summary.total} mastered · {summary.avgMastery}% avg
                </span>
              </div>
              <div className="enlight-chapter-progress-list">
                {summary.rows.map(({ chapter, masteryPercent, status }) => (
                  <Link
                    key={chapter.id}
                    to={`/subjects/${subject.id}`}
                    className="enlight-chapter-progress-row"
                  >
                    <div className="enlight-chapter-progress-row__top">
                      <span className="enlight-chapter-progress-row__title">
                        Ch {chapter.number}: {chapter.title}
                      </span>
                      <span className="enlight-chapter-progress-row__pct">{masteryPercent}%</span>
                    </div>
                    <div className="enlight-chapter-progress-row__bar">
                      <div
                        className="enlight-chapter-progress-row__fill"
                        style={{ width: `${masteryPercent}%` }}
                      />
                    </div>
                    <span className="enlight-chapter-progress-row__status">
                      {STATUS_LABEL[status]}
                    </span>
                  </Link>
                ))}
              </div>
              <EnlightButton to={`/subjects/${subject.id}`} variant="outline">
                Open {subject.name} →
              </EnlightButton>
            </section>
          )
        })}

        {/* Achievements */}
        <section className="enlight-progress-section">
          <div className="enlight-progress-section__header">
            <h2 className="enlight-heading-serif enlight-progress-section__title">Achievements</h2>
            <span className="enlight-progress-section__meta">
              {unlockedCount}/{achievements.length} unlocked
            </span>
          </div>
          <div className="enlight-achievement-grid">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={[
                  'enlight-achievement',
                  a.unlocked ? 'enlight-achievement--unlocked' : 'enlight-achievement--locked',
                ].join(' ')}
              >
                <span className="enlight-achievement__icon">{a.icon}</span>
                <div>
                  <div className="enlight-achievement__title">{a.title}</div>
                  <div className="enlight-achievement__desc">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Account + school/clan */}
        <section className="enlight-progress-section">
          <h2 className="enlight-heading-serif enlight-progress-section__title">Account</h2>
          <p className="enlight-body-text">
            {user
              ? `Signed in as ${user.displayName}. Your progress syncs to your Google account.`
              : 'Sign in with Google to save progress across devices and join school leaderboards.'}
          </p>
          <div style={{ marginBottom: 16 }}>
            <SignInButton />
          </div>
          {user && (
            <EnlightButton variant="outline" onClick={() => syncProgressNow()}>
              Sync progress now
            </EnlightButton>
          )}
          <div className="enlight-profile-form" style={{ marginTop: 20 }}>
            <input
              type="text"
              className="enlight-profile-form__input"
              placeholder="Display name on leaderboard"
              value={nameInput}
              maxLength={24}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            />
            <EnlightButton onClick={handleSaveName}>Save name</EnlightButton>
          </div>
        </section>

        <SchoolClanPanel />
        <ClassInsightsPanel />
        <GroupLeaderboard />
      </div>

      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
