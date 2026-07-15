import { Link } from 'react-router-dom'

import { EnlightSectionLabel } from '@/components/EnlightCard'
import { usePageTitle } from '@/hooks/usePageTitle'

import { useMastery } from '@/features/mastery/MasteryContext'

import {
  getPersonalChapterInsights,
  getStuckChaptersBySubject,
} from '@/features/mastery/tutorInsights'

import { getWeakTopicLessonPath } from '@/features/mastery/progressStats'
import { subjectAccentClasses } from '@/lib/subjectAccent'

export function ProgressReviewPage() {
  usePageTitle('Review')
  const { progress } = useMastery()
  const weakBySubject = getStuckChaptersBySubject(getPersonalChapterInsights(progress), 3)
  const totalWeak = weakBySubject.reduce((n, g) => n + g.chapters.length, 0)

  return (
    <>
      <EnlightSectionLabel>Review</EnlightSectionLabel>
      <h1 className="ace-heading-serif">Weak topics</h1>
      <p className="ace-body-text ace-progress-page__intro">
        Up to three chapters per subject, ranked by quiz fail rate and study time. Open a topic to
        review notes and retry quizzes.
      </p>

      {totalWeak === 0 ? (
        <section className="ace-dashboard-card">
          <p className="ace-body-text">No weak spots flagged — keep going!</p>
        </section>
      ) : (
        <section className="ace-dashboard-card">
          <div className="ace-insights-table">
            {weakBySubject.flatMap((group) =>
              group.chapters.map((row) => {
                const path = getWeakTopicLessonPath(row.chapterId)
                const { subjectClass } = subjectAccentClasses(group.subjectId)
                const failLabel =
                  row.quizAttempts > 0
                    ? `${row.quizFails}/${row.quizAttempts} fails`
                    : `${row.timeSpentMin} min studied`

                return (
                  <div key={row.chapterId} className="ace-insights-row">
                    <div className="ace-insights-row__main">
                      <span className={['ace-insights-row__subject', subjectClass].filter(Boolean).join(' ')}>
                        {group.subjectName}
                      </span>
                      {path ? (
                        <Link to={path} className="ace-insights-row__title ace-insights-row__title--link">
                          {row.chapterTitle}
                        </Link>
                      ) : (
                        <span className="ace-insights-row__title">{row.chapterTitle}</span>
                      )}
                    </div>
                    <div className="ace-insights-row__stats">
                      <span>{failLabel}</span>
                      {row.failRate > 0 && <span>{row.failRate}% fail rate</span>}
                    </div>
                  </div>
                )
              }),
            )}
          </div>
        </section>
      )}
    </>
  )
}
