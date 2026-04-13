import type { Timestamp } from 'firebase/firestore'
import type { LoanOrder } from '@/lib/ordersStore'

function tsToMs(v: unknown): number {
  if (v && typeof v === 'object' && 'toMillis' in v && typeof (v as Timestamp).toMillis === 'function') {
    return (v as Timestamp).toMillis()
  }
  return Date.now()
}

function formatInr(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`
}

function parseLoanImageDataUrl(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.length < 22) return undefined
  const t = raw.trim()
  if (!t.startsWith('data:image/') || !t.includes(';base64,')) return undefined
  return t
}

/** Map Firestore `orders` document to app `LoanOrder`. */
export function firestoreOrderToLoanOrder(docId: string, data: Record<string, unknown>): LoanOrder | null {
  if (typeof data.userId !== 'string' || typeof data.userName !== 'string') return null
  if (typeof data.loanAmount !== 'number' || typeof data.totalDueAmount !== 'number') return null
  if (typeof data.isCompleted !== 'boolean') return null

  const createdAt = tsToMs(data.createdAt)
  const dueDateMs = tsToMs(data.dueDate)

  const loanImageDataUrl = parseLoanImageDataUrl(data.loanImageDataUrl)

  return {
    id: docId,
    loanName: data.userName,
    amountLabel: formatInr(data.totalDueAmount),
    status: data.isCompleted ? 'cleared' : 'pending',
    createdAt,
    referenceId: `Ref: #${docId.slice(-8).toUpperCase()}`,
    totalToPay: formatInr(data.totalDueAmount),
    dueDateMs,
    loanAmountDisplay: formatInr(data.loanAmount),
    clearedAt: data.isCompleted ? tsToMs(data.updatedAt) : undefined,
    paymentUrl: typeof data.paymentUrl === 'string' ? data.paymentUrl : undefined,
    totalDueAmountNum: data.totalDueAmount,
    ...(loanImageDataUrl ? { loanImageDataUrl } : {}),
  }
}
