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
      // Consume the sentinel entry pushed by trapBack, otherwise the first
      // Back press after the quiz ends lands on the same URL and does nothing.
      const state = window.history.state as { enlightQuizGuard?: boolean } | null
      if (state?.enlightQuizGuard) {
        window.history.back()
      }
    }
  }, [active])
}
