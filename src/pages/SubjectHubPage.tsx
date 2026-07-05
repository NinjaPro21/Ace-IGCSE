import { Link, useParams } from 'react-router-dom'
import { EnlightChapterCard } from '@/components/EnlightChapterCard'
import { EnlightHeader } from '@/components/EnlightHeader'
import { EnlightSectionLabel } from '@/components/EnlightCard'
import { ProgressGatewayCard } from '@/components/ProgressGatewayCard'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getSubjectSummary } from '@/features/mastery/progressStats'
import {
  getChapterMasteryPercent,
  getChapterStatus,
  getChaptersForSubject,
  getSubject,
  getTopicsForChapter,
} from '@/lib/contentLoader'
import type { ChapterMeta } from '@/lib/contentTypes'
import { usePageTitle } from '@/hooks/usePageTitle'

function topicUrl(chapter: ChapterMeta, topicId: string) {
  return `/subjects/${chapter.subjectId}/chapters/${chapter.id}/topics/${topicId}`
}

function findContinueTarget(
  chapters: ChapterMeta[],
  notesRead: Record<string, boolean>,
  getChapterQuizLevel: (id: string) => number,
) {
  for (const ch of chapters) {
    const topics = getTopicsForChapter(ch.id)
    const nextUnread = topics.find((t) => !notesRead[t.id])
    if (nextUnread) {
      return {
        to: topicUrl(ch, nextUnread.id),
        meta: `Resume Ch. ${ch.number} — ${nextUnread.title}`,
      }
    }
    if (getChapterQuizLevel(ch.id) < 4 && ch.hasChapterQuiz) {
      const anchor = topics.find((t) => t.isChapterQuizAnchor) ?? topics[topics.length - 1]
      if (anchor) {
        return {
          to: topicUrl(ch, anchor.id),
          meta: `Review Ch. ${ch.number} before quiz`,
        }
      }
    }
  }
  const first = chapters[0]
  const firstTopic = first ? getTopicsForChapter(first.id)[0] : undefined
  if (first && firstTopic) {
    return { to: topicUrl(first, firstTopic.id), meta: `Start Ch. ${first.number}` }
  }
  return { to: '#chapters', meta: 'Pick a chapter below' }
}

function findQuizTarget(chapters: ChapterMeta[], getChapterQuizLevel: (id: string) => number) {
  const inProgress = chapters.find((ch) => ch.hasChapterQuiz && getChapterQuizLevel(ch.id) > 0 && getChapterQuizLevel(ch.id) < 4)
  const target = inProgress ?? chapters.find((ch) => ch.hasChapterQuiz)
  if (target) {
    const level = getChapterQuizLevel(target.id)
    const diff = level === 0 ? 'easy' : level === 1 ? 'medium' : level === 2 ? 'hard' : 'pyp'
    return {
      to: `/quiz/${target.id}/${diff}`,
      meta: `Ch. ${target.number} — ${diff.charAt(0).toUpperCase() + diff.slice(1)} quiz`,
    }
  }
  return { to: '#chapters', meta: 'Open a chapter with a quiz' }
}

export function SubjectHubPage() {
  const { subjectId = 'add-maths-0606' } = useParams()
  const subject = getSubject(subjectId)
  usePageTitle(subject?.name ?? 'Subject')
  const { progress, getChapterQuizLevel, getTopicNotesReadMap } = useMastery()
  const chapters = getChaptersForSubject(subjectId)
  const notesRead = getTopicNotesReadMap()
  const summary = getSubjectSummary(subjectId, progress)

  const continueTarget = findContinueTarget(chapters, notesRead, getChapterQuizLevel)
  const quizTarget = findQuizTarget(chapters, getChapterQuizLevel)

  if (!subject) {
    return (
      <div className="enlight-app">
        <EnlightHeader />
        <div className="enlight-container enlight-page-padding">
          <p>Subject not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="enlight-app">
      <EnlightHeader />
      <div className="enlight-gradient-bar" />
      <div className="enlight-container enlight-page-padding">
        <Link to="/subjects" className="enlight-progress-back">
          ← All subjects
        </Link>

        <EnlightSectionLabel>{subject.syllabus}</EnlightSectionLabel>
        <h1 className="enlight-heading-serif">{subject.name}</h1>
        <p className="enlight-body-text enlight-subject-hub__intro">{subject.description}</p>

        <div className="enlight-subject-hub__gateways">
          <ProgressGatewayCard
            to={continueTarget.to}
            icon="C"
            title="Continue studying"
            description="Jump back to your next unread section or chapter."
            meta={continueTarget.meta}
            accent="gold"
          />
          <ProgressGatewayCard
            to={quizTarget.to}
            icon="Q"
            title="Take a quiz"
            description="Practice MCQs — Easy through PYP — with a mistake log after each run."
            meta={quizTarget.meta}
            accent="gold"
          />
          <ProgressGatewayCard
            to="/dashboard"
            icon="D"
            title="View dashboard"
            description="XP, streaks, weak topics, and subject mastery."
            meta={`${summary.avgMastery}% quiz average · ${summary.mastered}/${summary.total} chapters mastered`}
            accent="gold"
          />
        </div>

        <h2 id="chapters" className="enlight-heading-serif enlight-subject-hub__chapters-title">
          Chapters
        </h2>
        <div className="enlight-legend">
          <span className="enlight-legend__item">
            <span className="enlight-legend__dot enlight-legend__dot--sage" />
            Not started
          </span>
          <span className="enlight-legend__item">
            <span className="enlight-legend__dot enlight-legend__dot--blue" />
            In progress
          </span>
          <span className="enlight-legend__item">
            <span className="enlight-legend__dot enlight-legend__dot--gold" />
            Mastered
          </span>
        </div>

        <div className="enlight-chapter-grid">
          {chapters.map((ch) => {
            const quizLevel = getChapterQuizLevel(ch.id)
            return (
              <EnlightChapterCard
                key={ch.id}
                chapter={ch}
                status={getChapterStatus(ch.id, notesRead, quizLevel)}
                masteryPercent={getChapterMasteryPercent(ch.id, notesRead, quizLevel)}
              />
            )
          })}
        </div>
      </div>
      <footer className="enlight-footer">© {new Date().getFullYear()} Project Enlight</footer>
    </div>
  )
}
