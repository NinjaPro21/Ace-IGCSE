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
  notesFile: string
  explorerId?: 'discriminant' | 'trig' | 'modulus' | 'line-intersection'
  isChapterQuizAnchor?: boolean
  quizIds?: {
    easy: string
    medium: string
    hard: string
    pyp: string
  }
  lessonNav?: { id: string; label: string }[]
}

export interface McqQuestion {
  id: string
  type: 'mcq'
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
