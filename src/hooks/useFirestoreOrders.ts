import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { getFirebaseDb } from '@/lib/firebase'
import { firestoreOrderToLoanOrder } from '@/lib/firestoreOrdersMap'
import type { LoanOrder } from '@/lib/ordersStore'

export function useFirestoreOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<LoanOrder[]>([])
  const [loading, setLoading] = useState(Boolean(userId))

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => {
        setOrders([])
        setLoading(false)
      })
      return
    }

    const db = getFirebaseDb()
    if (!db) {
      queueMicrotask(() => {
        setOrders([])
        setLoading(false)
      })
      return
    }

    setLoading(true)
    const q = query(collection(db, 'orders'), where('userId', '==', userId))
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: LoanOrder[] = []
        snap.forEach((d) => {
          const o = firestoreOrderToLoanOrder(d.id, d.data() as Record<string, unknown>)
          if (o) list.push(o)
        })
        list.sort((a, b) => b.createdAt - a.createdAt)
        setOrders(list)
        setLoading(false)
      },
      () => {
        setOrders([])
        setLoading(false)
      },
    )
    return () => unsub()
  }, [userId])

  return { orders, loading }
}
