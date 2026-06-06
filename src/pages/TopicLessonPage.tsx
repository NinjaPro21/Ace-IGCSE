import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EnlightCard, EnlightFormulaBox, EnlightProTip, EnlightSectionLabel } from '@/components/EnlightCard'
import { EnlightButton } from '@/components/EnlightButton'
import { EnlightHeader } from '@/components/EnlightHeader'
import { LessonTopBar } from '@/components/LessonTopBar'
import { MarkdownLesson } from '@/components/MarkdownLesson'
import { MasteryPath } from '@/components/MasteryPath'
import { DiscriminantExplorer } from '@/features/explorers/DiscriminantExplorer'
import { useMastery } from '@/features/mastery/MasteryContext'
import {
  getChapter,
  getNotesForTopic,
  getSubject,
  getTopic,
} from '@/lib/contentLoader'

export function TopicLessonPage() {
  const {
    subjectId = '',
    chapterId = '',
    topicId = '',
  } = useParams()
  const { markNotesRead } = useMastery()

  const topic = getTopic(topicId)
  const chapter = getChapter(chapterId)
  const subject = getSubject(subjectId)

  useEffect(() => {
    if (topicId) {
      const t = setTimeout(() => markNotesRead(topicId), 1500)
      return () => clearTimeout(t)
    }
  }, [topicId, markNotesRead])

  if (!topic || !chapter || !subject) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-container enlight-page-padding">
          <p>Lesson not found.</p>
          <Link to="/">Home</Link>
        </div>
      </div>
    )
  }

  const notes = getNotesForTopic(topic)
  const isDiscriminant = topic.explorerId === 'discriminant'

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-container enlight-page-padding">
        <LessonTopBar topic={topic} chapterTitle={`${subject.name} · ${chapter.title}`} />

        <EnlightSectionLabel>Quadratics 101 · {subject.code}</EnlightSectionLabel>
        <h1 className="enlight-heading-serif">{topic.title}</h1>
        <p className="enlight-body-text">{topic.subtitle}</p>

        {isDiscriminant ? (
          <>
            <div className="enlight-two-col" style={{ marginTop: 32 }}>
              <EnlightCard accent="gold">
                <p className="enlight-card-label">What is the Discriminant?</p>
                <MarkdownLesson content={notes} />
                <EnlightFormulaBox>Δ = b² − 4ac</EnlightFormulaBox>
                <EnlightProTip title="'Real roots' vs 'distinct roots'">
                  In exam language, &quot;real roots&quot; can mean any real solutions. &quot;Distinct&quot;
                  means two different values — check whether the question specifies equal roots.
                </EnlightProTip>
              </EnlightCard>
              <EnlightCard accent="gold">
                <p className="enlight-card-label">Nature of roots</p>
                <ul className="enlight-nature-list">
                  <li className="enlight-nature-list__item">
                    <span className="enlight-nature-list__symbol enlight-nature-list__symbol--gt">&gt;</span>
                    <div>
                      <strong>Δ &gt; 0</strong> — Two real distinct roots. Parabola crosses the x-axis
                      twice.
                    </div>
                  </li>
                  <li className="enlight-nature-list__item">
                    <span className="enlight-nature-list__symbol enlight-nature-list__symbol--eq">=</span>
                    <div>
                      <strong>Δ = 0</strong> — Equal roots. Vertex touches the x-axis.
                    </div>
                  </li>
                  <li className="enlight-nature-list__item">
                    <span className="enlight-nature-list__symbol enlight-nature-list__symbol--lt">&lt;</span>
                    <div>
                      <strong>Δ &lt; 0</strong> — No real roots. Parabola does not cross the x-axis.
                    </div>
                  </li>
                </ul>
              </EnlightCard>
            </div>
            <DiscriminantExplorer />
          </>
        ) : (
          <EnlightCard accent="gold">
            <MarkdownLesson content={notes} />
          </EnlightCard>
        )}

        <h2 className="enlight-heading-serif" style={{ fontSize: '1.5rem', marginTop: 48 }}>
          Mastery path
        </h2>
        <p className="enlight-body-text">Complete each level to unlock the next. Aim for 70%+ on quizzes.</p>
        <MasteryPath topicId={topicId} />

        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <EnlightButton to={`/quiz/${topicId}/easy`}>Start Easy quiz</EnlightButton>
          <EnlightButton to={`/subjects/${subjectId}`} variant="outline">
            All chapters
          </EnlightButton>
        </div>
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
