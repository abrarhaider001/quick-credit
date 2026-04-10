import { RECOMMENDED_LOANS } from '@/data/recommendedLoans'

export type LoanOrder = {
  id: string
  loanName: string
  amountLabel: string
  status: 'pending' | 'cleared'
  createdAt: number
  imageUrl?: string
  referenceId?: string
  /** Display string e.g. ₹12,500 */
  totalToPay?: string
  dueDateMs?: number
  loanAmountDisplay?: string
  clearedAt?: number
  /** From Firestore `orders.paymentUrl` */
  paymentUrl?: string
  /** Numeric due for dashboards (Firestore `totalDueAmount`) */
  totalDueAmountNum?: number
}

const ORDERS_KEY = 'quickcredit.orders.v1'

/** When `userId` is in auth cache, UI reads orders from Firestore via this snapshot. */
let firestoreOrdersSnapshot: LoanOrder[] | null = null

export function setFirestoreOrdersSnapshot(orders: LoanOrder[] | null): void {
  firestoreOrdersSnapshot = orders
}

function readRaw(): LoanOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (o): o is LoanOrder =>
        typeof o === 'object' &&
        o !== null &&
        typeof (o as LoanOrder).id === 'string' &&
        typeof (o as LoanOrder).loanName === 'string',
    )
  } catch {
    return []
  }
}

function writeRaw(orders: LoanOrder[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  } catch {
    // ignore
  }
}

export function getOrders(): LoanOrder[] {
  if (firestoreOrdersSnapshot !== null) {
    return firestoreOrdersSnapshot
  }
  return readRaw()
}

export function hasPendingOrders(): boolean {
  return getOrders().some((o) => o.status === 'pending')
}

export function notifyOrdersChanged() {
  window.dispatchEvent(new Event('qc-orders-changed'))
}

/** Returns `dues` if user must clear pending orders first; else adds order and returns `added`. */
export function tryApplyLoan(input: {
  loanName: string
  amountLabel: string
}): 'dues' | 'added' {
  if (hasPendingOrders()) return 'dues'
  const match = RECOMMENDED_LOANS.find((l) => l.name === input.loanName)
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  const next: LoanOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    loanName: input.loanName,
    amountLabel: input.amountLabel,
    status: 'pending',
    createdAt: Date.now(),
    imageUrl: match?.image,
    referenceId: `Ref: #QC-${suffix}`,
    totalToPay: match?.displayFigure ?? input.amountLabel,
    dueDateMs: Date.now() + 14 * 24 * 60 * 60 * 1000,
    loanAmountDisplay: match?.amount ?? input.amountLabel,
  }
  writeRaw([...getOrders(), next])
  notifyOrdersChanged()
  return 'added'
}

export function markOrderPaid(orderId: string): boolean {
  const orders = getOrders()
  const idx = orders.findIndex((o) => o.id === orderId && o.status === 'pending')
  if (idx < 0) return false
  const next = [...orders]
  next[idx] = {
    ...next[idx],
    status: 'cleared',
    clearedAt: Date.now(),
  }
  writeRaw(next)
  notifyOrdersChanged()
  return true
}
