import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchPendingFriendRequests, respondFriendRequest, type FriendRequest } from './friendsApi'
import { fetchUserDuels, respondDuel, type Duel } from './duelsApi'

export function useSocialInbox() {
  const { user } = useAuth()
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [duels, setDuels] = useState<Duel[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setFriendRequests([])
      setDuels([])
      return
    }
    setLoading(true)
    try {
      const [reqs, duelRows] = await Promise.all([
        fetchPendingFriendRequests(user.id),
        fetchUserDuels(user.id),
      ])
      setFriendRequests(reqs)
      setDuels(duelRows.filter((d) => d.status === 'pending' || d.status === 'active'))
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
    const interval = setInterval(() => void refresh(), 60_000)
    return () => clearInterval(interval)
  }, [refresh])

  const acceptFriend = async (id: string) => {
    if (!user) return
    await respondFriendRequest(id, user.id, true)
    await refresh()
  }

  const declineFriend = async (id: string) => {
    if (!user) return
    await respondFriendRequest(id, user.id, false)
    await refresh()
  }

  const acceptDuel = async (id: string) => {
    if (!user) return
    await respondDuel(id, user.id, true)
    await refresh()
  }

  const declineDuel = async (id: string) => {
    if (!user) return
    await respondDuel(id, user.id, false)
    await refresh()
  }

  const pendingCount =
    friendRequests.length + duels.filter((d) => d.status === 'pending' && d.opponentUid === user?.id).length

  return {
    friendRequests,
    duels,
    loading,
    pendingCount,
    refresh,
    acceptFriend,
    declineFriend,
    acceptDuel,
    declineDuel,
  }
}
