import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

function envAdminEmails(): string[] {
  return (import.meta.env.VITE_ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string): boolean {
  const admins = envAdminEmails()
  return admins.length > 0 && admins.includes(email.toLowerCase())
}

/** Client + Firestore `admins/{uid}` doc (create in Firebase Console for your account). */
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
