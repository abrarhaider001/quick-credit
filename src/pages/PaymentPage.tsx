import { useCallback, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiCopy,
  FiCreditCard,
  FiHeadphones,
  FiInfo,
  FiShield,
} from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { Snackbar } from '@/components/ui/Snackbar'
import { formatDueDateWithOrdinal } from '@/lib/orderDisplay'
import { paths } from '@/routes/paths'
import { resolvePaymentLoan } from '@/types/paymentNavigation'

const DEMO_UPI_ID = 'quickcredit@upi'
const SUPPORT_EMAIL = 'support@quickcredit.com'
const SUPPORT_TEL_DISPLAY = '1800-000-0000'
const SUPPORT_TEL_HREF = 'tel:+9118000000000'

/** Add PNG/WebP files under public/assets/paymentMethods/ (e.g. paytm.png). */
const PAYMENT_TILES = [
  { id: 'paytm' as const, label: 'Paytm', file: 'paytm.png' },
  { id: 'phonepe' as const, label: 'PhonePe', file: 'phonepe.png' },
  { id: 'gpay' as const, label: 'Google Pay', file: 'googlepay.png' },
  { id: 'upi' as const, label: 'Other UPI', file: 'upi.png' },
]

type MethodId = (typeof PAYMENT_TILES)[number]['id']

function paymentMethodImageSrc(file: string): string {
  return `/assets/paymentMethods/${file}`
}

function PaymentMethodTile({
  id,
  label,
  imageSrc,
  selected,
  onSelect,
}: {
  id: MethodId
  label: string
  imageSrc: string
  selected: boolean
  onSelect: (mid: MethodId) => void
}) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <button
      type="button"
      className={`payment-page__method-tile${selected ? ' payment-page__method-tile--selected' : ''}`}
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      aria-label={`Pay with ${label}`}
    >
      {selected ? (
        <span className="payment-page__method-check" aria-hidden>
          <FiCheck size={14} strokeWidth={3} />
        </span>
      ) : null}
      {!imageFailed ? (
        <img
          className="payment-page__method-img"
          src={imageSrc}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="payment-page__method-fallback" role="img" aria-label={label}>
          {label}
        </span>
      )}
    </button>
  )
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

export default function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const loan = useMemo(() => resolvePaymentLoan(location.state), [location.state])

  const [refNo, setRefNo] = useState('')
  const [refInvalid, setRefInvalid] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<MethodId | null>('phonepe')
  const [copied, setCopied] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info' | 'success'
  }>({ open: false, message: '', variant: 'info' })

  const closeSnackbar = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }))
  }, [])

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1)
    else navigate(paths.homeOrders)
  }, [navigate])

  const copyUpi = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DEMO_UPI_ID)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setSnackbar({
        open: true,
        message: 'Could not copy. Please copy manually.',
        variant: 'error',
      })
    }
  }, [])

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const d = digitsOnly(refNo)
      if (d.length !== 12) {
        setRefInvalid(true)
        setSnackbar({
          open: true,
          message: 'Please enter a valid 12-digit UPI reference number.',
          variant: 'error',
        })
        return
      }
      setRefInvalid(false)
      setSnackbar({
        open: true,
        message: 'Your request has been submitted',
        variant: 'success',
      })
    },
    [refNo],
  )

  const amountLabel = loan?.totalToPay ?? '—'
  const loanAccountDisplay = loan?.referenceId
    ? loan.referenceId.replace(/^Reference:\s*/i, '').trim()
    : '—'
  const nextDue =
    loan != null ? formatDueDateWithOrdinal(loan.dueDateMs) : null

  const onRefChange = useCallback((v: string) => {
    setRefNo(v)
    if (refInvalid) setRefInvalid(false)
  }, [refInvalid])

  return (
    <AnimatedPage>
      <div className="payment-page">
        <header className="payment-page__header">
          <div className="payment-page__header-inner">
            <button
              type="button"
              className="payment-page__back"
              onClick={goBack}
              aria-label="Go back"
            >
              <FiArrowLeft size={22} strokeWidth={2.25} />
            </button>
            <div className="payment-page__header-titles">
              <p className="payment-page__crumb">Payments › Make payment</p>
              <h1 className="payment-page__title">Make Payment</h1>
            </div>
          </div>
        </header>

        <div className="payment-page__layout">
          <div className="payment-page__main">
            <div className="payment-page__scroll">
              {!loan ? (
                <p className="payment-page__hint">
                  No loan selected. Use <strong>Pay now</strong> from a pending order to pre-fill this
                  screen.
                </p>
              ) : null}

              {loan?.paymentUrl ? (
                <section className="payment-page__loan-link" aria-label="Loan payment link">
                  <h2 className="payment-page__step-title">Loan payment link</h2>
                  <p className="payment-page__step-desc">
                    Use this link to complete payment for this loan in your lender&apos;s portal.
                  </p>
                  <a
                    className="payment-page__external-pay"
                    href={loan.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open payment page
                    <FiArrowRight size={18} strokeWidth={2.25} aria-hidden />
                  </a>
                </section>
              ) : null}

              <section className="payment-page__summary" aria-label="Amount due">
                <div className="payment-page__summary-mobile">
                  <p className="payment-page__summary-label">Total Pending Amount</p>
                  <p className="payment-page__summary-value">{amountLabel}</p>
                  {nextDue ? (
                    <p className="payment-page__summary-due">
                      <FiCalendar size={15} strokeWidth={2} aria-hidden />
                      Next due: {nextDue}
                    </p>
                  ) : null}
                </div>
                <div className="payment-page__summary-desktop">
                  <div className="payment-page__summary-desktop-left">
                    <p className="payment-page__summary-label">Total Pending Amount</p>
                    <p className="payment-page__summary-value">{amountLabel}</p>
                    {nextDue ? (
                      <p className="payment-page__summary-due">
                        <FiCalendar size={16} strokeWidth={2} aria-hidden />
                        Next due: {nextDue}
                      </p>
                    ) : null}
                  </div>
                  <div className="payment-page__summary-account" aria-label="Loan account">
                    <p className="payment-page__summary-account-label">Loan account</p>
                    <p className="payment-page__summary-account-id">{loanAccountDisplay}</p>
                  </div>
                </div>
              </section>

              <form className="payment-page__form" onSubmit={onSubmit} noValidate>
                <div className="payment-page__step">
                  <h2 className="payment-page__step-title">Step 1: Copy UPI ID</h2>
                  <p className="payment-page__step-desc">
                    Use this ID in your preferred UPI application to initiate the transfer.
                  </p>
                  <div className="payment-page__merchant-box">
                    <div className="payment-page__merchant-row">
                      <div className="payment-page__merchant-start">
                        <span className="payment-page__qr-badge" aria-hidden>
                          <FiCreditCard size={22} strokeWidth={2} />
                        </span>
                        <span className="payment-page__merchant-upi">{DEMO_UPI_ID}</span>
                      </div>
                      <button
                        type="button"
                        className="payment-page__copy-id"
                        onClick={copyUpi}
                      >
                        <FiCopy size={16} strokeWidth={2} aria-hidden />
                        Copy ID
                      </button>
                    </div>
                  </div>
                  {copied ? (
                    <p className="payment-page__copied">Copied to clipboard</p>
                  ) : null}
                </div>

                <div className="payment-page__step">
                  <h2 className="payment-page__step-title">Step 2: Select Payment Method</h2>
                  <p className="payment-page__step-desc">
                    Choose the application you have installed on your mobile device.
                  </p>
                  <div className="payment-page__methods-wrap">
                    <div className="payment-page__method-grid" role="group" aria-label="UPI apps">
                      {PAYMENT_TILES.map(({ id, label, file }) => (
                        <PaymentMethodTile
                          key={id}
                          id={id}
                          label={label}
                          imageSrc={paymentMethodImageSrc(file)}
                          selected={selectedMethod === id}
                          onSelect={setSelectedMethod}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="payment-page__step">
                  <h2 className="payment-page__step-title">Step 3: Enter Transaction ID</h2>
                  <p className="payment-page__step-desc">
                    After payment, enter the 12-digit UPI reference number from your app.
                  </p>
                  <div
                    className={`payment-page__ref-field${refInvalid ? ' payment-page__ref-field--invalid' : ''}`}
                  >
                    <input
                      type="text"
                      className="payment-page__ref-input"
                      placeholder="e.g. 1234 5678 9012"
                      value={refNo}
                      onChange={(e) => onRefChange(e.target.value)}
                      inputMode="numeric"
                      autoComplete="off"
                      aria-invalid={refInvalid}
                      aria-describedby="payment-ref-hint"
                    />
                    <div className="payment-page__ref-trail" id="payment-ref-hint">
                      <span className="payment-page__ref-rule">12 digits required</span>
                      <FiInfo size={18} strokeWidth={2} className="payment-page__ref-info" aria-hidden />
                    </div>
                  </div>
                </div>

                <button type="submit" className="payment-page__submit">
                  Submit Payment
                  <FiArrowRight size={20} strokeWidth={2.25} aria-hidden />
                </button>
                <p className="payment-page__legal">
                  By clicking submit, you agree to our Terms of Service regarding protected
                  transactions.
                </p>
              </form>
            </div>
          </div>

          <aside className="payment-page__rail" aria-label="Security and support">
            <div className="payment-page__rail-card">
              <div className="payment-page__rail-head">
                <FiShield size={22} strokeWidth={2} aria-hidden />
                <h3 className="payment-page__rail-title">Secure payment protocol</h3>
              </div>
              <p className="payment-page__rail-text">
                Your payment details are encrypted. We never store your full UPI PIN or passwords.
              </p>
              <ul className="payment-page__rail-bullets">
                <li>No hidden fees</li>
                <li>Instant confirmation</li>
              </ul>
            </div>

            <div className="payment-page__rail-card payment-page__rail-card--support">
              <div className="payment-page__rail-head">
                <FiHeadphones size={22} strokeWidth={2} aria-hidden />
                <h3 className="payment-page__rail-title">QuickCredit support</h3>
              </div>
              <p className="payment-page__rail-text">
                Need help with this payment or your loan? Contact the QuickCredit support team — we
                are here for billing questions, UPI issues, and account support.
              </p>
              <a className="payment-page__rail-cta payment-page__rail-cta--link" href={`mailto:${SUPPORT_EMAIL}`}>
                Email support
              </a>
              <a className="payment-page__rail-secondary-link" href={SUPPORT_TEL_HREF}>
                Call {SUPPORT_TEL_DISPLAY}
              </a>
              <p className="payment-page__rail-meta">Mon–Sat · 9am–7pm IST</p>
            </div>
          </aside>
        </div>

        <Snackbar
          message={snackbar.message}
          open={snackbar.open}
          onClose={closeSnackbar}
          variant={snackbar.variant}
        />
      </div>
    </AnimatedPage>
  )
}
