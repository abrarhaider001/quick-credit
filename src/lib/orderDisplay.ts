import type { LoanOrder } from '@/lib/ordersStore'

const FALLBACK_IMG = '/assets/images/user.png'

function defaultLoanImageForName(loanName: string): string {
  const normalized = loanName.trim().toLowerCase()
  if (normalized.includes('true cash')) return '/assets/images/loan-1.jpeg'
  if (normalized.includes('cash bee')) return '/assets/images/loan-2.jpeg'
  if (normalized.includes('tata credit')) return '/assets/images/loan-3.jpeg'
  return FALLBACK_IMG
}

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
  const fromFirestore =
    typeof o.loanImageDataUrl === 'string' &&
    o.loanImageDataUrl.startsWith('data:image/') &&
    o.loanImageDataUrl.includes(';base64,')
      ? o.loanImageDataUrl
      : undefined
  const imageUrl = fromFirestore ?? o.imageUrl ?? defaultLoanImageForName(o.loanName)
  return {
    ...o,
    imageUrl,
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
