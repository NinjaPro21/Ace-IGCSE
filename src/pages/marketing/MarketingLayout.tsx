import { Link, Outlet, useLocation } from 'react-router-dom'
import { AceFooter } from '@/components/AceFooter'
import { SignInButton } from '@/features/social/SocialPanels'

export function MarketingLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="ace-app ace-marketing">
      <header className="ace-header ace-header--marketing">
        <div className="ace-header__inner">
          <Link to="/" className="ace-header__brand">
            <h1 className="ace-header__logo">
              <span className="ace-header__logo-full">AceIGCSE</span>
            </h1>
            <span className="ace-badge ace-badge--gold">IGCSE</span>
          </Link>

          {!isHome && (
            <nav className="ace-header__nav" aria-label="Marketing navigation">
              <Link to="/" className="ace-header__link">
                Home
              </Link>
            </nav>
          )}

          <div className="ace-header__actions">
            <SignInButton compact />
          </div>
        </div>
      </header>
      <Outlet />
      <AceFooter />
    </div>
  )
}
