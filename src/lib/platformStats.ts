import { getAllSubjects, getChaptersForSubject, getTopicsForChapter, getNotesForTopic } from '@/lib/contentLoader'
import type { TopicMeta } from '@/lib/contentTypes'

export interface PlatformStats {
  subjectCount: number
  chapterCount: number
  topicCount: number
  quizFileCount: number
  diagramTopicCount: number
}

export interface SubjectStats {
  id: string
  name: string
  code: string
  description: string
  accent: 'gold' | 'blue' | 'green'
  chapterCount: number
  topicCount: number
  /** Topics with inline diagrams and/or a matching interactive explorer */
  diagramTopicCount: number
  sampleChapters: string[]
  highlights: string[]
}

const SUBJECT_META: Record<string, Pick<SubjectStats, 'accent' | 'highlights'>> = {
  'add-maths-0606': {
    accent: 'gold',
    highlights: ['Functions', 'Calculus', 'Vectors', 'Probability'],
  },
  'maths-0580': {
    accent: 'blue',
    highlights: ['Algebra', 'Geometry', 'Trigonometry', 'Statistics'],
  },
  physics: {
    accent: 'green',
    highlights: ['Mechanics', 'Waves', 'Electricity', 'Radioactivity'],
  },
}

let cached: PlatformStats | null = null
let subjectStatsCache: SubjectStats[] | null = null

function noteHasDiagrams(topic: TopicMeta): boolean {
  const text = getNotesForTopic(topic)
  return text.includes('## Graphs & diagrams') || text.includes('enlight-physics-diagram')
}

/** Inline diagrams in the note, or a wired interactive explorer at the bottom. */
function topicHasVisualHelp(topic: TopicMeta): boolean {
  return Boolean(topic.explorerId) || noteHasDiagrams(topic)
}

function countTopicsForSubject(subjectId: string) {
  const chapters = getChaptersForSubject(subjectId)
  let topicCount = 0
  let diagramTopicCount = 0
  const sampleChapters: string[] = []

  for (const chapter of chapters) {
    const topics = getTopicsForChapter(chapter.id)
    topicCount += topics.length
    diagramTopicCount += topics.filter(topicHasVisualHelp).length
    if (sampleChapters.length < 4) sampleChapters.push(chapter.title)
  }

  return { chapterCount: chapters.length, topicCount, diagramTopicCount, sampleChapters }
}

/** Counts from bundled content — used on marketing walkthrough. */
export function getPlatformStats(): PlatformStats {
  if (cached) return cached

  const subjects = getAllSubjects()
  let chapterCount = 0
  let topicCount = 0
  let diagramTopicCount = 0

  for (const subject of subjects) {
    const stats = countTopicsForSubject(subject.id)
    chapterCount += stats.chapterCount
    topicCount += stats.topicCount
    diagramTopicCount += stats.diagramTopicCount
  }

  cached = {
    subjectCount: subjects.length,
    chapterCount,
    topicCount,
    diagramTopicCount,
    quizFileCount: topicCount * 4,
  }
  return cached
}

export function getSubjectStatsList(): SubjectStats[] {
  if (subjectStatsCache) return subjectStatsCache

  subjectStatsCache = getAllSubjects().map((subject) => {
    const stats = countTopicsForSubject(subject.id)
    const meta = SUBJECT_META[subject.id] ?? { accent: 'blue' as const, highlights: [] }
    return {
      id: subject.id,
      name: subject.name,
      code: subject.code,
      description: subject.description,
      accent: meta.accent,
      chapterCount: stats.chapterCount,
      topicCount: stats.topicCount,
      diagramTopicCount: stats.diagramTopicCount,
      sampleChapters: stats.sampleChapters,
      highlights: meta.highlights,
    }
  })

  return subjectStatsCache
}

export function formatStatValue(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 100) * 100}+`
  if (n >= 100) return `${Math.floor(n / 10) * 10}+`
  return String(n)
}
