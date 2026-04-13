import loan1Img from '@/assets/Loan1.jpeg'
import loan2Img from '@/assets/Loan2.jpeg'
import loan3Img from '@/assets/Loan3.jpeg'

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
    name: 'True Cash',
    displayFigure: '₹7,500',
    amount: 'Up to ₹7,500',
    image: loan1Img,
    imageAlt: 'True Cash',
  },
  {
    id: 'rl-2',
    name: 'Cash Bee',
    displayFigure: '₹9,500',
    amount: 'Up to ₹9,500',
    image: loan2Img,
    imageAlt: 'Cash Bee',
  },
  {
    id: 'rl-3',
    name: 'Tata Credit',
    displayFigure: '₹14,500',
    amount: 'Up to ₹14,500',
    image: loan3Img,
    imageAlt: 'Tata Credit',
  },
]
