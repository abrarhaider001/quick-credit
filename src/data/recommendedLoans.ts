export type RecommendedLoan = {
  id: string
  name: string
  /** Bottom-right amount (e.g. ₹7,500) */
  displayFigure: string
  /** Full line for orders / apply payload */
  amount: string
  image: string
  imageAlt: string
}

export const RECOMMENDED_LOANS: RecommendedLoan[] = [
  {
    id: 'rl-1',
    name: 'GrandLoan',
    displayFigure: '₹7,500',
    amount: 'Up to ₹5,00,000',
    image:
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    imageAlt: 'Coins and finance',
  },
  {
    id: 'rl-2',
    name: 'FlexMoney',
    displayFigure: '₹12,000',
    amount: 'Up to ₹2,00,000',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
    imageAlt: 'Calculator and documents',
  },
  {
    id: 'rl-3',
    name: 'MoneySweet',
    displayFigure: '₹15,000',
    amount: 'Up to ₹10,00,000',
    image:
      'https://images.unsplash.com/photo-1554224154-26032cec0a0c?w=400&q=80',
    imageAlt: 'Credit card and phone',
  },
]
