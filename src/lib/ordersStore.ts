export type LoanOrder = {
  id: string
  loanName: string
  amountLabel: string
  status: 'pending' | 'cleared'
  createdAt: number
}

const ORDERS_KEY = 'quickcredit.orders.v1'

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
  const next: LoanOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    loanName: input.loanName,
    amountLabel: input.amountLabel,
    status: 'pending',
    createdAt: Date.now(),
  }
  writeRaw([...getOrders(), next])
  notifyOrdersChanged()
  return 'added'
}
