import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'

const NAV = [
  { to: '/subjects/add-maths-0606', label: 'Add Maths' },
  { to: '/subjects/maths-0580', label: 'Maths' },
  { to: '/subjects/physics', label: 'Physics' },
  { to: '/demo', label: 'Demo' },
  { to: '/pricing', label: 'Pricing' },
]

export function EnlightHeader() {
  const location = useLocation()
  const { progress, globalLevel } = useMastery()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
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
          <div className="enlight-header__stats">
            <span className="enlight-stat-pill" title="Your level">
              <span className="enlight-stat-pill__icon">🏆</span> Lv {globalLevel}
            </span>
            <span className="enlight-stat-pill" title="Experience points earned">
              <span className="enlight-stat-pill__icon">⚡</span> {progress.xp} XP
            </span>
            <span className="enlight-stat-pill enlight-stat-pill--streak" title="Study streak">
              <span className="enlight-stat-pill__icon">🔥</span> {progress.streakDays}d
            </span>
          </div>
          <button type="button" className="enlight-btn enlight-btn--primary enlight-btn--sm">
            Sign in
          </button>
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
      </div>

      {/* Mobile nav drawer */}
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
          <div className="enlight-mobile-menu__stats">
            <span className="enlight-stat-pill">🏆 Lv {globalLevel}</span>
            <span className="enlight-stat-pill">⚡ {progress.xp} XP</span>
            <span className="enlight-stat-pill enlight-stat-pill--streak">🔥 {progress.streakDays}d</span>
          </div>
        </nav>
      )}
    </header>
  )
}
