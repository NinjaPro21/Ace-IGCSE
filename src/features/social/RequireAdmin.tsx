import type { ReactNode } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from './AuthContext'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, adminChecked } = useAuth()

  if (loading || (user && !adminChecked)) {
    return (
      <div className="enlight-app enlight-signin-gate">
        <p className="enlight-body-text">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="enlight-app enlight-signin-gate">
        <div className="enlight-signin-gate__card">
          <h1 className="enlight-heading-serif enlight-signin-gate__title">Admin analytics</h1>
          <p className="enlight-body-text enlight-signin-gate__text">
            Sign in with your admin Google account to view site-wide statistics.
          </p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="enlight-app enlight-signin-gate">
        <div className="enlight-signin-gate__card">
          <h1 className="enlight-heading-serif enlight-signin-gate__title">Access restricted</h1>
          <p className="enlight-body-text enlight-signin-gate__text">
            Platform analytics are only available to site administrators. Your progress dashboard
            still has your personal stats and class insights.
          </p>
          <EnlightButton to="/dashboard" variant="outline">Back to dashboard</EnlightButton>
        </div>
      </div>
    )
  }

  return children
}
