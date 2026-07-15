import { getChapter, getTopicsForChapter } from '@/lib/contentLoader'
import { localDateISO } from '@/lib/localDate'
import { getPersonalChapterInsights, getStuckChapters } from './tutorInsights'
import type { UserProgress } from './MasteryEngine'
import { getTodayStudyMinutes } from './progressStats'

export const DAILY_QUEST_BONUS_XP = 25
export const DAILY_QUEST_COUNT = 3

export type DailyQuestKind = 'review_chapter' | 'pass_medium_quiz' | 'daily_goal'

export interface DailyQuest {
  id: string
  kind: DailyQuestKind
  title: string
  description: string
  subjectId?: string
  chapterId?: string
  topicId?: string
  path?: string
  done: boolean
}

export interface DailyQuestState {
  forDate: string
  quests: DailyQuest[]
  bonusClaimed: boolean
}

function pickWeakChapter(progress: UserProgress): {
  chapterId: string
  subjectId: string
  topicId: string
  title: string
} | null {
  const stuck = getStuckChapters(getPersonalChapterInsights(progress), 1)[0]
  if (!stuck) return null
  const topics = getTopicsForChapter(stuck.chapterId)
  const topic = topics[0]
  if (!topic) return null
  const chapter = getChapter(stuck.chapterId)
  const shortTitle = chapter
    ? `${chapter.number}-${chapter.title.split(':').pop()?.trim() ?? chapter.title}`
    : stuck.chapterTitle
  return {
    chapterId: stuck.chapterId,
    subjectId: stuck.subjectId,
    topicId: topic.id,
    title: shortTitle.slice(0, 48),
  }
}

export function generateDailyQuests(progress: UserProgress, forDate = localDateISO()): DailyQuestState {
  const weak = pickWeakChapter(progress)
  const goalMin = progress.dailyGoalMin ?? 20

  const quests: DailyQuest[] = []

  if (weak) {
    quests.push({
      id: `${forDate}-review`,
      kind: 'review_chapter',
      title: `Review ${weak.title}`,
      description: 'Open the lesson notes or pass any quiz on this chapter.',
      subjectId: weak.subjectId,
      chapterId: weak.chapterId,
      topicId: weak.topicId,
      path: `/subjects/${weak.subjectId}/chapters/${weak.chapterId}/topics/${weak.topicId}`,
      done: false,
    })
  } else {
    quests.push({
      id: `${forDate}-review`,
      kind: 'review_chapter',
      title: 'Study one topic',
      description: 'Spend 5+ minutes on any lesson notes.',
      done: false,
    })
  }

  quests.push({
    id: `${forDate}-medium`,
    kind: 'pass_medium_quiz',
    title: 'Pass a medium quiz',
    description: 'Clear a medium-tier quiz on any chapter.',
    done: false,
  })

  quests.push({
    id: `${forDate}-goal`,
    kind: 'daily_goal',
    title: `Hit your daily goal (${goalMin} min)`,
    description: `Study at least ${goalMin} minutes today.`,
    done: getTodayStudyMinutes(progress) >= goalMin,
  })

  return { forDate, quests, bonusClaimed: false }
}

export function evaluateDailyQuests(
  state: DailyQuestState,
  progress: UserProgress,
  ctx?: { chapterId?: string; topicId?: string; mediumQuizPassed?: boolean; notesStudiedSec?: number },
): DailyQuestState {
  const today = localDateISO()
  if (state.forDate !== today) return state

  const quests = state.quests.map((q) => {
    if (q.done) return q
    if (q.kind === 'daily_goal') {
      return { ...q, done: getTodayStudyMinutes(progress) >= (progress.dailyGoalMin ?? 20) }
    }
    if (q.kind === 'pass_medium_quiz' && ctx?.mediumQuizPassed) {
      return { ...q, done: true }
    }
    if (q.kind === 'review_chapter') {
      if (ctx?.mediumQuizPassed && q.chapterId && ctx.chapterId === q.chapterId) {
        return { ...q, done: true }
      }
      if (q.chapterId && ctx?.chapterId === q.chapterId) {
        const topicTime = q.topicId ? (progress.topics[q.topicId]?.timeSpentSec ?? 0) : 0
        const chapterTime = progress.chapterStats[q.chapterId]?.timeSpentSec ?? 0
        if (topicTime >= 300 || chapterTime >= 300 || (ctx?.notesStudiedSec ?? 0) >= 60) {
          return { ...q, done: true }
        }
      }
      if (!q.chapterId && (ctx?.notesStudiedSec ?? 0) >= 300) {
        return { ...q, done: true }
      }
    }
    return q
  })

  return { ...state, quests }
}

export function allDailyQuestsDone(state: DailyQuestState | undefined): boolean {
  if (!state || state.quests.length === 0) return false
  return state.quests.every((q) => q.done)
}
