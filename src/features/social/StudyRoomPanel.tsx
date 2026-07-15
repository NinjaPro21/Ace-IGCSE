import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EnlightButton } from '@/components/EnlightButton'
import { useAuth } from '@/features/social/AuthContext'
import {
  createStudyRoom,
  joinStudyRoom,
  leaveStudyRoom,
  subscribeStudyRoom,
  type StudyRoom,
} from '@/features/social/studyRoomsApi'

interface StudyRoomPanelProps {
  subjectId: string
  chapterId: string
  topicId: string
  topicTitle: string
}

export function StudyRoomPanel({ subjectId, chapterId, topicId, topicTitle }: StudyRoomPanelProps) {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [room, setRoom] = useState<StudyRoom | null>(null)
  const [roomId, setRoomId] = useState(searchParams.get('room') ?? '')
  const [joinDraft, setJoinDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = searchParams.get('room')
    if (!id || !user) return
    setRoomId(id)
    void joinStudyRoom(id, user.id).catch(() => undefined)
  }, [searchParams, user])

  useEffect(() => {
    if (!roomId) {
      setRoom(null)
      return
    }
    return subscribeStudyRoom(roomId, setRoom)
  }, [roomId])

  if (!user) return null

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?room=${roomId}`
      : ''

  const handleCreate = async () => {
    setBusy(true)
    try {
      const id = await createStudyRoom(user.id, { subjectId, chapterId, topicId, topicTitle })
      setRoomId(id)
      const next = new URLSearchParams(searchParams)
      next.set('room', id)
      setSearchParams(next, { replace: true })
    } finally {
      setBusy(false)
    }
  }

  const handleJoin = async () => {
    const id = (joinDraft || roomId).trim()
    if (!id) return
    setBusy(true)
    try {
      await joinStudyRoom(id, user.id)
      setRoomId(id)
      const next = new URLSearchParams(searchParams)
      next.set('room', id)
      setSearchParams(next, { replace: true })
    } finally {
      setBusy(false)
    }
  }

  const handleLeave = async () => {
    if (!roomId) return
    await leaveStudyRoom(roomId, user.id)
    setRoomId('')
    setRoom(null)
    const next = new URLSearchParams(searchParams)
    next.delete('room')
    setSearchParams(next, { replace: true })
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="ace-dashboard-card ace-study-room" aria-label="Study room">
      <h2 className="ace-heading-serif ace-dashboard-card__title">Study together</h2>
      {!roomId ? (
        <>
          <p className="ace-body-text">Start a room and share the link so friends join this lesson.</p>
          <div className="ace-popout__actions">
            <EnlightButton onClick={() => void handleCreate()} disabled={busy}>
              Create room
            </EnlightButton>
          </div>
          <div className="ace-study-plan__add" style={{ marginTop: 12 }}>
            <input
              className="ace-input"
              placeholder="Room ID to join"
              value={joinDraft}
              onChange={(e) => setJoinDraft(e.target.value)}
              aria-label="Study room ID"
            />
            <EnlightButton
              variant="outline"
              onClick={() => {
                setRoomId(joinDraft.trim())
                void handleJoin()
              }}
              disabled={busy || !joinDraft.trim()}
            >
              Join
            </EnlightButton>
          </div>
        </>
      ) : (
        <>
          <p className="ace-body-text">
            {room ? `${room.memberUids.length} studying · ${room.topicTitle}` : 'Connecting…'}
          </p>
          <div className="ace-popout__actions">
            <EnlightButton variant="outline" onClick={() => void handleCopy()}>
              {copied ? 'Link copied!' : 'Copy invite link'}
            </EnlightButton>
            <EnlightButton variant="outline" onClick={() => void handleLeave()}>
              Leave room
            </EnlightButton>
          </div>
        </>
      )}
    </section>
  )
}
