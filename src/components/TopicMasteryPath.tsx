import { Link } from 'react-router-dom'
import { useMastery } from '@/features/mastery/MasteryContext'
import type { Difficulty } from '@/lib/contentTypes'

const STEPS: { difficulty: Difficulty | 'notes'; label: string; title: string }[] = [
  { difficulty: 'notes', label: 'Level 0', title: 'Notes' },
  { difficulty: 'easy', label: 'Level 1', title: 'Easy' },
  { difficulty: 'medium', label: 'Level 2', title: 'Medium' },
  { difficulty: 'hard', label: 'Level 3', title: 'Hard' },
  { difficulty: 'pyp', label: 'Level 4', title: 'PYP' },
]

function getStepScore(
  topicProgress: import('@/features/mastery/MasteryEngine').TopicProgress | undefined,
  difficulty: Difficulty,
): number | undefined {
  if (!topicProgress) return undefined
  switch (difficulty) {
    case 'easy':
      return topicProgress.easyScore
    case 'medium':
      return topicProgress.mediumScore
    case 'hard':
      return topicProgress.hardScore
    case 'pyp':
      return topicProgress.pypComplete ? 100 : undefined
    default:
      return undefined
  }
}

interface TopicMasteryPathProps {
  topicId: string
  notesComplete: boolean
  /** When false for a tier, that quiz link is hidden (e.g. pending content). */
  quizAvailability?: Partial<Record<Difficulty, boolean>>
}

export function TopicMasteryPath({ topicId, notesComplete, quizAvailability }: TopicMasteryPathProps) {
  const { progress, canTakeTopicQuiz } = useMastery()
  const topicProgress = progress.topics[topicId]
  const quizLevel = (topicProgress?.quizLevel ?? 0) as import('@/features/mastery/MasteryEngine').MasteryLevel

  return (
    <div className="enlight-mastery-path">
      {STEPS.map((step, idx) => {
        const isNotes = step.difficulty === 'notes'
        const difficulty = step.difficulty as Difficulty
        const quizAvailable = isNotes || quizAvailability?.[difficulty] !== false
        if (!isNotes && !quizAvailable) return null

        const complete = isNotes ? notesComplete : quizLevel > idx
        const unlocked = isNotes
          ? true
          : canTakeTopicQuiz(topicId, step.difficulty as Difficulty)
        const score =
          !isNotes && complete
            ? getStepScore(topicProgress, step.difficulty as Difficulty)
            : undefined
        const cls = [
          'enlight-mastery-step',
          complete ? 'enlight-mastery-step--complete' : '',
          unlocked ? 'enlight-mastery-step--unlocked' : 'enlight-mastery-step--locked',
        ].join(' ')

        if (isNotes) {
          return (
            <div key={step.difficulty} className={cls}>
              <div className="enlight-mastery-step__label">{step.label}</div>
              <div className="enlight-mastery-step__title">{step.title}</div>
            </div>
          )
        }

        if (complete) {
          return (
            <div key={step.difficulty} className={cls} title="Tier complete">
              <div className="enlight-mastery-step__label">{step.label}</div>
              <div className="enlight-mastery-step__title">{step.title}</div>
              {score !== undefined && (
                <div className="enlight-mastery-step__score">{Math.min(100, score)}%</div>
              )}
            </div>
          )
        }

        if (!unlocked) {
          return (
            <div key={step.difficulty} className={cls} title="Pass the previous tier to unlock">
              <div className="enlight-mastery-step__label">{step.label}</div>
              <div className="enlight-mastery-step__title">{step.title}</div>
            </div>
          )
        }

        return (
          <Link
            key={step.difficulty}
            to={`/quiz/topic/${topicId}/${step.difficulty}`}
            className={cls}
          >
            <div className="enlight-mastery-step__label">{step.label}</div>
            <div className="enlight-mastery-step__title">{step.title}</div>
            {score !== undefined && (
              <div className="enlight-mastery-step__score">{Math.min(100, score)}%</div>
            )}
          </Link>
        )
      })}
    </div>
  )
}
