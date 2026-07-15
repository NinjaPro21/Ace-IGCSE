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

/** Lazy-loaded — keeps quiz JSON out of the initial bundle. Exclude deprecated folder. */
const quizLoaders = import.meta.glob('@content/quizzes/!(\_deprecated)/**/*.json', {
  import: 'default',
}) as Record<string, () => Promise<QuizData>>

const noteModules = import.meta.glob('@content/notes/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const subjects: SubjectMeta[] = Object.values(subjectModules)
const chapters: ChapterMeta[] = Object.values(chapterModules)
const topics: TopicMeta[] = Object.values(topicModules)

const notesMap: Record<string, string> = {}
for (const [filePath, content] of Object.entries(noteModules)) {
  const match = filePath.match(/notes\/(.+\.md)$/)
  if (match) notesMap[match[1]] = content
}

const quizLoaderById = new Map<string, () => Promise<QuizData>>()
for (const [filePath, loader] of Object.entries(quizLoaders)) {
  const match = filePath.match(/quizzes\/(?:[^/]+\/)?([^/]+)\.json$/)
  if (match) quizLoaderById.set(match[1], loader)
}

const quizCache = new Map<string, QuizData>()
const quizLoadPromises = new Map<string, Promise<QuizData | undefined>>()

function quizIdFromTopic(topic: TopicMeta, difficulty: QuizData['difficulty']): string | undefined {
  return topic.quizIds?.[difficulty]
}

export async function loadQuiz(quizId: string): Promise<QuizData | undefined> {
  const cached = quizCache.get(quizId)
  if (cached) return cached

  const pending = quizLoadPromises.get(quizId)
  if (pending) return pending

  const loader = quizLoaderById.get(quizId)
  if (!loader) return undefined

  const promise = loader()
    .then((quiz) => {
      quizCache.set(quizId, quiz)
      quizLoadPromises.delete(quizId)
      return quiz
    })
    .catch(() => {
      quizLoadPromises.delete(quizId)
      return undefined
    })

  quizLoadPromises.set(quizId, promise)
  return promise
}

/** Returns cached quiz only (sync). Use loadQuiz for guaranteed fetch. */
export function getQuiz(quizId: string): QuizData | undefined {
  return quizCache.get(quizId)
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

export function getTopicSectionNumber(chapterId: string, topicId: string): number {
  const chapterTopics = getTopicsForChapter(chapterId)
  const idx = chapterTopics.findIndex((t) => t.id === topicId)
  return idx >= 0 ? idx + 1 : 1
}

export function getTopicSectionLabel(chapterId: string, topicId: string): string {
  return `Section ${getTopicSectionNumber(chapterId, topicId)}`
}

export function getChapterQuizAnchor(chapterId: string): TopicMeta | undefined {
  return getTopicsForChapter(chapterId).find((t) => t.isChapterQuizAnchor)
}

export async function isQuizPlayable(quizId: string): Promise<boolean> {
  const quiz = await loadQuiz(quizId)
  return Boolean(quiz && !quiz.pending)
}

export async function getTopicQuizAvailability(
  topicId: string,
): Promise<Partial<Record<QuizData['difficulty'], boolean>>> {
  const topic = getTopic(topicId)
  if (!topic?.quizIds) return {}
  const entries = await Promise.all(
    (Object.entries(topic.quizIds) as [QuizData['difficulty'], string][]).map(async ([difficulty, quizId]) => {
      const playable = await isQuizPlayable(quizId)
      return [difficulty, playable] as const
    }),
  )
  return Object.fromEntries(entries)
}

export async function getQuizByTopicAndDifficulty(
  topicId: string,
  difficulty: QuizData['difficulty'],
): Promise<QuizData | undefined> {
  const topic = getTopic(topicId)
  if (!topic?.quizIds) return undefined
  const quizId = quizIdFromTopic(topic, difficulty)
  if (!quizId) return undefined
  return loadQuiz(quizId)
}

export async function getQuizByChapterAndDifficulty(
  chapterId: string,
  difficulty: QuizData['difficulty'],
): Promise<QuizData | undefined> {
  const chapter = getChapter(chapterId)
  if (!chapter) return undefined

  const chapterTopics = getTopicsForChapter(chapterId)
  const mergedQuestions: QuizData['questions'] = []
  let passPercent = 70

  for (const topic of chapterTopics) {
    const quiz = await getQuizByTopicAndDifficulty(topic.id, difficulty)
    if (!quiz || quiz.pending) continue
    const active = quiz.questions.filter((q) => !q.pending)
    if (active.length === 0) continue
    passPercent = quiz.passPercent
    mergedQuestions.push(...active)
  }

  if (mergedQuestions.length === 0) {
    const anchor = getChapterQuizAnchor(chapterId)
    if (!anchor?.quizIds) return undefined
    const anchorQuiz = await loadQuiz(anchor.quizIds[difficulty])
    if (!anchorQuiz || anchorQuiz.pending) return undefined
    const active = anchorQuiz.questions.filter((q) => !q.pending)
    if (active.length === 0) return undefined
    return { ...anchorQuiz, questions: active }
  }

  return {
    id: `${chapterId}-${difficulty}-merged`,
    topicId: chapterId,
    chapterId,
    difficulty,
    title: `Chapter ${chapter.number}: ${chapter.title} — ${difficulty === 'pyp' ? 'PYP' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
    passPercent,
    questions: mergedQuestions,
  }
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
