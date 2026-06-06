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

interface MasteryPathProps {
  chapterId: string
  notesComplete: boolean
}

export function MasteryPath({ chapterId, notesComplete }: MasteryPathProps) {
  const { progress, canTakeChapterQuiz } = useMastery()
  // Read from the reactive `progress` object so this re-renders when quiz results are recorded
  const quizLevel = (progress.chapters[chapterId]?.quizLevel ?? 0) as import('@/features/mastery/MasteryEngine').MasteryLevel

  return (
    <div className="enlight-mastery-path">
      {STEPS.map((step, idx) => {
        const isNotes = step.difficulty === 'notes'
        const complete = isNotes ? notesComplete : quizLevel > idx
        const unlocked = isNotes
          ? true
          : canTakeChapterQuiz(chapterId, step.difficulty as Difficulty)
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

        return (
          <Link
            key={step.difficulty}
            to={`/quiz/${chapterId}/${step.difficulty}`}
            className={cls}
          >
            <div className="enlight-mastery-step__label">{step.label}</div>
            <div className="enlight-mastery-step__title">{step.title}</div>
          </Link>
        )
      })}
    </div>
  )
}
