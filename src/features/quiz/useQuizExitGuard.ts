import { useEffect } from 'react'

const LEAVE_MESSAGE =
  'Leave this quiz? Your current attempt will not be saved and will not count as a pass or fail.'

export function confirmQuizExit(): boolean {
  return window.confirm(LEAVE_MESSAGE)
}

/**
 * Warn on tab close and browser back during an active quiz.
 * (In-app route changes use the Exit button confirmation — useBlocker needs a data router.)
 */
export function useQuizExitGuard(active: boolean): void {
  useEffect(() => {
    if (!active) return

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    const trapBack = () => {
      window.history.pushState({ enlightQuizGuard: true }, '')
    }

    const onPopState = () => {
      if (confirmQuizExit()) {
        window.removeEventListener('popstate', onPopState)
        window.history.back()
        return
      }
      trapBack()
    }

    trapBack()
    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('popstate', onPopState)
    }
  }, [active])
}
