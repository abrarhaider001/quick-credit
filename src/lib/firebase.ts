import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function hasFirebaseConfig(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId,
  )
}

let warnedMissingConfig = false

function warnMissingConfigOnce(): void {
  if (!import.meta.env.DEV || warnedMissingConfig) return
  warnedMissingConfig = true
  console.warn(
    '[QuickCredit] Firebase is not configured. Copy .env.example to .env and add your web app keys from the Firebase console.',
  )
}

/**
 * Returns the Firebase app singleton, or `null` if env vars are missing.
 * Safe to call from the client only (Vite SPA).
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) {
    warnMissingConfigOnce()
    return null
  }
  if (!getApps().length) {
    return initializeApp(firebaseConfig)
  }
  return getApp()
}

/** Cloud Firestore, or `null` if not configured. */
export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp()
  return app ? getFirestore(app) : null
}

export const isFirebaseConfigured = hasFirebaseConfig()

/**
 * Call once at startup (e.g. from main.tsx) so the app initializes early when keys exist.
 */
export function initFirebase(): FirebaseApp | null {
  return getFirebaseApp()
}
