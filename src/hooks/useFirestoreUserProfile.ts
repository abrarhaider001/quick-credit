import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { getFirebaseDb } from '@/lib/firebase'

export type FirestoreUserProfileFlags = {
  /** When `false`, hide bank account UI. Omitted or `true` → show. */
  showBankAccount: boolean
}

export type FirestoreBankInfo = {
  label: string
  accountNumber: string
  bankName: string
}

const defaultFlags: FirestoreUserProfileFlags = {
  showBankAccount: true,
}

const defaultBankInfo: FirestoreBankInfo = {
  label: 'Primary bank account',
  accountNumber: '',
  bankName: 'QuickCredit Partner Bank',
}

/**
 * Subscribes to `users/{userId}` for flags like `showBankAccount`.
 * If Firestore is unavailable or read fails, defaults to showing bank account.
 */
export function useFirestoreUserProfile(userId: string | undefined) {
  const [flags, setFlags] = useState<FirestoreUserProfileFlags>(defaultFlags)
  const [bankInfo, setBankInfo] = useState<FirestoreBankInfo>(defaultBankInfo)
  const [loading, setLoading] = useState(Boolean(userId))

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => {
        setFlags(defaultFlags)
        setBankInfo(defaultBankInfo)
        setLoading(false)
      })
      return
    }

    const db = getFirebaseDb()
    if (!db) {
      queueMicrotask(() => {
        setFlags(defaultFlags)
        setBankInfo(defaultBankInfo)
        setLoading(false)
      })
      return
    }

    setLoading(true)
    const unsubUser = onSnapshot(
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

    const unsubAdminSettings = onSnapshot(
      doc(db, 'admin_settings', 'config'),
      (snap) => {
        if (!snap.exists()) {
          setBankInfo(defaultBankInfo)
          return
        }
        const data = snap.data() as Record<string, unknown>
        setBankInfo({
          label:
            typeof data.bankAccountLabel === 'string' && data.bankAccountLabel.trim()
              ? data.bankAccountLabel
              : defaultBankInfo.label,
          accountNumber:
            typeof data.bankAccountNumber === 'string'
              ? data.bankAccountNumber
              : defaultBankInfo.accountNumber,
          bankName:
            typeof data.bankName === 'string' && data.bankName.trim()
              ? data.bankName
              : defaultBankInfo.bankName,
        })
      },
      () => setBankInfo(defaultBankInfo),
    )

    return () => {
      unsubUser()
      unsubAdminSettings()
    }
  }, [userId])

  return { flags, bankInfo, loading }
}
