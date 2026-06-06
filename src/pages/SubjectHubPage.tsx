import { useParams } from 'react-router-dom'
import { EnlightChapterCard } from '@/components/EnlightChapterCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { SubjectToggle } from '@/components/SubjectToggle'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getChapterStatus, getChaptersForSubject, getSubject } from '@/lib/contentLoader'

export function SubjectHubPage() {
  const { subjectId = 'add-maths-0606' } = useParams()
  const { getTopicNotesReadMap, getChapterQuizLevel } = useMastery()
  const subject = getSubject(subjectId)
  const chapters = getChaptersForSubject(subjectId)
  const notesRead = getTopicNotesReadMap()

  if (!subject) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-container enlight-page-padding">
          <p>Subject not found.</p>
        </div>
      </div>
    )
  }

  const availableCount = chapters.length

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-gradient-bar" />
      <div className="enlight-container enlight-page-padding">
        <div className="enlight-subject-bar">
          <SubjectToggle />
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <h2 className="enlight-heading-serif" style={{ margin: 0 }}>
              {subject.name}
            </h2>
            <span className="enlight-badge enlight-badge--gold">{subject.code}</span>
          </div>
        </div>

        <EnlightSectionLabel>{subject.syllabus}</EnlightSectionLabel>
        <h2 className="enlight-heading-serif">All Chapters</h2>
        <p className="enlight-body-text" style={{ maxWidth: 560, marginBottom: 8 }}>
          {subject.description}
        </p>

        <div className="enlight-legend">
          <span className="enlight-legend__item">
            <span className="enlight-legend__dot enlight-legend__dot--gold" />
            {availableCount} chapters available
          </span>
          <span className="enlight-legend__item">
            <span className="enlight-legend__dot enlight-legend__dot--green" />
            3E · 3M · 3H practice sets
          </span>
          <span className="enlight-legend__item">
            <span className="enlight-legend__dot enlight-legend__dot--blue" />
            Past year paper questions
          </span>
        </div>

        <div className="enlight-chapter-grid">
          {chapters.map((ch) => (
            <EnlightChapterCard
              key={ch.id}
              chapter={ch}
              status={getChapterStatus(ch.id, notesRead, getChapterQuizLevel(ch.id))}
            />
          ))}
        </div>
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
