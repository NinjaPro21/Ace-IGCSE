import { db } from '@/lib/firebase'
import { localDateISO, localDateISODaysAgo } from '@/lib/localDate'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

function pairId(a: string, b: string): string {
  return [a, b].sort().join('_')
}

export interface BuddyStreak {
  streakDays: number
  lastBothActiveDate: string
}

export async function touchBuddyStreak(uidA: string, uidB: string): Promise<BuddyStreak | null> {
  if (!db) return null
  const id = pairId(uidA, uidB)
  const ref = doc(db, 'buddyStreaks', id)
  const snap = await getDoc(ref)
  const today = localDateISO()

  if (!snap.exists()) {
    const streak = { uidA, uidB, streakDays: 1, lastBothActiveDate: today, updatedAt: serverTimestamp() }
    await setDoc(ref, streak)
    return { streakDays: 1, lastBothActiveDate: today }
  }

  const data = snap.data()
  const last = data.lastBothActiveDate as string
  if (last === today) {
    return { streakDays: data.streakDays as number, lastBothActiveDate: last }
  }

  const yIso = localDateISODaysAgo(1)
  const nextStreak = last === yIso ? (data.streakDays as number) + 1 : 1

  await setDoc(
    ref,
    { streakDays: nextStreak, lastBothActiveDate: today, updatedAt: serverTimestamp() },
    { merge: true },
  )
  return { streakDays: nextStreak, lastBothActiveDate: today }
}

/** Once per local day per pair — avoids duplicate writes on re-renders. */
const touchedToday = new Set<string>()

/** Bump buddy streaks after meaningful study (both users active today). */
export async function touchBuddyStreaksForFriends(
  uid: string,
  friendIds: string[],
): Promise<void> {
  if (!db || friendIds.length === 0) return
  const today = localDateISO()
  await Promise.all(
    friendIds.map(async (friendId) => {
      const key = `${pairId(uid, friendId)}:${today}`
      if (touchedToday.has(key)) return
      touchedToday.add(key)
      await touchBuddyStreak(uid, friendId)
    }),
  )
}

export async function fetchBuddyStreak(uidA: string, uidB: string): Promise<BuddyStreak | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'buddyStreaks', pairId(uidA, uidB)))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    streakDays: data.streakDays as number,
    lastBothActiveDate: data.lastBothActiveDate as string,
  }
}
