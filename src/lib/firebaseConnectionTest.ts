import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { getFirebaseApp } from '@/lib/firebase'

export type FirebaseConnectionResult = {
  ok: boolean
  message: string
  details?: string
}

const CONSOLE_TAG = '[QuickCredit Firebase]'

export function logFirebaseConnectionResult(result: FirebaseConnectionResult): void {
  if (result.ok) {
    console.info(`${CONSOLE_TAG} ✓ ${result.message}`, result.details ?? '')
  } else {
    console.error(`${CONSOLE_TAG} ✗ ${result.message}`, result.details ?? '')
  }
}

/**
 * Verifies env-based config loads and the client can reach Cloud Firestore.
 * A missing doc is OK; `permission-denied` still means the project endpoint responded.
 */
export async function testFirebaseConnection(): Promise<FirebaseConnectionResult> {
  const app = getFirebaseApp()
  if (!app) {
    return {
      ok: false,
      message: 'Firebase is not configured.',
      details: 'Set all VITE_FIREBASE_* variables in .env and restart the dev server.',
    }
  }

  const db = getFirestore(app)

  try {
    await getDoc(doc(db, '_quickcredit_health', 'ping'))
    return {
      ok: true,
      message: 'Connected to Firestore.',
      details: 'SDK reached your project (document may not exist).',
    }
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string }
    const code = err.code ?? 'unknown'

    if (code === 'permission-denied') {
      return {
        ok: true,
        message: 'Connected to Firebase.',
        details:
          'Firestore responded but security rules blocked the health read. That still confirms your config and network.',
      }
    }

    if (code === 'unavailable' || code === 'deadline-exceeded') {
      return {
        ok: false,
        message: 'Could not reach Firestore.',
        details: err.message ?? 'Check network, VPN, or Firebase status.',
      }
    }

    return {
      ok: false,
      message: `Firestore check failed (${code}).`,
      details: err.message,
    }
  }
}

declare global {
  interface Window {
    /** Dev only: `await testQuickCreditFirebase()` */
    testQuickCreditFirebase?: typeof testFirebaseConnection
  }
}
