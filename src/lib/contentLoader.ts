import type { ChapterMeta, QuizData, SubjectMeta, TopicMeta } from './contentTypes'

import addMathsSubject from '@content/subjects/add-maths-0606.json'
import mathsSubject from '@content/subjects/maths-0580.json'
import physicsSubject from '@content/subjects/physics.json'

import chQuadratics from '@content/chapters/add-maths-0606/ch02-quadratics.json'
import chFunctions from '@content/chapters/add-maths-0606/ch01-functions.json'
import chAlgebraMaths from '@content/chapters/maths-0580/ch01-algebra.json'
import chMechanics from '@content/chapters/physics/ch01-mechanics.json'

import topicDiscriminant from '@content/topics/add-maths-0606/discriminant.json'
import topicFunctions from '@content/topics/add-maths-0606/functions-intro.json'
import topicAlgebra from '@content/topics/maths-0580/algebra-basics.json'
import topicMechanics from '@content/topics/physics/kinematics.json'

import quizDiscEasy from '@content/quizzes/add-maths-0606/discriminant-easy.json'
import quizDiscMedium from '@content/quizzes/add-maths-0606/discriminant-medium.json'
import quizDiscHard from '@content/quizzes/add-maths-0606/discriminant-hard.json'
import quizDiscPyp from '@content/quizzes/add-maths-0606/discriminant-pyp.json'

import notesDiscriminant from '@content/notes/add-maths-0606/discriminant.md?raw'
import notesFunctions from '@content/notes/add-maths-0606/functions-intro.md?raw'
import notesAlgebra from '@content/notes/maths-0580/algebra-basics.md?raw'
import notesMechanics from '@content/notes/physics/kinematics.md?raw'

const subjects: SubjectMeta[] = [
  addMathsSubject as SubjectMeta,
  mathsSubject as SubjectMeta,
  physicsSubject as SubjectMeta,
]

const chapters: ChapterMeta[] = [
  chQuadratics as ChapterMeta,
  chFunctions as ChapterMeta,
  chAlgebraMaths as ChapterMeta,
  chMechanics as ChapterMeta,
]

const topics: TopicMeta[] = [
  topicDiscriminant as TopicMeta,
  topicFunctions as TopicMeta,
  topicAlgebra as TopicMeta,
  topicMechanics as TopicMeta,
]

const quizzes: QuizData[] = [
  quizDiscEasy as QuizData,
  quizDiscMedium as QuizData,
  quizDiscHard as QuizData,
  quizDiscPyp as QuizData,
]

const notesMap: Record<string, string> = {
  'add-maths-0606/discriminant.md': notesDiscriminant,
  'add-maths-0606/functions-intro.md': notesFunctions,
  'maths-0580/algebra-basics.md': notesAlgebra,
  'physics/kinematics.md': notesMechanics,
}

export function getAllSubjects(): SubjectMeta[] {
  return subjects
}

export function getSubject(subjectId: string): SubjectMeta | undefined {
  return subjects.find((s) => s.id === subjectId)
}

export function getChaptersForSubject(subjectId: string): ChapterMeta[] {
  return chapters.filter((c) => c.subjectId === subjectId)
}

export function getChapter(chapterId: string): ChapterMeta | undefined {
  return chapters.find((c) => c.id === chapterId)
}

export function getTopic(topicId: string): TopicMeta | undefined {
  return topics.find((t) => t.id === topicId)
}

export function getTopicsForChapter(chapterId: string): TopicMeta[] {
  return topics.filter((t) => t.chapterId === chapterId)
}

export function getQuiz(quizId: string): QuizData | undefined {
  return quizzes.find((q) => q.id === quizId)
}

export function getQuizByTopicAndDifficulty(
  topicId: string,
  difficulty: QuizData['difficulty'],
): QuizData | undefined {
  const topic = getTopic(topicId)
  if (!topic) return undefined
  const quizId = topic.quizIds[difficulty]
  return getQuiz(quizId)
}

export function getNotesForTopic(topic: TopicMeta): string {
  return notesMap[topic.notesFile] ?? '# Notes not found\n\nContent coming soon.'
}

export function getChapterMasteryPercent(chapterId: string, topicLevels: Record<string, number>): number {
  const chapterTopics = getTopicsForChapter(chapterId)
  if (chapterTopics.length === 0) return 0
  const sum = chapterTopics.reduce((acc, t) => acc + (topicLevels[t.id] ?? 0), 0)
  return Math.round((sum / (chapterTopics.length * 4)) * 100)
}

export function getChapterStatus(
  chapterId: string,
  topicLevels: Record<string, number>,
): 'available' | 'in_progress' | 'mastered' {
  const chapterTopics = getTopicsForChapter(chapterId)
  if (chapterTopics.length === 0) return 'available'
  const levels = chapterTopics.map((t) => topicLevels[t.id] ?? 0)
  if (levels.every((l) => l >= 4)) return 'mastered'
  if (levels.some((l) => l > 0)) return 'in_progress'
  return 'available'
}
