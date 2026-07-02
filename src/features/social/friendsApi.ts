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
import { docToProfile } from './socialApi'
import { generateFriendCode } from './profileTypes'

export interface FriendRequest {
  id: string
  fromUid: string
  toUid: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export async function ensureFriendCode(userId: string): Promise<string> {
  if (!db) throw new Error('Firebase is not configured')
  const ref = doc(db, 'profiles', userId)
  const snap = await getDoc(ref)
  const existing = snap.data()?.friendCode as string | undefined
  if (existing) return existing
  const code = generateFriendCode()
  await setDoc(ref, { friendCode: code }, { merge: true })
  return code
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

export async function sendFriendRequestByCode(fromUid: string, rawCode: string): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  const code = rawCode.trim().toUpperCase()
  const snap = await getDocs(query(collection(db, 'profiles'), where('friendCode', '==', code), limit(1)))
  if (snap.empty) throw new Error('No student found with that friend code')
  await sendFriendRequest(fromUid, snap.docs[0].id)
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
    await setDoc(doc(db, 'profiles', fromUid), { friendIds: arrayUnion(toUid) }, { merge: true })
    await setDoc(doc(db, 'profiles', toUid), { friendIds: arrayUnion(fromUid) }, { merge: true })
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
  const snap = await getDoc(doc(firestore, 'profiles', userId))
  const friendIds = (snap.data()?.friendIds as string[]) ?? []
  if (friendIds.length === 0) return []

  const profiles = await Promise.all(friendIds.map((id) => getDoc(doc(firestore, 'profiles', id))))
  return profiles.filter((p) => p.exists()).map((p) => docToProfile(p.id, p.data()!))
}

export async function removeFriend(userId: string, friendId: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'profiles', userId), { friendIds: arrayRemove(friendId) }, { merge: true })
  await setDoc(doc(db, 'profiles', friendId), { friendIds: arrayRemove(userId) }, { merge: true })
}
