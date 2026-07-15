import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

function envAdminEmails(): string[] {
  return (import.meta.env.VITE_ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

/** Build-time allowlist (optional). Prefer a Firestore `admins/{uid}` doc for production. */
export function isAdminEmail(email: string): boolean {
  const admins = envAdminEmails()
  return admins.length > 0 && admins.includes(email.toLowerCase())
}

/**
 * Admin if either:
 * - email is in `VITE_ADMIN_EMAILS` (client build env), or
 * - a Firestore `admins/{uid}` doc exists (create in Firebase Console).
 *
 * Firestore rules also treat `config/site.adminEmails` as admin, but that doc
 * is not client-readable — so listing only there does not show the Analytics tab.
 */
export async function checkIsAdmin(uid: string, email?: string): Promise<boolean> {
  if (email && isAdminEmail(email)) return true
  if (!db) return false
  try {
    const snap = await getDoc(doc(db, 'admins', uid))
    return snap.exists()
  } catch {
    return false
  }
}
