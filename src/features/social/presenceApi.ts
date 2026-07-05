import { db } from '@/lib/firebase'
import { deleteField, doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore'

export type PresenceStatus = 'online' | 'studying' | 'in_quiz' | 'offline'

export interface PresenceDoc {
  status: PresenceStatus
  currentTopicId?: string
  currentChapterId?: string
  subjectId?: string
  topicTitle?: string
  updatedAt?: string
  updatedAtClient?: string
}

const PRESENCE_CONTEXT_KEYS = [
  'subjectId',
  'currentChapterId',
  'currentTopicId',
  'topicTitle',
] as const satisfies ReadonlyArray<keyof PresenceDoc>

function presenceWritePayload(data: Omit<PresenceDoc, 'updatedAt' | 'updatedAtClient'>): Record<string, unknown> {
  const payload: Record<string, unknown> = { status: data.status }
  for (const key of PRESENCE_CONTEXT_KEYS) {
    const value = data[key]
    if (value !== undefined) {
      payload[key] = value
    } else if (data.status === 'online') {
      // merge:true keeps old lesson fields — clear them when back to browsing
      payload[key] = deleteField()
    }
  }
  return payload
}

export async function updatePresence(userId: string, data: Omit<PresenceDoc, 'updatedAt' | 'updatedAtClient'>): Promise<void> {
  if (!db) return
  await setDoc(
    doc(db, 'presence', userId),
    {
      ...presenceWritePayload(data),
      updatedAt: serverTimestamp(),
      updatedAtClient: new Date().toISOString(),
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
      updatedAtClient: typeof data.updatedAtClient === 'string' ? data.updatedAtClient : undefined,
    })
  })
}

export function isPresenceStale(p: PresenceDoc | null, maxAgeMs = 120_000): boolean {
  const ts = p?.updatedAtClient ?? p?.updatedAt
  if (!ts) return p?.status !== 'online' && p?.status !== 'studying' && p?.status !== 'in_quiz'
  return Date.now() - new Date(ts).getTime() > maxAgeMs
}

/** True when the user is actively on the site (browsing, studying, or in a quiz). */
export function isUserOnline(p: PresenceDoc | null): boolean {
  if (!p || p.status === 'offline') return false
  return !isPresenceStale(p)
}

export function presenceActivityLabel(p: PresenceDoc | null): string {
  if (!isUserOnline(p)) return 'Offline'
  switch (p!.status) {
    case 'studying':
      return p!.topicTitle ? `Studying · ${p!.topicTitle}` : 'Studying'
    case 'in_quiz':
      return 'In a quiz'
    case 'online':
    default:
      return 'Online'
  }
}
