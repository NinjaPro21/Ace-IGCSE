import type { Messaging } from 'firebase/messaging'
import { app, isFirebaseConfigured } from '@/lib/firebase'

let messagingPromise: Promise<Messaging | null> | null = null

export async function getMessagingInstance(): Promise<Messaging | null> {
  if (!isFirebaseConfigured || !app) return null
  if (!messagingPromise) {
    messagingPromise = import('firebase/messaging').then(({ getMessaging, isSupported }) =>
      isSupported().then((ok) => (ok ? getMessaging(app!) : null)),
    )
  }
  return messagingPromise
}
