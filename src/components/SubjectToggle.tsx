import { Link, useParams } from 'react-router-dom'
import { getAllSubjects } from '@/lib/contentLoader'

export function SubjectToggle() {
  const { subjectId } = useParams()
  const subjects = getAllSubjects()

  return (
    <div className="enlight-subject-toggle">
      <Link to="/" className="enlight-subject-toggle__btn" style={{ marginRight: 8 }}>
        + Home
      </Link>
      {subjects.map((s) => (
        <Link
          key={s.id}
          to={`/subjects/${s.id}`}
          className={`enlight-subject-toggle__btn${subjectId === s.id ? ' enlight-subject-toggle__btn--active' : ''}`}
        >
          {s.name} {s.code}
        </Link>
      ))}
    </div>
  )
}
