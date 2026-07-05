import type { McqQuestion, McqQuestionVariant } from '@/lib/contentTypes'
import { generateRuntimeVariants } from './quizVariantGenerators'

/** Fisher–Yates shuffle; returns a new array. */
function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

function pickQuestionVariant(question: McqQuestion): McqQuestion {
  const base: McqQuestionVariant = {
    question: question.question,
    options: question.options,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  }

  const seen = new Set<string>([base.question])
  const pool: McqQuestionVariant[] = [base]

  for (const v of question.variants ?? []) {
    if (!seen.has(v.question)) {
      seen.add(v.question)
      pool.push(v)
    }
  }

  for (const v of generateRuntimeVariants(question)) {
    if (!seen.has(v.question)) {
      seen.add(v.question)
      pool.push(v)
    }
  }

  if (pool.length <= 1) return question

  const variant = pool[Math.floor(Math.random() * pool.length)]
  return {
    ...question,
    question: variant.question,
    options: variant.options,
    correctIndex: variant.correctIndex,
    explanation: variant.explanation ?? question.explanation,
    variants: undefined,
  }
}

/** Randomize option order so the correct answer is not always in the same position. */
export function shuffleMcqQuestion(question: McqQuestion): McqQuestion {
  const order = shuffleIndices(question.options.length)
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    correctIndex: order.indexOf(question.correctIndex),
  }
}

export function shuffleMcqQuestions(questions: McqQuestion[]): McqQuestion[] {
  return questions.map(shuffleMcqQuestion)
}

/**
 * Build a quiz attempt: pick variants, shuffle question order, optionally subsample,
 * then shuffle options within each question.
 */
export function prepareQuizSession(
  questions: McqQuestion[],
  questionsPerAttempt?: number,
): McqQuestion[] {
  const withVariants = questions.map(pickQuestionVariant)
  const order = shuffleIndices(withVariants.length)
  let ordered = order.map((i) => withVariants[i])

  const cap = questionsPerAttempt ?? withVariants.length
  if (ordered.length > cap) {
    ordered = ordered.slice(0, cap)
  }

  return shuffleMcqQuestions(ordered)
}

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

/** Score as nearest integer percent: (correct / total) × 100. */
export function computeQuizScorePercent(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0
  return Math.round((correctCount / totalQuestions) * 100)
}
