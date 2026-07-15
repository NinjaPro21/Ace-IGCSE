import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Admin = a Firestore `admins/{uid}` doc exists (create it in the Firebase
 * Console for your account). Admin emails are intentionally never shipped in
 * the client bundle — server-side rules read them from `config/site` instead.
 */
export async function checkIsAdmin(uid: string): Promise<boolean> {
  if (!db) return false
  try {
    const snap = await getDoc(doc(db, 'admins', uid))
    return snap.exists()
  } catch {
    return false
  }
}
