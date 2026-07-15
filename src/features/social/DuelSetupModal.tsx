import { useMemo, useState } from 'react'
import { EnlightButton } from '@/components/EnlightButton'
import { useMastery } from '@/features/mastery/MasteryContext'
import { getContinueStudying } from '@/features/mastery/progressStats'
import {
  getAllSubjects,
  getChapter,
  getChaptersForSubject,
  getTopic,
  getTopicsForChapter,
} from '@/lib/contentLoader'
import type { Difficulty } from '@/lib/contentTypes'
import { friendlyErrorMessage } from '@/lib/firebaseErrors'
import { createDuel } from './duelsApi'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

interface DuelSetupModalProps {
  userId: string
  friendId: string
  friendName: string
  onClose: () => void
  onSent: () => void
}

export function DuelSetupModal({ userId, friendId, friendName, onClose, onSent }: DuelSetupModalProps) {
  const { progress } = useMastery()
  const continueTarget = useMemo(() => getContinueStudying(progress), [progress])
  const subjects = getAllSubjects()

  const defaultSubjectId =
    continueTarget?.subjectId ?? subjects[0]?.id ?? 'add-maths-0606'
  const defaultChapterId =
    continueTarget?.chapterId ?? getChaptersForSubject(defaultSubjectId)[0]?.id ?? ''
  const defaultTopicId =
    continueTarget?.topicId ?? getTopicsForChapter(defaultChapterId)[0]?.id ?? ''

  const [subjectId, setSubjectId] = useState(defaultSubjectId)
  const [chapterId, setChapterId] = useState(defaultChapterId)
  const [topicId, setTopicId] = useState(defaultTopicId)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chapters = useMemo(() => getChaptersForSubject(subjectId), [subjectId])
  const topics = useMemo(() => getTopicsForChapter(chapterId), [chapterId])
  const topic = getTopic(topicId)
  const chapter = getChapter(chapterId)

  const handleSubjectChange = (nextSubjectId: string) => {
    setSubjectId(nextSubjectId)
    const nextChapters = getChaptersForSubject(nextSubjectId)
    const nextChapterId = nextChapters[0]?.id ?? ''
    setChapterId(nextChapterId)
    setTopicId(getTopicsForChapter(nextChapterId)[0]?.id ?? '')
  }

  const handleChapterChange = (nextChapterId: string) => {
    setChapterId(nextChapterId)
    setTopicId(getTopicsForChapter(nextChapterId)[0]?.id ?? '')
  }

  const handleSend = async () => {
    if (!topicId || !chapterId) {
      setError('Pick a section to duel on.')
      return
    }
    setSending(true)
    setError(null)
    try {
      await createDuel(userId, friendId, { topicId, chapterId, difficulty })
      onSent()
      onClose()
    } catch (e) {
      setError(friendlyErrorMessage(e, 'Could not send duel — try again.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="ace-popout-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="ace-popout ace-popout--card ace-duel-setup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ace-duel-setup__hero">
          <span className="ace-duel-setup__hero-icon" aria-hidden>⚔️</span>
          <div>
            <h2 className="ace-heading-serif">Challenge {friendName}</h2>
            <p className="ace-body-text" style={{ margin: 0 }}>
              Same quiz, highest score wins. They&apos;ll get a notification to accept.
            </p>
          </div>
        </div>

        <div className="ace-duel-setup__fields">
        <label className="ace-profile-form__label">
          Subject
          <select
            className="ace-select ace-profile-form__input"
            value={subjectId}
            onChange={(e) => handleSubjectChange(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="ace-profile-form__label">
          Chapter
          <select
            className="ace-select ace-profile-form__input"
            value={chapterId}
            onChange={(e) => handleChapterChange(e.target.value)}
          >
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                Ch {c.number}: {c.title}
              </option>
            ))}
          </select>
        </label>

        <label className="ace-profile-form__label">
          Section
          <select
            className="ace-select ace-profile-form__input"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>

        <label className="ace-profile-form__label">
          Difficulty
          <select
            className="ace-select ace-profile-form__input"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </label>
        </div>

        {topic && chapter && (
          <p className="ace-body-text ace-duel-setup__summary">
            Duel: <strong>{topic.title}</strong> · {difficulty} · {chapter.title}
          </p>
        )}

        {error && <p className="ace-form-message">{error}</p>}

        <div className="ace-duel-setup__actions">
          <EnlightButton variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </EnlightButton>
          <EnlightButton onClick={() => void handleSend()} disabled={sending || !topicId}>
            {sending ? 'Sending…' : 'Send challenge'}
          </EnlightButton>
        </div>
      </div>
    </div>
  )
}
