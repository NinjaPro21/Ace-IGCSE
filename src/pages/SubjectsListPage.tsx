import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { EnlightHeader } from '@/components/EnlightHeader'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatStatValue, getPlatformStats, getSubjectStatsList, type SubjectStats } from '@/lib/platformStats'

const SUBJECT_ICONS: Record<string, string> = {
  'add-maths-0606': '📐',
  'maths-0580': '📊',
  physics: '⚛️',
}

function SubjectStudyCard({ subject }: { subject: SubjectStats }) {
  return (
    <Link
      to={`/subjects/${subject.id}`}
      className={`enlight-study-subject enlight-study-subject--${subject.accent}`}
    >
      <div className="enlight-study-subject__glow" aria-hidden />
      <div className="enlight-study-subject__head">
        <span className="enlight-study-subject__icon" aria-hidden>
          {SUBJECT_ICONS[subject.id] ?? '📚'}
        </span>
        <div>
          <span className="enlight-study-subject__code">{subject.code}</span>
          <h2 className="enlight-study-subject__name">{subject.name}</h2>
        </div>
        <span className="enlight-study-subject__arrow" aria-hidden>
          →
        </span>
      </div>

      <p className="enlight-study-subject__blurb">{subject.description}</p>

      <p className="enlight-study-subject__meta">
        {subject.chapterCount} chapters · {subject.topicCount} topics · {subject.diagramTopicCount}{' '}
        diagrams
      </p>

      <ul className="enlight-study-subject__chapters">
        {subject.sampleChapters.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
    </Link>
  )
}

export function SubjectsListPage() {
  usePageTitle('Subjects')
  const subjects = useMemo(() => getSubjectStatsList(), [])
  const stats = useMemo(() => getPlatformStats(), [])

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-gradient-bar" />
      <div className="enlight-container enlight-page-padding">
        <EnlightSectionLabel>Study</EnlightSectionLabel>
        <h1 className="enlight-heading-serif">Subjects</h1>
        <p className="enlight-body-text enlight-subject-hub__intro">
          Pick a syllabus to open notes, tiered quizzes, and chapter progress —{' '}
          {formatStatValue(stats.diagramTopicCount)} topics with graphs, diagrams, or interactive tools across all
          three courses.
        </p>

        <div className="enlight-study-subjects" data-tour="subjects-grid">
          {subjects.map((s) => (
            <SubjectStudyCard key={s.id} subject={s} />
          ))}
        </div>

        <p className="enlight-body-text enlight-study-subjects__back">
          <Link to="/dashboard">← Back to dashboard</Link>
        </p>
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} AceIGCSE</footer>
    </div>
  )
}
