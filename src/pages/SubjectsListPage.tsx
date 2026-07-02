import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { EnlightHeader } from '@/components/EnlightHeader'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { formatStatValue, getPlatformStats, getSubjectStatsList, type SubjectStats } from '@/lib/platformStats'

const SUBJECT_ICONS: Record<string, string> = {
  'add-maths-0606': '📐',
  'maths-0580': '📊',
  physics: '⚛️',
}

function SubjectStudyCard({ subject }: { subject: SubjectStats }) {
  const diagramPct = subject.topicCount
    ? Math.round((subject.diagramTopicCount / subject.topicCount) * 100)
    : 0

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

      <dl className="enlight-study-subject__stats">
        <div>
          <dt>Chapters</dt>
          <dd>{subject.chapterCount}</dd>
        </div>
        <div>
          <dt>Subtopics</dt>
          <dd>{subject.topicCount}</dd>
        </div>
        <div>
          <dt>Visual diagrams</dt>
          <dd>{subject.diagramTopicCount}</dd>
        </div>
      </dl>

      <div
        className="enlight-study-subject__meter"
        aria-label={`${diagramPct}% of topics include graphs, diagrams, or interactive tools`}
      >
        <span className="enlight-study-subject__meter-fill" style={{ width: `${diagramPct}%` }} />
      </div>
      <p className="enlight-study-subject__meter-label">{diagramPct}% topics with visual help</p>

      <ul className="enlight-study-subject__chapters">
        {subject.sampleChapters.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>

      <div className="enlight-study-subject__tags">
        {subject.highlights.map((tag) => (
          <span key={tag} className="enlight-study-subject__tag">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

export function SubjectsListPage() {
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

        <div className="enlight-study-subjects">
          {subjects.map((s) => (
            <SubjectStudyCard key={s.id} subject={s} />
          ))}
        </div>

        <p className="enlight-body-text enlight-study-subjects__back">
          <Link to="/dashboard">← Back to dashboard</Link>
        </p>
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
