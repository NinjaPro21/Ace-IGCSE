import { Link } from 'react-router-dom'

import { EnlightSectionLabel } from '@/components/EnlightCard'

import { useMastery } from '@/features/mastery/MasteryContext'

import {

  getPersonalChapterInsights,

  getStuckChaptersBySubject,

} from '@/features/mastery/tutorInsights'

import { getWeakTopicLessonPath } from '@/features/mastery/progressStats'



export function ProgressReviewPage() {

  const { progress } = useMastery()

  const weakBySubject = getStuckChaptersBySubject(getPersonalChapterInsights(progress), 3)

  const totalWeak = weakBySubject.reduce((n, g) => n + g.chapters.length, 0)



  return (

    <>

      <EnlightSectionLabel>Review</EnlightSectionLabel>

      <h1 className="enlight-heading-serif">Weak topics</h1>

      <p className="enlight-body-text enlight-progress-page__intro">

        Up to three chapters per subject, ranked by quiz fail rate and study time. Open a topic to

        review notes and retry quizzes.

      </p>



      {totalWeak === 0 ? (

        <section className="enlight-dashboard-card">

          <p className="enlight-body-text">No weak spots flagged — keep going!</p>

        </section>

      ) : (

        weakBySubject.map((group) => (

          <section key={group.subjectId} className="enlight-dashboard-card enlight-weak-by-subject">

            <h2 className="enlight-heading-serif enlight-weak-by-subject__title">{group.subjectName}</h2>

            <ul className="enlight-weak-list">

              {group.chapters.map((row) => {

                const path = getWeakTopicLessonPath(row.chapterId)

                return (

                  <li key={row.chapterId} className="enlight-weak-list__item">

                    <div>

                      {path ? (

                        <Link to={path} className="enlight-weak-list__title enlight-weak-list__title--link">

                          {row.chapterTitle}

                        </Link>

                      ) : (

                        <span className="enlight-weak-list__title">{row.chapterTitle}</span>

                      )}

                      <span className="enlight-weak-list__sub">

                        {row.quizAttempts > 0

                          ? `${row.quizFails}/${row.quizAttempts} quiz fails`

                          : `${row.timeSpentMin} min studied`}

                      </span>

                    </div>

                    <span className="enlight-weak-list__stat">

                      {row.failRate > 0 ? `${row.failRate}% fail` : `${row.timeSpentMin} min`}

                    </span>

                  </li>

                )

              })}

            </ul>

          </section>

        ))

      )}

    </>

  )

}

