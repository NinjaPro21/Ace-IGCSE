import { db } from '@/lib/firebase'
import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore'

export type PresenceStatus = 'online' | 'studying' | 'in_quiz' | 'offline'

export interface PresenceDoc {
  status: PresenceStatus
  currentTopicId?: string
  currentChapterId?: string
  subjectId?: string
  topicTitle?: string
  updatedAt?: string
}

export async function updatePresence(userId: string, data: Omit<PresenceDoc, 'updatedAt'>): Promise<void> {
  if (!db) return
  await setDoc(
    doc(db, 'presence', userId),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function clearPresence(userId: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'presence', userId), { status: 'offline', updatedAt: serverTimestamp() }, { merge: true })
}

export function subscribePresence(userId: string, cb: (p: PresenceDoc | null) => void): Unsubscribe {
  if (!db) {
    cb(null)
    return () => {}
  }
  return onSnapshot(doc(db, 'presence', userId), (snap) => {
    if (!snap.exists()) {
      cb(null)
      return
    }
    const data = snap.data()
    cb({
      status: (data.status as PresenceStatus) ?? 'offline',
      currentTopicId: data.currentTopicId as string | undefined,
      currentChapterId: data.currentChapterId as string | undefined,
      subjectId: data.subjectId as string | undefined,
      topicTitle: data.topicTitle as string | undefined,
      updatedAt:
        (data.updatedAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ??
        (typeof data.updatedAt === 'string' ? data.updatedAt : undefined),
    })
  })
}

export function isPresenceStale(p: PresenceDoc | null, maxAgeMs = 120_000): boolean {
  if (!p?.updatedAt) return true
  return Date.now() - new Date(p.updatedAt).getTime() > maxAgeMs
}
