import { useCallback, useEffect, useState } from 'react'
import { getOrders, type LoanOrder } from '@/lib/ordersStore'

export function useOrders() {
  const [orders, setOrders] = useState<LoanOrder[]>(() => getOrders())

  const refresh = useCallback(() => {
    setOrders(getOrders())
  }, [])

  useEffect(() => {
    const onSync = () => setOrders(getOrders())
    window.addEventListener('qc-orders-changed', onSync)
    window.addEventListener('storage', onSync)
    return () => {
      window.removeEventListener('qc-orders-changed', onSync)
      window.removeEventListener('storage', onSync)
    }
  }, [])

  return { orders, refresh }
}
