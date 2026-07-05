import { recordPlatformSync } from '@/features/analytics/analyticsApi'
import type { UserProgress } from '@/features/mastery/MasteryEngine'
import { getGlobalLevel, NOTES_MIN_SECONDS } from '@/features/mastery/levelSystem'
import { db } from '@/lib/firebase'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
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
import { MAX_CLANS, generateInviteCode, normalizeInviteCode, type GroupType } from './socialTypes'
import {
  sumXpInPeriod,
  type LeaderboardMedalTier,
  type LeaderboardMetric,
  type LeaderboardPeriod,
} from './leaderboardUtils'
import { normalizeProfileTheme, type ProfileTheme } from './profileTypes'

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
  lastActiveAt: string | null
  activeDates: string[]
  progress: Partial<UserProgress>
  schoolId: string | null
  clanIds: string[]
  createdAt: string | null
  bio?: string | null
  examYear?: number | null
  subjects?: string[]
  privacy?: 'public' | 'friends' | 'school'
  showOnLeaderboard?: boolean
  dailyGoalMin?: number | null
  achievementIds?: string[]
  friendIds?: string[]
  friendCode?: string | null
  showStudyActivity?: boolean
  profileTheme?: ProfileTheme
  showcaseAchievementIds?: string[]
  showcaseMedalTiers?: LeaderboardMedalTier[]
}

export function docToProfile(id: string, data: Record<string, unknown>): CloudProfile {
  const progress = (data.progress as Partial<UserProgress>) ?? {}
  const clanIds = (data.clanIds as string[]) ?? []
  return {
    id,
    email: (data.email as string) ?? null,
    displayName: (data.displayName as string) ?? null,
    avatarUrl: (data.avatarUrl as string) ?? null,
    xp: (data.xp as number) ?? 0,
    streakDays: (data.streakDays as number) ?? 0,
    longestStreak: (data.longestStreak as number) ?? 0,
    lastActiveDate: (data.lastActiveDate as string) ?? null,
    lastActiveAt:
      (data.lastActiveAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ??
      (typeof data.lastActiveAt === 'string' ? data.lastActiveAt : null),
    activeDates: (data.activeDates as string[]) ?? [],
    progress,
    schoolId: (data.schoolId as string) ?? null,
    clanIds,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ??
      (typeof data.createdAt === 'string' ? data.createdAt : null),
    bio: (data.bio as string) ?? null,
    examYear: (data.examYear as number) ?? null,
    subjects: (data.subjects as string[]) ?? [],
    privacy: (data.privacy as CloudProfile['privacy']) ?? 'friends',
    showOnLeaderboard: data.showOnLeaderboard !== false,
    dailyGoalMin: (data.dailyGoalMin as number) ?? null,
    achievementIds: (data.achievementIds as string[]) ?? [],
    friendIds: (data.friendIds as string[]) ?? [],
    friendCode: (data.friendCode as string) ?? null,
    showStudyActivity: data.showStudyActivity !== false,
    profileTheme: normalizeProfileTheme(data.profileTheme as string | undefined),
    showcaseAchievementIds: (data.showcaseAchievementIds as string[]) ?? [],
    showcaseMedalTiers: (data.showcaseMedalTiers as LeaderboardMedalTier[]) ?? [],
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
    lastActiveAt: row.lastActiveAt ?? embedded.lastActiveAt ?? '',
    activeDates: embedded.activeDates ?? row.activeDates ?? [],
    displayName: embedded.displayName ?? row.displayName ?? '',
    topics: embedded.topics ?? {},
    chapters: embedded.chapters ?? {},
    chapterStats: embedded.chapterStats ?? {},
    conceptMisses: embedded.conceptMisses ?? {},
    quizAttempts: embedded.quizAttempts ?? [],
    xpByDate: mergeXpByDate(embedded.xpByDate, row.progress?.xpByDate),
    studySecByDate: embedded.studySecByDate ?? {},
    lastVisitedTopicId: embedded.lastVisitedTopicId,
    lastVisitedChapterId: embedded.lastVisitedChapterId,
    lastVisitedSubjectId: embedded.lastVisitedSubjectId,
    dailyGoalMin: embedded.dailyGoalMin,
    achievementIds: embedded.achievementIds ?? [],
    subjects: embedded.subjects ?? [],
    onboardingComplete: embedded.onboardingComplete,
    appTourComplete: embedded.appTourComplete,
  }
}

function mergeXpByDate(
  a?: Record<string, number>,
  b?: Record<string, number>,
): Record<string, number> {
  const merged: Record<string, number> = { ...b }
  for (const [date, xp] of Object.entries(a ?? {})) {
    merged[date] = Math.max(xp, merged[date] ?? 0)
  }
  const trimmed: Record<string, number> = {}
  for (const key of Object.keys(merged).sort().slice(-90)) {
    trimmed[key] = merged[key]
  }
  return trimmed
}

export function mergeUserProgress(
  local: UserProgress,
  remote: UserProgress,
  userId?: string,
): UserProgress {
  if (userId && local.ownerUserId && local.ownerUserId !== userId) {
    return { ...remote, ownerUserId: userId }
  }

  const topics = { ...remote.topics }
  for (const [id, t] of Object.entries(local.topics)) {
    const remoteT = remote.topics[id]
    const timeSpentSec = Math.max(t.timeSpentSec ?? 0, remoteT?.timeSpentSec ?? 0)
    const localComplete = Boolean(t.notesRead) && (t.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS
    const remoteComplete = Boolean(remoteT?.notesRead) && (remoteT?.timeSpentSec ?? 0) >= NOTES_MIN_SECONDS
    topics[id] = {
      notesRead: (localComplete || remoteComplete) && timeSpentSec >= NOTES_MIN_SECONDS,
      timeSpentSec,
      quizLevel: Math.max(
        t.quizLevel ?? 0,
        remoteT?.quizLevel ?? 0,
      ) as import('@/features/mastery/MasteryEngine').MasteryLevel,
      easyScore: Math.max(t.easyScore ?? 0, remoteT?.easyScore ?? 0),
      mediumScore: Math.max(t.mediumScore ?? 0, remoteT?.mediumScore ?? 0),
      hardScore: Math.max(t.hardScore ?? 0, remoteT?.hardScore ?? 0),
      pypComplete: Boolean(t.pypComplete || remoteT?.pypComplete),
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

  const xpByDate = mergeXpByDate(local.xpByDate, remote.xpByDate)
  const studySecByDate = mergeXpByDate(local.studySecByDate, remote.studySecByDate)

  const conceptMisses = { ...remote.conceptMisses }
  for (const [key, record] of Object.entries(local.conceptMisses ?? {})) {
    const remoteRecord = remote.conceptMisses?.[key]
    conceptMisses[key] = {
      ...record,
      missCount: Math.max(record.missCount, remoteRecord?.missCount ?? 0),
      lastAt:
        (record.lastAt ?? '') >= (remoteRecord?.lastAt ?? '')
          ? record.lastAt
          : remoteRecord?.lastAt ?? record.lastAt,
    }
  }

  const quizAttempts = [...(local.quizAttempts ?? []), ...(remote.quizAttempts ?? [])]
    .sort((a, b) => b.at.localeCompare(a.at))
    .filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i)
    .slice(0, 150)

  const lastActiveAt =
    !local.lastActiveAt
      ? remote.lastActiveAt ?? ''
      : !remote.lastActiveAt
        ? local.lastActiveAt
        : local.lastActiveAt >= remote.lastActiveAt
          ? local.lastActiveAt
          : remote.lastActiveAt

  return {
    xp: Math.max(local.xp, remote.xp),
    streakDays: Math.max(local.streakDays, remote.streakDays),
    longestStreak: Math.max(local.longestStreak, remote.longestStreak),
    lastActiveDate: local.lastActiveDate >= remote.lastActiveDate ? local.lastActiveDate : remote.lastActiveDate,
    lastActiveAt,
    activeDates,
    displayName: remote.displayName || local.displayName,
    topics,
    chapters,
    chapterStats,
    conceptMisses,
    quizAttempts,
    xpByDate,
    studySecByDate,
    lastVisitedTopicId: local.lastVisitedTopicId ?? remote.lastVisitedTopicId,
    lastVisitedChapterId: local.lastVisitedChapterId ?? remote.lastVisitedChapterId,
    lastVisitedSubjectId: local.lastVisitedSubjectId ?? remote.lastVisitedSubjectId,
    dailyGoalMin: local.dailyGoalMin ?? remote.dailyGoalMin,
    achievementIds: [...new Set([...(local.achievementIds ?? []), ...(remote.achievementIds ?? [])])],
    subjects: local.subjects?.length ? local.subjects : remote.subjects,
    onboardingComplete: Boolean(local.onboardingComplete || remote.onboardingComplete),
    appTourComplete: Boolean(local.appTourComplete || remote.appTourComplete),
    ownerUserId: userId ?? local.ownerUserId ?? remote.ownerUserId,
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

  const profileRef = doc(db, 'profiles', userId)
  const existingSnap = await getDoc(profileRef)
  const snapshots = await recordPlatformSync(userId, progress)
  const showOnLeaderboard =
    existingSnap.exists() && existingSnap.data().showOnLeaderboard === false ? false : true

  await setDoc(
    profileRef,
    stripUndefined({
      email: meta?.email ?? null,
      displayName: progress.displayName || meta?.displayName || null,
      avatarUrl: meta?.avatarUrl ?? null,
      xp: progress.xp,
      streakDays: progress.streakDays,
      longestStreak: progress.longestStreak,
      lastActiveDate: progress.lastActiveDate || null,
      lastActiveAt: serverTimestamp(),
      activeDates: progress.activeDates,
      syncedStudySec: snapshots.syncedStudySec,
      syncedQuizAttempts: snapshots.syncedQuizAttempts,
      progress: {
        topics: progress.topics,
        chapters: progress.chapters,
        chapterStats: progress.chapterStats,
        conceptMisses: progress.conceptMisses,
        quizAttempts: progress.quizAttempts,
        displayName: progress.displayName,
        lastActiveDate: progress.lastActiveDate,
        activeDates: progress.activeDates,
        xpByDate: progress.xpByDate,
        studySecByDate: progress.studySecByDate,
        lastVisitedTopicId: progress.lastVisitedTopicId,
        lastVisitedChapterId: progress.lastVisitedChapterId,
        lastVisitedSubjectId: progress.lastVisitedSubjectId,
        dailyGoalMin: progress.dailyGoalMin,
        achievementIds: progress.achievementIds,
        subjects: progress.subjects,
        onboardingComplete: progress.onboardingComplete,
        appTourComplete: progress.appTourComplete,
      },
      dailyGoalMin: progress.dailyGoalMin ?? null,
      achievementIds: progress.achievementIds ?? [],
      subjects: progress.subjects ?? [],
      ...(!existingSnap.exists() ? { createdAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  )

  await setDoc(
    doc(db, 'leaderboard', userId),
    stripUndefined({
      displayName: progress.displayName || meta?.displayName || 'Student',
      avatarUrl: meta?.avatarUrl ?? null,
      xp: progress.xp,
      streakDays: progress.streakDays,
      longestStreak: progress.longestStreak,
      level: getGlobalLevel(progress.xp),
      showOnLeaderboard,
      xpByDate: progress.xpByDate ?? {},
      achievementIds: progress.achievementIds ?? [],
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  )
}

async function countGroupMembers(groupId: string, type: GroupType): Promise<number> {
  if (!db) return 0
  if (type === 'school') {
    const snap = await getDocs(query(collection(db, 'profiles'), where('schoolId', '==', groupId)))
    return snap.size
  }
  const snap = await getDocs(query(collection(db, 'profiles'), where('clanIds', 'array-contains', groupId)))
  return snap.size
}

function normalizeGroupName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Case-insensitive duplicate check within the same group type. */
export async function isGroupNameTaken(name: string, type: GroupType): Promise<boolean> {
  if (!db) return false
  const target = normalizeGroupName(name)
  const snap = await getDocs(query(collection(db, 'schools'), where('type', '==', type), limit(200)))
  return snap.docs.some((d) => normalizeGroupName(String(d.data().name ?? '')) === target)
}

export async function fetchGroup(groupId: string): Promise<SchoolGroup | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'schools', groupId))
  if (!snap.exists()) return null
  const data = snap.data()
  const type = data.type as GroupType
  return {
    id: snap.id,
    name: data.name as string,
    type,
    inviteCode: data.inviteCode as string,
    memberCount: await countGroupMembers(snap.id, type),
  }
}

/** @deprecated use fetchGroup */
export async function fetchSchool(schoolId: string): Promise<SchoolGroup | null> {
  return fetchGroup(schoolId)
}

export async function fetchPublicSchools(): Promise<SchoolGroup[]> {
  if (!db) return []
  const q = query(
    collection(db, 'schools'),
    where('type', '==', 'school'),
    orderBy('name'),
    limit(100),
  )
  const snap = await getDocs(q)
  const memberCounts = await Promise.all(
    snap.docs.map((d) => countGroupMembers(d.id, 'school')),
  )
  return snap.docs.map((d, i) => {
    const data = d.data()
    return {
      id: d.id,
      name: data.name as string,
      type: 'school' as const,
      inviteCode: data.inviteCode as string,
      memberCount: memberCounts[i],
    }
  }).reduce<SchoolGroup[]>((acc, school) => {
    const key = school.name.trim().toLowerCase()
    const existing = acc.find((s) => s.name.trim().toLowerCase() === key)
    if (!existing) {
      acc.push(school)
    } else if ((school.memberCount ?? 0) > (existing.memberCount ?? 0)) {
      const idx = acc.indexOf(existing)
      acc[idx] = school
    }
    return acc
  }, [])
}

export async function createGroup(
  userId: string,
  name: string,
  type: GroupType,
  inviteCode?: string,
): Promise<SchoolGroup> {
  if (!db) throw new Error('Firebase is not configured')

  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name is required')
  if (type === 'clan' && (trimmed.length < 3 || trimmed.length > 24)) {
    throw new Error('Clan name must be between 3 and 24 characters.')
  }
  if (await isGroupNameTaken(trimmed, type)) {
    throw new Error(
      type === 'school'
        ? 'A school with this name already exists — search the list and join it instead.'
        : 'A clan with this name already exists — pick a different name.',
    )
  }

  const code = inviteCode ?? generateInviteCode(type)
  const ref = await addDoc(collection(db, 'schools'), {
    name: trimmed,
    nameNormalized: normalizeGroupName(trimmed),
    type,
    inviteCode: code,
    createdBy: userId,
    createdAt: serverTimestamp(),
  })

  if (type === 'school') {
    await joinSchoolById(userId, ref.id)
  } else {
    await joinClanById(userId, ref.id)
  }

  const group = await fetchGroup(ref.id)
  if (!group) throw new Error('Failed to load group')
  return group
}

/** @deprecated use createGroup */
export async function createSchool(
  userId: string,
  name: string,
  type: GroupType,
  inviteCode?: string,
): Promise<SchoolGroup> {
  return createGroup(userId, name, type, inviteCode)
}

/** Keep `leaderboard/{uid}` in sync when only `profiles/{uid}` was updated (e.g. school join). */
export async function syncLeaderboardFromProfile(userId: string): Promise<void> {
  if (!db) return
  const profileSnap = await getDoc(doc(db, 'profiles', userId))
  if (!profileSnap.exists()) return

  const data = profileSnap.data()
  const progress = (data.progress as Partial<UserProgress>) ?? {}
  const xp = Math.max((data.xp as number) ?? 0, (progress.xp as number) ?? 0)

  await setDoc(
    doc(db, 'leaderboard', userId),
    stripUndefined({
      displayName: (data.displayName as string) ?? (progress.displayName as string) ?? 'Student',
      avatarUrl: (data.avatarUrl as string) ?? null,
      xp,
      streakDays: Math.max((data.streakDays as number) ?? 0, (progress.streakDays as number) ?? 0),
      longestStreak: Math.max(
        (data.longestStreak as number) ?? 0,
        (progress.longestStreak as number) ?? 0,
      ),
      level: getGlobalLevel(xp),
      showOnLeaderboard: data.showOnLeaderboard !== false,
      xpByDate: progress.xpByDate ?? {},
      achievementIds: (data.achievementIds as string[]) ?? (progress.achievementIds as string[]) ?? [],
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  )
}

export async function joinSchoolById(userId: string, schoolId: string): Promise<SchoolGroup> {
  if (!db) throw new Error('Firebase is not configured')
  const group = await fetchGroup(schoolId)
  if (!group) throw new Error('School not found')
  if (group.type !== 'school') throw new Error('That group is a clan — use an invite code to join clans')

  await setDoc(doc(db, 'profiles', userId), { schoolId }, { merge: true })
  await syncLeaderboardFromProfile(userId)
  return { ...group, memberCount: (group.memberCount ?? 0) + 1 }
}

export async function joinClanByCode(userId: string, rawCode: string): Promise<SchoolGroup> {
  if (!db) throw new Error('Firebase is not configured')
  const inviteCode = normalizeInviteCode(rawCode)

  const q = query(collection(db, 'schools'), where('inviteCode', '==', inviteCode), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('No clan found with that invite code')

  const clanDoc = snap.docs[0]
  const data = clanDoc.data()
  if (data.type !== 'clan') {
    throw new Error('Schools are joined from the list — only clans use invite codes')
  }

  return joinClanById(userId, clanDoc.id)
}

async function joinClanById(userId: string, clanId: string): Promise<SchoolGroup> {
  if (!db) throw new Error('Firebase is not configured')

  const profileSnap = await getDoc(doc(db, 'profiles', userId))
  const clanIds = (profileSnap.data()?.clanIds as string[]) ?? []
  if (clanIds.includes(clanId)) {
    const existing = await fetchGroup(clanId)
    if (!existing) throw new Error('Clan not found')
    return existing
  }
  if (clanIds.length >= MAX_CLANS) {
    throw new Error(`You can only join up to ${MAX_CLANS} clans — leave one first`)
  }

  await setDoc(doc(db, 'profiles', userId), { clanIds: arrayUnion(clanId) }, { merge: true })
  await syncLeaderboardFromProfile(userId)
  const group = await fetchGroup(clanId)
  if (!group) throw new Error('Failed to load clan')
  return group
}

/** @deprecated use joinClanByCode */
export async function joinSchoolByCode(userId: string, rawCode: string): Promise<SchoolGroup> {
  return joinClanByCode(userId, rawCode)
}

export async function leaveSchool(userId: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'profiles', userId), { schoolId: null }, { merge: true })
}

export async function leaveClan(userId: string, clanId: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'profiles', userId), { clanIds: arrayRemove(clanId) }, { merge: true })
}

function globalLeaderboardEligible(
  row: Record<string, unknown>,
  metric: LeaderboardMetric,
  period: LeaderboardPeriod,
  score: number,
): boolean {
  if (row.showOnLeaderboard === false) return false
  if (metric === 'longestStreak') return ((row.longestStreak as number) ?? 0) > 0
  if (period === 'all') return ((row.xp as number) ?? 0) > 0
  return score > 0
}

function docToLeaderboardEntry(
  userId: string,
  row: Record<string, unknown>,
  currentUserId: string,
  metric: LeaderboardMetric,
  period: LeaderboardPeriod,
  index: number,
): LeaderboardEntry {
  const xp = (row.xp as number) ?? 0
  const xpByDate = mergeXpByDate(row.xpByDate as Record<string, number> | undefined)
  const longestStreak = (row.longestStreak as number) ?? 0
  const streakDays = (row.streakDays as number) ?? 0
  const score = metric === 'longestStreak' ? longestStreak : sumXpInPeriod(xpByDate, period, xp)

  return {
    userId,
    displayName: (row.displayName as string) ?? `Student ${index + 1}`,
    avatarUrl: (row.avatarUrl as string) ?? undefined,
    xp,
    streakDays,
    longestStreak,
    level: getGlobalLevel(xp),
    score,
    isYou: userId === currentUserId,
    achievementIds: (row.achievementIds as string[]) ?? [],
  }
}

/** Period boards must scan all entrants — pre-sorting by all-time XP drops weekly leaders. */
async function fetchGlobalLeaderboardDocs(period: LeaderboardPeriod) {
  if (!db) throw new Error('Firebase is not configured')
  if (period === 'all') {
    return getDocs(query(collection(db, 'leaderboard'), orderBy('xp', 'desc'), limit(200)))
  }
  return getDocs(collection(db, 'leaderboard'))
}

function buildGlobalLeaderboardRows(
  docs: { id: string; data: () => Record<string, unknown> }[],
  currentUserId: string,
  metric: LeaderboardMetric,
  period: LeaderboardPeriod,
): LeaderboardEntry[] {
  return docs
    .map((d, index) => {
      const row = d.data()
      const entry = docToLeaderboardEntry(d.id, row, currentUserId, metric, period, index)
      return globalLeaderboardEligible(row, metric, period, entry.score) ? entry : null
    })
    .filter((entry): entry is LeaderboardEntry => entry !== null)
    .sort((a, b) => b.score - a.score)
}

export async function fetchLeaderboard(
  groupId: string,
  groupType: GroupType,
  currentUserId: string,
  options?: { metric?: LeaderboardMetric; period?: LeaderboardPeriod },
): Promise<LeaderboardEntry[]> {
  if (!db) return []

  const metric = options?.metric ?? 'xp'
  const period = options?.period ?? 'all'

  try {
    const q =
      groupType === 'school'
        ? query(collection(db, 'profiles'), where('schoolId', '==', groupId), limit(50))
        : query(
            collection(db, 'profiles'),
            where('clanIds', 'array-contains', groupId),
            limit(50),
          )

    const snap = await getDocs(q)

    const rows: LeaderboardEntry[] = snap.docs.map((d, index) => {
      const row = d.data()
      const xp = (row.xp as number) ?? 0
      const progress = (row.progress as Partial<UserProgress>) ?? {}
      const xpByDate = mergeXpByDate(progress.xpByDate as Record<string, number> | undefined)
      const longestStreak = (row.longestStreak as number) ?? 0
      const streakDays = (row.streakDays as number) ?? 0
      const score =
        metric === 'longestStreak'
          ? longestStreak
          : sumXpInPeriod(xpByDate, period, xp)

      return {
        userId: d.id,
        displayName: (row.displayName as string) ?? `Student ${index + 1}`,
        avatarUrl: (row.avatarUrl as string) ?? undefined,
        xp,
        streakDays,
        longestStreak,
        level: getGlobalLevel(xp),
        score,
        isYou: d.id === currentUserId,
      }
    })

    rows.sort((a, b) => b.score - a.score)
    return rows.slice(0, 25)
  } catch {
    return []
  }
}

export async function fetchGlobalLeaderboard(
  currentUserId: string,
  options?: { metric?: LeaderboardMetric; period?: LeaderboardPeriod; limit?: number },
): Promise<LeaderboardEntry[]> {
  if (!db) return []

  const metric = options?.metric ?? 'xp'
  const period = options?.period ?? 'all'
  const cap = options?.limit ?? 10

  try {
    const snap = await fetchGlobalLeaderboardDocs(period)
    return buildGlobalLeaderboardRows(snap.docs, currentUserId, metric, period).slice(0, cap)
  } catch {
    return []
  }
}

export interface GlobalLeaderboardResult {
  top: LeaderboardEntry[]
  total: number
  userRank: number | null
  userEntry: LeaderboardEntry | null
}

export async function fetchGlobalLeaderboardWithRank(
  currentUserId: string,
  options?: { metric?: LeaderboardMetric; period?: LeaderboardPeriod; limit?: number },
): Promise<GlobalLeaderboardResult> {
  if (!db) return { top: [], total: 0, userRank: null, userEntry: null }

  const metric = options?.metric ?? 'xp'
  const period = options?.period ?? 'all'
  const cap = options?.limit ?? 10

  try {
    const snap = await fetchGlobalLeaderboardDocs(period)
    const rows = buildGlobalLeaderboardRows(snap.docs, currentUserId, metric, period)
    const userIdx = currentUserId ? rows.findIndex((r) => r.userId === currentUserId) : -1

    return {
      top: rows.slice(0, cap),
      total: rows.length,
      userRank: userIdx >= 0 ? userIdx + 1 : null,
      userEntry: userIdx >= 0 ? rows[userIdx] : null,
    }
  } catch {
    return { top: [], total: 0, userRank: null, userEntry: null }
  }
}

export async function fetchFriendsLeaderboard(
  friendIds: string[],
  currentUserId: string,
  options?: { metric?: LeaderboardMetric; period?: LeaderboardPeriod },
): Promise<LeaderboardEntry[]> {
  if (!db || friendIds.length === 0) return []

  const metric = options?.metric ?? 'xp'
  const period = options?.period ?? 'all'
  const ids = [...new Set([currentUserId, ...friendIds])]

  const profiles = await Promise.all(ids.map((id) => getDoc(doc(db!, 'profiles', id))))
  const rows: LeaderboardEntry[] = profiles
    .filter((p) => p.exists())
    .map((d, index) => {
      const row = d.data()!
      const xp = (row.xp as number) ?? 0
      const progress = (row.progress as Partial<UserProgress>) ?? {}
      const xpByDate = mergeXpByDate(progress.xpByDate as Record<string, number> | undefined)
      const longestStreak = (row.longestStreak as number) ?? 0
      const streakDays = (row.streakDays as number) ?? 0
      const score =
        metric === 'longestStreak' ? longestStreak : sumXpInPeriod(xpByDate, period, xp)

      return {
        userId: d.id,
        displayName: (row.displayName as string) ?? `Student ${index + 1}`,
        avatarUrl: (row.avatarUrl as string) ?? undefined,
        xp,
        streakDays,
        longestStreak,
        level: getGlobalLevel(xp),
        score,
        isYou: d.id === currentUserId,
        achievementIds: (row.achievementIds as string[]) ?? [],
      }
    })

  rows.sort((a, b) => b.score - a.score)
  return rows
}

export async function updateProfileExtras(
  userId: string,
  extras: Partial<
    Pick<
      CloudProfile,
      | 'bio'
      | 'examYear'
      | 'subjects'
      | 'privacy'
      | 'showOnLeaderboard'
      | 'dailyGoalMin'
      | 'showStudyActivity'
      | 'profileTheme'
      | 'showcaseAchievementIds'
      | 'showcaseMedalTiers'
    >
  >,
): Promise<void> {
  if (!db) return
  await setDoc(doc(db, 'profiles', userId), stripUndefined(extras), { merge: true })
  if (extras.showOnLeaderboard !== undefined) {
    await setDoc(
      doc(db, 'leaderboard', userId),
      { showOnLeaderboard: extras.showOnLeaderboard },
      { merge: true },
    )
  }
}

export async function fetchSchoolMemberProfiles(schoolId: string): Promise<CloudProfile[]> {
  if (!db) return []

  const snap = await getDocs(query(collection(db, 'profiles'), where('schoolId', '==', schoolId)))
  return snap.docs.map((d) => docToProfile(d.id, d.data()))
}

export async function fetchClanMemberProfiles(clanId: string): Promise<CloudProfile[]> {
  if (!db) return []

  const snap = await getDocs(
    query(collection(db, 'profiles'), where('clanIds', 'array-contains', clanId)),
  )
  return snap.docs.map((d) => docToProfile(d.id, d.data()))
}

/** Admin-only — requires Firestore `admins/{uid}` doc or matching rules. */
export async function fetchAllProfilesForAdmin(): Promise<CloudProfile[]> {
  if (!db) return []

  const snap = await getDocs(query(collection(db, 'profiles'), limit(500)))
  return snap.docs.map((d) => docToProfile(d.id, d.data()))
}
