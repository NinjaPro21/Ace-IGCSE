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
import {
  fetchPendingFriendRequests,
  respondFriendRequest,
  subscribePendingFriendRequests,
  type FriendRequest,
} from './friendsApi'
import {
  duelNeedsAction,
  mapDuelDoc,
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
    // Friend requests and duels stream in via listeners; only the manual
    // friend-request refresh remains for pull-to-refresh style calls.
    if (!user) {
      setFriendRequests([])
      setDuels([])
      return
    }
    setLoading(true)
    try {
      await refreshFriends()
    } finally {
      setLoading(false)
    }
  }, [user, refreshFriends])

  // Realtime pending friend requests — replaces the old 30s polling loop.
  useEffect(() => {
    if (!user) {
      setFriendRequests([])
      return
    }
    return subscribePendingFriendRequests(user.id, setFriendRequests)
  }, [user])

  useEffect(() => {
    if (!user || !db) {
      setDuels([])
      return
    }

    // Map listener snapshots directly — re-fetching all duels on every
    // snapshot doubled the reads the listener already paid for.
    let challengerRows: Duel[] = []
    let opponentRows: Duel[] = []
    const emit = () => {
      const map = new Map<string, Duel>()
      for (const d of [...challengerRows, ...opponentRows]) map.set(d.id, d)
      const rows = [...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      setDuels(rows.filter((d) => d.status === 'pending' || d.status === 'active' || d.status === 'complete'))
    }

    const challengerQ = query(collection(db, 'duels'), where('challengerUid', '==', user.id), limit(20))
    const opponentQ = query(collection(db, 'duels'), where('opponentUid', '==', user.id), limit(20))

    const unsubA = onSnapshot(challengerQ, (snap) => {
      challengerRows = snap.docs.map((d) => mapDuelDoc(d.id, d.data()))
      emit()
    })
    const unsubB = onSnapshot(opponentQ, (snap) => {
      opponentRows = snap.docs.map((d) => mapDuelDoc(d.id, d.data()))
      emit()
    })

    return () => {
      unsubA()
      unsubB()
    }
  }, [user])

  const acceptFriend = async (id: string) => {
    if (!user) return
    await respondFriendRequest(id, user.id, true)
    window.dispatchEvent(new CustomEvent('ace-friends-changed'))
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
