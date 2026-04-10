import { useCallback, useEffect, useState } from 'react'
import { useAuthCacheListener } from '@/hooks/useAuthCacheListener'
import { useFirestoreOrders } from '@/hooks/useFirestoreOrders'
import { getOrders, notifyOrdersChanged, setFirestoreOrdersSnapshot, type LoanOrder } from '@/lib/ordersStore'

export function useOrders() {
  const auth = useAuthCacheListener()
  const fs = useFirestoreOrders(auth.userId)
  const [, setLocalTick] = useState(0)

  useEffect(() => {
    if (auth.userId) {
      setFirestoreOrdersSnapshot(fs.orders)
    } else {
      setFirestoreOrdersSnapshot(null)
    }
    notifyOrdersChanged()
  }, [auth.userId, fs.orders])

  useEffect(() => {
    const onSync = () => setLocalTick((t) => t + 1)
    window.addEventListener('qc-orders-changed', onSync)
    window.addEventListener('storage', onSync)
    return () => {
      window.removeEventListener('qc-orders-changed', onSync)
      window.removeEventListener('storage', onSync)
    }
  }, [])

  const refresh = useCallback(() => {
    notifyOrdersChanged()
  }, [])

  const orders: LoanOrder[] = auth.userId ? fs.orders : getOrders()

  return { orders, refresh, loading: Boolean(auth.userId) && fs.loading }
}
