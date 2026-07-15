import type { ReactNode } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from './AuthContext'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, adminChecked } = useAuth()

  if (loading || (user && !adminChecked)) {
    return (
      <div className="ace-app ace-signin-gate">
        <p className="ace-body-text">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="ace-app ace-signin-gate">
        <div className="ace-signin-gate__card">
          <h1 className="ace-heading-serif ace-signin-gate__title">Admin analytics</h1>
          <p className="ace-body-text ace-signin-gate__text">
            Sign in with your admin Google account to view site-wide statistics.
          </p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="ace-app ace-signin-gate">
        <div className="ace-signin-gate__card">
          <h1 className="ace-heading-serif ace-signin-gate__title">Access restricted</h1>
          <p className="ace-body-text ace-signin-gate__text">
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
