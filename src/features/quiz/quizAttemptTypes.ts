import type { Difficulty } from '@/lib/contentTypes'

export interface ConceptMissRecord {
  conceptKey: string
  conceptLabel: string
  scopeId: string
  missCount: number
  lastAt: string
}

export interface QuizMistakeEntry {
  questionId: string
  questionText: string
  conceptKey: string
  conceptLabel: string
  selectedIndex: number
  correctIndex: number
  selectedLabel: string
  correctLabel: string
  explanation?: string
  totalMisses: number
  isRepeatConcept: boolean
}

export interface QuizMistakeLogResult {
  entries: QuizMistakeEntry[]
  hotSubtopics: Array<{ scopeId: string; label: string; missCount: number }>
}

/** @deprecated use QuizMistakeLogResult */
export type QuizBattleLogResult = QuizMistakeLogResult

export interface QuizAttemptRecord {
  id: string
  at: string
  subjectId: string
  chapterId: string
  topicId?: string
  quizId: string
  quizTitle: string
  difficulty: Difficulty
  scorePercent: number
  passed: boolean
  questionCount: number
  correctCount: number
  mistakes: QuizMistakeEntry[]
}

export interface RecordQuizFinishInput {
  quizId: string
  quizTitle: string
  topicId?: string
  chapterId: string
  subjectId: string
  difficulty: Difficulty
  scorePercent: number
  passed: boolean
  questionCount: number
  correctCount: number
  mistakes: Array<{
    questionId: string
    questionText: string
    conceptKey: string
    conceptLabel: string
    selectedIndex: number
    correctIndex: number
    selectedLabel: string
    correctLabel: string
    explanation?: string
    scopeId: string
  }>
}

/** @deprecated use RecordQuizFinishInput */
export type RecordQuizMistakesInput = Omit<
  RecordQuizFinishInput,
  'scorePercent' | 'passed' | 'questionCount' | 'correctCount' | 'quizTitle'
>
