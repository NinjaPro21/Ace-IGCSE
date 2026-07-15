import { useEffect, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from '@/features/social/AuthContext'
import { useMastery } from '@/features/mastery/MasteryContext'
import {
  getPushPermissionState,
  registerPushNotifications,
  type PushPermissionState,
} from '@/lib/pushNotifications'

const DISMISS_KEY = 'ace-push-prompt-dismissed'

/** Prompt signed-in users with an active streak to enable streak-deadline push. */
export function PushNotificationPrompt() {
  const { user } = useAuth()
  const { progress, streakAtRisk } = useMastery()
  const [permission, setPermission] = useState<PushPermissionState>(() => getPushPermissionState())
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setPermission(getPushPermissionState())
  }, [])

  if (!user || dismissed || permission === 'unsupported' || permission === 'denied') return null
  if (permission === 'granted') return null
  if (progress.streakDays < 2 && !streakAtRisk) return null

  const handleEnable = async () => {
    setBusy(true)
    const result = await registerPushNotifications()
    setPermission(getPushPermissionState())
    setBusy(false)
    if (result === 'granted') setDismissed(true)
  }

  return (
    <section className="ace-dashboard-card ace-push-prompt" aria-label="Streak reminders">
      <h2 className="ace-heading-serif ace-dashboard-card__title">Streak reminders</h2>
      <p className="ace-body-text">
        Get a push notification about 3 hours before your {progress.streakDays}-day streak expires —
        so you can study even when the app is closed.
      </p>
      <div className="ace-popout__actions">
        <EnlightButton onClick={() => void handleEnable()} disabled={busy}>
          {busy ? 'Enabling…' : 'Enable reminders'}
        </EnlightButton>
        <EnlightButton
          variant="outline"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, '1')
            setDismissed(true)
          }}
        >
          Not now
        </EnlightButton>
      </div>
    </section>
  )
}
