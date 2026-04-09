import { useCallback, useMemo, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { HomeCreditGaugeMobile } from '@/components/home/HomeCreditGaugeMobile'
import { HomeDashboardFooter } from '@/components/home/HomeDashboardFooter'
import { HomeLimitsRow } from '@/components/home/HomeLimitsRow'
import { HomeOfferBanner } from '@/components/home/HomeOfferBanner'
import { Snackbar } from '@/components/ui/Snackbar'
import { RECOMMENDED_LOANS } from '@/data/recommendedLoans'
import { readCachedAuth } from '@/lib/authCache'
import { tryApplyLoan } from '@/lib/ordersStore'

const CREDIT_MIN = 2000
const CREDIT_MAX = 34500
const CREDIT_USED = 34500
const PRE_APPROVED_ELIGIBLE = 50000

/** Hero art — growth / coins (Unsplash) */
const OFFER_IMAGE =
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80'

const RECOMMENDED_HEADLINE = '₹27,000'

function greetingLabel(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function displayFirstName(fullName: string): string {
  const t = fullName.trim()
  if (!t) return 'there'
  return t.split(/\s+/)[0] ?? 'there'
}

export default function HomeDashboard() {
  const userName = useMemo(() => displayFirstName(readCachedAuth().fullName), [])
  const greet = useMemo(() => greetingLabel(), [])

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info'
  }>({ open: false, message: '', variant: 'info' })

  const closeSnackbar = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }))
  }, [])

  const onApply = useCallback(
    (loan: (typeof RECOMMENDED_LOANS)[number]) => {
      const result = tryApplyLoan({
        loanName: loan.name,
        amountLabel: loan.amount,
      })
      if (result === 'dues') {
        setSnackbar({
          open: true,
          message: 'Please clear previous dues',
          variant: 'error',
        })
        return
      }
      setSnackbar({
        open: true,
        message: 'Processing...',
        variant: 'info',
      })
    },
    [],
  )

  const scrollToRecommended = useCallback(() => {
    document.getElementById('recommended-loans')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  return (
    <div className="home-tab home-dashboard">
      <header className="home-dashboard__masthead">
        {/* <p className="home-dashboard__crumb">Dashboard</p> */}
        <p className="home-dashboard__greet-line">
          {greet},{' '}
          <span className="home-dashboard__greet-name">{userName}</span>
        </p>
      </header>

      <HomeCreditGaugeMobile
        min={CREDIT_MIN}
        max={CREDIT_MAX}
        used={CREDIT_USED}
      />

      <HomeOfferBanner
        eyebrow="Personalized offer"
        title={`You are eligible for ₹${PRE_APPROVED_ELIGIBLE.toLocaleString('en-IN')}`}
        description="Your trust score and repayment history qualify you for preferred rates. Review limits below and pick a loan that fits your plan."
        imageSrc={OFFER_IMAGE}
        imageAlt="Financial growth and savings"
        ctaLabel="Apply now"
        onCtaClick={scrollToRecommended}
      />

      <HomeLimitsRow
        minAmount={CREDIT_MIN}
        maxAmount={CREDIT_MAX}
        usedAmount={CREDIT_USED}
      />

      <section
        className="home-loans"
        id="recommended-loans"
        aria-labelledby="loans-heading"
      >
        <div className="home-loans__head">
          <h2 id="loans-heading" className="home-loans__title">
            Recommended options
          </h2>
          <span className="home-loans__head-meta">{RECOMMENDED_HEADLINE}</span>
        </div>
        <div className="home-loans__list">
          {RECOMMENDED_LOANS.map((loan) => (
            <button
              key={loan.id}
              type="button"
              className="loan-tile"
              aria-label={`${loan.name}, ${loan.displayFigure}. Loan amount.`}
              onClick={() => onApply(loan)}
            >
              <div className="loan-tile__thumb">
                <img
                  src={loan.image}
                  alt={loan.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="loan-tile__main">
                <h3 className="loan-tile__name">{loan.name}</h3>
                <p className="loan-tile__eyebrow">Loan amount</p>
              </div>
              <div className="loan-tile__side">
                <span className="loan-tile__chev" aria-hidden>
                  <FiChevronDown size={18} strokeWidth={2} />
                </span>
                <span className="loan-tile__figure">{loan.displayFigure}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <HomeDashboardFooter />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={closeSnackbar}
      />
    </div>
  )
}
