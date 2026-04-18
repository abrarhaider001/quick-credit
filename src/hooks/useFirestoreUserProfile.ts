import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
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

function parseAdminBankInfo(data: Record<string, unknown>): FirestoreBankInfo {
  return {
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
  }
}

function parsePerUserBankInfo(data: Record<string, unknown>): FirestoreBankInfo {
  return {
    label:
      typeof data.bankAccountLabel === 'string' && data.bankAccountLabel.trim()
        ? data.bankAccountLabel
        : defaultBankInfo.label,
    accountNumber:
      typeof data.bankAccountNumber === 'string' ? data.bankAccountNumber : defaultBankInfo.accountNumber,
    bankName:
      typeof data.bankName === 'string' && data.bankName.trim()
        ? data.bankName
        : defaultBankInfo.bankName,
  }
}

/**
 * Subscribes to `users/{userId}` for flags like `showBankAccount` and bank routing:
 * when `useGlobalBankDetails` is false (admin-assigned per-user account), shows that
 * user's `bankAccount*` fields; otherwise shows `admin_settings/config` (see schema).
 */
export function useFirestoreUserProfile(userId: string | undefined) {
  const [flags, setFlags] = useState<FirestoreUserProfileFlags>(defaultFlags)
  const [bankInfo, setBankInfo] = useState<FirestoreBankInfo>(defaultBankInfo)
  const [loading, setLoading] = useState(Boolean(userId))

  const globalBankRef = useRef<FirestoreBankInfo>(defaultBankInfo)
  /** `null` = use global; object = admin assigned custom bank for this user */
  const customBankRef = useRef<FirestoreBankInfo | null>(null)

  const recomputeBankInfo = () => {
    const custom = customBankRef.current
    setBankInfo(custom ?? globalBankRef.current)
  }

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => {
        setFlags(defaultFlags)
        customBankRef.current = null
        globalBankRef.current = defaultBankInfo
        setBankInfo(defaultBankInfo)
        setLoading(false)
      })
      return
    }

    const db = getFirebaseDb()
    if (!db) {
      queueMicrotask(() => {
        setFlags(defaultFlags)
        customBankRef.current = null
        globalBankRef.current = defaultBankInfo
        setBankInfo(defaultBankInfo)
        setLoading(false)
      })
      return
    }

    setLoading(true)
    globalBankRef.current = defaultBankInfo
    customBankRef.current = null

    const unsubUser = onSnapshot(
      doc(db, 'users', userId),
      (snap) => {
        if (!snap.exists()) {
          setFlags(defaultFlags)
          customBankRef.current = null
          recomputeBankInfo()
          setLoading(false)
          return
        }
        const data = snap.data() as Record<string, unknown>
        const show =
          typeof data.showBankAccount === 'boolean' ? data.showBankAccount : true
        setFlags({ showBankAccount: show })

        const useGlobal =
          typeof data.useGlobalBankDetails === 'boolean' ? data.useGlobalBankDetails : true
        if (useGlobal) {
          customBankRef.current = null
        } else {
          customBankRef.current = parsePerUserBankInfo(data)
        }
        recomputeBankInfo()
        setLoading(false)
      },
      () => {
        setFlags(defaultFlags)
        customBankRef.current = null
        recomputeBankInfo()
        setLoading(false)
      },
    )

    const unsubAdminSettings = onSnapshot(
      doc(db, 'admin_settings', 'config'),
      (snap) => {
        if (!snap.exists()) {
          globalBankRef.current = defaultBankInfo
        } else {
          globalBankRef.current = parseAdminBankInfo(snap.data() as Record<string, unknown>)
        }
        recomputeBankInfo()
      },
      () => {
        globalBankRef.current = defaultBankInfo
        recomputeBankInfo()
      },
    )

    return () => {
      unsubUser()
      unsubAdminSettings()
    }
  }, [userId])

  return { flags, bankInfo, loading }
}
