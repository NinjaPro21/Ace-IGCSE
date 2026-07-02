import { db } from '@/lib/firebase'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'

export interface StudyRoom {
  id: string
  topicId: string
  chapterId: string
  subjectId: string
  topicTitle: string
  memberUids: string[]
  createdBy: string
  startedAt: string
}

export async function createStudyRoom(
  userId: string,
  opts: { topicId: string; chapterId: string; subjectId: string; topicTitle: string },
): Promise<string> {
  if (!db) throw new Error('Firebase is not configured')
  const ref = await addDoc(collection(db, 'studyRooms'), {
    ...opts,
    memberUids: [userId],
    createdBy: userId,
    startedAt: serverTimestamp(),
  })
  return ref.id
}

export async function joinStudyRoom(roomId: string, userId: string): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  await updateDoc(doc(db, 'studyRooms', roomId), { memberUids: arrayUnion(userId) })
}

export async function leaveStudyRoom(roomId: string, userId: string): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')
  await updateDoc(doc(db, 'studyRooms', roomId), { memberUids: arrayRemove(userId) })
}

export function subscribeStudyRoom(roomId: string, cb: (room: StudyRoom | null) => void): Unsubscribe {
  if (!db) {
    cb(null)
    return () => {}
  }
  return onSnapshot(doc(db, 'studyRooms', roomId), (snap) => {
    if (!snap.exists()) {
      cb(null)
      return
    }
    const data = snap.data()
    cb({
      id: snap.id,
      topicId: data.topicId as string,
      chapterId: data.chapterId as string,
      subjectId: data.subjectId as string,
      topicTitle: data.topicTitle as string,
      memberUids: (data.memberUids as string[]) ?? [],
      createdBy: data.createdBy as string,
      startedAt:
        (data.startedAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    })
  })
}
