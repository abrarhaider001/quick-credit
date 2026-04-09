import { useCallback, useMemo, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { CreditUsageRing } from '@/components/home/CreditUsageRing'
import { Snackbar } from '@/components/ui/Snackbar'
import { RECOMMENDED_LOANS } from '@/data/recommendedLoans'
import { readCachedAuth } from '@/lib/authCache'
import { tryApplyLoan } from '@/lib/ordersStore'

const CREDIT_MIN = 2000
const CREDIT_MAX = 34500
const CREDIT_USED = 34500
/** Headline figure next to “Recommended” (theme accent) */
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

  const creditBlock = (
    <section className="home-credit" aria-labelledby="credit-heading">
      <h2 id="credit-heading" className="visually-hidden">
        Credit usage
      </h2>
      <div className="home-credit__widget">
        <div className="home-credit__gauge">
          <div className="home-credit__gauge-inner">
            <CreditUsageRing
              min={CREDIT_MIN}
              max={CREDIT_MAX}
              used={CREDIT_USED}
            />
            <div className="home-credit__gauge-text" aria-hidden>
              <p className="home-credit__amount">₹34,500</p>
              <p className="home-credit__sub">Selected amount</p>
            </div>
          </div>
        </div>
        <div className="home-credit__range">
          <div className="home-credit__range-col">
            <span className="home-credit__range-value">
              ₹ {CREDIT_MIN.toLocaleString('en-IN')}
            </span>
            <span className="home-credit__range-label">Minimum</span>
          </div>
          <div className="home-credit__range-col home-credit__range-col--end">
            <span className="home-credit__range-value">
              ₹ {CREDIT_MAX.toLocaleString('en-IN')}
            </span>
            <span className="home-credit__range-label">Maximum</span>
          </div>
        </div>
      </div>
    </section>
  )

  const loansBlock = (
    <section className="home-loans" aria-labelledby="loans-heading">
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
  )

  return (
    <div className="home-tab home-dashboard">
      <header className="home-dashboard__greet">
        <p className="home-dashboard__greet-line">
          {greet},{' '}
          <span className="home-dashboard__greet-name">{userName}</span>
        </p>
      </header>

      <div className="home-dashboard__shell">
        <div className="home-dashboard__main">{loansBlock}</div>
        <aside className="home-dashboard__aside">{creditBlock}</aside>
      </div>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={closeSnackbar}
      />
    </div>
  )
}
