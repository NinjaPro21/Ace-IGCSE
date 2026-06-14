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
import { trackSignIn } from '@/lib/analytics'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import {
  cloudRowToUserProgress,
  createSchool,
  fetchLeaderboard,
  fetchProfile,
  fetchSchool,
  joinSchoolByCode,
  leaveSchool,
  mergeUserProgress,
  rowToAuthUser,
  upsertProfile,
} from './socialApi'
import { socialStore } from './socialStore'
import type { AuthUser, LeaderboardEntry, PendingGroupAction, SchoolGroup } from './socialTypes'
import { generateInviteCode, isValidInviteCode, normalizeInviteCode, type GroupType } from './socialTypes'

interface AuthContextValue {
  isConfigured: boolean
  loading: boolean
  user: AuthUser | null
  school: SchoolGroup | null
  leaderboard: LeaderboardEntry[]
  pendingGroup: PendingGroupAction | undefined
  localInviteCode: string | undefined
  syncError: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  queueCreateGroup: (name: string, type: GroupType) => string
  queueJoinGroup: (inviteCode: string) => void
  createGroupNow: (name: string, type: GroupType) => Promise<SchoolGroup>
  joinGroupNow: (inviteCode: string) => Promise<SchoolGroup>
  leaveGroup: () => Promise<void>
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

async function processPendingGroup(userId: string): Promise<SchoolGroup | null> {
  const pending = socialStore.getPendingGroup()
  if (!pending) return null

  try {
    if (pending.action === 'create' && pending.name && pending.type) {
      const code = socialStore.getLocalInviteCode()
      const group = await createSchool(userId, pending.name, pending.type, code)
      socialStore.clearPendingGroup()
      socialStore.clearLocalInviteCode()
      return group
    }
    if (pending.action === 'join' && pending.inviteCode) {
      const group = await joinSchoolByCode(userId, pending.inviteCode)
      socialStore.clearPendingGroup()
      return group
    }
  } catch {
    // Keep pending so user can retry after sign-in
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [school, setSchool] = useState<SchoolGroup | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [syncError, setSyncError] = useState<string | null>(null)
  const [pendingGroup, setPendingGroupState] = useState(socialStore.getPendingGroup())
  const [localInviteCode, setLocalInviteCode] = useState(socialStore.getLocalInviteCode())
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refreshLeaderboard = useCallback(async (schoolId?: string, userId?: string) => {
    const sid = schoolId ?? school?.id
    const uid = userId ?? user?.id
    if (!sid || !uid) {
      setLeaderboard([])
      return
    }
    const rows = await fetchLeaderboard(sid, uid)
    setLeaderboard(rows)
  }, [school?.id, user?.id])

  const syncProgressNow = useCallback(async () => {
    if (!auth || !user) return
    try {
      setSyncError(null)
      await upsertProfile(user.id, masteryEngine.getState(), {
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      })
      await refreshLeaderboard()
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Sync failed')
    }
  }, [user, refreshLeaderboard])

  const hydrateSession = useCallback(
    async (firebaseUser: User) => {
      const authUser = firebaseUserToAuthUser(firebaseUser)
      const row = await fetchProfile(firebaseUser.uid)

      if (row) {
        const remote = cloudRowToUserProgress(row)
        const merged = mergeUserProgress(masteryEngine.getState(), remote)
        masteryEngine.replaceState(merged)
        masteryEngine.notify()
        setUser(rowToAuthUser(row))

        let group: SchoolGroup | null = null
        if (row.schoolId) {
          group = await fetchSchool(row.schoolId)
        } else {
          group = await processPendingGroup(firebaseUser.uid)
        }
        setSchool(group)
        if (group) await refreshLeaderboard(group.id, firebaseUser.uid)
      } else {
        setUser(authUser)
        await upsertProfile(firebaseUser.uid, masteryEngine.getState(), {
          email: authUser.email,
          displayName: authUser.displayName,
          avatarUrl: authUser.avatarUrl,
        })
        const group = await processPendingGroup(firebaseUser.uid)
        setSchool(group)
        if (group) await refreshLeaderboard(group.id, firebaseUser.uid)
      }
    },
    [refreshLeaderboard],
  )

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        hydrateSession(firebaseUser).finally(() => setLoading(false))
      } else {
        setUser(null)
        setSchool(null)
        setLeaderboard([])
        setLoading(false)
      }
    })

    return unsub
  }, [hydrateSession])

  useEffect(() => {
    const scheduleSync = () => {
      if (!user) return
      if (syncTimer.current) clearTimeout(syncTimer.current)
      syncTimer.current = setTimeout(() => {
        void syncProgressNow()
      }, 2000)
    }

    window.addEventListener('enlight-progress', scheduleSync)
    return () => {
      window.removeEventListener('enlight-progress', scheduleSync)
      if (syncTimer.current) clearTimeout(syncTimer.current)
    }
  }, [user, syncProgressNow])

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      setSyncError('Add Firebase config to .env.local — see .env.example.')
      return
    }
    setSyncError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      trackSignIn('google')
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Sign-in failed')
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!auth) return
    await firebaseSignOut(auth)
    setUser(null)
    setSchool(null)
    setLeaderboard([])
  }, [])

  const queueCreateGroup = useCallback((name: string, type: GroupType) => {
    const code = generateInviteCode(type)
    socialStore.setPendingGroup({ action: 'create', name, type })
    socialStore.setLocalInviteCode(code)
    setPendingGroupState(socialStore.getPendingGroup())
    setLocalInviteCode(code)
    return code
  }, [])

  const queueJoinGroup = useCallback((inviteCode: string) => {
    const code = normalizeInviteCode(inviteCode)
    if (!isValidInviteCode(code)) {
      throw new Error('Invite code must look like SCH-ABC123 or CLN-ABC123')
    }
    socialStore.setPendingGroup({ action: 'join', inviteCode: code })
    setPendingGroupState(socialStore.getPendingGroup())
  }, [])

  const createGroupNow = useCallback(
    async (name: string, type: GroupType) => {
      if (!user) throw new Error('Sign in with Google first')
      const code = socialStore.getLocalInviteCode()
      const group = await createSchool(user.id, name, type, code)
      socialStore.clearPendingGroup()
      socialStore.clearLocalInviteCode()
      setPendingGroupState(undefined)
      setLocalInviteCode(undefined)
      setSchool(group)
      await refreshLeaderboard(group.id, user.id)
      return group
    },
    [user, refreshLeaderboard],
  )

  const joinGroupNow = useCallback(
    async (inviteCode: string) => {
      if (!user) throw new Error('Sign in with Google first')
      const group = await joinSchoolByCode(user.id, inviteCode)
      socialStore.clearPendingGroup()
      setPendingGroupState(undefined)
      setSchool(group)
      await refreshLeaderboard(group.id, user.id)
      return group
    },
    [user, refreshLeaderboard],
  )

  const leaveGroupHandler = useCallback(async () => {
    if (!user) return
    await leaveSchool(user.id)
    setSchool(null)
    setLeaderboard([])
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured: isFirebaseConfigured,
      loading,
      user,
      school,
      leaderboard,
      pendingGroup,
      localInviteCode,
      syncError,
      signInWithGoogle,
      signOut,
      queueCreateGroup,
      queueJoinGroup,
      createGroupNow,
      joinGroupNow,
      leaveGroup: leaveGroupHandler,
      refreshLeaderboard,
      syncProgressNow,
    }),
    [
      loading,
      user,
      school,
      leaderboard,
      pendingGroup,
      localInviteCode,
      syncError,
      signInWithGoogle,
      signOut,
      queueCreateGroup,
      queueJoinGroup,
      createGroupNow,
      joinGroupNow,
      leaveGroupHandler,
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
