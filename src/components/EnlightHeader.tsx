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

  return (
    <header className="enlight-header">
      <div className="enlight-header__inner">
        <Link to="/" className="enlight-header__brand">
          <h1 className="enlight-header__logo">Project Enlight</h1>
          <span className="enlight-badge enlight-badge--gold">IGCSE</span>
        </Link>

        <nav className="enlight-header__nav">
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

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="enlight-header__stats">
            <span>Lv {globalLevel}</span>
            <span>{progress.xp} XP</span>
            <span>Streak: {progress.streakDays}d</span>
          </div>
          <button type="button" className="enlight-btn enlight-btn--primary enlight-btn--sm">
            Sign in
          </button>
        </div>
      </div>
    </header>
  )
}
