import { useLocation } from 'react-router-dom'
import { useAuth } from '@/features/social/AuthContext'
import { usePresence } from '@/features/social/usePresence'

/** Browsing presence; lesson/quiz pages override with studying / in_quiz. */
export function SignedInPresence() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const onLesson = /\/topics\//.test(pathname)
  const onQuiz = pathname.startsWith('/quiz/')

  usePresence(user?.id, {
    status: 'online',
    enabled: Boolean(user) && !onLesson && !onQuiz,
  })

  return null
}
