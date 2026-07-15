import { deleteField, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getToken, isSupported, type Messaging } from 'firebase/messaging'
import { auth, db, isFirebaseConfigured } from '@/lib/firebase'
import { getMessagingInstance } from '@/lib/firebaseMessaging'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined

export type PushPermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

export function getPushPermissionState(): PushPermissionState {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission as PushPermissionState
}

async function savePushToken(userId: string, token: string): Promise<void> {
  if (!db) return
  await setDoc(
    doc(db, 'profiles', userId, 'private', 'push'),
    {
      fcmToken: token,
      enabled: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function disablePushNotifications(userId: string): Promise<void> {
  if (!db) return
  await setDoc(
    doc(db, 'profiles', userId, 'private', 'push'),
    { enabled: false, fcmToken: deleteField(), updatedAt: serverTimestamp() },
    { merge: true },
  )
}

/** Request browser push permission and persist the FCM token for streak reminders. */
export async function registerPushNotifications(): Promise<'granted' | 'denied' | 'unsupported' | 'error'> {
  if (!isFirebaseConfigured || !auth?.currentUser || !db) return 'error'
  if (!VAPID_KEY) return 'error'

  const supported = await isSupported()
  if (!supported) return 'unsupported'

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return 'denied'

  let messaging: Messaging | null = null
  try {
    messaging = await getMessagingInstance()
  } catch {
    return 'error'
  }
  if (!messaging) return 'error'

  try {
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' })
    await navigator.serviceWorker.ready
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg })
    if (!token) return 'error'
    await savePushToken(auth.currentUser.uid, token)
    return 'granted'
  } catch {
    return 'error'
  }
}
