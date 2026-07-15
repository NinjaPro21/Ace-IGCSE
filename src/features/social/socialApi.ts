import { auth, db } from '@/lib/firebase'
import { recordPlatformSync } from '@/features/analytics/analyticsApi'
import type { UserProgress } from '@/features/mastery/MasteryEngine'
import { getGlobalLevel, NOTES_MIN_SECONDS } from '@/features/mastery/levelSystem'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  documentId,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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

/** Owner writes to the public social card — always strip sensitive legacy fields. */
export async function patchPublicProfile(
  userId: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!db) return
  await setDoc(
    doc(db, 'profiles', userId),
    {
      ...stripUndefined(data),
      email: deleteField(),
      progress: deleteField(),
      activeDates: deleteField(),
      syncedStudySec: deleteField(),
      syncedQuizAttempts: deleteField(),
    },
    { merge: true },
  )
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
  /** Public week-board helper — not full topic/quiz detail. */
  xpByDate?: Record<string, number>
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
    xpByDate: (data.xpByDate as Record<string, number>) ?? {},
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

export async function fetchSecureProgress(userId: string): Promise<{
  email: string | null
  progress: Partial<UserProgress>
  activeDates: string[]
  lastActiveDate: string | null
} | null> {
  if (!db) return null
  try {
    const snap = await getDoc(doc(db, 'profiles', userId, 'private', 'secure'))
    if (!snap.exists()) return null
    const data = snap.data()
    return {
      email: (data.email as string) ?? null,
      progress: (data.progress as Partial<UserProgress>) ?? {},
      activeDates: (data.activeDates as string[]) ?? [],
      lastActiveDate: (data.lastActiveDate as string) ?? null,
    }
  } catch {
    return null
  }
}

async function mergeSecureIntoProfile(profile: CloudProfile): Promise<CloudProfile> {
  const secure = await fetchSecureProgress(profile.id)
  if (!secure) {
    // Legacy docs may still have progress/email on the root until next sync.
    return profile
  }
  return {
    ...profile,
    email: secure.email ?? profile.email,
    progress: Object.keys(secure.progress).length ? secure.progress : profile.progress,
    activeDates: secure.activeDates.length ? secure.activeDates : profile.activeDates,
    lastActiveDate: secure.lastActiveDate ?? profile.lastActiveDate,
  }
}

/**
 * Fetches a profile social card. Private study data is only merged when the
 * caller is the profile owner (or an admin with private read access).
 */
export async function fetchProfile(
  userId: string,
  options?: { includeSecure?: boolean },
): Promise<CloudProfile | null> {
  if (!db) return null
  try {
    const snap = await getDoc(doc(db, 'profiles', userId))
    if (!snap.exists()) return null
    let profile = docToProfile(snap.id, snap.data())
    const wantsSecure =
      options?.includeSecure === true ||
      auth?.currentUser?.uid === userId
    if (wantsSecure) {
      profile = await mergeSecureIntoProfile(profile)
    } else {
      // Never trust legacy root progress/email on another user's card.
      profile = {
        ...profile,
        email: null,
        progress: {},
        activeDates: [],
      }
    }
    return profile
  } catch {
    // permission-denied → treat as private / missing
    return null
  }
}

/**
 * Denormalized period scores so global boards can `orderBy(...).limit(...)`
 * instead of scanning the whole leaderboard collection on every view.
 */
function periodScoreFields(xpByDate: Record<string, number> | undefined) {
  return {
    dayXp: sumXpInPeriod(xpByDate, 'day', 0),
    weekXp: sumXpInPeriod(xpByDate, 'week', 0),
    monthXp: sumXpInPeriod(xpByDate, 'month', 0),
  }
}

/** Cached per-session so light syncs don't re-read the profile every time. */
const showOnLeaderboardCache = new Map<string, boolean>()

async function resolveShowOnLeaderboard(userId: string): Promise<{ show: boolean; isNew: boolean }> {
  const cached = showOnLeaderboardCache.get(userId)
  if (cached !== undefined) return { show: cached, isNew: false }
  const existingSnap = await getDoc(doc(db!, 'profiles', userId))
  const show = existingSnap.exists() && existingSnap.data().showOnLeaderboard === false ? false : true
  showOnLeaderboardCache.set(userId, show)
  return { show, isNew: !existingSnap.exists() }
}

/**
 * Light sync — public social card + leaderboard entry only (2 writes).
 * Safe to run frequently; the heavy private progress blob is written by
 * `upsertProfile` on a slower cadence.
 */
export async function upsertProfileLight(
  userId: string,
  progress: UserProgress,
  meta?: { email?: string; displayName?: string; avatarUrl?: string },
): Promise<void> {
  if (!db) return

  const { show: showOnLeaderboard, isNew } = await resolveShowOnLeaderboard(userId)

  // Public social card — no email, no full progress blob.
  await patchPublicProfile(userId, {
    displayName: progress.displayName || meta?.displayName || null,
    avatarUrl: meta?.avatarUrl ?? null,
    xp: progress.xp,
    streakDays: progress.streakDays,
    longestStreak: progress.longestStreak,
    streakFreezes: progress.streakFreezes ?? 0,
    lastActiveDate: progress.lastActiveDate || null,
    lastActiveAt: serverTimestamp(),
    // Keep week boards usable without exposing topic/quiz detail.
    xpByDate: progress.xpByDate ?? {},
    dailyGoalMin: progress.dailyGoalMin ?? null,
    achievementIds: progress.achievementIds ?? [],
    subjects: progress.subjects ?? [],
    ...(isNew ? { createdAt: serverTimestamp(), privacy: 'friends' } : {}),
    updatedAt: serverTimestamp(),
  })

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
      ...periodScoreFields(progress.xpByDate),
      achievementIds: progress.achievementIds ?? [],
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  )
}

export async function upsertProfile(
  userId: string,
  progress: UserProgress,
  meta?: { email?: string; displayName?: string; avatarUrl?: string },
): Promise<void> {
  if (!db) return

  const snapshots = await recordPlatformSync(userId, progress)

  await upsertProfileLight(userId, progress, meta)

  // Owner-only private payload.
  await setDoc(
    doc(db, 'profiles', userId, 'private', 'secure'),
    stripUndefined({
      email: meta?.email ?? null,
      activeDates: progress.activeDates,
      lastActiveDate: progress.lastActiveDate || null,
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
        streakFreezes: progress.streakFreezes,
        dailyQuests: progress.dailyQuests,
        weeklyChallengeClaims: progress.weeklyChallengeClaims,
      },
      updatedAt: serverTimestamp(),
    }),
    { merge: true },
  )
}

/** Count aggregation — 1 billed read per 1000 members instead of 1 per member. */
async function countGroupMembers(groupId: string, type: GroupType): Promise<number> {
  if (!db) return 0
  const q =
    type === 'school'
      ? query(collection(db, 'profiles'), where('schoolId', '==', groupId))
      : query(collection(db, 'profiles'), where('clanIds', 'array-contains', groupId))
  const snap = await getCountFromServer(q)
  return snap.data().count
}

function normalizeGroupName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Case-insensitive duplicate check within the same group type. Queries the
 * `nameNormalized` field written at create time (legacy docs created before
 * that field exist may not be caught — acceptable for a duplicate-name hint).
 */
export async function isGroupNameTaken(name: string, type: GroupType): Promise<boolean> {
  if (!db) return false
  const target = normalizeGroupName(name)
  const snap = await getDocs(
    query(
      collection(db, 'schools'),
      where('type', '==', type),
      where('nameNormalized', '==', target),
      limit(1),
    ),
  )
  return !snap.empty
}

/** Adjust denormalized memberCount on a school/clan doc (best-effort). */
async function adjustGroupMemberCount(groupId: string, delta: number): Promise<void> {
  if (!db || delta === 0) return
  try {
    await updateDoc(doc(db, 'schools', groupId), { memberCount: increment(delta) })
  } catch {
    // Legacy groups without memberCount or rules lag — ignore.
  }
}

function readMemberCount(data: Record<string, unknown>, fallback: number): number {
  const stored = data.memberCount
  return typeof stored === 'number' && stored >= 0 ? stored : fallback
}

export async function fetchGroup(groupId: string): Promise<SchoolGroup | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'schools', groupId))
  if (!snap.exists()) return null
  const data = snap.data()
  const type = data.type as GroupType
  const stored = data.memberCount
  const memberCount =
    typeof stored === 'number' && stored >= 0
      ? stored
      : await countGroupMembers(snap.id, type)
  return {
    id: snap.id,
    name: data.name as string,
    type,
    inviteCode: data.inviteCode as string,
    memberCount,
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
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      name: data.name as string,
      type: 'school' as const,
      inviteCode: data.inviteCode as string,
      memberCount: readMemberCount(data, 0),
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
    memberCount: 1,
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
  let progress: Partial<UserProgress> = {}
  try {
    const secureSnap = await getDoc(doc(db, 'profiles', userId, 'private', 'secure'))
    if (secureSnap.exists()) {
      progress = (secureSnap.data().progress as Partial<UserProgress>) ?? {}
    }
  } catch {
    progress = (data.progress as Partial<UserProgress>) ?? {}
  }
  if (!Object.keys(progress).length) {
    progress = (data.progress as Partial<UserProgress>) ?? {}
  }
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
      xpByDate:
        (data.xpByDate as Record<string, number> | undefined)
        ?? progress.xpByDate
        ?? {},
      ...periodScoreFields(
        (data.xpByDate as Record<string, number> | undefined) ?? progress.xpByDate,
      ),
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

  const profileSnap = await getDoc(doc(db, 'profiles', userId))
  const prevSchoolId = profileSnap.data()?.schoolId as string | undefined
  if (prevSchoolId && prevSchoolId !== schoolId) {
    await adjustGroupMemberCount(prevSchoolId, -1)
  }

  await patchPublicProfile(userId, { schoolId })
  if (prevSchoolId !== schoolId) {
    await adjustGroupMemberCount(schoolId, 1)
  }
  await syncLeaderboardFromProfile(userId)
  return { ...group, memberCount: (group.memberCount ?? 0) + (prevSchoolId === schoolId ? 0 : 1) }
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

  await patchPublicProfile(userId, { clanIds: arrayUnion(clanId) })
  await adjustGroupMemberCount(clanId, 1)
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
  const profileSnap = await getDoc(doc(db, 'profiles', userId))
  const schoolId = profileSnap.data()?.schoolId as string | undefined
  await patchPublicProfile(userId, { schoolId: null })
  if (schoolId) await adjustGroupMemberCount(schoolId, -1)
}

export async function leaveClan(userId: string, clanId: string): Promise<void> {
  if (!db) return
  await patchPublicProfile(userId, { clanIds: arrayRemove(clanId) })
  await adjustGroupMemberCount(clanId, -1)
}

function globalLeaderboardEligible(
  row: Record<string, unknown>,
  metric: LeaderboardMetric,
  period: LeaderboardPeriod,
  score: number,
  allowZeroPeriodScore = false,
): boolean {
  if (row.showOnLeaderboard === false) return false
  if (metric === 'longestStreak') return ((row.longestStreak as number) ?? 0) > 0
  if (period === 'all') return ((row.xp as number) ?? 0) > 0
  return allowZeroPeriodScore ? score >= 0 : score > 0
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

const PERIOD_SCORE_FIELD: Record<LeaderboardPeriod, string> = {
  day: 'dayXp',
  week: 'weekXp',
  month: 'monthXp',
  all: 'xp',
}

function leaderboardOrderField(metric: LeaderboardMetric, period: LeaderboardPeriod): string {
  return metric === 'longestStreak' ? 'longestStreak' : PERIOD_SCORE_FIELD[period]
}

/**
 * Bounded top-of-board query. Period boards order by the denormalized
 * dayXp/weekXp/monthXp written at sync time (see `periodScoreFields`) — the
 * exact display score is still recomputed client-side from xpByDate, the
 * denormalized field only drives which docs we fetch. Over-fetch a little so
 * hidden entries and slightly-stale ordering don't shrink the top 10.
 */
async function fetchGlobalLeaderboardDocs(metric: LeaderboardMetric, period: LeaderboardPeriod) {
  if (!db) throw new Error('Firebase is not configured')
  const field = leaderboardOrderField(metric, period)
  return getDocs(query(collection(db, 'leaderboard'), orderBy(field, 'desc'), limit(60)))
}

function buildGlobalLeaderboardRows(
  docs: { id: string; data: () => Record<string, unknown> }[],
  currentUserId: string,
  metric: LeaderboardMetric,
  period: LeaderboardPeriod,
): LeaderboardEntry[] {
  const parsed = docs
    .map((d, index) => {
      const row = d.data()
      const entry = docToLeaderboardEntry(d.id, row, currentUserId, metric, period, index)
      return { row, entry }
    })
    .filter(({ row, entry }) => globalLeaderboardEligible(row, metric, period, entry.score))

  if (parsed.length > 0) {
    return parsed.map(({ entry }) => entry).sort((a, b) => b.score - a.score)
  }

  // Quiet week: still show opted-in players from the bounded query window.
  return docs
    .map((d, index) => {
      const row = d.data()
      const entry = docToLeaderboardEntry(d.id, row, currentUserId, metric, period, index)
      return globalLeaderboardEligible(row, metric, period, entry.score, true) ? entry : null
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
      const xpByDate = mergeXpByDate(
        (row.xpByDate as Record<string, number> | undefined) ??
          ((row.progress as Partial<UserProgress> | undefined)?.xpByDate as
            | Record<string, number>
            | undefined),
      )
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
    const snap = await fetchGlobalLeaderboardDocs(metric, period)
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
    const snap = await fetchGlobalLeaderboardDocs(metric, period)
    const rows = buildGlobalLeaderboardRows(snap.docs, currentUserId, metric, period)
    const userIdx = currentUserId ? rows.findIndex((r) => r.userId === currentUserId) : -1

    // Board size via count aggregation (1 read per 1000 docs) instead of
    // downloading the whole collection.
    const totalSnap = await getCountFromServer(collection(db, 'leaderboard'))
    const total = Math.max(totalSnap.data().count, rows.length)

    if (userIdx >= 0 || !currentUserId) {
      return {
        top: rows.slice(0, cap),
        total,
        userRank: userIdx >= 0 ? userIdx + 1 : null,
        userEntry: userIdx >= 0 ? rows[userIdx] : null,
      }
    }

    // User is outside the fetched window — rank from a count of entries
    // scoring above them on the same order field.
    const orderField = leaderboardOrderField(metric, period)
    const ownSnap = await getDoc(doc(db, 'leaderboard', currentUserId))
    if (!ownSnap.exists()) {
      return { top: rows.slice(0, cap), total, userRank: null, userEntry: null }
    }
    const ownRow = ownSnap.data()
    const ownEntry = docToLeaderboardEntry(currentUserId, ownRow, currentUserId, metric, period, 0)
    const ownFieldScore = (ownRow[orderField] as number) ?? 0
    const aboveSnap = await getCountFromServer(
      query(collection(db, 'leaderboard'), where(orderField, '>', ownFieldScore)),
    )

    return {
      top: rows.slice(0, cap),
      total,
      userRank: aboveSnap.data().count + 1,
      userEntry: ownEntry,
    }
  } catch {
    return { top: [], total: 0, userRank: null, userEntry: null }
  }
}

/** Batched profile reads — `documentId() in` supports 30 ids per query. */
export async function fetchProfileDocsByIds(
  ids: string[],
): Promise<{ id: string; data: () => Record<string, unknown> }[]> {
  if (!db || ids.length === 0) return []
  const chunks: string[][] = []
  for (let i = 0; i < ids.length; i += 30) chunks.push(ids.slice(i, i + 30))
  const snaps = await Promise.all(
    chunks.map((chunk) =>
      getDocs(query(collection(db!, 'profiles'), where(documentId(), 'in', chunk))),
    ),
  )
  return snaps.flatMap((s) => s.docs)
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

  const profiles = await fetchProfileDocsByIds(ids)
  const rows: LeaderboardEntry[] = profiles
    .map((d, index) => {
      const row = d.data()
      const xp = (row.xp as number) ?? 0
      const progress = (row.progress as Partial<UserProgress>) ?? {}
      const xpByDate = mergeXpByDate(
        (row.xpByDate as Record<string, number> | undefined) ??
          (progress.xpByDate as Record<string, number> | undefined),
      )
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
  await patchPublicProfile(userId, extras as Record<string, unknown>)
  if (extras.showOnLeaderboard !== undefined) {
    showOnLeaderboardCache.set(userId, extras.showOnLeaderboard)
    await setDoc(
      doc(db, 'leaderboard', userId),
      { showOnLeaderboard: extras.showOnLeaderboard },
      { merge: true },
    )
  }
}

export async function fetchSchoolMemberProfiles(
  schoolId: string,
  options?: { includeSecure?: boolean },
): Promise<CloudProfile[]> {
  if (!db) return []

  try {
    const snap = await getDocs(
      query(collection(db, 'profiles'), where('schoolId', '==', schoolId), limit(100)),
    )
    const profiles = snap.docs.map((d) => docToProfile(d.id, d.data()))
    if (!options?.includeSecure) {
      return profiles.map((p) => ({ ...p, email: null, progress: {}, activeDates: [] }))
    }
    return Promise.all(profiles.map((p) => mergeSecureIntoProfile(p)))
  } catch {
    return []
  }
}

export async function fetchClanMemberProfiles(
  clanId: string,
  options?: { includeSecure?: boolean },
): Promise<CloudProfile[]> {
  if (!db) return []

  try {
    const snap = await getDocs(
      query(collection(db, 'profiles'), where('clanIds', 'array-contains', clanId), limit(100)),
    )
    const profiles = snap.docs.map((d) => docToProfile(d.id, d.data()))
    if (!options?.includeSecure) {
      return profiles.map((p) => ({ ...p, email: null, progress: {}, activeDates: [] }))
    }
    return Promise.all(profiles.map((p) => mergeSecureIntoProfile(p)))
  } catch {
    return []
  }
}

/** Admin-only — requires Firestore admin access to private progress docs. */
export async function fetchAllProfilesForAdmin(): Promise<CloudProfile[]> {
  if (!db) return []

  try {
    const snap = await getDocs(query(collection(db, 'profiles'), limit(500)))
    const profiles = snap.docs.map((d) => docToProfile(d.id, d.data()))
    return Promise.all(profiles.map((p) => mergeSecureIntoProfile(p)))
  } catch {
    return []
  }
}
