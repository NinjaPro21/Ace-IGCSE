export type Difficulty = 'easy' | 'medium' | 'hard' | 'pyp'

export type AccentColor = 'gold' | 'blue' | 'green' | 'lavender'

export interface SubjectMeta {
  id: string
  name: string
  code: string
  syllabus: string
  description: string
  chapterIds: string[]
}

export interface ChapterMeta {
  id: string
  subjectId: string
  number: number
  title: string
  badge: string
  summary: string
  topicIds: string[]
  accentColor: AccentColor
  hasChapterQuiz?: boolean
}

export interface TopicMeta {
  id: string
  subjectId: string
  chapterId: string
  title: string
  subtitle: string
  /** Rich descriptor shown under the lesson title (nav keeps `subtitle`). */
  lessonMeta?: string
  notesFile: string
  explorerId?: 'discriminant' | 'trig' | 'cast' | 'modulus' | 'line-intersection' | 'quadratic' | 'log' | 'shoelace' | 'exponential' | 'circle-line' | 'circle-circle' | 'pnc-guide' | 'series-guide' | 'functions-guide' | 'differentiation-guide' | 'vectors-guide' | 'integration-guide' | 'kinematics-guide'
  /** Panels to show for visual-guide explorers (per-topic subset). */
  explorerPanels?: GuidePanel[]
  isChapterQuizAnchor?: boolean
  quizIds?: {
    easy: string
    medium: string
    hard: string
    pyp: string
  }
  lessonNav?: { id: string; label: string }[]
}

export type DiffGuidePanel = 'gradient' | 'tangent' | 'approximation' | 'rates' | 'optimization' | 'rules' | 'transcendental'

export type VectorGuidePanel = 'displacement' | 'magnitude' | 'motion'

export type IntegrationGuidePanel = 'indefinite' | 'definite' | 'area'

export type KinematicsGuidePanel = 'chain' | 'graphs' | 'distance'

export type GuidePanel = DiffGuidePanel | VectorGuidePanel | IntegrationGuidePanel | KinematicsGuidePanel

export interface McqQuestion {
  id: string
  type: 'mcq'
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
  /** Alternate phrasings / numbers — one is picked at random each attempt */
  variants?: McqQuestionVariant[]
}

export interface McqQuestionVariant {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface QuizData {
  id: string
  topicId: string
  chapterId?: string
  difficulty: Difficulty
  title: string
  passPercent: number
  /** If the pool is larger, only this many questions per attempt (random subset) */
  questionsPerAttempt?: number
  questions: McqQuestion[]
}

/** Optional adapter shape for importing external content */
export interface LegacyContentBundle {
  subject?: string
  chapter?: string
  topic?: string
  notes?: string
  questions?: Array<{
    q?: string
    question?: string
    choices?: string[]
    options?: string[]
    answer?: number
    correct?: number
    correctIndex?: number
  }>
}
