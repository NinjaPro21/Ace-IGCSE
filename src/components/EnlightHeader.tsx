import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'
import { SignInButton } from '@/features/social/SocialPanels'

const NAV = [
  { to: '/subjects/add-maths-0606', label: 'Add Maths' },
  { to: '/subjects/maths-0580', label: 'Maths' },
  { to: '/subjects/physics', label: 'Physics' },
  { to: '/progress', label: 'Progress' },
  { to: '/analytics', label: 'Analytics' },
]

export function EnlightHeader() {
  const location = useLocation()
  const { progress, levelProfile, streakAtRisk } = useMastery()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header className="enlight-header">
      <div className="enlight-header__inner">
        <Link to="/" className="enlight-header__brand">
          <h1 className="enlight-header__logo">Project Enlight</h1>
          <span className="enlight-badge enlight-badge--gold">IGCSE</span>
        </Link>

        <nav className="enlight-header__nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`enlight-header__link${location.pathname.startsWith(item.to) ? ' enlight-header__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="enlight-header__right">
          <Link to="/progress" className="enlight-header__stats" title="View progress dashboard">
            <span className="enlight-stat-pill" title={`${levelProfile.title} — Level ${levelProfile.level}`}>
              <span className="enlight-stat-pill__icon">🏆</span> Lv {levelProfile.level}
            </span>
            <span className="enlight-stat-pill enlight-stat-pill--xp" title="Experience points">
              <span className="enlight-stat-pill__icon">⚡</span> {progress.xp} XP
            </span>
            <span
              className={[
                'enlight-stat-pill',
                'enlight-stat-pill--streak',
                streakAtRisk && progress.streakDays > 0 ? 'enlight-stat-pill--streak-risk' : '',
              ].join(' ')}
              title={
                streakAtRisk && progress.streakDays > 0
                  ? 'Study today to keep your streak!'
                  : 'Study streak'
              }
            >
              <span className="enlight-stat-pill__icon">🔥</span> {progress.streakDays}d
            </span>
          </Link>
          <SignInButton compact />
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
        <nav className="enlight-mobile-menu" aria-label="Mobile navigation">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`enlight-mobile-menu__link${location.pathname.startsWith(item.to) ? ' enlight-mobile-menu__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/progress" className="enlight-mobile-menu__stats">
            <span className="enlight-stat-pill">🏆 Lv {levelProfile.level}</span>
            <span className="enlight-stat-pill">⚡ {progress.xp} XP</span>
            <span className="enlight-stat-pill enlight-stat-pill--streak">🔥 {progress.streakDays}d</span>
          </Link>
        </nav>
      )}
    </header>
  )
}
