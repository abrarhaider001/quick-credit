import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'

export type UserPhoneLookupResult =
  | { status: 'no_config' }
  | { status: 'found'; userId: string }
  | { status: 'not_found' }
  | { status: 'error'; message: string }

/** Resolve `users/{userId}` by `phone` (E.164 e.g. +917010838732). */
export async function lookupUserDocumentIdByPhone(e164: string): Promise<UserPhoneLookupResult> {
  const db = getFirebaseDb()
  if (!db) {
    return { status: 'no_config' }
  }

  try {
    const q = query(collection(db, 'users'), where('phone', '==', e164), limit(1))
    const snap = await getDocs(q)
    if (!snap.empty) {
      return { status: 'found', userId: snap.docs[0].id }
    }
    return { status: 'not_found' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lookup failed.'
    return { status: 'error', message }
  }
}
