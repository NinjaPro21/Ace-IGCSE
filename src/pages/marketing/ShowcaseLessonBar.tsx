import { PomodoroControl } from '@/components/PomodoroControl'
import type { TopicMeta } from '@/lib/contentTypes'

const EXPLORER_SHORT: Partial<Record<NonNullable<TopicMeta['explorerId']>, string>> = {
  'line-geometry': 'Coordinate geometry lab',
  'kinematics-guide': 'Motion graph explorer',
  quadratic: 'Quadratic graph explorer',
  trig: 'Trig graph explorer',
  discriminant: 'Discriminant explorer',
}

export function ShowcaseLessonBar({
  chapterTitle,
  sectionLabel,
  explorerId,
}: {
  chapterTitle: string
  sectionLabel: string
  explorerId?: TopicMeta['explorerId']
}) {
  const explorerLabel = explorerId ? EXPLORER_SHORT[explorerId] ?? 'Interactive explorer' : null

  const scrollToExplorer = () => {
    document.getElementById('lesson-explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="ace-showcase-note__mock-bar">
        <span className="ace-showcase-note__mock-label">
          {chapterTitle} · {sectionLabel}
        </span>
        <PomodoroControl compact />
      </div>

      <div className="ace-showcase-lesson-features">
        {explorerLabel && (
          <button type="button" className="ace-showcase-lesson-features__chip ace-showcase-lesson-features__chip--interactive" onClick={scrollToExplorer}>
            <span className="ace-showcase-lesson-features__icon">📊</span>
            <span>
              <strong>Interactive graph</strong>
              <span>Try the {explorerLabel.toLowerCase()} below</span>
            </span>
          </button>
        )}
        <div className="ace-showcase-lesson-features__chip ace-showcase-lesson-features__chip--xp">
          <span className="ace-showcase-lesson-features__icon">⚡</span>
          <span>
            <strong>Study XP</strong>
            <span>Timer tracks focus time toward +5 XP</span>
          </span>
        </div>
        <div className="ace-showcase-lesson-features__chip ace-showcase-lesson-features__chip--cards">
          <span className="ace-showcase-lesson-features__icon">📖</span>
          <span>
            <strong>Note cards</strong>
            <span>Formulas, steps, worked examples</span>
          </span>
        </div>
      </div>
    </>
  )
}
