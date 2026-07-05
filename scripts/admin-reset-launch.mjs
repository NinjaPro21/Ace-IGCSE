/**
 * One-time admin reset before public launch.
 * Uses Firebase Admin SDK — not exposed in the app UI.
 *
 * Setup:
 *   Firebase Console → Project settings → Service accounts → Generate new private key
 *   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccount.json"
 *
 * Dry run (default — logs what WOULD change):
 *   node scripts/admin-reset-launch.mjs --userId YOUR_UID
 *   node scripts/admin-reset-launch.mjs --userId YOUR_UID --groups clanId1,schoolId2
 *
 * Actually apply changes:
 *   node scripts/admin-reset-launch.mjs --userId YOUR_UID --groups clanId1 --confirm
 *
 * Optional:
 *   --project=project-enlight-notes
 *
 * Notes:
 *   - Client analytics are stored in `events` (field `uid`). The script also checks
 *     `analyticsEvents` (field `userId`) if that collection exists.
 *   - `platformStats/summary` is reset to zero counters (not deleted).
 *   - `--groups` deletes documents from `schools/{id}` (schools and clans share this collection).
 */
import { readFileSync, existsSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

function usage(exitCode = 1) {
  console.error(`
Usage:
  node scripts/admin-reset-launch.mjs --userId <uid> [--groups id1,id2] [--confirm] [--project <id>]

  --userId   Required. Clears this user's profile, leaderboard row, buddy streaks,
             study rooms they created, and matching analytics events.
  --groups   Optional comma-separated school/clan document IDs to delete entirely.
  --confirm  Apply deletions. Without this flag, only a dry run is performed.
  --project  Firebase project id (defaults to service account project_id).
`)
  process.exit(exitCode)
}

function flagValue(args, name) {
  const eq = args.find((a) => a.startsWith(`${name}=`))
  if (eq) return eq.slice(name.length + 1)
  const idx = args.indexOf(name)
  if (idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith('--')) return args[idx + 1]
  return undefined
}

const args = process.argv.slice(2)
if (args.includes('--help') || args.includes('-h')) usage(0)

const confirm = args.includes('--confirm')
const userId = flagValue(args, '--userId')
const projectFlag = flagValue(args, '--project')
const groupsRaw = flagValue(args, '--groups')
const groupIds = groupsRaw
  ? groupsRaw.split(',').map((s) => s.trim()).filter(Boolean)
  : []

if (!userId) {
  console.error('Error: --userId is required.\n')
  usage()
}

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!credPath || !existsSync(credPath)) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service account JSON path.')
  console.error('Example: $env:GOOGLE_APPLICATION_CREDENTIALS="C:\\keys\\enlight-admin.json"')
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(credPath, 'utf8'))
const projectId = projectFlag ?? serviceAccount.project_id

let admin
try {
  admin = require('firebase-admin')
} catch {
  console.error('Install firebase-admin: npm install --save-dev firebase-admin')
  process.exit(1)
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId,
  })
}

const db = admin.firestore()
const FieldValue = admin.firestore.FieldValue

const PLATFORM_STATS_RESET = {
  totalSignUps: 0,
  totalStudySeconds: 0,
  totalQuizAttempts: 0,
  updatedAt: FieldValue.serverTimestamp(),
}

function logAction(kind, path, detail = '') {
  const suffix = detail ? ` — ${detail}` : ''
  console.log(`  [${kind}] ${path}${suffix}`)
}

async function deleteDocIfExists(ref, label) {
  const snap = await ref.get()
  if (!snap.exists) {
    logAction('skip', ref.path, 'not found')
    return 0
  }
  logAction(confirm ? 'delete' : 'would delete', ref.path)
  if (confirm) await ref.delete()
  return 1
}

async function deleteQueryMatches(buildQuery, label, fieldHint) {
  let total = 0
  let lastDoc = null
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let q = buildQuery().limit(400)
    if (lastDoc) q = q.startAfter(lastDoc)
    const snap = await q.get()
    if (snap.empty) break
    for (const docSnap of snap.docs) {
      total += 1
      const detail = fieldHint ? `${fieldHint}=${JSON.stringify(docSnap.get(fieldHint))}` : ''
      logAction(confirm ? 'delete' : 'would delete', docSnap.ref.path, detail)
    }
    if (confirm) {
      const batch = db.batch()
      snap.docs.forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }
    lastDoc = snap.docs[snap.docs.length - 1]
    if (snap.size < 400) break
  }
  if (total === 0) logAction('skip', label, 'no matching documents')
  return total
}

async function resetPlatformStats() {
  const ref = db.doc('platformStats/summary')
  const snap = await ref.get()
  if (!snap.exists) {
    logAction(confirm ? 'create' : 'would create', ref.path, 'zero counters')
  } else {
    const data = snap.data()
    logAction(
      confirm ? 'reset' : 'would reset',
      ref.path,
      `was signUps=${data.totalSignUps ?? 0}, studySec=${data.totalStudySeconds ?? 0}, quizzes=${data.totalQuizAttempts ?? 0}`,
    )
  }
  if (confirm) await ref.set(PLATFORM_STATS_RESET, { merge: false })
  return 1
}

async function deleteBuddyStreaks(uid) {
  const seen = new Set()
  let total = 0

  for (const field of ['uidA', 'uidB']) {
    const snap = await db.collection('buddyStreaks').where(field, '==', uid).get()
    for (const docSnap of snap.docs) {
      if (seen.has(docSnap.id)) continue
      seen.add(docSnap.id)
      total += 1
      logAction(
        confirm ? 'delete' : 'would delete',
        docSnap.ref.path,
        `${field}=${uid}`,
      )
      if (confirm) await docSnap.ref.delete()
    }
  }

  if (total === 0) logAction('skip', 'buddyStreaks', `no pairs for uid ${uid}`)
  return total
}

async function deleteAnalyticsForUser(uid) {
  let total = 0

  total += await deleteQueryMatches(
    () => db.collection('analyticsEvents').where('userId', '==', uid),
    'analyticsEvents',
    'userId',
  )

  total += await deleteQueryMatches(
    () => db.collection('events').where('uid', '==', uid),
    'events',
    'uid',
  )

  return total
}

async function deleteGroups(ids) {
  let total = 0
  for (const id of ids) {
    const ref = db.collection('schools').doc(id)
    const snap = await ref.get()
    if (!snap.exists) {
      logAction('skip', ref.path, 'not found')
      continue
    }
    const data = snap.data()
    logAction(
      confirm ? 'delete' : 'would delete',
      ref.path,
      `name=${JSON.stringify(data.name ?? '')}, type=${JSON.stringify(data.type ?? '')}`,
    )
    if (confirm) await ref.delete()
    total += 1
  }
  if (ids.length === 0) logAction('skip', 'schools/*', 'no --groups specified')
  return total
}

console.log(`Project: ${projectId}`)
console.log(`Mode: ${confirm ? 'CONFIRM — writing to Firestore' : 'DRY RUN — pass --confirm to apply'}`)
console.log(`User: ${userId}`)
if (groupIds.length) console.log(`Groups to wipe: ${groupIds.join(', ')}`)
console.log('')

const summary = {
  profile: 0,
  leaderboard: 0,
  buddyStreaks: 0,
  studyRooms: 0,
  analyticsEvents: 0,
  platformStats: 0,
  groups: 0,
}

console.log('1. profiles/{userId}')
summary.profile = await deleteDocIfExists(db.collection('profiles').doc(userId))

console.log('2. leaderboard/{userId}')
summary.leaderboard = await deleteDocIfExists(db.collection('leaderboard').doc(userId))

console.log('3. buddyStreaks (uidA or uidB matches)')
summary.buddyStreaks = await deleteBuddyStreaks(userId)

console.log('4. studyRooms (createdBy matches)')
summary.studyRooms = await deleteQueryMatches(
  () => db.collection('studyRooms').where('createdBy', '==', userId),
  'studyRooms',
  'createdBy',
)

console.log('5. analyticsEvents + events (userId / uid matches)')
summary.analyticsEvents = await deleteAnalyticsForUser(userId)

console.log('6. platformStats/summary')
summary.platformStats = await resetPlatformStats()

console.log('7. schools/{groupId} (--groups)')
summary.groups = await deleteGroups(groupIds)

console.log('')
console.log('Summary:')
console.log(`  profile:          ${summary.profile} doc(s)`)
console.log(`  leaderboard:      ${summary.leaderboard} doc(s)`)
console.log(`  buddyStreaks:     ${summary.buddyStreaks} doc(s)`)
console.log(`  studyRooms:       ${summary.studyRooms} doc(s)`)
console.log(`  analytics/events: ${summary.analyticsEvents} doc(s)`)
console.log(`  platformStats:    ${summary.platformStats} doc(s) reset`)
console.log(`  groups:           ${summary.groups} doc(s)`)

if (!confirm) {
  console.log('\nDry run complete. Re-run with --confirm to apply.')
} else {
  console.log('\nDone — changes written to Firestore.')
}
