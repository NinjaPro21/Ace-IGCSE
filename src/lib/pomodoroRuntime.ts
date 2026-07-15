export type PomodoroPhase = 'work' | 'break'

export const POMODORO_RUNTIME_KEY = 'enlight-pomodoro-runtime'

export interface PomodoroRuntime {
  phase: PomodoroPhase
  secondsLeft: number
  running: boolean
  sessionActive: boolean
  /** Work seconds completed but not yet credited to the mastery engine. */
  workSecAccrued?: number
  savedAt: number
}

export function loadPomodoroRuntime(): PomodoroRuntime | null {
  try {
    const raw = localStorage.getItem(POMODORO_RUNTIME_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PomodoroRuntime>
    if (
      (parsed.phase !== 'work' && parsed.phase !== 'break') ||
      typeof parsed.secondsLeft !== 'number' ||
      typeof parsed.running !== 'boolean' ||
      typeof parsed.sessionActive !== 'boolean' ||
      typeof parsed.savedAt !== 'number'
    ) {
      return null
    }
    return {
      phase: parsed.phase,
      secondsLeft: Math.max(0, Math.round(parsed.secondsLeft)),
      running: parsed.running,
      sessionActive: parsed.sessionActive,
      workSecAccrued:
        typeof parsed.workSecAccrued === 'number' ? Math.max(0, Math.round(parsed.workSecAccrued)) : 0,
      savedAt: parsed.savedAt,
    }
  } catch {
    return null
  }
}

export function savePomodoroRuntime(runtime: PomodoroRuntime): void {
  try {
    localStorage.setItem(POMODORO_RUNTIME_KEY, JSON.stringify(runtime))
  } catch {
    // ignore quota errors
  }
}

export function clearPomodoroRuntime(): void {
  try {
    localStorage.removeItem(POMODORO_RUNTIME_KEY)
  } catch {
    // ignore
  }
}

/** Catch up elapsed time when restoring a running timer (e.g. after navigation or refresh). */
export function hydratePomodoroRuntime(
  saved: PomodoroRuntime,
  settings: { workMinutes: number; breakMinutes: number },
): Omit<PomodoroRuntime, 'savedAt'> {
  let { phase, secondsLeft, running, sessionActive } = saved
  let workSecAccrued = saved.workSecAccrued ?? 0
  if (!running) {
    return { phase, secondsLeft, running, sessionActive, workSecAccrued }
  }

  let elapsed = Math.floor((Date.now() - saved.savedAt) / 1000)
  // Work seconds consumed while away still count as focus time, but cap the
  // catch-up at one full work block so a tab left running overnight can't
  // farm hours of streak/study credit.
  let catchUpWorkSec = 0
  const catchUpCap = settings.workMinutes * 60
  while (elapsed > 0) {
    if (elapsed < secondsLeft) {
      if (phase === 'work' && sessionActive) catchUpWorkSec += elapsed
      secondsLeft -= elapsed
      elapsed = 0
      break
    }
    if (phase === 'work' && sessionActive) catchUpWorkSec += secondsLeft
    elapsed -= secondsLeft
    if (phase === 'work') {
      phase = 'break'
      secondsLeft = settings.breakMinutes * 60
    } else {
      phase = 'work'
      secondsLeft = settings.workMinutes * 60
    }
  }
  workSecAccrued += Math.min(catchUpWorkSec, catchUpCap)

  return { phase, secondsLeft, running, sessionActive, workSecAccrued }
}
