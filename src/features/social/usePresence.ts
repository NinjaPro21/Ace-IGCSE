import { useEffect } from 'react'
import { clearPresence, updatePresence, type PresenceStatus } from './presenceApi'

const HEARTBEAT_MS = 45_000

export function usePresence(
  userId: string | undefined,
  opts: {
    status: PresenceStatus
    subjectId?: string
    currentChapterId?: string
    currentTopicId?: string
    topicTitle?: string
    enabled?: boolean
  },
): void {
  const { status, subjectId, currentChapterId, currentTopicId, topicTitle, enabled = true } = opts

  useEffect(() => {
    if (!userId || !enabled) return

    const write = () => {
      void updatePresence(userId, {
        status,
        subjectId,
        currentChapterId,
        currentTopicId,
        topicTitle,
      })
    }

    write()
    const interval = setInterval(write, HEARTBEAT_MS)

    const onUnload = () => {
      void clearPresence(userId)
    }
    window.addEventListener('beforeunload', onUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', onUnload)
      void clearPresence(userId)
    }
  }, [userId, status, subjectId, currentChapterId, currentTopicId, topicTitle, enabled])
}
