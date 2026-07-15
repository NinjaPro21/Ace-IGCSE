/**
 * One-time full Firestore wipe before public launch.
 * Uses Firebase Admin SDK — not exposed in the app UI.
 *
 * Keeps: admins/*, config/*
 * Does NOT delete Firebase Auth accounts — users sign in fresh and recreate profiles.
 *
 * Setup:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccount.json"
 *
 * Dry run (default):
 *   npx tsx scripts/reset-all-launch.ts
 *
 * Apply:
 *   npx tsx scripts/reset-all-launch.ts --confirm
 *
 * Optional: --project=project-enlight-notes
 */
import { existsSync, readFileSync } from 'fs'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue, type Firestore, type QueryDocumentSnapshot } from 'firebase-admin/firestore'

const PLATFORM_STATS_RESET_BASE = {
  totalSignUps: 0,
  totalStudySeconds: 0,
  totalQuizAttempts: 0,
  dailyActiveUsers: 0,
  weeklyActiveUsers: 0,
  returningUsers: 0,
  averageSessionDurationSeconds: 0,
  totalSessions: 0,
  sessionsPerUserAverage: 0,
  dropOffAfterFirstSession: 0,
  studySecondsBySubject: { math: 0, addMath: 0, physics: 0 },
  studySecondsByHourOfDay: Object.fromEntries([...Array(24)].map((_, h) => [String(h), 0])),
  studySecondsByDayOfWeek: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
  averageStudySessionLengthSeconds: 0,
  peakStudyHour: 0,
  peakStudyDay: '',
  topicViewCounts: {},
  topicCompletionCounts: {},
  topicCompletionRates: {},
  mostRevisitedTopics: [] as string[],
  notesReadCounts: {},
  chapterCompletionCounts: {},
  subjectEngagementRatio: { math: 0, addMath: 0, physics: 0 },
  quizAttemptsBySubject: { math: 0, addMath: 0, physics: 0 },
  quizAverageScoreBySubject: { math: 0, addMath: 0, physics: 0 },
  quizPassRateBySubject: { math: 0, addMath: 0, physics: 0 },
  quizAverageScoreByTopic: {},
  quizRetakeRate: 0,
  quizScoreDistribution: { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 },
  firstAttemptPassRate: 0,
  averageAttemptsBeforePass: 0,
  totalXpAwarded: 0,
  xpBySource: { quiz: 0, notes: 0, streak: 0, chapter: 0 },
  averageXpPerUser: 0,
  streakDistribution: { '1-3': 0, '4-7': 0, '8-14': 0, '15+': 0 },
  usersWithActiveStreak: 0,
  averageStreakLength: 0,
  leaderboardParticipationRate: 0,
  day1RetentionRate: 0,
  day7RetentionRate: 0,
  day30RetentionRate: 0,
  averageDaysBetweenSessions: 0,
  churnedUsers: 0,
  reactivatedUsers: 0,
  signUpsByDay: {},
  signUpsByReferralSource: { discord: 0, direct: 0, other: 0 },
}

const PILOT_UIDS = [
  'SPLITQ9EAQVaH6FGAi66lT8UjL32',
  'nUhyTtzzjlO2V54pyDo67lgi5sQ2',
  'Pfw1G2mHxQOBj3YEpa4ufIeV2K43',
  'b5jFOHprGEPjymupp4Pyen1Fzi52',
  'RQQNHnQrXhSM3CgnUqW4HuQg7qp2',
  'MQNzVDJzwle8n2PpuxJ3C6WZsxF2',
] as const

/** Clans live in `schools` (type: school | clan). `groups` is checked in case it exists. */
const COLLECTIONS_TO_WIPE = [
  'profiles',
  'leaderboard',
  'events',
  'analyticsEvents',
  'buddyStreaks',
  'studyRooms',
  'platformStats',
  'schools',
  'groups',
  'friendCodes',
  'friendRequests',
  'presence',
  'duels',
  'appReviews',
] as const

function usage(exitCode = 1): never {
  console.error(`
Usage:
  npx tsx scripts/reset-all-launch.ts [--confirm] [--project <id>]

  Wipes all documents in: ${COLLECTIONS_TO_WIPE.join(', ')}
  Keeps Firebase Auth accounts and admins/config collections.

  --confirm  Apply deletions (default is dry run).
  --project  Firebase project id (defaults to service account project_id).
`)
  process.exit(exitCode)
}

function flagValue(args: string[], name: string): string | undefined {
  const eq = args.find((a) => a.startsWith(`${name}=`))
  if (eq) return eq.slice(name.length + 1)
  const idx = args.indexOf(name)
  if (idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith('--')) return args[idx + 1]
  return undefined
}

function logAction(kind: string, path: string, detail = ''): void {
  const suffix = detail ? ` — ${detail}` : ''
  console.log(`  [${kind}] ${path}${suffix}`)
}

async function wipeCollection(db: Firestore, name: string, confirm: boolean): Promise<number> {
  console.log(`\nCollection: ${name}`)
  let total = 0
  let cursor: QueryDocumentSnapshot | null = null

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let q = db.collection(name).limit(400)
    if (cursor) q = q.startAfter(cursor)
    const snap = await q.get()
    if (snap.empty) break

    for (const docSnap of snap.docs) {
      total += 1
      logAction(confirm ? 'delete' : 'would delete', docSnap.ref.path)
    }

    if (confirm) {
      const batch = db.batch()
      snap.docs.forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }

    cursor = snap.docs[snap.docs.length - 1] ?? null
    if (snap.size < 400) break
  }

  if (total === 0) logAction('skip', name, 'no documents')
  return total
}

async function wipePrivateSubcollections(db: Firestore, confirm: boolean): Promise<number> {
  console.log('\nSubcollection: profiles/*/private + profiles/*/analytics')
  let total = 0
  for (const group of ['private', 'analytics'] as const) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const snap = await db.collectionGroup(group).limit(200).get()
      if (snap.empty) break
      for (const docSnap of snap.docs) {
        total += 1
        logAction(confirm ? 'delete' : 'would delete', docSnap.ref.path)
      }
      if (confirm) {
        const batch = db.batch()
        snap.docs.forEach((d) => batch.delete(d.ref))
        await batch.commit()
      }
      if (snap.size < 200) break
    }
  }
  if (total === 0) logAction('skip', 'profiles/*/private|analytics', 'no documents')
  return total
}

async function wipeSubcollection(
  db: Firestore,
  path: string,
  confirm: boolean,
): Promise<number> {
  let total = 0
  let last: QueryDocumentSnapshot | undefined
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let q = db.collection(path).orderBy('__name__').limit(200)
    if (last) q = q.startAfter(last)
    const snap = await q.get()
    if (snap.empty) break
    for (const d of snap.docs) {
      total += 1
      logAction(confirm ? 'delete' : 'would delete', d.ref.path)
    }
    if (confirm) {
      const batch = db.batch()
      snap.docs.forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }
    last = snap.docs[snap.docs.length - 1]
    if (snap.size < 200) break
  }
  return total
}

async function resetPlatformStats(db: Firestore, confirm: boolean): Promise<void> {
  const ref = db.doc('platformStats/summary')
  logAction(confirm ? 'reset' : 'would reset', ref.path, 'zero counters')
  if (confirm) {
    await ref.set(
      {
        ...PLATFORM_STATS_RESET_BASE,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: false },
    )
  }
  await wipeSubcollection(db, 'platformStats/summary/daily', confirm)
  await wipeSubcollection(db, 'platformStats/summary/weekly', confirm)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) usage(0)

  const confirm = args.includes('--confirm')
  const projectFlag = flagValue(args, '--project')

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!credPath || !existsSync(credPath)) {
    console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service account JSON path.')
    console.error('Example: $env:GOOGLE_APPLICATION_CREDENTIALS="C:\\keys\\enlight-admin.json"')
    process.exit(1)
  }

  const serviceAccount = JSON.parse(readFileSync(credPath, 'utf8')) as {
    project_id?: string
    client_email?: string
    private_key?: string
  }
  const projectId = projectFlag ?? serviceAccount.project_id
  if (!projectId) {
    console.error('Could not determine project id — pass --project=<id>.')
    process.exit(1)
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    })
  }

  const db = getFirestore()

  console.log(`Project: ${projectId}`)
  console.log(`Mode: ${confirm ? 'CONFIRM — writing to Firestore' : 'DRY RUN — pass --confirm to apply'}`)
  console.log('Keeping: admins/*, config/*')
  console.log('Auth: accounts are NOT deleted — users start fresh on next sign-in')
  console.log(`Pilot UIDs (Firestore data wiped with collections): ${PILOT_UIDS.join(', ')}`)

  const totals: Record<string, number> = {}

  for (const name of COLLECTIONS_TO_WIPE) {
    if (name === 'platformStats') continue
    totals[name] = await wipeCollection(db, name, confirm)
  }

  totals['profiles/*/private'] = await wipePrivateSubcollections(db, confirm)
  await resetPlatformStats(db, confirm)
  totals.platformStats = 1

  console.log('\nSummary:')
  let grandTotal = 0
  for (const name of COLLECTIONS_TO_WIPE) {
    console.log(`  ${name}: ${totals[name] ?? 0} document(s)`)
    grandTotal += totals[name] ?? 0
  }
  console.log(`  profiles/*/private: ${totals['profiles/*/private'] ?? 0} document(s)`)
  grandTotal += totals['profiles/*/private'] ?? 0
  console.log(`  total: ${grandTotal} document(s)`)

  console.log('\nAuth accounts preserved:')
  for (const uid of PILOT_UIDS) {
    logAction('keep auth', `auth/users/${uid}`, 'sign-in will recreate profile')
  }

  if (!confirm) {
    console.log('\nDry run complete. Re-run with --confirm to apply.')
  } else {
    console.log('\nDone — Firestore test data wiped. Auth accounts unchanged.')
    console.log('Tip: testers can clear local progress in DevTools → Local Storage → enlight-progress-v2')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
