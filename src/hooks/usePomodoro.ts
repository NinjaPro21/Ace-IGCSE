import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_SECONDS = 25 * 60

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export interface PomodoroState {
  display: string
  running: boolean
  finished: boolean
  start: () => void
  pause: () => void
  reset: () => void
  toggle: () => void
}

export function usePomodoro(initialSeconds = DEFAULT_SECONDS): PomodoroState {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRunning(false)
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clear()
    }
    return clear
  }, [running, secondsLeft, clear])

  const start = useCallback(() => {
    if (secondsLeft > 0) setRunning(true)
  }, [secondsLeft])

  const pause = useCallback(() => setRunning(false), [])

  const reset = useCallback(() => {
    setRunning(false)
    setSecondsLeft(initialSeconds)
  }, [initialSeconds])

  const toggle = useCallback(() => {
    if (secondsLeft === 0) {
      setSecondsLeft(initialSeconds)
      setRunning(true)
    } else {
      setRunning((r) => !r)
    }
  }, [secondsLeft, initialSeconds])

  return {
    display: formatTime(secondsLeft),
    running,
    finished: secondsLeft === 0,
    start,
    pause,
    reset,
    toggle,
  }
}
