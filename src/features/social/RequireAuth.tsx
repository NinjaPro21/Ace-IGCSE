import type { ReactNode } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from './AuthContext'

export function SignInGate() {
  const { signInWithGoogle, syncError, isConfigured } = useAuth()

  return (
    <div className="ace-app ace-signin-gate">
      <div className="ace-signin-gate__card">
        <span className="ace-badge ace-badge--gold">IGCSE</span>
        <h1 className="ace-heading-serif ace-signin-gate__title">AceIGCSE</h1>
        <p className="ace-body-text ace-signin-gate__text">
          Sign in with your school Google account to access notes, quizzes, progress tracking, and
          class leaderboards.
        </p>
        {!isConfigured && (
          <p className="ace-signin-error">
            Firebase is not configured. Add credentials to <code>.env.local</code>.
          </p>
        )}
        <EnlightButton onClick={() => signInWithGoogle()}>Sign in with Google</EnlightButton>
        {syncError && <p className="ace-signin-error">{syncError}</p>}
      </div>
    </div>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="ace-app ace-signin-gate">
        <p className="ace-body-text">Loading…</p>
      </div>
    )
  }

  if (!user) return <SignInGate />

  return children
}
