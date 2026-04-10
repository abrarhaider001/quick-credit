import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'

export const LOGIN_INVALID_PHONE_MESSAGE = 'Please enter a valid phone number'

export type LoginPhoneValidation =
  | { ok: true; userId: string; fullName: string; minLimit: number; maxLimit: number }
  | { ok: false }

/**
 * Blocked if `blocked_users/{e164}` exists OR any doc has `phone == e164`.
 * Allowed user: `users` row with `phone == e164`, role user, not isBlocked.
 */
export async function validateLoginPhone(e164: string): Promise<LoginPhoneValidation> {
  const db = getFirebaseDb()
  if (!db) {
    return { ok: false }
  }

  try {
    const byId = await getDoc(doc(db, 'blocked_users', e164))
    if (byId.exists()) {
      return { ok: false }
    }

    const blockedQ = query(
      collection(db, 'blocked_users'),
      where('phone', '==', e164),
      limit(1),
    )
    const blockedSnap = await getDocs(blockedQ)
    if (!blockedSnap.empty) {
      return { ok: false }
    }

    const userQ = query(collection(db, 'users'), where('phone', '==', e164), limit(1))
    const userSnap = await getDocs(userQ)
    if (userSnap.empty) {
      return { ok: false }
    }

    const d = userSnap.docs[0]
    const data = d.data() as Record<string, unknown>
    if (data.role !== 'user' || data.isBlocked === true) {
      return { ok: false }
    }

    const ls = data.loanSettings as Record<string, unknown> | undefined
    const minLimit = typeof ls?.minLimit === 'number' ? ls.minLimit : 0
    const maxLimit = typeof ls?.maxLimit === 'number' ? ls.maxLimit : 0
    const fullName = typeof data.name === 'string' ? data.name : ''

    return {
      ok: true,
      userId: d.id,
      fullName,
      minLimit,
      maxLimit,
    }
  } catch {
    return { ok: false }
  }
}
