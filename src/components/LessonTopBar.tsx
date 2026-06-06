import { useMastery } from '@/features/mastery/MasteryContext'
import type { TopicMeta } from '@/lib/contentTypes'

interface LessonTopBarProps {
  topic: TopicMeta
  chapterTitle: string
}

export function LessonTopBar({ topic, chapterTitle }: LessonTopBarProps) {
  const { getChecklistCount } = useMastery()
  const done = getChecklistCount(topic.id)

  return (
    <div className="enlight-lesson-topbar">
      <div>
        <span className="enlight-section-label">{chapterTitle}</span>
        <nav className="enlight-lesson-nav">
          {(topic.lessonNav ?? [{ id: topic.id, label: 'Lesson' }]).map((item) => (
            <span
              key={item.id}
              className={`enlight-lesson-nav__link${item.id === topic.id || item.label === 'Discriminant' ? ' enlight-lesson-nav__link--active' : ''}`}
            >
              {item.label}
            </span>
          ))}
        </nav>
      </div>
      <div className="enlight-lesson-tools">
        <span>A−</span>
        <span>A+</span>
        <span>25:00</span>
        <div className="enlight-checklist">
          <div className="enlight-checklist__steps">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`enlight-checklist__step${i < done ? ' enlight-checklist__step--done' : ''}`}
              />
            ))}
          </div>
          <span>
            {done}/4
          </span>
        </div>
      </div>
    </div>
  )
}
