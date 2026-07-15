import {
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
  type UpdateData,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toResearchSubjectKey, type ResearchSubjectKey } from './researchSubjectKeys'
import {
  dayOfWeekKey,
  localDateKey,
  scoreToBucket,
  type DayOfWeekKey,
  type QuizScoreHistoryEntry,
  type ReferralSource,
  type StudySessionLogEntry,
  type XpSource,
} from './platformStatsTypes'

const LEARNING_DOC = 'learning'
const MAX_STUDY_LOG = 50
const MAX_QUIZ_HISTORY = 100
const MAX_TOPICS_VIEWED = 200

export type ResearchAnalyticsEvent =
  | 'user_signed_up'
  | 'session_started'
  | 'session_ended'
  | 'topic_opened'
  | 'notes_read'
  | 'chapter_completed'
  | 'quiz_attempted'
  | 'quiz_passed'
  | 'xp_awarded'
  | 'streak_updated'
  | 'study_time_credited'
  // Enlight / GA aliases routed through trackEvent
  | 'notes_opened'
  | 'notes_closed'
  | 'quiz_started'
  | 'quiz_completed'
  | 'question_answered'
  | 'chapter_thumbs_up'
  | 'chapter_thumbs_down'
  | 'quiz_complete'
  | 'chapter_notes_complete'
  | 'login'
  | 'level_up'

export type AnalyticsEventPayload = Record<
  string,
  string | number | boolean | undefined | null
>

function learningRef(uid: string) {
  return doc(db!, 'profiles', uid, 'analytics', LEARNING_DOC)
}

function asReferralSource(raw: unknown): ReferralSource {
  if (raw === 'discord' || raw === 'direct' || raw === 'other') return raw
  return 'direct'
}

function asXpSource(raw: unknown): XpSource {
  if (raw === 'quiz' || raw === 'notes' || raw === 'streak' || raw === 'chapter') return raw
  return 'quiz'
}

async function ensureLearningDoc(uid: string): Promise<void> {
  if (!db) return
  const ref = learningRef(uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return
  await setDoc(ref, {
    createdAt: new Date().toISOString(),
    referralSource: 'direct',
    sessionCount: 0,
    totalSessionSeconds: 0,
    firstSessionAt: null,
    lastSessionAt: null,
    lastActiveDate: null,
    totalStudySeconds: 0,
    studySessionCount: 0,
    studySessionLog: [],
    topicsViewed: [],
    topicViewCounts: {},
    topicRevisitCounts: {},
    topicCompletionCounts: {},
    notesReadCounts: {},
    chapterCompletionCounts: {},
    quizScoreHistory: [],
    quizRetakeCount: 0,
    firstAttemptPassCount: 0,
    firstAttemptCount: 0,
    attemptsBeforePassSum: 0,
    passedQuizCount: 0,
    totalXpAwarded: 0,
    currentStreak: 0,
    longestStreak: 0,
    wasChurned: false,
    reactivatedCount: 0,
    updatedAt: serverTimestamp(),
  })
}

async function patchLearning(uid: string, data: UpdateData<Record<string, unknown>>): Promise<void> {
  if (!db) return
  await ensureLearningDoc(uid)
  await updateDoc(learningRef(uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

async function appendCappedArray<T>(
  uid: string,
  field: 'studySessionLog' | 'quizScoreHistory' | 'topicsViewed',
  entry: T,
  max: number,
): Promise<void> {
  if (!db) return
  await ensureLearningDoc(uid)
  const snap = await getDoc(learningRef(uid))
  const existing = (snap.data()?.[field] as T[] | undefined) ?? []
  const next = [...existing, entry].slice(-max)
  await updateDoc(learningRef(uid), {
    [field]: next,
    updatedAt: serverTimestamp(),
  })
}

function subjectKey(payload: AnalyticsEventPayload): ResearchSubjectKey | null {
  const fromSubject =
    toResearchSubjectKey(typeof payload.subject === 'string' ? payload.subject : null) ??
    toResearchSubjectKey(typeof payload.subjectId === 'string' ? payload.subjectId : null)
  return fromSubject
}

/**
 * Apply a behavioural event to profiles/{uid}/analytics/learning.
 * Uses increment() for counters. Failures must be caught by callers.
 */
export async function updatePersonalAnalytics(
  uid: string,
  eventName: string,
  payload: AnalyticsEventPayload = {},
): Promise<void> {
  if (!db || !uid) return

  const now = new Date()
  const iso = now.toISOString()
  const dateKey = localDateKey(now)
  const hour = String(now.getHours())
  const dow = dayOfWeekKey(now)
  const subject = subjectKey(payload)

  switch (eventName as ResearchAnalyticsEvent) {
    case 'user_signed_up': {
      const referral = asReferralSource(payload.referralSource)
      await patchLearning(uid, {
        createdAt: iso,
        referralSource: referral,
        lastActiveDate: dateKey,
        firstSessionAt: iso,
        lastSessionAt: iso,
      })
      return
    }

    case 'login': {
      await patchLearning(uid, { lastActiveDate: dateKey })
      return
    }

    case 'session_started': {
      await ensureLearningDoc(uid)
      const snap = await getDoc(learningRef(uid))
      const data = snap.exists() ? snap.data() : null
      const wasChurned = Boolean(data?.wasChurned)
      const updates: UpdateData<Record<string, unknown>> = {
        sessionCount: increment(1),
        lastSessionAt: iso,
        lastActiveDate: dateKey,
      }
      if (!data?.firstSessionAt) updates.firstSessionAt = iso
      if (wasChurned) {
        updates.wasChurned = false
        updates.reactivatedCount = increment(1)
      }
      await patchLearning(uid, updates)
      return
    }

    case 'session_ended': {
      const durationSec = Number(payload.durationSec) || 0
      if (durationSec > 0) {
        await patchLearning(uid, {
          totalSessionSeconds: increment(durationSec),
          lastSessionAt: iso,
          lastActiveDate: dateKey,
        })
      }
      return
    }

    case 'topic_opened':
    case 'notes_opened': {
      const topicId = typeof payload.topicId === 'string' ? payload.topicId : ''
      if (!topicId) return
      const snap = await getDoc(learningRef(uid)).catch(() => null)
      const viewed = (snap?.data()?.topicsViewed as string[] | undefined) ?? []
      const already = viewed.includes(topicId)
      const updates: UpdateData<Record<string, unknown>> = {
        [`topicViewCounts.${topicId}`]: increment(1),
        lastActiveDate: dateKey,
      }
      if (already) {
        updates[`topicRevisitCounts.${topicId}`] = increment(1)
      }
      await patchLearning(uid, updates)
      if (!already) {
        await appendCappedArray(uid, 'topicsViewed', topicId, MAX_TOPICS_VIEWED)
      }
      return
    }

    case 'notes_read': {
      const topicId = typeof payload.topicId === 'string' ? payload.topicId : ''
      if (!topicId) return
      await patchLearning(uid, {
        [`notesReadCounts.${topicId}`]: increment(1),
        [`topicCompletionCounts.${topicId}`]: increment(1),
        lastActiveDate: dateKey,
      })
      return
    }

    case 'chapter_completed':
    case 'chapter_notes_complete': {
      const chapterId = typeof payload.chapterId === 'string' ? payload.chapterId : ''
      if (!chapterId) return
      await patchLearning(uid, {
        [`chapterCompletionCounts.${chapterId}`]: increment(1),
        lastActiveDate: dateKey,
      })
      return
    }

    case 'quiz_attempted':
    case 'quiz_completed':
    case 'quiz_complete': {
      const score = Number(payload.score) || 0
      const passed = Boolean(payload.passed)
      const attemptNumber = Number(payload.attemptNumber) || 1
      const topicId = typeof payload.topicId === 'string' ? payload.topicId : undefined
      const chapterId = typeof payload.chapterId === 'string' ? payload.chapterId : undefined
      const bucket = scoreToBucket(score)
      const updates: UpdateData<Record<string, unknown>> = {
        [`quizScoreBucketCounts.${bucket}`]: increment(1),
        lastActiveDate: dateKey,
      }
      if (subject) {
        updates[`quizAttemptsBySubject.${subject}`] = increment(1)
        updates[`quizAttemptCountBySubject.${subject}`] = increment(1)
        updates[`quizScoreSumBySubject.${subject}`] = increment(score)
        if (passed) updates[`quizPassCountBySubject.${subject}`] = increment(1)
      }
      if (topicId) {
        updates[`quizScoreSumByTopic.${topicId}`] = increment(score)
        updates[`quizAttemptCountByTopic.${topicId}`] = increment(1)
      }
      if (attemptNumber === 1) {
        updates.firstAttemptCount = increment(1)
        if (passed) updates.firstAttemptPassCount = increment(1)
      } else {
        updates.quizRetakeCount = increment(1)
      }
      if (passed) {
        updates.passedQuizCount = increment(1)
        updates.attemptsBeforePassSum = increment(attemptNumber)
      }
      await patchLearning(uid, updates)

      if (subject) {
        const entry: QuizScoreHistoryEntry = {
          at: iso,
          topicId,
          chapterId,
          subject,
          score,
          passed,
          attemptNumber,
        }
        await appendCappedArray(uid, 'quizScoreHistory', entry, MAX_QUIZ_HISTORY)
      }

      if (passed && eventName !== 'quiz_passed') {
        // pass metrics already included above
      }
      return
    }

    case 'quiz_passed': {
      // Pass counters live on quiz_attempted / quiz_completed when passed=true.
      await patchLearning(uid, { lastActiveDate: dateKey })
      return
    }

    case 'xp_awarded': {
      const amount = Number(payload.amount) || 0
      if (amount <= 0) return
      const source = asXpSource(payload.source)
      await patchLearning(uid, {
        totalXpAwarded: increment(amount),
        [`xpBySource.${source}`]: increment(amount),
        lastActiveDate: dateKey,
      })
      return
    }

    case 'streak_updated': {
      const current = Number(payload.currentStreak) || 0
      const longest = Number(payload.longestStreak) || current
      await patchLearning(uid, {
        currentStreak: current,
        longestStreak: longest,
        lastActiveDate: dateKey,
      })
      return
    }

    case 'notes_closed': {
      // Duration is credited via study_time_credited from session hooks — avoid double-count.
      await patchLearning(uid, { lastActiveDate: dateKey })
      return
    }

    case 'study_time_credited': {
      const seconds = Number(payload.seconds ?? payload.durationSec) || 0
      if (seconds <= 0) return
      const topicId = typeof payload.topicId === 'string' ? payload.topicId : undefined
      const updates: UpdateData<Record<string, unknown>> = {
        totalStudySeconds: increment(seconds),
        studySessionCount: increment(1),
        [`studySecondsByHourOfDay.${hour}`]: increment(seconds),
        [`studySecondsByDayOfWeek.${dow}`]: increment(seconds),
        lastActiveDate: dateKey,
      }
      if (subject) {
        updates[`studySecondsBySubject.${subject}`] = increment(seconds)
        updates[`subjectTimeBreakdown.${subject}`] = increment(seconds)
      }
      await patchLearning(uid, updates)

      const logEntry: StudySessionLogEntry = {
        at: iso,
        seconds,
        subject: subject ?? undefined,
        topicId,
        hour: now.getHours(),
        dayOfWeek: dow as DayOfWeekKey,
      }
      await appendCappedArray(uid, 'studySessionLog', logEntry, MAX_STUDY_LOG)
      return
    }

    default:
      // Unknown events: touch last-active only when signed in tracking
      await patchLearning(uid, { lastActiveDate: dateKey }).catch(() => undefined)
  }
}

/** Capture ?ref= for signup attribution (discord | direct | other). */
const REFERRAL_STORAGE_KEY = 'enlight-referral-source'

export function captureReferralFromUrl(search: string = typeof window !== 'undefined' ? window.location.search : ''): void {
  try {
    const params = new URLSearchParams(search)
    const ref = params.get('ref')?.toLowerCase()
    if (!ref) return
    let source: ReferralSource = 'other'
    if (ref === 'discord') source = 'discord'
    else if (ref === 'direct') source = 'direct'
    localStorage.setItem(REFERRAL_STORAGE_KEY, source)
  } catch {
    // ignore
  }
}

export function getStoredReferralSource(): ReferralSource {
  try {
    return asReferralSource(localStorage.getItem(REFERRAL_STORAGE_KEY))
  } catch {
    return 'direct'
  }
}
