/**
 * Hourly cron: send FCM streak-at-risk reminders (~3 hours before expiry).
 * Protected by CRON_SECRET. Requires FIREBASE_SERVICE_ACCOUNT_JSON.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore, type QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'

const THREE_HOURS_MS = 3 * 60 * 60 * 1000
const WINDOW_MS = 45 * 60 * 1000

function initAdmin(): void {
  if (getApps().length) return
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set')
  const sa = JSON.parse(raw) as ServiceAccount
  initializeApp({ credential: cert(sa), projectId: sa.projectId })
}

function localDateISO(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function endOfLocalDayMs(lastActiveDate: string, extraDays = 1): number | null {
  const parts = lastActiveDate.split('-').map(Number)
  if (parts.length !== 3) return null
  const [y, m, d] = parts
  const end = new Date(y, m - 1, d + extraDays, 23, 59, 59, 999)
  return end.getTime()
}

function streakRemainingMs(lastActiveDate: string, streakDays: number): number {
  if (streakDays <= 0 || !lastActiveDate) return 0
  const deadline = endOfLocalDayMs(lastActiveDate, 1)
  if (deadline === null) return 0
  return Math.max(0, deadline - Date.now())
}

export async function runStreakReminders(): Promise<{ sent: number; scanned: number }> {
  initAdmin()
  const db = getFirestore()
  const messaging = getMessaging()
  const today = localDateISO()

  let sent = 0
  let scanned = 0
  let last: QueryDocumentSnapshot | undefined

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let q = db.collection('profiles').orderBy('__name__').limit(100)
    if (last) q = q.startAfter(last)
    const snap = await q.get()
    if (snap.empty) break

    for (const doc of snap.docs) {
      scanned += 1
      const data = doc.data()
      const streakDays = Number(data.streakDays) || 0
      const lastActiveDate = (data.lastActiveDate as string) || ''
      if (streakDays < 1 || !lastActiveDate) continue

      const remaining = streakRemainingMs(lastActiveDate, streakDays)
      if (remaining <= 0) continue
      if (remaining > THREE_HOURS_MS + WINDOW_MS / 2) continue
      if (remaining < THREE_HOURS_MS - WINDOW_MS / 2) continue

      const pushSnap = await db.doc(`profiles/${doc.id}/private/push`).get()
      if (!pushSnap.exists) continue
      const push = pushSnap.data()!
      if (push.enabled === false) continue
      const token = push.fcmToken as string | undefined
      if (!token) continue
      if (push.lastStreakReminderDate === today) continue

      await messaging.send({
        token,
        notification: {
          title: 'Streak ending soon',
          body: `Your ${streakDays}-day streak ends in about 3 hours. Open AceIGCSE to keep it going.`,
        },
        data: { type: 'streak_reminder', streakDays: String(streakDays) },
      })

      await pushSnap.ref.set({ lastStreakReminderDate: today }, { merge: true })
      sent += 1
    }

    last = snap.docs[snap.docs.length - 1]
    if (snap.size < 100) break
  }

  return { sent, scanned }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const secret = process.env.CRON_SECRET
  const auth = req.headers.authorization
  if (!secret || auth !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const result = await runStreakReminders()
    res.status(200).json(result)
  } catch (err) {
    console.error('streak reminders failed', err)
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed' })
  }
}
