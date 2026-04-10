import { useCallback, useMemo, useState } from 'react'
import { HomeCreditGaugeMobile } from '@/components/home/HomeCreditGaugeMobile'
import { HomeDashboardFooter } from '@/components/home/HomeDashboardFooter'
import { HomeLimitsRow } from '@/components/home/HomeLimitsRow'
import { HomeOfferBanner } from '@/components/home/HomeOfferBanner'
import { Snackbar } from '@/components/ui/Snackbar'
import { RECOMMENDED_LOANS } from '@/data/recommendedLoans'
import { useAuthCacheListener } from '@/hooks/useAuthCacheListener'
import { useOrders } from '@/hooks/useOrders'
import { tryApplyLoan } from '@/lib/ordersStore'

const FALLBACK_MIN = 2000
const FALLBACK_MAX = 34500
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
  const auth = useAuthCacheListener()
  const { orders } = useOrders()

  const minLimit = auth.minLimit != null && auth.minLimit > 0 ? auth.minLimit : FALLBACK_MIN
  const maxLimit = auth.maxLimit != null && auth.maxLimit > 0 ? auth.maxLimit : FALLBACK_MAX

  const usedCredit = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'pending')
        .reduce((sum, o) => sum + (o.totalDueAmountNum ?? 0), 0),
    [orders],
  )

  const userName = useMemo(() => displayFirstName(auth.fullName), [auth.fullName])
  const greet = useMemo(() => greetingLabel(), [])

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info' | 'success'
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
          message: 'Pay your previous dues',
          variant: 'error',
        })
        return
      }
      setSnackbar({
        open: true,
        message: 'Processing successful',
        variant: 'success',
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

      <HomeCreditGaugeMobile min={minLimit} max={maxLimit} used={usedCredit} />

      <HomeOfferBanner
        eyebrow="Personalized offer"
        title={`You are eligible for ₹${PRE_APPROVED_ELIGIBLE.toLocaleString('en-IN')}`}
        description="Your trust score and repayment history qualify you for preferred rates. Review limits below and pick a loan that fits your plan."
        imageSrc={OFFER_IMAGE}
        imageAlt="Financial growth and savings"
        ctaLabel="Apply now"
        onCtaClick={scrollToRecommended}
      />

      <HomeLimitsRow minAmount={minLimit} maxAmount={maxLimit} usedAmount={usedCredit} />

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
            <article key={loan.id} className="loan-tile" aria-label={`${loan.name}, ${loan.displayFigure}`}>
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
                <p className="loan-tile__figure">{loan.displayFigure}</p>
              </div>
              <div className="loan-tile__side">
                <button
                  type="button"
                  className="loan-tile__apply"
                  onClick={() => onApply(loan)}
                  aria-label={`Apply for ${loan.name}`}
                >
                  Apply
                </button>
              </div>
            </article>
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
