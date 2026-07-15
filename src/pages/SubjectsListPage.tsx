import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { AceFooter } from '@/components/AceFooter'
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
      className={`ace-study-subject ace-study-subject--${subject.accent}`}
    >
      <div className="ace-study-subject__glow" aria-hidden />
      <div className="ace-study-subject__head">
        <span className="ace-study-subject__icon" aria-hidden>
          {SUBJECT_ICONS[subject.id] ?? '📚'}
        </span>
        <div>
          <span className="ace-study-subject__code">{subject.code}</span>
          <h2 className="ace-study-subject__name">{subject.name}</h2>
        </div>
        <span className="ace-study-subject__arrow" aria-hidden>
          →
        </span>
      </div>

      <p className="ace-study-subject__blurb">{subject.description}</p>

      <p className="ace-study-subject__meta">
        {subject.chapterCount} chapters · {subject.topicCount} topics · {subject.diagramTopicCount}{' '}
        diagrams
      </p>

      <ul className="ace-study-subject__chapters">
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
    <div className="ace-app">
      <EnlightHeader />
      <div className="ace-gradient-bar" />
      <div className="ace-container ace-page-padding">
        <EnlightSectionLabel>Study</EnlightSectionLabel>
        <h1 className="ace-heading-serif">Subjects</h1>
        <p className="ace-body-text ace-subject-hub__intro">
          Pick a syllabus to open notes, tiered quizzes, and chapter progress —{' '}
          {formatStatValue(stats.diagramTopicCount)} topics with graphs, diagrams, or interactive tools across all
          three courses.
        </p>

        <div className="ace-study-subjects" data-tour="subjects-grid">
          {subjects.map((s) => (
            <SubjectStudyCard key={s.id} subject={s} />
          ))}
        </div>

        <p className="ace-body-text ace-study-subjects__back">
          <Link to="/dashboard">← Back to dashboard</Link>
        </p>
      </div>
      <AceFooter />
    </div>
  )
}
