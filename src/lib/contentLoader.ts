import type { ChapterMeta, QuizData, SubjectMeta, TopicMeta } from './contentTypes'

const subjectModules = import.meta.glob('@content/subjects/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, SubjectMeta>

const chapterModules = import.meta.glob('@content/chapters/**/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, ChapterMeta>

const topicModules = import.meta.glob('@content/topics/**/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, TopicMeta>

const quizModules = import.meta.glob('@content/quizzes/**/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, QuizData>

const noteModules = import.meta.glob('@content/notes/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const subjects: SubjectMeta[] = Object.values(subjectModules)
const chapters: ChapterMeta[] = Object.values(chapterModules)
const topics: TopicMeta[] = Object.values(topicModules)
const quizzes: QuizData[] = Object.values(quizModules)

const notesMap: Record<string, string> = {}
for (const [filePath, content] of Object.entries(noteModules)) {
  const match = filePath.match(/notes\/(.+\.md)$/)
  if (match) notesMap[match[1]] = content
}

export function getAllSubjects(): SubjectMeta[] {
  return subjects
}

export function getSubject(subjectId: string): SubjectMeta | undefined {
  return subjects.find((s) => s.id === subjectId)
}

export function getChaptersForSubject(subjectId: string): ChapterMeta[] {
  return chapters
    .filter((c) => c.subjectId === subjectId)
    .sort((a, b) => a.number - b.number)
}

export function getChapter(chapterId: string): ChapterMeta | undefined {
  return chapters.find((c) => c.id === chapterId)
}

export function getTopic(topicId: string): TopicMeta | undefined {
  return topics.find((t) => t.id === topicId)
}

export function getTopicsForChapter(chapterId: string): TopicMeta[] {
  const chapter = getChapter(chapterId)
  if (!chapter) return []
  return chapter.topicIds
    .map((id) => getTopic(id))
    .filter((t): t is TopicMeta => Boolean(t))
}

export function getChapterQuizAnchor(chapterId: string): TopicMeta | undefined {
  return getTopicsForChapter(chapterId).find((t) => t.isChapterQuizAnchor)
}

export function getQuiz(quizId: string): QuizData | undefined {
  return quizzes.find((q) => q.id === quizId)
}

export function getQuizByChapterAndDifficulty(
  chapterId: string,
  difficulty: QuizData['difficulty'],
): QuizData | undefined {
  const anchor = getChapterQuizAnchor(chapterId)
  if (!anchor?.quizIds) return undefined
  const quizId = anchor.quizIds[difficulty]
  return getQuiz(quizId)
}

/** @deprecated Use getQuizByChapterAndDifficulty for chapter-scoped quizzes */
export function getQuizByTopicAndDifficulty(
  topicId: string,
  difficulty: QuizData['difficulty'],
): QuizData | undefined {
  const topic = getTopic(topicId)
  if (!topic?.quizIds) return undefined
  const quizId = topic.quizIds[difficulty]
  return getQuiz(quizId)
}

export function getNotesForTopic(topic: TopicMeta): string {
  return notesMap[topic.notesFile] ?? '# Notes not found\n\nContent coming soon.'
}

export function areChapterNotesComplete(
  chapterId: string,
  topicNotesRead: Record<string, boolean>,
): boolean {
  const chapterTopics = getTopicsForChapter(chapterId)
  if (chapterTopics.length === 0) return false
  return chapterTopics.every((t) => topicNotesRead[t.id])
}

export function getWeakTopicsInChapter(
  chapterId: string,
  topicNotesRead: Record<string, boolean>,
): TopicMeta[] {
  return getTopicsForChapter(chapterId).filter((t) => !topicNotesRead[t.id])
}

export function getChapterMasteryPercent(
  chapterId: string,
  topicNotesRead: Record<string, boolean>,
  chapterQuizLevel: number,
): number {
  const chapterTopics = getTopicsForChapter(chapterId)
  if (chapterTopics.length === 0) return 0
  const notesPct =
    chapterTopics.filter((t) => topicNotesRead[t.id]).length / chapterTopics.length
  const quizPct = chapterQuizLevel / 4
  return Math.round((notesPct * 0.5 + quizPct * 0.5) * 100)
}

export function getChapterStatus(
  chapterId: string,
  topicNotesRead: Record<string, boolean>,
  chapterQuizLevel: number,
): 'available' | 'in_progress' | 'mastered' {
  if (chapterQuizLevel >= 4) return 'mastered'
  const hasProgress =
    chapterQuizLevel > 0 ||
    getTopicsForChapter(chapterId).some((t) => topicNotesRead[t.id])
  if (hasProgress) return 'in_progress'
  return 'available'
}
