import { Outlet, useLocation, Link } from 'react-router-dom'
import { EnlightHeader } from '@/components/EnlightHeader'

export function ProgressLayout() {
  const { pathname } = useLocation()
  const isHub = pathname === '/dashboard' || pathname === '/dashboard/'

  return (
    <div className="enlight-app">
      <EnlightHeader />

      <div className="enlight-container enlight-page-padding enlight-progress-page">
        {!isHub && (
          <Link to="/dashboard" className="enlight-progress-back">
            ← Dashboard
          </Link>
        )}
        <Outlet />
      </div>

      <footer className="enlight-footer">© {new Date().getFullYear()} AceIGCSE</footer>
    </div>
  )
}
