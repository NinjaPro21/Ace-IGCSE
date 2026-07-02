import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DEFAULT_POMODORO,
  loadPomodoroSettings,
  savePomodoroSettings,
  type PomodoroSettings,
} from '@/lib/pomodoroSettings'

export type PomodoroPhase = 'work' | 'break'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export interface PomodoroState {
  display: string
  running: boolean
  finished: boolean
  phase: PomodoroPhase
  settings: PomodoroSettings
  setWorkMinutes: (minutes: number) => void
  setBreakMinutes: (minutes: number) => void
  start: () => void
  pause: () => void
  reset: () => void
  toggle: () => void
}

export function usePomodoro(initialSettings?: PomodoroSettings): PomodoroState {
  const [settings, setSettings] = useState<PomodoroSettings>(
    () => initialSettings ?? loadPomodoroSettings(),
  )
  const [phase, setPhase] = useState<PomodoroPhase>('work')
  const [secondsLeft, setSecondsLeft] = useState(() => settings.workMinutes * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const applySettings = useCallback(
    (next: PomodoroSettings) => {
      setSettings(next)
      savePomodoroSettings(next)
      setRunning(false)
      setPhase('work')
      setSecondsLeft(next.workMinutes * 60)
    },
    [],
  )

  const setWorkMinutes = useCallback(
    (minutes: number) => {
      const next = { ...settings, workMinutes: Math.min(90, Math.max(1, Math.round(minutes))) }
      applySettings(next)
    },
    [applySettings, settings],
  )

  const setBreakMinutes = useCallback(
    (minutes: number) => {
      const next = { ...settings, breakMinutes: Math.min(30, Math.max(1, Math.round(minutes))) }
      applySettings(next)
    },
    [applySettings, settings],
  )

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

  const prevRunning = useRef(false)
  useEffect(() => {
    if (running) prevRunning.current = true
  }, [running])

  useEffect(() => {
    if (secondsLeft !== 0 || running || !prevRunning.current) return
    prevRunning.current = false
    if (phase === 'work') {
      setPhase('break')
      setSecondsLeft(settings.breakMinutes * 60)
    } else {
      setPhase('work')
      setSecondsLeft(settings.workMinutes * 60)
    }
  }, [secondsLeft, running, phase, settings.breakMinutes, settings.workMinutes])

  const reset = useCallback(() => {
    setRunning(false)
    setPhase('work')
    setSecondsLeft(settings.workMinutes * 60)
  }, [settings.workMinutes])

  const start = useCallback(() => {
    if (secondsLeft > 0) setRunning(true)
  }, [secondsLeft])

  const pause = useCallback(() => setRunning(false), [])

  const toggle = useCallback(() => {
    if (secondsLeft === 0) {
      setPhase('work')
      setSecondsLeft(settings.workMinutes * 60)
      setRunning(true)
    } else {
      setRunning((r) => !r)
    }
  }, [secondsLeft, settings.workMinutes])

  return {
    display: formatTime(secondsLeft),
    running,
    finished: secondsLeft === 0 && !running,
    phase,
    settings,
    setWorkMinutes,
    setBreakMinutes,
    start,
    pause,
    reset,
    toggle,
  }
}

export { DEFAULT_POMODORO }
