import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import {
  DEFAULT_POMODORO,
  loadPomodoroSettings,
  savePomodoroSettings,
  type PomodoroSettings,
} from '@/lib/pomodoroSettings'
import {
  hydratePomodoroRuntime,
  loadPomodoroRuntime,
  savePomodoroRuntime,
} from '@/lib/pomodoroRuntime'
import { playPomodoroFinishSound, primePomodoroAudio } from '@/lib/pomodoroSound'

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
  sessionActive: boolean
  settings: PomodoroSettings
  setWorkMinutes: (minutes: number) => void
  setBreakMinutes: (minutes: number) => void
  start: () => void
  pause: () => void
  reset: () => void
  toggle: () => void
  startSession: () => void
  endSession: () => void
}

const PomodoroContext = createContext<PomodoroState | null>(null)

function initialRuntime(settings: PomodoroSettings) {
  const saved = loadPomodoroRuntime()
  if (saved) {
    const hydrated = hydratePomodoroRuntime(saved, settings)
    return hydrated
  }
  return {
    phase: 'work' as PomodoroPhase,
    secondsLeft: settings.workMinutes * 60,
    running: false,
    sessionActive: false,
  }
}

function createInitialState(settings: PomodoroSettings) {
  const hydrated = initialRuntime(settings)
  return {
    settings,
    ...hydrated,
  }
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => createInitialState(loadPomodoroSettings()))
  const { settings, phase, secondsLeft, running, sessionActive } = state

  const setSettings = (next: PomodoroSettings) =>
    setState((prev) => ({ ...prev, settings: next }))
  const setPhase = (next: PomodoroPhase | ((p: PomodoroPhase) => PomodoroPhase)) =>
    setState((prev) => ({
      ...prev,
      phase: typeof next === 'function' ? next(prev.phase) : next,
    }))
  const setSecondsLeft = (next: number | ((s: number) => number)) =>
    setState((prev) => ({
      ...prev,
      secondsLeft: typeof next === 'function' ? next(prev.secondsLeft) : next,
    }))
  const setRunning = (next: boolean | ((r: boolean) => boolean)) =>
    setState((prev) => ({
      ...prev,
      running: typeof next === 'function' ? next(prev.running) : next,
    }))
  const setSessionActive = (next: boolean) =>
    setState((prev) => ({ ...prev, sessionActive: next }))

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevPhaseRef = useRef(phase)

  const persistRuntime = useCallback(
    (
      next: Partial<{
        phase: PomodoroPhase
        secondsLeft: number
        running: boolean
        sessionActive: boolean
      }>,
    ) => {
      savePomodoroRuntime({
        phase: next.phase ?? phase,
        secondsLeft: next.secondsLeft ?? secondsLeft,
        running: next.running ?? running,
        sessionActive: next.sessionActive ?? sessionActive,
        savedAt: Date.now(),
      })
    },
    [phase, secondsLeft, running, sessionActive],
  )

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const applySettings = useCallback((next: PomodoroSettings) => {
    setSettings(next)
    savePomodoroSettings(next)
    setRunning(false)
    setPhase('work')
    setSecondsLeft(next.workMinutes * 60)
    persistRuntime({
      phase: 'work',
      secondsLeft: next.workMinutes * 60,
      running: false,
    })
  }, [persistRuntime])

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

  useEffect(() => {
    persistRuntime({})
  }, [phase, secondsLeft, running, sessionActive, persistRuntime])

  const prevRunning = useRef(false)
  useEffect(() => {
    if (running) prevRunning.current = true
  }, [running])

  useEffect(() => {
    if (secondsLeft !== 0 || running || !prevRunning.current) return
    prevRunning.current = false
    playPomodoroFinishSound()
    if (phase === 'work') {
      setPhase('break')
      setSecondsLeft(settings.breakMinutes * 60)
    } else {
      setPhase('work')
      setSecondsLeft(settings.workMinutes * 60)
    }
  }, [secondsLeft, running, phase, settings.breakMinutes, settings.workMinutes])

  useEffect(() => {
    if (!sessionActive) {
      prevPhaseRef.current = phase
      return
    }
    if (prevPhaseRef.current === 'work' && phase === 'break') {
      masteryEngine.recordFocusStudySec(settings.workMinutes * 60)
      masteryEngine.notify()
    }
    prevPhaseRef.current = phase
  }, [phase, sessionActive, settings.workMinutes])

  const reset = useCallback(() => {
    setRunning(false)
    setPhase('work')
    setSecondsLeft(settings.workMinutes * 60)
    persistRuntime({
      phase: 'work',
      secondsLeft: settings.workMinutes * 60,
      running: false,
    })
  }, [settings.workMinutes, persistRuntime])

  const start = useCallback(() => {
    if (secondsLeft > 0) {
      primePomodoroAudio()
      setRunning(true)
      setSessionActive(true)
      persistRuntime({ running: true, sessionActive: true })
    }
  }, [secondsLeft, persistRuntime])

  const pause = useCallback(() => {
    setRunning(false)
    persistRuntime({ running: false })
  }, [persistRuntime])

  const toggle = useCallback(() => {
    if (secondsLeft === 0) {
      setPhase('work')
      setSecondsLeft(settings.workMinutes * 60)
      primePomodoroAudio()
      setRunning(true)
      setSessionActive(true)
      persistRuntime({
        phase: 'work',
        secondsLeft: settings.workMinutes * 60,
        running: true,
        sessionActive: true,
      })
      return
    }
    setRunning((wasRunning) => {
      if (!wasRunning) {
        primePomodoroAudio()
        setSessionActive(true)
        persistRuntime({ running: true, sessionActive: true })
        return true
      }
      persistRuntime({ running: false })
      return false
    })
  }, [secondsLeft, settings.workMinutes, persistRuntime])

  const startSession = useCallback(() => {
    setSessionActive(true)
    setPhase('work')
    setSecondsLeft(settings.workMinutes * 60)
    primePomodoroAudio()
    setRunning(true)
    persistRuntime({
      sessionActive: true,
      phase: 'work',
      secondsLeft: settings.workMinutes * 60,
      running: true,
    })
  }, [settings.workMinutes, persistRuntime])

  const endSession = useCallback(() => {
    setSessionActive(false)
    setRunning(false)
    setPhase('work')
    setSecondsLeft(settings.workMinutes * 60)
    persistRuntime({
      sessionActive: false,
      phase: 'work',
      secondsLeft: settings.workMinutes * 60,
      running: false,
    })
  }, [settings.workMinutes, persistRuntime])

  const value: PomodoroState = {
    display: formatTime(secondsLeft),
    running,
    finished: secondsLeft === 0 && !running,
    phase,
    sessionActive,
    settings,
    setWorkMinutes,
    setBreakMinutes,
    start,
    pause,
    reset,
    toggle,
    startSession,
    endSession,
  }

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}

export function usePomodoro(): PomodoroState {
  const ctx = useContext(PomodoroContext)
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider')
  return ctx
}

export { DEFAULT_POMODORO }
