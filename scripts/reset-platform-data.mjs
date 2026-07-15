/**
 * Wipe Firestore test data (profiles, schools/clans, platformStats).
 * Keeps admins/ and config/ collections.
 *
 * Setup:
 *   1. Firebase Console → Project settings → Service accounts → Generate new private key
 *   2. Save JSON somewhere safe (never commit)
 *   3. Run:
 *      set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\serviceAccount.json
 *      npm run firebase:reset
 *
 * Or pass project id:
 *      node scripts/reset-platform-data.mjs --project your-project-id
 */
import { readFileSync, existsSync } from 'fs'
import { createRequire } from 'module'
import { PLATFORM_STATS_RESET_BASE } from './platformStatsReset.mjs'

const require = createRequire(import.meta.url)

const args = process.argv.slice(2)
const projectFlag = args.find((a) => a.startsWith('--project='))?.split('=')[1]
  ?? (args.includes('--project') ? args[args.indexOf('--project') + 1] : undefined)

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!credPath || !existsSync(credPath)) {
  console.error(
    'Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service account JSON path.',
  )
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

async function deleteQuery(query, label) {
  let total = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snap = await query.limit(400).get()
    if (snap.empty) break
    const batch = db.batch()
    snap.docs.forEach((d) => batch.delete(d.ref))
    await batch.commit()
    total += snap.size
    process.stdout.write(`\r  ${label}: deleted ${total}`)
  }
  if (total > 0) console.log('')
  return total
}

async function resetCollection(name) {
  return deleteQuery(db.collection(name), name)
}

async function resetDoc(path, emptyData) {
  await db.doc(path).set(emptyData, { merge: false })
  console.log(`  Reset ${path}`)
}

console.log(`Resetting Firestore data for project: ${projectId}`)
console.log('Keeping: admins/*, config/*\n')

const profiles = await resetCollection('profiles')
const schools = await resetCollection('schools')
await resetDoc('platformStats/summary', {
  ...PLATFORM_STATS_RESET_BASE,
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
})
await deleteQuery(db.collection('platformStats/summary/daily'), 'platformStats/summary/daily')
await deleteQuery(db.collection('platformStats/summary/weekly'), 'platformStats/summary/weekly')

console.log('\nDone.')
console.log(`  profiles deleted: ${profiles}`)
console.log(`  schools deleted: ${schools}`)
console.log('  platformStats/summary zeroed (+ daily/weekly cleared)')
console.log('\nUsers keep local progress in browser until they sign in again (will recreate profile).')
console.log('Clear local test data: DevTools → Application → Local Storage → enlight-progress-v2')
