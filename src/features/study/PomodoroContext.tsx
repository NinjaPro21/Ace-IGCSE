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
import { useAuth } from '@/features/social/AuthContext'
import { trackEvent } from '@/lib/analytics'
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
    workSecAccrued: 0,
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
  const { user } = useAuth()
  const uid = user?.id

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

  // Work seconds ticked but not yet credited to the mastery engine. Crediting
  // actual elapsed seconds (instead of a fixed workMinutes block on every
  // work→break transition) keeps focus credit correct across refreshes and
  // partial blocks.
  const workSecAccruedRef = useRef(state.workSecAccrued ?? 0)
  const phaseRef = useRef(phase)
  const sessionActiveRef = useRef(sessionActive)
  useEffect(() => {
    phaseRef.current = phase
    sessionActiveRef.current = sessionActive
  }, [phase, sessionActive])

  const flushFocusCredit = useCallback(() => {
    const sec = Math.round(workSecAccruedRef.current)
    workSecAccruedRef.current = 0
    if (sec > 0) {
      masteryEngine.recordFocusStudySec(sec)
      masteryEngine.notify()
      try {
        const subjectId = masteryEngine.getState().lastVisitedSubjectId
        trackEvent(
          'study_time_credited',
          { seconds: sec, subjectId, subject: subjectId },
          { uid },
        )
      } catch {
        // analytics silent
      }
    }
  }, [uid])

  // Credit focus seconds carried over from a previous page load (hydration).
  useEffect(() => {
    flushFocusCredit()
  }, [flushFocusCredit])

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
        workSecAccrued: workSecAccruedRef.current,
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
    flushFocusCredit()
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
  }, [persistRuntime, flushFocusCredit])

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

  // Interval depends only on `running` — including secondsLeft in the deps
  // recreated the interval every tick, causing drift under load.
  useEffect(() => {
    if (!running) {
      clear()
      return clear
    }
    intervalRef.current = setInterval(() => {
      if (phaseRef.current === 'work' && sessionActiveRef.current) {
        workSecAccruedRef.current += 1
      }
      setState((prev) => {
        if (prev.secondsLeft <= 0) {
          return prev.running ? { ...prev, running: false } : prev
        }
        const nextSeconds = prev.secondsLeft - 1
        return { ...prev, secondsLeft: nextSeconds, running: nextSeconds > 0 }
      })
    }, 1000)
    return clear
  }, [running, clear])

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
    if (prevPhaseRef.current === 'work' && phase === 'break') {
      flushFocusCredit()
    }
    prevPhaseRef.current = phase
  }, [phase, flushFocusCredit])

  const reset = useCallback(() => {
    flushFocusCredit()
    setRunning(false)
    setPhase('work')
    setSecondsLeft(settings.workMinutes * 60)
    persistRuntime({
      phase: 'work',
      secondsLeft: settings.workMinutes * 60,
      running: false,
    })
  }, [settings.workMinutes, persistRuntime, flushFocusCredit])

  const start = useCallback(() => {
    if (secondsLeft > 0) {
      primePomodoroAudio()
      setRunning(true)
      setSessionActive(true)
      persistRuntime({ running: true, sessionActive: true })
    }
  }, [secondsLeft, persistRuntime])

  const pause = useCallback(() => {
    flushFocusCredit()
    setRunning(false)
    persistRuntime({ running: false })
  }, [persistRuntime, flushFocusCredit])

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
      flushFocusCredit()
      persistRuntime({ running: false })
      return false
    })
  }, [secondsLeft, settings.workMinutes, persistRuntime, flushFocusCredit])

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
    flushFocusCredit()
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
  }, [settings.workMinutes, persistRuntime, flushFocusCredit])

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
