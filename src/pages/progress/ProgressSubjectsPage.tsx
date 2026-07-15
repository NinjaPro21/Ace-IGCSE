import { Link } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getSubjectSummary } from '@/features/mastery/progressStats'
import { getAllSubjects } from '@/lib/contentLoader'

const STATUS_LABEL = {
  available: 'Not started',
  in_progress: 'In progress',
  mastered: 'Mastered',
} as const

export function ProgressSubjectsPage() {
  usePageTitle('Subjects')
  const { progress } = useMastery()
  const subjects = getAllSubjects()

  return (
    <>
      <EnlightSectionLabel>Subjects</EnlightSectionLabel>
      <h1 className="ace-heading-serif">Subject progress</h1>
      <p className="ace-body-text ace-progress-page__intro">
        Mastery by chapter across every subject you have started.
      </p>

      <section className="ace-dashboard-card">
        <div className="ace-subject-overview">
          {subjects.map((subject) => {
            const summary = getSubjectSummary(subject.id, progress)
            if (summary.total === 0) return null
            return (
              <details key={subject.id} className="ace-subject-fold">
                <summary className="ace-subject-fold__summary">
                  <span className="ace-subject-fold__name">{subject.name}</span>
                  <span className="ace-subject-fold__meta">
                    {summary.mastered}/{summary.total} chapters mastered · {summary.avgMastery}% quiz average
                  </span>
                  <span className="ace-subject-fold__bar">
                    <span style={{ width: `${summary.avgMastery}%` }} />
                  </span>
                </summary>
                <div className="ace-subject-fold__chapters">
                  {summary.rows.map(({ chapter, masteryPercent, status }) => (
                    <Link
                      key={chapter.id}
                      to={`/subjects/${subject.id}`}
                      className="ace-chapter-progress-row ace-chapter-progress-row--compact"
                    >
                      <span className="ace-chapter-progress-row__title">
                        Ch {chapter.number}: {chapter.title}
                      </span>
                      <span className="ace-chapter-progress-row__pct">{masteryPercent}%</span>
                      <span className="ace-chapter-progress-row__status">{STATUS_LABEL[status]}</span>
                    </Link>
                  ))}
                  <EnlightButton to={`/subjects/${subject.id}`} variant="outline">
                    Open {subject.name} →
                  </EnlightButton>
                </div>
              </details>
            )
          })}
        </div>
      </section>
    </>
  )
}
