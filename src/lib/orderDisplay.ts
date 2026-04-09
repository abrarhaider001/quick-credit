import type { LoanOrder } from '@/lib/ordersStore'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80'

export type EnrichedLoanOrder = LoanOrder & {
  imageUrl: string
  referenceId: string
  totalToPay: string
  dueDateMs: number
  loanAmountDisplay: string
}

export function enrichOrder(o: LoanOrder): EnrichedLoanOrder {
  const due =
    o.dueDateMs ??
    o.createdAt + 14 * 24 * 60 * 60 * 1000
  return {
    ...o,
    imageUrl: o.imageUrl ?? FALLBACK_IMG,
    referenceId: o.referenceId ?? `Ref: #${o.id.replace(/\W/g, '').slice(-8).toUpperCase()}`,
    totalToPay: o.totalToPay ?? o.amountLabel,
    dueDateMs: due,
    loanAmountDisplay: o.loanAmountDisplay ?? o.amountLabel,
  }
}

export function formatDueDate(ms: number) {
  return new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function dayOrdinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`
  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

/** e.g. "28th Oct 2023" for payment summaries */
export function formatDueDateWithOrdinal(ms: number) {
  const d = new Date(ms)
  const monYear = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
  return `${dayOrdinal(d.getDate())} ${monYear}`
}

export function formatLoanDate(ms: number) {
  return new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Desktop tile — e.g. "Dec 12, 2023" */
export function formatDueDateDesktop(ms: number) {
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Desktop tile — e.g. "Nov 12, 2023" */
export function formatLoanDateDesktop(ms: number) {
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** "Reference: #LN-88219" style label */
export function referenceDesktopLabel(ref: string): string {
  const t = ref.trim()
  if (/^reference\s*:/i.test(t)) return t
  const m = t.match(/#([\w-]+)/i)
  const id = m ? m[1] : t.replace(/^Ref:?\s*/i, '').replace(/^#\s*/, '')
  return `Reference: #${id}`
}
