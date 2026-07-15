import { db } from '@/lib/firebase'
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { CloudProfile } from './socialApi'
import { docToProfile, patchPublicProfile } from './socialApi'
import { generateFriendCode, isValidFriendCode } from './profileTypes'

export interface FriendRequest {
  id: string
  fromUid: string
  toUid: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export type FriendshipStatus = 'self' | 'friends' | 'pending_sent' | 'pending_received' | 'none'

function normalizeFriendCode(raw: string): string {
  return raw.trim().toUpperCase()
}

async function syncFriendCodeIndex(userId: string, code: string, displayName?: string | null): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'friendCodes', code), { userId, displayName: displayName ?? 'Student' }, { merge: true })
}

export async function ensureFriendCode(userId: string): Promise<string> {
  if (!db) throw new Error('Firebase is not configured')
  const ref = doc(db, 'profiles', userId)
  const snap = await getDoc(ref)
  const existing = snap.data()?.friendCode as string | undefined
  const displayName = (snap.data()?.displayName as string | undefined) ?? null
  if (existing) {
    await syncFriendCodeIndex(userId, existing, displayName)
    return existing
  }
  const code = generateFriendCode()
  await patchPublicProfile(userId, { friendCode: code })
  await syncFriendCodeIndex(userId, code, displayName)
  return code
}

/** Repair friendIds from accepted requests (fixes one-sided friendships from before rules fix). */
export async function reconcileFriendIds(userId: string): Promise<void> {
  if (!db) return
  const [asSender, asReceiver] = await Promise.all([
    getDocs(
      query(collection(db, 'friendRequests'), where('fromUid', '==', userId), where('status', '==', 'accepted'), limit(50)),
    ),
    getDocs(
      query(collection(db, 'friendRequests'), where('toUid', '==', userId), where('status', '==', 'accepted'), limit(50)),
    ),
  ])
  const profile = await getDoc(doc(db, 'profiles', userId))
  const friendIds = new Set((profile.data()?.friendIds as string[]) ?? [])
  for (const d of asSender.docs) friendIds.add(d.data().toUid as string)
  for (const d of asReceiver.docs) friendIds.add(d.data().fromUid as string)
  if (friendIds.size === 0) return
  await patchPublicProfile(userId, { friendIds: [...friendIds] })
}

export async function getFriendshipStatus(fromUid: string, toUid: string): Promise<FriendshipStatus> {
  if (!db) return 'none'
  if (fromUid === toUid) return 'self'

  const profile = await getDoc(doc(db, 'profiles', fromUid))
  const friendIds = (profile.data()?.friendIds as string[]) ?? []
  if (friendIds.includes(toUid)) return 'friends'

  const [sent, received] = await Promise.all([
    getDocs(
      query(
        collection(db, 'friendRequests'),
        where('fromUid', '==', fromUid),
        where('toUid', '==', toUid),
        where('status', '==', 'pending'),
        limit(1),
      ),
    ),
    getDocs(
      query(
        collection(db, 'friendRequests'),
        where('fromUid', '==', toUid),
        where('toUid', '==', fromUid),
        where('status', '==', 'pending'),
        limit(1),
      ),
    ),
  ])
  if (!sent.empty) return 'pending_sent'
  if (!received.empty) return 'pending_received'
  return 'none'
}

export async function sendFriendRequest(fromUid: string, toUid: string): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  if (fromUid === toUid) throw new Error('Cannot add yourself')

  const profile = await getDoc(doc(db, 'profiles', fromUid))
  const friendIds = (profile.data()?.friendIds as string[]) ?? []
  if (friendIds.includes(toUid)) throw new Error('Already friends')

  const existing = await getDocs(
    query(
      collection(db, 'friendRequests'),
      where('fromUid', '==', fromUid),
      where('toUid', '==', toUid),
      where('status', '==', 'pending'),
      limit(1),
    ),
  )
  if (!existing.empty) throw new Error('Request already sent')

  await setDoc(doc(collection(db, 'friendRequests')), {
    fromUid,
    toUid,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

async function resolveUidFromFriendCode(code: string): Promise<string | null> {
  if (!db) return null
  const codeRef = doc(db, 'friendCodes', code)
  const codeSnap = await getDoc(codeRef)
  if (codeSnap.exists()) return codeSnap.data().userId as string

  const snap = await getDocs(query(collection(db, 'profiles'), where('friendCode', '==', code), limit(1)))
  if (snap.empty) return null
  const uid = snap.docs[0].id
  const displayName = snap.docs[0].data().displayName as string | undefined
  await syncFriendCodeIndex(uid, code, displayName)
  return uid
}

export async function sendFriendRequestByCode(fromUid: string, rawCode: string): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  const code = normalizeFriendCode(rawCode)
  if (!isValidFriendCode(code)) {
    throw new Error('Enter a valid friend code (e.g. FRD-ABC123).')
  }
  const toUid = await resolveUidFromFriendCode(code)
  if (!toUid) throw new Error('No student found with that friend code')
  await sendFriendRequest(fromUid, toUid)
}

export async function respondFriendRequest(
  requestId: string,
  userId: string,
  accept: boolean,
): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  const ref = doc(db, 'friendRequests', requestId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Request not found')
  const data = snap.data()
  if (data.toUid !== userId) throw new Error('Not your request')

  await updateDoc(ref, { status: accept ? 'accepted' : 'declined' })
  if (accept) {
    const fromUid = data.fromUid as string
    const toUid = data.toUid as string
    // Other profile: rules allow friendIds-only sync. Own profile: strip legacy secrets.
    await setDoc(doc(db, 'profiles', fromUid), { friendIds: arrayUnion(toUid) }, { merge: true })
    await patchPublicProfile(toUid, { friendIds: arrayUnion(fromUid) })
  }
}

export async function fetchPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
  if (!db) return []
  const snap = await getDocs(
    query(collection(db, 'friendRequests'), where('toUid', '==', userId), where('status', '==', 'pending'), limit(20)),
  )
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      fromUid: data.fromUid as string,
      toUid: data.toUid as string,
      status: 'pending' as const,
      createdAt:
        (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }
  })
}

export async function fetchFriendProfiles(userId: string): Promise<CloudProfile[]> {
  if (!db) return []
  const firestore = db
  await reconcileFriendIds(userId)
  const snap = await getDoc(doc(firestore, 'profiles', userId))
  const friendIds = (snap.data()?.friendIds as string[]) ?? []
  if (friendIds.length === 0) return []

  const profiles = await Promise.all(friendIds.map((id) => getDoc(doc(firestore, 'profiles', id))))
  return profiles
    .filter((p) => p.exists())
    .map((p) => {
      const row = docToProfile(p.id, p.data()!)
      return { ...row, email: null, progress: {}, activeDates: [] }
    })
}

export async function removeFriend(userId: string, friendId: string): Promise<void> {
  if (!db) return
  await patchPublicProfile(userId, { friendIds: arrayRemove(friendId) })
  await setDoc(doc(db, 'profiles', friendId), { friendIds: arrayRemove(userId) }, { merge: true })
}
