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
  chapterProgress: import('@/features/mastery/MasteryEngine').ChapterProgress | undefined,
  difficulty: Difficulty,
): number | undefined {
  if (!chapterProgress) return undefined
  switch (difficulty) {
    case 'easy':
      return chapterProgress.easyScore
    case 'medium':
      return chapterProgress.mediumScore
    case 'hard':
      return chapterProgress.hardScore
    case 'pyp':
      return chapterProgress.pypComplete ? 100 : undefined
    default:
      return undefined
  }
}

interface MasteryPathProps {
  chapterId: string
  notesComplete: boolean
}

export function MasteryPath({ chapterId, notesComplete }: MasteryPathProps) {
  const { progress, canTakeChapterQuiz, markChapterPopoutSeen } = useMastery()
  const chapterProgress = progress.chapters[chapterId]
  // Read from the reactive `progress` object so this re-renders when quiz results are recorded
  const quizLevel = (chapterProgress?.quizLevel ?? 0) as import('@/features/mastery/MasteryEngine').MasteryLevel

  return (
    <div className="enlight-mastery-path">
      {STEPS.map((step, idx) => {
        const isNotes = step.difficulty === 'notes'
        const complete = isNotes ? notesComplete : quizLevel > idx
        const unlocked = isNotes
          ? true
          : canTakeChapterQuiz(chapterId, step.difficulty as Difficulty)
        const score =
          !isNotes && complete
            ? getStepScore(chapterProgress, step.difficulty as Difficulty)
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
            <div key={step.difficulty} className={cls} title="Pass the previous tier first">
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
            onClick={() => {
              if (step.difficulty === 'easy') markChapterPopoutSeen(chapterId)
            }}
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
