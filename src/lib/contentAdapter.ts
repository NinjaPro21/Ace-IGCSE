/**
 * Content import adapter — maps external JSON/Markdown shapes to AceIGCSE schema.
 * See content/CONTENT_AUTHORING.md for the canonical format.
 */
import type {
  ChapterMeta,
  LegacyContentBundle,
  McqQuestion,
  QuizData,
  SubjectMeta,
  TopicMeta,
} from './contentTypes'

export function adaptLegacyQuiz(
  bundle: LegacyContentBundle,
  topicId: string,
  difficulty: QuizData['difficulty'],
  passPercent = 70,
): QuizData {
  const questions: McqQuestion[] = (bundle.questions ?? []).map((q, i) => ({
    id: `${topicId}-${difficulty}-${i}`,
    type: 'mcq' as const,
    question: q.question ?? q.q ?? '',
    options: q.options ?? q.choices ?? [],
    correctIndex: q.correctIndex ?? q.correct ?? q.answer ?? 0,
  }))

  return {
    id: `${topicId}-${difficulty}`,
    topicId,
    difficulty,
    title: `${bundle.topic ?? topicId} — ${difficulty}`,
    passPercent,
    questions,
  }
}

export interface ExternalSubjectFile {
  id?: string
  name?: string
  code?: string
  chapters?: ExternalChapterFile[]
}

export interface ExternalChapterFile {
  id?: string
  number?: number
  title?: string
  topics?: ExternalTopicFile[]
}

export interface ExternalTopicFile {
  id?: string
  title?: string
  notes?: string
  markdown?: string
  quizzes?: {
    easy?: LegacyContentBundle
    medium?: LegacyContentBundle
    hard?: LegacyContentBundle
    pyp?: LegacyContentBundle
  }
}

export function adaptExternalSubject(
  raw: ExternalSubjectFile,
  defaultSyllabus = 'IGCSE',
): { subject: SubjectMeta; chapters: ChapterMeta[]; topics: TopicMeta[] } {
  const subjectId = raw.id ?? 'imported-subject'
  const chapters: ChapterMeta[] = []
  const topics: TopicMeta[] = []

  for (const ch of raw.chapters ?? []) {
    const chapterId = ch.id ?? `ch-${ch.number ?? chapters.length + 1}`
    const topicIds: string[] = []

    for (const t of ch.topics ?? []) {
      const topicId = t.id ?? `${chapterId}-topic-${topicIds.length + 1}`
      topicIds.push(topicId)
      topics.push({
        id: topicId,
        subjectId,
        chapterId,
        title: t.title ?? topicId,
        subtitle: '',
        notesFile: `${subjectId}/${topicId}.md`,
        quizIds: {
          easy: `${topicId}-easy`,
          medium: `${topicId}-medium`,
          hard: `${topicId}-hard`,
          pyp: `${topicId}-pyp`,
        },
      })
    }

    chapters.push({
      id: chapterId,
      subjectId,
      number: ch.number ?? chapters.length + 1,
      title: ch.title ?? chapterId,
      badge: `CH.${ch.number ?? chapters.length + 1} ${(ch.title ?? '').toUpperCase().slice(0, 12)}`,
      summary: topicIds.map((id) => topics.find((t) => t.id === id)?.title).filter(Boolean).join(' · '),
      topicIds,
      accentColor: 'gold',
    })
  }

  const subject: SubjectMeta = {
    id: subjectId,
    name: raw.name ?? subjectId,
    code: raw.code ?? '',
    syllabus: defaultSyllabus,
    description: '',
    chapterIds: chapters.map((c) => c.id),
  }

  return { subject, chapters, topics }
}

export function adaptExternalQuizzes(topic: ExternalTopicFile, topicId: string) {
  const result = []
  const diffs = ['easy', 'medium', 'hard', 'pyp'] as const
  for (const d of diffs) {
    const bundle = topic.quizzes?.[d]
    if (bundle) {
      result.push(adaptLegacyQuiz({ ...bundle, topic: topic.title }, topicId, d))
    }
  }
  return result
}
