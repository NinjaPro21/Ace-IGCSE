import { useState } from 'react'
import { usePomodoro } from '@/hooks/usePomodoro'

const WORK_OPTIONS = [15, 20, 25, 30, 45]
const BREAK_OPTIONS = [3, 5, 10, 15]

interface PomodoroControlProps {
  compact?: boolean
  className?: string
}

export function PomodoroControl({ compact = false, className = '' }: PomodoroControlProps) {
  const {
    display,
    running,
    finished,
    phase,
    sessionActive,
    settings,
    setWorkMinutes,
    setBreakMinutes,
    toggle,
    reset,
    startSession,
  } = usePomodoro()
  const [open, setOpen] = useState(false)

  const handleTimerClick = () => {
    if (!sessionActive) {
      startSession()
      return
    }
    toggle()
  }

  const timerTitle = !sessionActive
    ? 'Click to start study session'
    : finished
      ? `${phase === 'work' ? 'Work' : 'Break'} complete — click to restart`
      : running
        ? 'Click to pause · double-click to reset'
        : 'Click to resume · double-click to reset'

  return (
    <div className={`ace-pomodoro-control ${compact ? 'ace-pomodoro-control--compact' : ''} ${className}`.trim()}>
      <button
        type="button"
        className={`ace-timer${running ? ' ace-timer--running' : ''}${finished ? ' ace-timer--finished' : ''}${phase === 'break' ? ' ace-timer--break' : ''}`}
        onClick={handleTimerClick}
        onDoubleClick={(e) => {
          e.preventDefault()
          reset()
        }}
        title={timerTitle}
        aria-label={`Pomodoro ${phase}: ${display}. ${timerTitle}`}
      >
        <span className="ace-timer__icon" aria-hidden>
          {finished ? '✓' : running ? '⏸' : '▶'}
        </span>
        <span className="ace-timer__phase">{phase === 'work' ? 'Focus' : 'Break'}</span>
        <span className="ace-timer__display">{display}</span>
      </button>

      <button
        type="button"
        className="ace-pomodoro-control__settings-btn"
        aria-expanded={open}
        aria-label="Pomodoro work and break duration"
        onClick={() => setOpen((v) => !v)}
      >
        ⚙
      </button>

      {open && (
        <div className="ace-pomodoro-control__panel" role="dialog" aria-label="Pomodoro settings">
          <p className="ace-pomodoro-control__panel-title">Study timer</p>
          <label className="ace-pomodoro-control__field">
            Focus (min)
            <select
              className="ace-select"
              value={settings.workMinutes}
              onChange={(e) => setWorkMinutes(Number(e.target.value))}
              disabled={sessionActive && running}
            >
              {WORK_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="ace-pomodoro-control__field">
            Break (min)
            <select
              className="ace-select"
              value={settings.breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
              disabled={sessionActive && running}
            >
              {BREAK_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <p className="ace-pomodoro-control__hint">Earn XP from real focus time on each lesson.</p>
        </div>
      )}
    </div>
  )
}
