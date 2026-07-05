import { getTopicsForChapter } from '@/lib/contentLoader'
import type { StudyPlanTask } from '@/features/mastery/MasteryEngine'

/** Best lesson URL for a study-plan task (chapter-only routes do not exist). */
export function getStudyTaskPath(task: Pick<StudyPlanTask, 'subjectId' | 'chapterId' | 'topicId'>): string {
  if (task.topicId) {
    return `/subjects/${task.subjectId}/chapters/${task.chapterId}/topics/${task.topicId}`
  }
  const topics = getTopicsForChapter(task.chapterId)
  const first = topics[0]
  if (first) {
    return `/subjects/${task.subjectId}/chapters/${task.chapterId}/topics/${first.id}`
  }
  return `/subjects/${task.subjectId}`
}

export function getDefaultTopicIdForChapter(chapterId: string): string | undefined {
  return getTopicsForChapter(chapterId)[0]?.id
}
