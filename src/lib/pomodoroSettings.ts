export interface PomodoroSettings {
  workMinutes: number
  breakMinutes: number
}

export const POMODORO_STORAGE_KEY = 'enlight-pomodoro-settings'

export const DEFAULT_POMODORO: PomodoroSettings = {
  workMinutes: 25,
  breakMinutes: 5,
}

export function loadPomodoroSettings(): PomodoroSettings {
  try {
    const raw = localStorage.getItem(POMODORO_STORAGE_KEY)
    if (!raw) return DEFAULT_POMODORO
    const parsed = JSON.parse(raw) as Partial<PomodoroSettings>
    return {
      workMinutes: clampMinutes(parsed.workMinutes ?? DEFAULT_POMODORO.workMinutes),
      breakMinutes: clampMinutes(parsed.breakMinutes ?? DEFAULT_POMODORO.breakMinutes),
    }
  } catch {
    return DEFAULT_POMODORO
  }
}

export function savePomodoroSettings(settings: PomodoroSettings): void {
  localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(settings))
}

function clampMinutes(n: number): number {
  return Math.min(90, Math.max(1, Math.round(n)))
}
