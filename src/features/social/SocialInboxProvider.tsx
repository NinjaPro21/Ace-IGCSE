import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from './AuthContext'
import { fetchPendingFriendRequests, respondFriendRequest, type FriendRequest } from './friendsApi'
import {
  duelNeedsAction,
  fetchUserDuels,
  respondDuel,
  type Duel,
} from './duelsApi'
import { dismissInboxIds, getDismissedInboxIds } from '@/lib/inboxDismissals'

function canDismissDuel(d: Duel, userId: string): boolean {
  if (d.status === 'pending' && d.opponentUid === userId) return false
  if (duelNeedsAction(d, userId)) return false
  return true
}

interface SocialInboxContextValue {
  friendRequests: FriendRequest[]
  duels: Duel[]
  visibleDuels: Duel[]
  loading: boolean
  pendingCount: number
  clearableCount: number
  refresh: () => Promise<void>
  clearInbox: () => void
  acceptFriend: (id: string) => Promise<void>
  declineFriend: (id: string) => Promise<void>
  acceptDuel: (id: string) => Promise<void>
  declineDuel: (id: string) => Promise<void>
}

const SocialInboxContext = createContext<SocialInboxContextValue | null>(null)

export function SocialInboxProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [duels, setDuels] = useState<Duel[]>([])
  const [loading, setLoading] = useState(false)
  const [dismissTick, setDismissTick] = useState(0)

  const dismissedIds = useMemo(() => getDismissedInboxIds(), [dismissTick, duels])

  const visibleDuels = useMemo(
    () => duels.filter((d) => !dismissedIds.has(d.id)),
    [duels, dismissedIds],
  )

  const clearInbox = useCallback(() => {
    if (!user) return
    const toDismiss = duels.filter((d) => canDismissDuel(d, user.id)).map((d) => d.id)
    dismissInboxIds(toDismiss)
    setDismissTick((t) => t + 1)
  }, [duels, user])

  const clearableCount = useMemo(() => {
    if (!user) return 0
    return visibleDuels.filter((d) => canDismissDuel(d, user.id)).length
  }, [user, visibleDuels])

  const refreshFriends = useCallback(async () => {
    if (!user) {
      setFriendRequests([])
      return
    }
    const reqs = await fetchPendingFriendRequests(user.id)
    setFriendRequests(reqs)
  }, [user])

  const refresh = useCallback(async () => {
    if (!user) {
      setFriendRequests([])
      setDuels([])
      return
    }
    setLoading(true)
    try {
      await refreshFriends()
      const duelRows = await fetchUserDuels(user.id)
      setDuels(duelRows.filter((d) => d.status === 'pending' || d.status === 'active' || d.status === 'complete'))
    } finally {
      setLoading(false)
    }
  }, [user, refreshFriends])

  useEffect(() => {
    void refreshFriends()
    const interval = setInterval(() => void refreshFriends(), 30_000)
    return () => clearInterval(interval)
  }, [refreshFriends])

  useEffect(() => {
    if (!user || !db) {
      setDuels([])
      return
    }

    let cancelled = false
    const loadDuels = async () => {
      const rows = await fetchUserDuels(user.id)
      if (!cancelled) {
        setDuels(rows.filter((d) => d.status === 'pending' || d.status === 'active' || d.status === 'complete'))
      }
    }

    void loadDuels()

    const challengerQ = query(collection(db, 'duels'), where('challengerUid', '==', user.id), limit(20))
    const opponentQ = query(collection(db, 'duels'), where('opponentUid', '==', user.id), limit(20))

    const unsubA = onSnapshot(challengerQ, () => void loadDuels(), () => void loadDuels())
    const unsubB = onSnapshot(opponentQ, () => void loadDuels(), () => void loadDuels())

    return () => {
      cancelled = true
      unsubA()
      unsubB()
    }
  }, [user])

  const acceptFriend = async (id: string) => {
    if (!user) return
    await respondFriendRequest(id, user.id, true)
    window.dispatchEvent(new CustomEvent('enlight-friends-changed'))
    await refreshFriends()
  }

  const declineFriend = async (id: string) => {
    if (!user) return
    await respondFriendRequest(id, user.id, false)
    await refreshFriends()
  }

  const acceptDuel = async (id: string) => {
    if (!user) return
    await respondDuel(id, user.id, true)
  }

  const declineDuel = async (id: string) => {
    if (!user) return
    await respondDuel(id, user.id, false)
  }

  const pendingCount = useMemo(() => {
    if (!user) return 0
    const incomingFriends = friendRequests.length
    const incomingDuels = visibleDuels.filter((d) => d.status === 'pending' && d.opponentUid === user.id).length
    const actionDuels = visibleDuels.filter((d) => duelNeedsAction(d, user.id)).length
    return incomingFriends + incomingDuels + actionDuels
  }, [visibleDuels, friendRequests.length, user])

  const value = useMemo(
    () => ({
      friendRequests,
      duels,
      visibleDuels,
      loading,
      pendingCount,
      clearableCount,
      refresh,
      clearInbox,
      acceptFriend,
      declineFriend,
      acceptDuel,
      declineDuel,
    }),
    [friendRequests, duels, visibleDuels, loading, pendingCount, clearableCount, refresh, clearInbox],
  )

  return <SocialInboxContext.Provider value={value}>{children}</SocialInboxContext.Provider>
}

export function useSocialInbox() {
  const ctx = useContext(SocialInboxContext)
  if (!ctx) throw new Error('useSocialInbox must be used within SocialInboxProvider')
  return ctx
}
