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
      <div className="enlight-showcase-note__mock-bar">
        <span className="enlight-showcase-note__mock-label">
          {chapterTitle} · {sectionLabel}
        </span>
        <PomodoroControl compact />
      </div>

      <div className="enlight-showcase-lesson-features">
        {explorerLabel && (
          <button type="button" className="enlight-showcase-lesson-features__chip enlight-showcase-lesson-features__chip--interactive" onClick={scrollToExplorer}>
            <span className="enlight-showcase-lesson-features__icon">📊</span>
            <span>
              <strong>Interactive graph</strong>
              <span>Try the {explorerLabel.toLowerCase()} below</span>
            </span>
          </button>
        )}
        <div className="enlight-showcase-lesson-features__chip enlight-showcase-lesson-features__chip--xp">
          <span className="enlight-showcase-lesson-features__icon">⚡</span>
          <span>
            <strong>Study XP</strong>
            <span>Timer tracks focus time toward +5 XP</span>
          </span>
        </div>
        <div className="enlight-showcase-lesson-features__chip enlight-showcase-lesson-features__chip--cards">
          <span className="enlight-showcase-lesson-features__icon">📖</span>
          <span>
            <strong>Note cards</strong>
            <span>Formulas, steps, worked examples</span>
          </span>
        </div>
      </div>
    </>
  )
}
