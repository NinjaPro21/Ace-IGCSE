import { recordPlatformSync } from '@/features/analytics/analyticsApi'
import type { UserProgress } from '@/features/mastery/MasteryEngine'
import { getGlobalLevel, NOTES_MIN_SECONDS } from '@/features/mastery/levelSystem'
import { db } from '@/lib/firebase'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import type { AuthUser, LeaderboardEntry, SchoolGroup } from './socialTypes'
import { generateInviteCode, normalizeInviteCode, type GroupType } from './socialTypes'

/** Firestore rejects `undefined` anywhere in a document — strip recursively before writes. */
function stripUndefined<T>(value: T): T {
  if (value === undefined || value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((item) => stripUndefined(item)) as T

  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (val !== undefined) out[key] = stripUndefined(val)
  }
  return out as T
}

function mergeChapterProgress(
  local: UserProgress['chapters'][string],
  remote: UserProgress['chapters'][string] | undefined,
): UserProgress['chapters'][string] {
  const easyScore = Math.max(local.easyScore ?? 0, remote?.easyScore ?? 0)
  const mediumScore = Math.max(local.mediumScore ?? 0, remote?.mediumScore ?? 0)
  const hardScore = Math.max(local.hardScore ?? 0, remote?.hardScore ?? 0)

  return {
    quizLevel: Math.max(local.quizLevel ?? 0, remote?.quizLevel ?? 0) as UserProgress['chapters'][string]['quizLevel'],
    ...(easyScore > 0 ? { easyScore } : {}),
    ...(mediumScore > 0 ? { mediumScore } : {}),
    ...(hardScore > 0 ? { hardScore } : {}),
    ...(local.pypComplete || remote?.pypComplete ? { pypComplete: true } : {}),
    ...(local.popoutSeen || remote?.popoutSeen ? { popoutSeen: true } : {}),
  }
}

export interface CloudProfile {
  id: string
  email: string | null
  displayName: string | null
  avatarUrl: string | null
  xp: number
  streakDays: number
  longestStreak: number
  lastActiveDate: string | null
  activeDates: string[]
  progress: Partial<UserProgress>
  schoolId: string | null
}

function docToProfile(id: string, data: Record<string, unknown>): CloudProfile {
  const progress = (data.progress as Partial<UserProgress>) ?? {}
  return {
    id,
    email: (data.email as string) ?? null,
    displayName: (data.displayName as string) ?? null,
    avatarUrl: (data.avatarUrl as string) ?? null,
    xp: (data.xp as number) ?? 0,
    streakDays: (data.streakDays as number) ?? 0,
    longestStreak: (data.longestStreak as number) ?? 0,
    lastActiveDate: (data.lastActiveDate as string) ?? null,
    activeDates: (data.activeDates as string[]) ?? [],
    progress,
    schoolId: (data.schoolId as string) ?? null,
  }
}

export function rowToAuthUser(row: CloudProfile): AuthUser {
  return {
    id: row.id,
    email: row.email ?? '',
    displayName: row.displayName ?? 'Student',
    avatarUrl: row.avatarUrl ?? undefined,
  }
}

export function cloudRowToUserProgress(row: CloudProfile): UserProgress {
  const embedded = row.progress ?? {}
  return {
    xp: Math.max(row.xp ?? 0, embedded.xp ?? 0),
    streakDays: Math.max(row.streakDays ?? 0, embedded.streakDays ?? 0),
    longestStreak: Math.max(row.longestStreak ?? 0, embedded.longestStreak ?? 0),
    lastActiveDate: embedded.lastActiveDate ?? row.lastActiveDate ?? '',
    activeDates: embedded.activeDates ?? row.activeDates ?? [],
    displayName: embedded.displayName ?? row.displayName ?? '',
    topics: embedded.topics ?? {},
    chapters: embedded.chapters ?? {},
    chapterStats: embedded.chapterStats ?? {},
  }
}

export function mergeUserProgress(local: UserProgress, remote: UserProgress): UserProgress {
  const topics = { ...remote.topics }
  for (const [id, t] of Object.entries(local.topics)) {
    const remoteT = remote.topics[id]
    const timeSpentSec = Math.max(t.timeSpentSec ?? 0, remoteT?.timeSpentSec ?? 0)
    const localComplete = Boolean(t.notesRead) && (t.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS
    const remoteComplete = Boolean(remoteT?.notesRead) && (remoteT?.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS
    topics[id] = {
      notesRead: (localComplete || remoteComplete) && timeSpentSec >= NOTES_MIN_SECONDS,
      timeSpentSec,
    }
  }

  const chapters = { ...remote.chapters }
  for (const [id, ch] of Object.entries(local.chapters)) {
    chapters[id] = mergeChapterProgress(ch, remote.chapters[id])
  }

  const activeDates = [...new Set([...(local.activeDates ?? []), ...(remote.activeDates ?? [])])].slice(-90)

  const chapterStats = { ...remote.chapterStats }
  for (const [id, s] of Object.entries(local.chapterStats ?? {})) {
    const remoteS = remote.chapterStats?.[id]
    chapterStats[id] = {
      timeSpentSec: Math.max(s.timeSpentSec ?? 0, remoteS?.timeSpentSec ?? 0),
      quizAttempts: Math.max(s.quizAttempts ?? 0, remoteS?.quizAttempts ?? 0),
      quizFails: Math.max(s.quizFails ?? 0, remoteS?.quizFails ?? 0),
      visits: Math.max(s.visits ?? 0, remoteS?.visits ?? 0),
      lastVisited:
        (s.lastVisited ?? '') >= (remoteS?.lastVisited ?? '')
          ? s.lastVisited ?? ''
          : remoteS?.lastVisited ?? '',
    }
  }

  return {
    xp: Math.max(local.xp, remote.xp),
    streakDays: Math.max(local.streakDays, remote.streakDays),
    longestStreak: Math.max(local.longestStreak, remote.longestStreak),
    lastActiveDate: local.lastActiveDate >= remote.lastActiveDate ? local.lastActiveDate : remote.lastActiveDate,
    activeDates,
    displayName: remote.displayName || local.displayName,
    topics,
    chapters,
    chapterStats,
  }
}

export async function fetchProfile(userId: string): Promise<CloudProfile | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'profiles', userId))
  if (!snap.exists()) return null
  return docToProfile(snap.id, snap.data())
}

export async function upsertProfile(
  userId: string,
  progress: UserProgress,
  meta?: { email?: string; displayName?: string; avatarUrl?: string },
): Promise<void> {
  if (!db) return

  const snapshots = await recordPlatformSync(userId, progress)

  await setDoc(
    doc(db, 'profiles', userId),
    stripUndefined({
      email: meta?.email ?? null,
      displayName: progress.displayName || meta?.displayName || null,
      avatarUrl: meta?.avatarUrl ?? null,
      xp: progress.xp,
      streakDays: progress.streakDays,
      longestStreak: progress.longestStreak,
      lastActiveDate: progress.lastActiveDate || null,
      activeDates: progress.activeDates,
      syncedStudySec: snapshots.syncedStudySec,
      syncedQuizAttempts: snapshots.syncedQuizAttempts,
      progress: {
        topics: progress.topics,
        chapters: progress.chapters,
        chapterStats: progress.chapterStats,
        displayName: progress.displayName,
        lastActiveDate: progress.lastActiveDate,
        activeDates: progress.activeDates,
      },
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  )
}

export async function fetchSchool(schoolId: string): Promise<SchoolGroup | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'schools', schoolId))
  if (!snap.exists()) return null
  const data = snap.data()

  const membersSnap = await getDocs(
    query(collection(db, 'profiles'), where('schoolId', '==', schoolId)),
  )

  return {
    id: snap.id,
    name: data.name as string,
    type: data.type as GroupType,
    inviteCode: data.inviteCode as string,
    memberCount: membersSnap.size,
  }
}

export async function createSchool(
  userId: string,
  name: string,
  type: GroupType,
  inviteCode?: string,
): Promise<SchoolGroup> {
  if (!db) throw new Error('Firebase is not configured')

  const code = inviteCode ?? generateInviteCode(type)
  const ref = await addDoc(collection(db, 'schools'), {
    name: name.trim(),
    type,
    inviteCode: code,
    createdBy: userId,
    createdAt: serverTimestamp(),
  })

  await joinSchool(userId, ref.id)
  const group = await fetchSchool(ref.id)
  if (!group) throw new Error('Failed to load group')
  return group
}

export async function joinSchoolByCode(userId: string, rawCode: string): Promise<SchoolGroup> {
  if (!db) throw new Error('Firebase is not configured')
  const inviteCode = normalizeInviteCode(rawCode)

  const q = query(collection(db, 'schools'), where('inviteCode', '==', inviteCode), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('No school or clan found with that invite code')

  const schoolDoc = snap.docs[0]
  await joinSchool(userId, schoolDoc.id)
  const group = await fetchSchool(schoolDoc.id)
  if (!group) throw new Error('Failed to load group')
  return group
}

async function joinSchool(userId: string, schoolId: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'profiles', userId), { schoolId }, { merge: true })
}

export async function leaveSchool(userId: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'profiles', userId), { schoolId: null }, { merge: true })
}

export async function fetchLeaderboard(
  schoolId: string,
  currentUserId: string,
): Promise<LeaderboardEntry[]> {
  if (!db) return []

  const q = query(
    collection(db, 'profiles'),
    where('schoolId', '==', schoolId),
    orderBy('xp', 'desc'),
    limit(25),
  )
  const snap = await getDocs(q)

  return snap.docs.map((d, index) => {
    const row = d.data()
    const xp = (row.xp as number) ?? 0
    return {
      userId: d.id,
      displayName: (row.displayName as string) ?? `Student ${index + 1}`,
      avatarUrl: (row.avatarUrl as string) ?? undefined,
      xp,
      streakDays: (row.streakDays as number) ?? 0,
      level: getGlobalLevel(xp),
      isYou: d.id === currentUserId,
    }
  })
}

export async function fetchSchoolMemberProfiles(schoolId: string): Promise<CloudProfile[]> {
  if (!db) return []

  const snap = await getDocs(query(collection(db, 'profiles'), where('schoolId', '==', schoolId)))
  return snap.docs.map((d) => docToProfile(d.id, d.data()))
}
