import { db } from '@/lib/firebase'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { Difficulty } from '@/lib/contentTypes'

export type DuelStatus = 'pending' | 'active' | 'complete' | 'expired' | 'declined'

export interface Duel {
  id: string
  challengerUid: string
  opponentUid: string
  topicId?: string
  chapterId?: string
  difficulty: Difficulty
  challengerScore?: number
  opponentScore?: number
  challengerTimeSec?: number
  opponentTimeSec?: number
  status: DuelStatus
  winnerUid?: string
  createdAt: string
  expiresAt: string
}

const DUEL_HOURS = 24

export async function createDuel(
  challengerUid: string,
  opponentUid: string,
  opts: { topicId?: string; chapterId?: string; difficulty: Difficulty },
): Promise<string> {
  if (!db) throw new Error('Firebase is not configured')
  const expiresAt = new Date(Date.now() + DUEL_HOURS * 3600_000).toISOString()
  const ref = await addDoc(collection(db, 'duels'), {
    challengerUid,
    opponentUid,
    topicId: opts.topicId ?? null,
    chapterId: opts.chapterId ?? null,
    difficulty: opts.difficulty,
    status: 'pending',
    createdAt: serverTimestamp(),
    expiresAt,
  })
  return ref.id
}

export async function respondDuel(duelId: string, userId: string, accept: boolean): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  const ref = doc(db, 'duels', duelId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Duel not found')
  const data = snap.data()
  if (data.opponentUid !== userId) throw new Error('Not your duel')
  if (data.status !== 'pending') throw new Error('Duel already handled')
  await updateDoc(ref, { status: accept ? 'active' : 'declined' })
}

export async function submitDuelScore(
  duelId: string,
  userId: string,
  score: number,
  timeSec: number,
): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  const ref = doc(db, 'duels', duelId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Duel not found')
  const data = snap.data()
  if (data.status !== 'active' && data.status !== 'pending') throw new Error('Duel not active')

  const isChallenger = data.challengerUid === userId
  const isOpponent = data.opponentUid === userId
  if (!isChallenger && !isOpponent) throw new Error('Not in this duel')

  if (isChallenger) {
    if (data.opponentScore != null) {
      const cScore = score
      const oScore = data.opponentScore as number
      const cTime = timeSec
      const oTime = data.opponentTimeSec as number
      let winnerUid = data.challengerUid as string
      if (oScore > cScore) winnerUid = data.opponentUid as string
      else if (oScore === cScore && oTime < cTime) winnerUid = data.opponentUid as string
      await updateDoc(ref, {
        challengerScore: score,
        challengerTimeSec: timeSec,
        status: 'complete',
        winnerUid,
      })
    } else {
      await updateDoc(ref, {
        challengerScore: score,
        challengerTimeSec: timeSec,
        status: 'active',
      })
    }
  } else {
    if (data.challengerScore != null) {
      const cScore = data.challengerScore as number
      const oScore = score
      const cTime = data.challengerTimeSec as number
      const oTime = timeSec
      let winnerUid = data.challengerUid as string
      if (oScore > cScore) winnerUid = data.opponentUid as string
      else if (oScore === cScore && oTime < cTime) winnerUid = data.opponentUid as string
      await updateDoc(ref, {
        opponentScore: score,
        opponentTimeSec: timeSec,
        status: 'complete',
        winnerUid,
      })
    } else {
      await updateDoc(ref, {
        opponentScore: score,
        opponentTimeSec: timeSec,
        status: 'active',
      })
    }
  }
}

export async function fetchUserDuels(userId: string): Promise<Duel[]> {
  if (!db) return []

  const [asChallenger, asOpponent] = await Promise.all([
    getDocs(query(collection(db, 'duels'), where('challengerUid', '==', userId), limit(15))),
    getDocs(query(collection(db, 'duels'), where('opponentUid', '==', userId), limit(15))),
  ])

  const map = new Map<string, Duel>()
  for (const d of [...asChallenger.docs, ...asOpponent.docs]) {
    const data = d.data()
    map.set(d.id, {
      id: d.id,
      challengerUid: data.challengerUid as string,
      opponentUid: data.opponentUid as string,
      topicId: (data.topicId as string) || undefined,
      chapterId: (data.chapterId as string) || undefined,
      difficulty: data.difficulty as Difficulty,
      challengerScore: data.challengerScore as number | undefined,
      opponentScore: data.opponentScore as number | undefined,
      challengerTimeSec: data.challengerTimeSec as number | undefined,
      opponentTimeSec: data.opponentTimeSec as number | undefined,
      status: data.status as DuelStatus,
      winnerUid: data.winnerUid as string | undefined,
      createdAt:
        (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      expiresAt: (data.expiresAt as string) ?? new Date().toISOString(),
    })
  }

  return [...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function fetchDuel(duelId: string): Promise<Duel | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'duels', duelId))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    challengerUid: data.challengerUid as string,
    opponentUid: data.opponentUid as string,
    topicId: (data.topicId as string) || undefined,
    chapterId: (data.chapterId as string) || undefined,
    difficulty: data.difficulty as Difficulty,
    challengerScore: data.challengerScore as number | undefined,
    opponentScore: data.opponentScore as number | undefined,
    challengerTimeSec: data.challengerTimeSec as number | undefined,
    opponentTimeSec: data.opponentTimeSec as number | undefined,
    status: data.status as DuelStatus,
    winnerUid: data.winnerUid as string | undefined,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    expiresAt: (data.expiresAt as string) ?? new Date().toISOString(),
  }
}
