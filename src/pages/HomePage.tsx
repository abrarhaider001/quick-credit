import { Link } from 'react-router-dom'
import { FiCreditCard, FiDollarSign, FiPackage, FiUser } from 'react-icons/fi'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { FlowNav } from '@/components/layout/FlowNav'
import { PageShell } from '@/components/layout/PageShell'
import { paths } from '@/routes/paths'

const hubItems = [
  {
    to: paths.loans,
    title: 'Loans',
    subtitle: 'Apply & track',
    icon: FiCreditCard,
  },
  {
    to: paths.orders,
    title: 'Orders',
    subtitle: 'History & status',
    icon: FiPackage,
  },
  {
    to: paths.payment,
    title: 'Payment',
    subtitle: 'Pay & schedule',
    icon: FiDollarSign,
  },
  {
    to: paths.profile,
    title: 'Profile',
    subtitle: 'Account & settings',
    icon: FiUser,
  },
] as const

export default function HomePage() {
  return (
    <AnimatedPage>
      <main className="qc-main">
        <PageShell
          eyebrow="Dashboard"
          title="Home"
          description="Your overview hub. Bottom navigation or app shell can be added when you specify it."
        />
        <div className="hub-grid">
          {hubItems.map(({ to, title, subtitle, icon: Icon }) => (
            <Link key={to} to={to} className="hub-link">
              <span className="hub-link__icon" aria-hidden>
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className="hub-link__text">
                <strong>{title}</strong>
                <span>{subtitle}</span>
              </span>
            </Link>
          ))}
        </div>
        <FlowNav prev={{ to: paths.otp, label: 'OTP' }} />
      </main>
    </AnimatedPage>
  )
}
