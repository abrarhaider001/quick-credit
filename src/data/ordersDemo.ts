import type { LoanOrder } from '@/lib/ordersStore'

/** Shown when the user has no orders in storage — sample tiles */
export const DEMO_PENDING: LoanOrder[] = [
  {
    id: 'demo-p-1',
    loanName: 'Quick Cash Loan',
    amountLabel: 'Up to ₹5,00,000',
    status: 'pending',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    imageUrl:
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    referenceId: 'Ref: #QX-8829',
    totalToPay: '₹12,500',
    dueDateMs: Date.now() + 12 * 24 * 60 * 60 * 1000,
    loanAmountDisplay: '₹10,000',
  },
  {
    id: 'demo-p-2',
    loanName: 'Small Business Fund',
    amountLabel: 'Up to ₹2,00,000',
    status: 'pending',
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
    referenceId: 'Ref: #QX-9012',
    totalToPay: '₹8,200',
    dueDateMs: Date.now() + 28 * 24 * 60 * 60 * 1000,
    loanAmountDisplay: '₹7,500',
  },
  {
    id: 'demo-p-3',
    loanName: 'Health Plus Credit',
    amountLabel: 'Up to ₹10,00,000',
    status: 'pending',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    imageUrl:
      'https://images.unsplash.com/photo-1554224154-26032cec0a0c?w=400&q=80',
    referenceId: 'Ref: #QX-9144',
    totalToPay: '₹5,400',
    dueDateMs: Date.now() + 2 * 24 * 60 * 60 * 1000,
    loanAmountDisplay: '₹5,000',
  },
]

export const DEMO_COMPLETED: LoanOrder[] = [
  {
    id: 'demo-c-1',
    loanName: 'FlexMoney',
    amountLabel: 'Up to ₹2,00,000',
    status: 'cleared',
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
    referenceId: 'Ref: #QX-7701',
    totalToPay: '₹12,000',
    dueDateMs: Date.now() - 60 * 24 * 60 * 60 * 1000,
    loanAmountDisplay: '₹12,000',
    clearedAt: Date.now() - 58 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'demo-c-2',
    loanName: 'GrandLoan',
    amountLabel: 'Up to ₹5,00,000',
    status: 'cleared',
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    imageUrl:
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    referenceId: 'Ref: #QX-6601',
    totalToPay: '₹7,500',
    dueDateMs: Date.now() - 100 * 24 * 60 * 60 * 1000,
    loanAmountDisplay: '₹7,500',
    clearedAt: Date.now() - 99 * 24 * 60 * 60 * 1000,
  },
]
