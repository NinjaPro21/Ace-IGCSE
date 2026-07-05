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
import { getFirestore, type Firestore, type QueryDocumentSnapshot } from 'firebase-admin/firestore'

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
  'buddyStreaks',
  'studyRooms',
  'platformStats',
  'schools',
  'groups',
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
    totals[name] = await wipeCollection(db, name, confirm)
  }

  console.log('\nSummary:')
  let grandTotal = 0
  for (const name of COLLECTIONS_TO_WIPE) {
    console.log(`  ${name}: ${totals[name]} document(s)`)
    grandTotal += totals[name] ?? 0
  }
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
