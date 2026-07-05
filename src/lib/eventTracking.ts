import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { hasAnalyticsConsent } from '@/lib/analyticsConsent'
import { trackEvent } from '@/lib/analytics'
import { db } from '@/lib/firebase'

const HASH_SALT = (import.meta.env.VITE_EVENT_HASH_SALT as string | undefined) ?? 'enlight-events'

let cachedHash: string | null = null
let cachedUid: string | null = null

export type EnlightEventName =
  | 'notes_opened'
  | 'notes_closed'
  | 'quiz_started'
  | 'quiz_completed'
  | 'question_answered'
  | 'chapter_thumbs_up'
  | 'chapter_thumbs_down'
  | 'session_started'
  | 'session_ended'

export interface EnlightEventBase {
  chapterId: string
  subject: string
}

export interface NotesClosedPayload extends EnlightEventBase {
  durationSec: number
}

export interface QuizCompletedPayload extends EnlightEventBase {
  score: number
  attemptNumber: number
  timeTakenSec: number
}

export interface QuestionAnsweredPayload extends EnlightEventBase {
  questionId: string
  correct: boolean
}

export interface SessionEndedPayload {
  durationSec: number
  subject?: string
  chapterId?: string
}

type EventPayload =
  | EnlightEventBase
  | NotesClosedPayload
  | QuizCompletedPayload
  | QuestionAnsweredPayload
  | SessionEndedPayload
  | Record<string, never>

async function hashUserId(uid: string): Promise<string> {
  if (cachedUid === uid && cachedHash) return cachedHash
  const data = new TextEncoder().encode(`${HASH_SALT}:${uid}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  cachedHash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  cachedUid = uid
  return cachedHash
}

function toAnalyticsParams(
  event: EnlightEventName,
  payload: EventPayload,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    event_name: event,
  }
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      params[key] = value as string | number | boolean
    }
  }
  return params
}

export async function trackEnlightEvent(
  uid: string | undefined,
  event: EnlightEventName,
  payload: EventPayload = {},
): Promise<void> {
  if (!uid || !hasAnalyticsConsent()) return

  const userIdHash = await hashUserId(uid)
  const timestamp = new Date().toISOString()

  if (hasAnalyticsConsent()) {
    trackEvent(event, {
      ...toAnalyticsParams(event, payload),
      user_id_hash: userIdHash,
      timestamp,
    })
  }

  if (!db) return

  try {
    await addDoc(collection(db, 'events'), {
      event,
      timestamp,
      recordedAt: serverTimestamp(),
      userIdHash,
      uid,
      ...payload,
    })
  } catch {
    // Firestore unavailable — GA4 event may still have been sent
  }
}
