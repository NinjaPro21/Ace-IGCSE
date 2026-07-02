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
  explorerId?: 'discriminant' | 'trig' | 'cast' | 'modulus' | 'line-intersection' | 'quadratic' | 'log' | 'log-laws' | 'change-of-base' | 'log-eval' | 'shoelace' | 'exponential' | 'circle-line' | 'circle-circle' | 'pnc-guide' | 'series-guide' | 'functions-guide' | 'differentiation-guide' | 'vectors-guide' | 'integration-guide' | 'kinematics-guide' | 'line-geometry' | 'cubic' | 'poly-division' | 'linear-law' | 'natural-log' | 'calculator-guide' | 'stats-guide' | 'curves-guide' | 'right-triangle-guide' | 'thermal-guide'
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

export type DiffGuidePanel =
  | 'gradient'
  | 'tangent'
  | 'approximation'
  | 'rates'
  | 'optimization'
  | 'rules'
  | 'transcendental'
  | 'chain'
  | 'trig'
  | 'power'
  | 'product'
  | 'quotient'
  | 'approx'
  | 'exponential'
  | 'logarithm'
  | 'cheatsheet'

export type VectorGuidePanel = 'displacement' | 'magnitude' | 'motion'

export type IntegrationGuidePanel = 'indefinite' | 'definite' | 'area' | 'power' | 'axb' | 'exp-trig'

export type KinematicsGuidePanel = 'chain' | 'graphs' | 'distance'

export type FnGuidePanel = 'types' | 'mapping' | 'composite' | 'inverse'
export type QuadraticPanel = 'graph' | 'inequality' | 'modulus'
export type ModulusPanel = 'graph' | 'inequality' | 'fx-gx'
export type TrigPanel = 'graph' | 'modulus' | 'sector' | 'sector-deg' | 'sector-length' | 'sector-area'
export type LineGeometryPanel = 'forms' | 'parallel' | 'intersect'
export type CubicPanel = 'trace' | 'factor' | 'modulus'

export type CalculatorGuidePanel = 'layout' | 'setup' | 'modes' | 'logs' | 'tools'

export type StatsGuidePanel = 'histogram' | 'scatter' | 'cumulative' | 'boxplot' | 'tree' | 'grouped-mean' | 'venn'

export type SeriesGuidePanel = 'binomial' | 'ap' | 'gp'

export type CurvesGuidePanel = 'quadratic' | 'cubic' | 'exponential' | 'reciprocal'

export type RightTrianglePanel = 'pythagoras' | 'sohcahtoa' | 'sine-rule' | 'cosine-rule'

export type ThermalGuidePanel = 'expansion' | 'ball-ring' | 'expansion-gap' | 'shc-lab' | 'particles'

export type GuidePanel =
  | DiffGuidePanel
  | VectorGuidePanel
  | IntegrationGuidePanel
  | KinematicsGuidePanel
  | FnGuidePanel
  | QuadraticPanel
  | ModulusPanel
  | TrigPanel
  | LineGeometryPanel
  | CubicPanel
  | CalculatorGuidePanel
  | StatsGuidePanel
  | SeriesGuidePanel
  | CurvesGuidePanel
  | RightTrianglePanel
  | ThermalGuidePanel

export interface McqQuestion {
  id: string
  type: 'mcq'
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
  /** Placeholder until docx import replaces this question. */
  pending?: boolean
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
  /** True when quiz still uses placeholder questions awaiting docx import. */
  pending?: boolean
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
