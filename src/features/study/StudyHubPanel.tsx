import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import { masteryEngine } from '@/features/mastery/MasteryEngine'
import { usePomodoro } from '@/hooks/usePomodoro'
import { getAllSubjects, getChaptersForSubject } from '@/lib/contentLoader'
import { localDateISO } from '@/lib/localDate'
import { getStudyTaskPath } from '@/lib/studyPlanPaths'

const WORK_OPTIONS = [15, 20, 25, 30, 45]
const BREAK_OPTIONS = [3, 5, 10, 15]

export function StudyHubPanel() {
  const { progress } = useMastery()
  const [subjectId, setSubjectId] = useState(progress.subjects?.[0] ?? 'add-maths-0606')
  const [chapterId, setChapterId] = useState('')
  const pomodoro = usePomodoro()

  const today = localDateISO()
  const tasks = useMemo(
    () => (progress.studyPlanTasks ?? []).filter((t) => t.forDate === today),
    [progress.studyPlanTasks, today],
  )
  const doneCount = tasks.filter((t) => t.done).length
  const subjects = getAllSubjects()
  const chapters = useMemo(() => getChaptersForSubject(subjectId), [subjectId])

  useEffect(() => {
    if (!chapterId && chapters[0]) setChapterId(chapters[0].id)
  }, [chapters, chapterId])

  const handleAddTask = () => {
    if (!chapterId) return
    masteryEngine.addStudyPlanTask(subjectId, chapterId, today)
    masteryEngine.notify()
  }

  return (
    <section className="ace-study-session" data-tour="dashboard-study-hub">
      <EnlightSectionLabel>Study session</EnlightSectionLabel>

      <div className="ace-study-session__grid">
        <div className={`ace-study-timer${pomodoro.sessionActive ? ' ace-study-timer--live' : ''}`}>
          <p className="ace-study-timer__label">
            {pomodoro.sessionActive ? (pomodoro.phase === 'work' ? 'Focus' : 'Break') : 'Ready'}
          </p>
          <button
            type="button"
            className={[
              'ace-study-timer__clock',
              pomodoro.running ? 'ace-study-timer__clock--running' : '',
              pomodoro.phase === 'break' ? 'ace-study-timer__clock--break' : '',
            ].join(' ')}
            onClick={() => pomodoro.sessionActive && pomodoro.toggle()}
            disabled={!pomodoro.sessionActive}
            aria-label={
              pomodoro.sessionActive
                ? `Timer ${pomodoro.display}. Click to pause or resume.`
                : `Timer ${pomodoro.display}`
            }
          >
            {pomodoro.display}
          </button>
          {pomodoro.sessionActive ? (
            <div className="ace-study-timer__actions">
              <button type="button" className="ace-link-btn" onClick={pomodoro.toggle}>
                {pomodoro.running ? 'Pause' : 'Resume'}
              </button>
              <button type="button" className="ace-link-btn" onClick={pomodoro.reset}>
                Reset
              </button>
              <button type="button" className="ace-link-btn" onClick={pomodoro.endSession}>
                End
              </button>
            </div>
          ) : (
            <p className="ace-study-timer__hint">Start a session to begin.</p>
          )}
          <div className="ace-study-timer__settings">
            <label className="ace-study-timer__chip">
              <span>Focus</span>
              <select
                className="ace-select ace-select--chip"
                value={pomodoro.settings.workMinutes}
                onChange={(e) => pomodoro.setWorkMinutes(Number(e.target.value))}
                disabled={pomodoro.sessionActive && pomodoro.running}
                aria-label="Focus duration"
              >
                {WORK_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m}m</option>
                ))}
              </select>
            </label>
            <label className="ace-study-timer__chip">
              <span>Break</span>
              <select
                className="ace-select ace-select--chip"
                value={pomodoro.settings.breakMinutes}
                onChange={(e) => pomodoro.setBreakMinutes(Number(e.target.value))}
                disabled={pomodoro.sessionActive && pomodoro.running}
                aria-label="Break duration"
              >
                {BREAK_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m}m</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="ace-study-plan">
          <div className="ace-study-plan__head">
            <div>
              <h2 className="ace-study-plan__title">Today&apos;s plan</h2>
              <p className="ace-study-plan__sub">
                {tasks.length === 0
                  ? '0 chapters'
                  : `${doneCount} of ${tasks.length} chapter${tasks.length === 1 ? '' : 's'} done`}
              </p>
            </div>
            {!pomodoro.sessionActive ? (
              <EnlightButton onClick={pomodoro.startSession}>Start session</EnlightButton>
            ) : (
              <EnlightButton variant="outline" onClick={pomodoro.endSession}>
                End session
              </EnlightButton>
            )}
          </div>

          <div className="ace-study-plan__add">
            <select
              className="ace-select"
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value)
                setChapterId('')
              }}
              aria-label="Subject"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              className="ace-select"
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              aria-label="Chapter"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  Ch {c.number}: {c.title}
                </option>
              ))}
            </select>
            <EnlightButton
              className="ace-study-plan__add-btn"
              onClick={handleAddTask}
              disabled={!chapterId}
            >
              + Add
            </EnlightButton>
          </div>

          {tasks.length === 0 ? (
            <div className="ace-study-plan__empty">
              No chapters queued — add one above.
            </div>
          ) : (
            <ul className="ace-study-plan__tasks">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`ace-study-plan__task${task.done ? ' ace-study-plan__task--done' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="ace-study-plan__check"
                    checked={task.done}
                    aria-label={`Mark ${task.chapterTitle} done`}
                    onChange={() => {
                      masteryEngine.toggleStudyPlanTask(task.id)
                      masteryEngine.notify()
                    }}
                  />
                  <div className="ace-study-plan__task-body">
                    <Link to={getStudyTaskPath(task)} className="ace-study-plan__task-link">
                      {task.chapterTitle}
                    </Link>
                    {'topicTitle' in task && task.topicTitle ? (
                      <span className="ace-study-plan__task-topic">{task.topicTitle}</span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="ace-study-plan__remove"
                    aria-label="Remove task"
                    onClick={() => {
                      masteryEngine.removeStudyPlanTask(task.id)
                      masteryEngine.notify()
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
