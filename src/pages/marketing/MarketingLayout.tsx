import { Link, Outlet, useLocation } from 'react-router-dom'
import { SignInButton } from '@/features/social/SocialPanels'

export function MarketingLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="enlight-app enlight-marketing">
      <header className="enlight-header enlight-header--marketing">
        <div className="enlight-header__inner">
          <Link to="/" className="enlight-header__brand">
            <h1 className="enlight-header__logo">
              <span className="enlight-header__logo-full">Project Enlight</span>
            </h1>
            <span className="enlight-badge enlight-badge--gold">IGCSE</span>
          </Link>

          {!isHome && (
            <nav className="enlight-header__nav" aria-label="Marketing navigation">
              <Link to="/" className="enlight-header__link">
                Tour
              </Link>
            </nav>
          )}

          <div className="enlight-header__actions">
            <SignInButton compact />
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
