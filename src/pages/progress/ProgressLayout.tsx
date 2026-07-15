import { Outlet, useLocation, Link } from 'react-router-dom'
import { AceFooter } from '@/components/AceFooter'
import { EnlightHeader } from '@/components/EnlightHeader'

export function ProgressLayout() {
  const { pathname } = useLocation()
  const isHub = pathname === '/dashboard' || pathname === '/dashboard/'

  return (
    <div className="ace-app">
      <EnlightHeader />

      <div className="ace-container ace-page-padding ace-progress-page">
        {!isHub && (
          <Link to="/dashboard" className="ace-progress-back">
            ← Dashboard
          </Link>
        )}
        <Outlet />
      </div>

      <AceFooter />
    </div>
  )
}
