const AFK_MS = 10 * 60 * 1000

let paused = false
let listeners = new Set<() => void>()

function notify() {
  for (const fn of listeners) fn()
}

export function isStudyPaused(): boolean {
  return paused
}

export function pauseStudy(): void {
  if (paused) return
  paused = true
  notify()
}

export function resumeStudy(): void {
  if (!paused) return
  paused = false
  notify()
}

export function subscribeStudyPause(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const AFK_IDLE_MS = AFK_MS
