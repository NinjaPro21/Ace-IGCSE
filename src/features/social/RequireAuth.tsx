import type { ReactNode } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from './AuthContext'

export function SignInGate() {
  const { signInWithGoogle, syncError, isConfigured } = useAuth()

  return (
    <div className="enlight-app enlight-signin-gate">
      <div className="enlight-signin-gate__card">
        <span className="enlight-badge enlight-badge--gold">IGCSE</span>
        <h1 className="enlight-heading-serif enlight-signin-gate__title">Project Enlight</h1>
        <p className="enlight-body-text enlight-signin-gate__text">
          Sign in with your school Google account to access notes, quizzes, progress tracking, and
          class leaderboards.
        </p>
        {!isConfigured && (
          <p className="enlight-signin-error">
            Firebase is not configured. Add credentials to <code>.env.local</code>.
          </p>
        )}
        <EnlightButton onClick={() => signInWithGoogle()}>Sign in with Google</EnlightButton>
        {syncError && <p className="enlight-signin-error">{syncError}</p>}
      </div>
    </div>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="enlight-app enlight-signin-gate">
        <p className="enlight-body-text">Loading…</p>
      </div>
    )
  }

  if (!user) return <SignInGate />

  return children
}
