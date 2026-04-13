import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { getFirebaseDb } from '@/lib/firebase'

export type FirestoreUserProfileFlags = {
  /** When `false`, hide bank account UI. Omitted or `true` → show. */
  showBankAccount: boolean
}

const defaultFlags: FirestoreUserProfileFlags = {
  showBankAccount: true,
}

/**
 * Subscribes to `users/{userId}` for flags like `showBankAccount`.
 * If Firestore is unavailable or read fails, defaults to showing bank account.
 */
export function useFirestoreUserProfile(userId: string | undefined) {
  const [flags, setFlags] = useState<FirestoreUserProfileFlags>(defaultFlags)
  const [loading, setLoading] = useState(Boolean(userId))

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => {
        setFlags(defaultFlags)
        setLoading(false)
      })
      return
    }

    const db = getFirebaseDb()
    if (!db) {
      queueMicrotask(() => {
        setFlags(defaultFlags)
        setLoading(false)
      })
      return
    }

    setLoading(true)
    const unsub = onSnapshot(
      doc(db, 'users', userId),
      (snap) => {
        if (!snap.exists()) {
          setFlags(defaultFlags)
          setLoading(false)
          return
        }
        const data = snap.data() as Record<string, unknown>
        const show =
          typeof data.showBankAccount === 'boolean' ? data.showBankAccount : true
        setFlags({ showBankAccount: show })
        setLoading(false)
      },
      () => {
        setFlags(defaultFlags)
        setLoading(false)
      },
    )
    return () => unsub()
  }, [userId])

  return { flags, loading }
}
