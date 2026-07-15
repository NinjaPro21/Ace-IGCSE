import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { User } from 'firebase/auth'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import { trackEvent, trackSignIn } from '@/lib/analytics'
import {
  getStoredReferralSource,
} from '@/features/analytics/personalAnalytics'
import { friendlyErrorMessage } from '@/lib/firebaseErrors'
import { localDateISO } from '@/lib/localDate'
import { checkIsAdmin } from '@/lib/admin'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import { clearPresence } from '@/features/social/presenceApi'
import { touchBuddyStreaksForFriends } from '@/features/social/buddyStreaksApi'
import {
  cloudRowToUserProgress,
  createGroup,
  fetchGroup,
  fetchLeaderboard,
  fetchProfile,
  fetchPublicSchools,
  joinClanByCode,
  joinSchoolById,
  leaveClan,
  leaveSchool,
  mergeUserProgress,
  rowToAuthUser,
  syncLeaderboardFromProfile,
  upsertProfile,
  upsertProfileLight,
} from './socialApi'
import { socialStore } from './socialStore'
import type { AuthUser, LeaderboardEntry, PendingGroupAction, SchoolGroup } from './socialTypes'
import { generateInviteCode, isValidClanInviteCode, normalizeInviteCode, type GroupType } from './socialTypes'
import type { LeaderboardMetric, LeaderboardPeriod } from './leaderboardUtils'

interface AuthContextValue {
  isConfigured: boolean
  loading: boolean
  profileHydrated: boolean
  user: AuthUser | null
  school: SchoolGroup | null
  clans: SchoolGroup[]
  publicSchools: SchoolGroup[]
  leaderboard: LeaderboardEntry[]
  leaderboardGroupId: string | null
  leaderboardMetric: LeaderboardMetric
  leaderboardPeriod: LeaderboardPeriod
  pendingGroup: PendingGroupAction | undefined
  localInviteCode: string | undefined
  syncError: string | null
  isAdmin: boolean
  adminChecked: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  queueCreateClan: (name: string) => string
  queueJoinClan: (inviteCode: string) => void
  queueJoinSchool: (schoolId: string) => void
  createSchoolNow: (name: string) => Promise<SchoolGroup>
  createClanNow: (name: string) => Promise<SchoolGroup>
  joinClanNow: (inviteCode: string) => Promise<SchoolGroup>
  joinSchoolNow: (schoolId: string) => Promise<SchoolGroup>
  leaveSchoolGroup: () => Promise<void>
  leaveClanGroup: (clanId: string) => Promise<void>
  loadPublicSchools: () => Promise<void>
  setLeaderboardGroup: (groupId: string, groupType: GroupType) => Promise<void>
  setLeaderboardFilters: (metric: LeaderboardMetric, period: LeaderboardPeriod) => Promise<void>
  refreshLeaderboard: () => Promise<void>
  syncProgressNow: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function firebaseUserToAuthUser(user: User): AuthUser {
  return {
    id: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Student',
    avatarUrl: user.photoURL ?? undefined,
  }
}

async function loadClans(clanIds: string[]): Promise<SchoolGroup[]> {
  const groups = await Promise.all(clanIds.map((id) => fetchGroup(id)))
  return groups.filter((g): g is SchoolGroup => g !== null)
}

async function processPendingGroup(userId: string): Promise<{ school: SchoolGroup | null; clans: SchoolGroup[] }> {
  const pending = socialStore.getPendingGroup()
  if (!pending) return { school: null, clans: [] }

  try {
    if (pending.action === 'create' && pending.name && pending.type === 'clan') {
      const code = socialStore.getLocalInviteCode()
      const group = await createGroup(userId, pending.name, 'clan', code)
      socialStore.clearPendingGroup()
      socialStore.clearLocalInviteCode()
      return { school: null, clans: [group] }
    }
    if (pending.action === 'joinClan' && pending.inviteCode) {
      const group = await joinClanByCode(userId, pending.inviteCode)
      socialStore.clearPendingGroup()
      return { school: null, clans: [group] }
    }
    if (pending.action === 'joinSchool' && pending.schoolId) {
      const school = await joinSchoolById(userId, pending.schoolId)
      socialStore.clearPendingGroup()
      return { school, clans: [] }
    }
  } catch {
    // Keep pending so user can retry after sign-in
  }
  return { school: null, clans: [] }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [profileHydrated, setProfileHydrated] = useState(!isFirebaseConfigured)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [school, setSchool] = useState<SchoolGroup | null>(null)
  const [clans, setClans] = useState<SchoolGroup[]>([])
  const [publicSchools, setPublicSchools] = useState<SchoolGroup[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [leaderboardGroupId, setLeaderboardGroupId] = useState<string | null>(null)
  const [leaderboardMetric, setLeaderboardMetric] = useState<LeaderboardMetric>('xp')
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('all')
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminChecked, setAdminChecked] = useState(!isFirebaseConfigured)
  const [pendingGroup, setPendingGroupState] = useState(socialStore.getPendingGroup())
  const [localInviteCode, setLocalInviteCode] = useState(socialStore.getLocalInviteCode())
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastLightSyncAt = useRef(0)
  const lastHeavySyncAt = useRef(0)

  const refreshLeaderboardFor = useCallback(
    async (
      groupId: string,
      groupType: GroupType,
      userId?: string,
      metric?: LeaderboardMetric,
      period?: LeaderboardPeriod,
    ) => {
      const uid = userId ?? user?.id
      if (!uid) {
        setLeaderboard([])
        return
      }
      const rows = await fetchLeaderboard(groupId, groupType, uid, {
        metric: metric ?? leaderboardMetric,
        period: period ?? leaderboardPeriod,
      })
      setLeaderboard(rows)
      setLeaderboardGroupId(groupId)
    },
    [user?.id, leaderboardMetric, leaderboardPeriod],
  )

  const refreshLeaderboard = useCallback(async () => {
    if (leaderboardGroupId && user) {
      const group = school?.id === leaderboardGroupId
        ? school
        : clans.find((c) => c.id === leaderboardGroupId)
      if (group) {
        await refreshLeaderboardFor(group.id, group.type, user.id)
      }
    } else if (school && user) {
      await refreshLeaderboardFor(school.id, 'school', user.id)
    } else if (clans[0] && user) {
      await refreshLeaderboardFor(clans[0].id, 'clan', user.id)
    } else {
      setLeaderboard([])
    }
  }, [clans, leaderboardGroupId, refreshLeaderboardFor, school, user])

  /** Full sync: public card + leaderboard + private progress blob. */
  const syncProgressNow = useCallback(async () => {
    if (!auth || !user) return
    try {
      setSyncError(null)
      await upsertProfile(user.id, masteryEngine.getState(), {
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      })
      lastHeavySyncAt.current = Date.now()
      lastLightSyncAt.current = Date.now()
    } catch (err) {
      setSyncError(friendlyErrorMessage(err, 'Sync failed'))
    }
  }, [user])

  /** Cheap sync: public card + leaderboard only (no private progress doc). */
  const syncProgressLight = useCallback(async () => {
    if (!auth || !user) return
    try {
      setSyncError(null)
      await upsertProfileLight(user.id, masteryEngine.getState(), {
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      })
      lastLightSyncAt.current = Date.now()
    } catch (err) {
      setSyncError(friendlyErrorMessage(err, 'Sync failed'))
    }
  }, [user])

  const resolveAdmin = useCallback(async (uid: string) => {
    const ok = await checkIsAdmin(uid)
    setIsAdmin(ok)
    setAdminChecked(true)
  }, [])

  const hydrateSession = useCallback(
    async (firebaseUser: User) => {
      setProfileHydrated(false)
      try {
      const authUser = firebaseUserToAuthUser(firebaseUser)
      const uid = firebaseUser.uid
      void resolveAdmin(uid)

      const local = masteryEngine.getState()
      if (local.ownerUserId && local.ownerUserId !== uid) {
        masteryEngine.clearLocalState()
      }

      const row = await fetchProfile(uid)

      if (row) {
        const remote = cloudRowToUserProgress(row)
        const merged = mergeUserProgress(masteryEngine.getState(), remote, uid)
        masteryEngine.replaceState(merged)
        masteryEngine.notify()
        setUser(rowToAuthUser(row))

        let schoolGroup: SchoolGroup | null = null
        let clanGroups: SchoolGroup[] = []

        if (row.schoolId) {
          schoolGroup = await fetchGroup(row.schoolId)
        }
        if (row.clanIds?.length) {
          clanGroups = await loadClans(row.clanIds)
        }

        if (!schoolGroup && clanGroups.length === 0) {
          const pending = await processPendingGroup(firebaseUser.uid)
          schoolGroup = pending.school ?? schoolGroup
          if (pending.clans.length) {
            clanGroups = await loadClans(
              [...new Set([...clanGroups.map((c) => c.id), ...pending.clans.map((c) => c.id)])],
            )
          }
        }

        setSchool(schoolGroup)
        setClans(clanGroups)

        void syncLeaderboardFromProfile(uid)

        if (schoolGroup) {
          void refreshLeaderboardFor(schoolGroup.id, 'school', firebaseUser.uid)
        } else if (clanGroups[0]) {
          void refreshLeaderboardFor(clanGroups[0].id, 'clan', firebaseUser.uid)
        }

        if (row.friendIds?.length && row.lastActiveDate === localDateISO()) {
          void touchBuddyStreaksForFriends(uid, row.friendIds)
        }
      } else {
        masteryEngine.bindOwnerUserId(uid)
        setUser(authUser)
        await upsertProfile(uid, masteryEngine.getState(), {
          email: authUser.email,
          displayName: authUser.displayName,
          avatarUrl: authUser.avatarUrl,
        })
        try {
          trackEvent(
            'user_signed_up',
            { referralSource: getStoredReferralSource() },
            { uid },
          )
        } catch {
          // analytics silent
        }
        const pending = await processPendingGroup(firebaseUser.uid)
        setSchool(pending.school)
        const clanGroups = pending.clans.length ? pending.clans : []
        setClans(clanGroups)
        if (pending.school) {
          void refreshLeaderboardFor(pending.school.id, 'school', firebaseUser.uid)
        } else if (clanGroups[0]) {
          void refreshLeaderboardFor(clanGroups[0].id, 'clan', firebaseUser.uid)
        }
      }
      } finally {
        setProfileHydrated(true)
      }
    },
    [refreshLeaderboardFor, resolveAdmin],
  )

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUserToAuthUser(firebaseUser))
        setAdminChecked(false)
        setLoading(false)
        void hydrateSession(firebaseUser)
      } else {
        setUser(null)
        setSchool(null)
        setClans([])
        setLeaderboard([])
        setLeaderboardGroupId(null)
        setIsAdmin(false)
        setAdminChecked(true)
        setProfileHydrated(true)
        setLoading(false)
      }
    })

    return unsub
  }, [hydrateSession])

  useEffect(() => {
    // Study sessions emit 'enlight-progress' every ~10s. Syncing the full
    // profile (1 read + 3 writes) on each event was ~1k writes/hour per
    // active student. Instead: light sync (2 writes) at most once a minute,
    // heavy sync (private progress blob) at most every 5 minutes, with a
    // guaranteed heavy flush when the tab is hidden or the user signs out.
    const LIGHT_SYNC_MIN_MS = 60_000
    const HEAVY_SYNC_MIN_MS = 5 * 60_000
    const DEBOUNCE_MS = 2000

    const runDueSync = () => {
      const now = Date.now()
      if (now - lastHeavySyncAt.current >= HEAVY_SYNC_MIN_MS) {
        void syncProgressNow()
      } else {
        void syncProgressLight()
      }
    }

    const scheduleSync = () => {
      if (!user) return
      if (syncTimer.current) clearTimeout(syncTimer.current)
      const sinceLight = Date.now() - lastLightSyncAt.current
      const delay = Math.max(DEBOUNCE_MS, LIGHT_SYNC_MIN_MS - sinceLight)
      syncTimer.current = setTimeout(runDueSync, delay)
    }

    const flushOnHide = () => {
      if (!user || document.visibilityState !== 'hidden') return
      if (syncTimer.current) clearTimeout(syncTimer.current)
      void syncProgressNow()
    }

    window.addEventListener('enlight-progress', scheduleSync)
    document.addEventListener('visibilitychange', flushOnHide)
    return () => {
      window.removeEventListener('enlight-progress', scheduleSync)
      document.removeEventListener('visibilitychange', flushOnHide)
      if (syncTimer.current) clearTimeout(syncTimer.current)
    }
  }, [user, syncProgressNow, syncProgressLight])

  const loadPublicSchools = useCallback(async () => {
    const schools = await fetchPublicSchools()
    setPublicSchools(schools)
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      setSyncError('Add Firebase config to .env.local — see .env.example.')
      return
    }
    setSyncError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      trackSignIn('google', auth.currentUser?.uid)
    } catch (err) {
      setSyncError(friendlyErrorMessage(err, 'Sign-in failed'))
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!auth) return
    const uid = user?.id
    if (uid) {
      // Heavy syncs are throttled — flush the latest progress before clearing.
      try {
        await upsertProfile(uid, masteryEngine.getState(), {
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        })
      } catch {
        // best effort — don't block sign-out
      }
      await clearPresence(uid)
    }
    masteryEngine.clearLocalState()
    socialStore.clearAll()
    await firebaseSignOut(auth)
    setUser(null)
    setSchool(null)
    setClans([])
    setLeaderboard([])
    setLeaderboardGroupId(null)
    setIsAdmin(false)
    setAdminChecked(true)
  }, [user])

  const queueCreateClan = useCallback((name: string) => {
    const code = generateInviteCode('clan')
    socialStore.setPendingGroup({ action: 'create', name, type: 'clan' })
    socialStore.setLocalInviteCode(code)
    setPendingGroupState(socialStore.getPendingGroup())
    setLocalInviteCode(code)
    return code
  }, [])

  const queueJoinClan = useCallback((inviteCode: string) => {
    const code = normalizeInviteCode(inviteCode)
    if (!isValidClanInviteCode(code)) {
      throw new Error('Clan codes look like CLN-ABC123')
    }
    socialStore.setPendingGroup({ action: 'joinClan', inviteCode: code })
    setPendingGroupState(socialStore.getPendingGroup())
  }, [])

  const queueJoinSchool = useCallback((schoolId: string) => {
    socialStore.setPendingGroup({ action: 'joinSchool', schoolId })
    setPendingGroupState(socialStore.getPendingGroup())
  }, [])

  const createSchoolNow = useCallback(
    async (name: string) => {
      if (!user) throw new Error('Sign in with Google first')
      const group = await createGroup(user.id, name, 'school')
      setSchool(group)
      await refreshLeaderboardFor(group.id, 'school', user.id)
      await loadPublicSchools()
      return group
    },
    [user, refreshLeaderboardFor, loadPublicSchools],
  )

  const createClanNow = useCallback(
    async (name: string) => {
      if (!user) throw new Error('Sign in with Google first')
      const code = socialStore.getLocalInviteCode()
      const group = await createGroup(user.id, name, 'clan', code)
      socialStore.clearPendingGroup()
      socialStore.clearLocalInviteCode()
      setPendingGroupState(undefined)
      setLocalInviteCode(undefined)
      setClans((prev) => [...prev, group])
      await refreshLeaderboardFor(group.id, 'clan', user.id)
      return group
    },
    [user, refreshLeaderboardFor],
  )

  const joinClanNow = useCallback(
    async (inviteCode: string) => {
      if (!user) throw new Error('Sign in with Google first')
      const group = await joinClanByCode(user.id, inviteCode)
      socialStore.clearPendingGroup()
      setPendingGroupState(undefined)
      setClans((prev) => (prev.some((c) => c.id === group.id) ? prev : [...prev, group]))
      await refreshLeaderboardFor(group.id, 'clan', user.id)
      return group
    },
    [user, refreshLeaderboardFor],
  )

  const joinSchoolNow = useCallback(
    async (schoolId: string) => {
      if (!user) throw new Error('Sign in with Google first')
      const group = await joinSchoolById(user.id, schoolId)
      socialStore.clearPendingGroup()
      setPendingGroupState(undefined)
      setSchool(group)
      await refreshLeaderboardFor(group.id, 'school', user.id)
      return group
    },
    [user, refreshLeaderboardFor],
  )

  const leaveSchoolGroup = useCallback(async () => {
    if (!user) return
    await leaveSchool(user.id)
    setSchool(null)
    if (clans[0]) {
      await refreshLeaderboardFor(clans[0].id, 'clan', user.id)
    } else {
      setLeaderboard([])
      setLeaderboardGroupId(null)
    }
  }, [clans, user, refreshLeaderboardFor])

  const leaveClanGroup = useCallback(
    async (clanId: string) => {
      if (!user) return
      await leaveClan(user.id, clanId)
      const next = clans.filter((c) => c.id !== clanId)
      setClans(next)
      if (leaderboardGroupId === clanId) {
        if (school) {
          await refreshLeaderboardFor(school.id, 'school', user.id)
        } else if (next[0]) {
          await refreshLeaderboardFor(next[0].id, 'clan', user.id)
        } else {
          setLeaderboard([])
          setLeaderboardGroupId(null)
        }
      }
    },
    [clans, leaderboardGroupId, school, user, refreshLeaderboardFor],
  )

  const setLeaderboardFilters = useCallback(
    async (metric: LeaderboardMetric, period: LeaderboardPeriod) => {
      setLeaderboardMetric(metric)
      setLeaderboardPeriod(period)
      if (!user || !leaderboardGroupId) return
      const group =
        school?.id === leaderboardGroupId
          ? school
          : clans.find((c) => c.id === leaderboardGroupId)
      if (group) {
        await refreshLeaderboardFor(group.id, group.type, user.id, metric, period)
      }
    },
    [user, leaderboardGroupId, school, clans, refreshLeaderboardFor],
  )

  const setLeaderboardGroup = useCallback(
    async (groupId: string, groupType: GroupType) => {
      if (!user) return
      await refreshLeaderboardFor(groupId, groupType, user.id)
    },
    [user, refreshLeaderboardFor],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured: isFirebaseConfigured,
      loading,
      profileHydrated,
      user,
      school,
      clans,
      publicSchools,
      leaderboard,
      leaderboardGroupId,
      leaderboardMetric,
      leaderboardPeriod,
      pendingGroup,
      localInviteCode,
      syncError,
      isAdmin,
      adminChecked,
      signInWithGoogle,
      signOut,
      queueCreateClan,
      queueJoinClan,
      queueJoinSchool,
      createSchoolNow,
      createClanNow,
      joinClanNow,
      joinSchoolNow,
      leaveSchoolGroup,
      leaveClanGroup,
      loadPublicSchools,
      setLeaderboardGroup,
      setLeaderboardFilters,
      refreshLeaderboard,
      syncProgressNow,
    }),
    [
      loading,
      profileHydrated,
      user,
      school,
      clans,
      publicSchools,
      leaderboard,
      leaderboardGroupId,
      leaderboardMetric,
      leaderboardPeriod,
      pendingGroup,
      localInviteCode,
      syncError,
      isAdmin,
      adminChecked,
      signInWithGoogle,
      signOut,
      queueCreateClan,
      queueJoinClan,
      queueJoinSchool,
      createSchoolNow,
      createClanNow,
      joinClanNow,
      joinSchoolNow,
      leaveSchoolGroup,
      leaveClanGroup,
      loadPublicSchools,
      setLeaderboardGroup,
      setLeaderboardFilters,
      refreshLeaderboard,
      syncProgressNow,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
