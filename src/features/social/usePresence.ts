import { useEffect } from 'react'

import { clearPresence, updatePresence, type PresenceStatus } from './presenceApi'



// Each heartbeat write fans out a billed read to every friend/group member
// watching this user, so keep it slow. Staleness detection allows up to
// PRESENCE_STALE_MS (presenceApi) without a beat before showing offline.
const HEARTBEAT_MS = 120_000



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

      if (document.visibilityState === 'hidden') return

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



    const onVisibility = () => {

      if (document.visibilityState === 'hidden') {

        void clearPresence(userId)

      } else {

        write()

      }

    }

    document.addEventListener('visibilitychange', onVisibility)



    const onUnload = () => {

      void clearPresence(userId)

    }

    window.addEventListener('beforeunload', onUnload)

    window.addEventListener('pagehide', onUnload)



    return () => {

      clearInterval(interval)

      document.removeEventListener('visibilitychange', onVisibility)

      window.removeEventListener('beforeunload', onUnload)

      window.removeEventListener('pagehide', onUnload)

      if (status === 'studying' || status === 'in_quiz') {

        void updatePresence(userId, { status: 'online' })

      } else {

        void clearPresence(userId)

      }

    }

  }, [userId, status, subjectId, currentChapterId, currentTopicId, topicTitle, enabled])

}

