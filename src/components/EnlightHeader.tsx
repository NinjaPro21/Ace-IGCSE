import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getContinueStudying, getTodayStudyMinutes } from '@/features/mastery/progressStats'
import { useAuth } from '@/features/social/AuthContext'
import { SignInButton } from '@/features/social/SocialPanels'
import { NotificationBell } from '@/features/social/NotificationBell'
import { ThemePicker } from '@/components/ThemePicker'

const SIGNED_IN_NAV = [
  { to: '/dashboard', label: 'Dashboard', match: (p: string) => p.startsWith('/dashboard') },
  { to: '/subjects', label: 'Subjects', match: (p: string) => p.startsWith('/subjects') && !p.startsWith('/dashboard') },
  { to: '/social', label: 'Social', match: (p: string) => p.startsWith('/social') || p.startsWith('/profile') },
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
    <Link to="/dashboard" className={`ace-header__stats ${className}`.trim()} title="View dashboard">
      <span className="ace-stat-pill ace-stat-pill--compact ace-stat-pill--level" title={`Level ${level}`}>
        Lv {level}
      </span>
      <span className="ace-stat-pill ace-stat-pill--compact ace-stat-pill--xp" title="Experience points">
        {xp} XP
      </span>
      <span
        className={[
          'ace-stat-pill',
          'ace-stat-pill--compact',
          'ace-stat-pill--streak',
          streakAtRisk && streakDays > 0 ? 'ace-stat-pill--streak-risk' : '',
        ].join(' ')}
        title="Study streak"
      >
        <span className="ace-stat-pill__icon" aria-hidden>🔥</span>
        {streakDays}d
      </span>
    </Link>
  )
}

export function EnlightHeader({
  variant = 'default',
  exitTo = '/subjects',
}: {
  variant?: 'default' | 'lesson'
  /** Used when variant is lesson — leave the lesson */
  exitTo?: string
}) {
  const location = useLocation()
  const { progress, levelProfile, streakAtRisk } = useMastery()
  const { isAdmin, user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const continueStudying = getContinueStudying(progress)
  const todayMin = getTodayStudyMinutes(progress)
  const dailyGoal = progress.dailyGoalMin ?? 20
  const goalPct = Math.min(100, Math.round((todayMin / dailyGoal) * 100))

  const hideDashboardStats =
    location.pathname === '/dashboard' || location.pathname === '/dashboard/'

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

  if (variant === 'lesson') {
    return (
      <header className="ace-header ace-header--lesson">
        <div className="ace-header__inner">
          <Link to={user ? '/dashboard' : '/'} className="ace-header__brand">
            <h1 className="ace-header__logo">
              <span className="ace-header__logo-full">AceIGCSE</span>
              <span className="ace-header__logo-short">Ace</span>
            </h1>
          </Link>
          <Link to={exitTo} className="ace-header__exit">
            Exit
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="ace-header">
      <div className="ace-header__inner">
        <Link to={user ? '/dashboard' : '/'} className="ace-header__brand">
          <h1 className="ace-header__logo">
            <span className="ace-header__logo-full">AceIGCSE</span>
            <span className="ace-header__logo-short">Ace</span>
          </h1>
          <span className="ace-header__meta">3 subjects</span>
        </Link>

        <nav className="ace-header__nav" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-tour={`nav-${item.label.toLowerCase()}`}
              className={`ace-header__link${item.match(location.pathname) ? ' ace-header__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ace-header__actions">
          <ThemePicker className="ace-theme-picks--header ace-theme-picks--desktop" />
          {!hideDashboardStats && (
            <HeaderStats
              className="ace-header__stats--desktop"
              level={levelProfile.level}
              xp={progress.xp}
              streakDays={progress.streakDays}
              streakAtRisk={streakAtRisk}
            />
          )}
          <NotificationBell />
          <div className="ace-header__auth">
            <SignInButton compact />
          </div>
          <button
            type="button"
            className="ace-hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {!hideDashboardStats && (
          <div className="ace-header__xp-mini" aria-hidden="true">
            <div
              className="ace-header__xp-mini-fill"
              style={{ width: `${levelProfile.levelProgressPercent}%` }}
            />
          </div>
        )}
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="ace-mobile-backdrop"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="ace-mobile-menu" aria-label="Mobile navigation">
            {continueStudying && (
              <Link to={continueStudying.topicPath} className="ace-mobile-menu__continue">
                <span className="ace-mobile-menu__continue-label">Continue studying</span>
                <span className="ace-mobile-menu__continue-topic">{continueStudying.topicTitle}</span>
              </Link>
            )}

            <div className="ace-mobile-menu__goal">
              <div className="ace-mobile-menu__goal-top">
                <span>Daily goal</span>
                <span>
                  {todayMin}/{dailyGoal} min
                </span>
              </div>
              <div className="ace-daily-goal-bar">
                <div className="ace-daily-goal-bar__fill" style={{ width: `${goalPct}%` }} />
              </div>
            </div>

            <ThemePicker className="ace-theme-picks--mobile" />

            {!hideDashboardStats && (
              <HeaderStats
                className="ace-mobile-menu__stats"
                level={levelProfile.level}
                xp={progress.xp}
                streakDays={progress.streakDays}
                streakAtRisk={streakAtRisk}
              />
            )}

            <div className="ace-mobile-menu__links">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  data-tour={`nav-${item.label.toLowerCase()}`}
                  className={`ace-mobile-menu__link${item.match(location.pathname) ? ' ace-mobile-menu__link--active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {user && (
              <Link to="/social" className="ace-mobile-menu__profile">
                Social & profile
              </Link>
            )}
          </nav>
        </>
      )}
    </header>
  )
}
