import { enrichOrder } from '@/lib/orderDisplay'
import type { EnrichedLoanOrder } from '@/lib/orderDisplay'
import { getOrders } from '@/lib/ordersStore'
import type { LoanOrder } from '@/lib/ordersStore'

/** Serializable loan snapshot passed from Pay now → Payment */
export type PaymentLoanSnapshot = {
  id: string
  loanName: string
  totalToPay: string
  referenceId: string
  loanAmountDisplay?: string
  imageUrl?: string
  dueDateMs?: number
  createdAt?: number
}

export type PaymentLocationState = {
  orderId?: string
  demo?: boolean
  loan?: PaymentLoanSnapshot
}

export function isPaymentLocationState(x: unknown): x is PaymentLocationState {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Partial<PaymentLocationState>
  if (o.loan && typeof o.loan.id === 'string') return true
  if (typeof o.orderId === 'string') return true
  return false
}

function snapshotToOrder(s: PaymentLoanSnapshot): LoanOrder {
  return {
    id: s.id,
    loanName: s.loanName,
    amountLabel: s.totalToPay,
    status: 'pending',
    createdAt: s.createdAt ?? Date.now(),
    imageUrl: s.imageUrl,
    referenceId: s.referenceId,
    totalToPay: s.totalToPay,
    dueDateMs: s.dueDateMs,
    loanAmountDisplay: s.loanAmountDisplay,
  }
}

/** Resolves pending loan for the payment screen from navigation state or storage. */
export function resolvePaymentLoan(state: unknown): EnrichedLoanOrder | null {
  if (!isPaymentLocationState(state)) return null
  if (state.loan) return enrichOrder(snapshotToOrder(state.loan))
  if (typeof state.orderId === 'string') {
    const raw = getOrders().find((o) => o.id === state.orderId)
    if (!raw || raw.status !== 'pending') return null
    return enrichOrder(raw)
  }
  return null
}
