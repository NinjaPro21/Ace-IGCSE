import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface AppReview {
  uid: string
  rating: number
  comment: string
  createdAt: ReturnType<typeof serverTimestamp>
}

export async function fetchReviewSubmitted(uid: string): Promise<boolean> {
  if (!db) return false
  try {
    const snap = await getDoc(doc(db, 'profiles', uid))
    return snap.exists() && snap.data()?.appReviewSubmitted === true
  } catch {
    return false
  }
}

export async function submitAppReview(
  uid: string,
  rating: number,
  comment: string,
): Promise<void> {
  if (!db) throw new Error('Firebase is not configured')

  const trimmed = comment.trim().slice(0, 500)
  const stars = Math.min(5, Math.max(1, Math.round(rating)))

  await addDoc(collection(db, 'appReviews'), {
    uid,
    rating: stars,
    comment: trimmed,
    createdAt: serverTimestamp(),
  } satisfies Omit<AppReview, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> })

  await setDoc(
    doc(db, 'profiles', uid),
    { appReviewSubmitted: true },
    { merge: true },
  )
}
