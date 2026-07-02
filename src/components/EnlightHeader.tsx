import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getContinueStudying, getTodayStudyMinutes } from '@/features/mastery/progressStats'
import { useAuth } from '@/features/social/AuthContext'
import { SignInButton } from '@/features/social/SocialPanels'
import { NotificationBell } from '@/features/social/NotificationBell'

const SIGNED_IN_NAV = [
  { to: '/dashboard', label: 'Dashboard', match: (p: string) => p.startsWith('/dashboard') },
  { to: '/subjects', label: 'Subjects', match: (p: string) => p.startsWith('/subjects') },
]

function HeaderStats({
  level,
  xp,
  streakDays,
  streakAtRisk,
  className = '',
}: {
  level: number
  xp: number
  streakDays: number
  streakAtRisk: boolean
  className?: string
}) {
  return (
    <Link to="/dashboard" className={`enlight-header__stats ${className}`.trim()} title="View dashboard">
      <span className="enlight-stat-pill enlight-stat-pill--compact" title={`Level ${level}`}>
        <span className="enlight-stat-pill__icon" aria-hidden>🏆</span>
        <span>Lv {level}</span>
      </span>
      <span className="enlight-stat-pill enlight-stat-pill--compact enlight-stat-pill--xp" title="Experience points">
        <span className="enlight-stat-pill__icon" aria-hidden>⚡</span>
        <span>{xp}</span>
      </span>
      <span
        className={[
          'enlight-stat-pill',
          'enlight-stat-pill--compact',
          'enlight-stat-pill--streak',
          streakAtRisk && streakDays > 0 ? 'enlight-stat-pill--streak-risk' : '',
        ].join(' ')}
        title="Study streak"
      >
        <span className="enlight-stat-pill__icon" aria-hidden>🔥</span>
        <span>{streakDays}d</span>
      </span>
    </Link>
  )
}

export function EnlightHeader() {
  const location = useLocation()
  const { progress, levelProfile, streakAtRisk } = useMastery()
  const { isAdmin, user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const continueStudying = getContinueStudying(progress)
  const todayMin = getTodayStudyMinutes(progress)
  const dailyGoal = progress.dailyGoalMin ?? 20
  const goalPct = Math.min(100, Math.round((todayMin / dailyGoal) * 100))

  const nav = [
    ...SIGNED_IN_NAV,
    ...(isAdmin ? [{ to: '/analytics', label: 'Analytics', match: (p: string) => p.startsWith('/analytics') }] : []),
  ]

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="enlight-header">
      <div className="enlight-header__inner">
        <Link to={user ? '/dashboard' : '/'} className="enlight-header__brand">
          <h1 className="enlight-header__logo">
            <span className="enlight-header__logo-full">Project Enlight</span>
            <span className="enlight-header__logo-short">Enlight</span>
          </h1>
          <span className="enlight-badge enlight-badge--gold">IGCSE</span>
        </Link>

        <nav className="enlight-header__nav" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`enlight-header__link${item.match(location.pathname) ? ' enlight-header__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="enlight-header__actions">
          <HeaderStats
            className="enlight-header__stats--desktop"
            level={levelProfile.level}
            xp={progress.xp}
            streakDays={progress.streakDays}
            streakAtRisk={streakAtRisk}
          />
          <NotificationBell />
          <div className="enlight-header__auth">
            <SignInButton compact />
          </div>
          <button
            type="button"
            className="enlight-hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className="enlight-header__xp-mini" aria-hidden="true">
          <div
            className="enlight-header__xp-mini-fill"
            style={{ width: `${levelProfile.levelProgressPercent}%` }}
          />
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="enlight-mobile-backdrop"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="enlight-mobile-menu" aria-label="Mobile navigation">
            {continueStudying && (
              <Link to={continueStudying.topicPath} className="enlight-mobile-menu__continue">
                <span className="enlight-mobile-menu__continue-label">Continue studying</span>
                <span className="enlight-mobile-menu__continue-topic">{continueStudying.topicTitle}</span>
              </Link>
            )}

            <div className="enlight-mobile-menu__goal">
              <div className="enlight-mobile-menu__goal-top">
                <span>Daily goal</span>
                <span>{todayMin}/{dailyGoal} min</span>
              </div>
              <div className="enlight-daily-goal-bar">
                <div className="enlight-daily-goal-bar__fill" style={{ width: `${goalPct}%` }} />
              </div>
            </div>

            <HeaderStats
              className="enlight-mobile-menu__stats"
              level={levelProfile.level}
              xp={progress.xp}
              streakDays={progress.streakDays}
              streakAtRisk={streakAtRisk}
            />

            <div className="enlight-mobile-menu__links">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`enlight-mobile-menu__link${item.match(location.pathname) ? ' enlight-mobile-menu__link--active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {user && (
              <Link to={`/profile/${user.id}`} className="enlight-mobile-menu__profile">
                View profile
              </Link>
            )}
          </nav>
        </>
      )}
    </header>
  )
}
