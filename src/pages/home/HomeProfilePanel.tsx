import { useCallback, useMemo, useState } from 'react'
import {
  FiCheck,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiHelpCircle,
  FiLogOut,
  FiPhone,
  FiX,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { clearCachedAuth, readCachedAuth, writeCachedAuth } from '@/lib/authCache'
import {
  DEMO_BANK_ACCOUNT_DIGITS,
  formatBankAccountFull,
  formatBankAccountHideFirstGroup,
} from '@/lib/bankAccountFormat'
import { paths } from '@/routes/paths'

const AVATAR_SRC = '/assets/images/user.png'
const CREDIT_LIMIT_LABEL = '₹34,500'
const BANK_NAME = 'QuickCredit Partner Bank'
const SUPPORT_EMAIL = 'support@quickcredit.com'

const DONUT_R = 54
const DONUT_C = 2 * Math.PI * DONUT_R
const UTIL_PCT = 0

function maskPhoneDisplay(phoneDigits: string): string {
  const d = phoneDigits.replace(/\D/g, '')
  if (!d) return '******____'
  if (d.length <= 4) return `******${d}`
  return `******${d.slice(-4)}`
}

function CreditDonut({
  className,
  compact,
}: {
  className?: string
  /** Mobile: only "0%" in the ring. Desktop: "0%" + "utilized". */
  compact?: boolean
}) {
  const arcLen = (UTIL_PCT / 100) * DONUT_C
  return (
    <div className={className} aria-hidden>
      <svg className="profile-page__donut-svg" viewBox="0 0 120 120" width="120" height="120">
        <circle
          className="profile-page__donut-track"
          cx="60"
          cy="60"
          r={DONUT_R}
          fill="none"
          strokeWidth="10"
        />
        <circle
          className="profile-page__donut-fill"
          cx="60"
          cy="60"
          r={DONUT_R}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${DONUT_C}`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className={`profile-page__donut-label${compact ? '' : ' profile-page__donut-label--full'}`}>
        <span className="profile-page__donut-pct">{UTIL_PCT}%</span>
        {!compact ? (
          <span className="profile-page__donut-util">utilized</span>
        ) : null}
      </span>
    </div>
  )
}

export default function HomeProfilePanel() {
  const navigate = useNavigate()
  const auth = useMemo(() => readCachedAuth(), [])
  const [displayName, setDisplayName] = useState(auth.fullName.trim() || 'Alex Rivera')
  const maskedPhone = useMemo(() => maskPhoneDisplay(auth.phoneDigits), [auth.phoneDigits])
  const [draftName, setDraftName] = useState(displayName)
  const [nameError, setNameError] = useState('')
  const [activePanel, setActivePanel] = useState<'none' | 'edit' | 'support'>('none')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const [bankRevealFirstGroup, setBankRevealFirstGroup] = useState(false)
  const bankFormatted = useMemo(
    () =>
      bankRevealFirstGroup
        ? formatBankAccountFull(DEMO_BANK_ACCOUNT_DIGITS)
        : formatBankAccountHideFirstGroup(DEMO_BANK_ACCOUNT_DIGITS),
    [bankRevealFirstGroup],
  )

  const logout = useCallback(() => {
    clearCachedAuth()
    navigate(paths.login, { replace: true })
  }, [navigate])

  const openEdit = useCallback(() => {
    setDraftName(displayName)
    setNameError('')
    setActivePanel('edit')
  }, [displayName])

  const saveName = useCallback(() => {
    const next = draftName.trim()
    if (next.length < 2) {
      setNameError('Please enter at least 2 characters.')
      return
    }
    setDisplayName(next)
    writeCachedAuth({ fullName: next, phoneDigits: auth.phoneDigits })
    setNameError('')
    setActivePanel('none')
  }, [auth.phoneDigits, draftName])

  return (
    <div className="home-tab profile-page">
      <div className="profile-page__shell">
        <div className="profile-page__primary">
          {activePanel !== 'none' ? (
            <div className="profile-page__dialog-backdrop" role="presentation">
              {activePanel === 'edit' ? (
                <section className="profile-page__inline-panel" aria-label="Edit name">
                  <div className="profile-page__inline-head">
                    <h2 className="profile-page__inline-title">Edit name</h2>
                    <button
                      type="button"
                      className="profile-page__inline-close"
                      onClick={() => setActivePanel('none')}
                      aria-label="Close edit panel"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  <label className="profile-page__field-label" htmlFor="profile-name-input">
                    Full name
                  </label>
                  <input
                    id="profile-name-input"
                    className="profile-page__field-input"
                    value={draftName}
                    onChange={(e) => {
                      setDraftName(e.target.value.slice(0, 20))
                      if (nameError) setNameError('')
                    }}
                    placeholder="Enter your name"
                  />
                  {nameError ? <p className="profile-page__field-error">{nameError}</p> : null}
                  <div className="profile-page__inline-actions">
                    <button type="button" className="profile-page__btn-lite" onClick={() => setActivePanel('none')}>
                      Cancel
                    </button>
                    <button type="button" className="profile-page__btn-primary" onClick={saveName}>
                      Save name
                    </button>
                  </div>
                </section>
              ) : null}

              {activePanel === 'support' ? (
                <section className="profile-page__inline-panel" aria-label="Support">
                  <div className="profile-page__inline-head">
                    <h2 className="profile-page__inline-title">QuickCredit support</h2>
                    <button
                      type="button"
                      className="profile-page__inline-close"
                      onClick={() => setActivePanel('none')}
                      aria-label="Close support panel"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  <p className="profile-page__support-text">
                    Need help? Reach us any time and our support team will assist with account, payment, and loan
                    questions.
                  </p>
                  <p className="profile-page__support-text">
                    Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                  </p>
                </section>
              ) : null}
            </div>
          ) : null}

          <section className="profile-page__hero">
            <div className="profile-page__avatar-wrap">
              <img
                className="profile-page__avatar"
                src={AVATAR_SRC}
                alt=""
                width={80}
                height={80}
              />
              <span className="profile-page__avatar-badge" aria-hidden>
                <FiCheck size={12} strokeWidth={3} />
              </span>
            </div>
            <div className="profile-page__hero-text">
              <p className="profile-page__eyebrow profile-page__eyebrow--mobile">Hello,</p>
              <p className="profile-page__eyebrow profile-page__eyebrow--desktop">User Profile</p>
              <h1 className="profile-page__name">{displayName}</h1>
              <p className="profile-page__phone">
                <FiPhone className="profile-page__phone-icon profile-page__phone-icon--desktop" aria-hidden />
                {maskedPhone}
              </p>
            </div>
          </section>

          <section className="profile-page__credit profile-page__credit--mobile" aria-label="Credit limit">
            <div className="profile-page__credit-copy">
              <p className="profile-page__credit-cap">Credit limit</p>
              <p className="profile-page__credit-amt">{CREDIT_LIMIT_LABEL}</p>
              <p className="profile-page__credit-sub">Available for immediate withdrawal</p>
            </div>
            <CreditDonut className="profile-page__donut" compact />
          </section>

          <section className="profile-page__bank" aria-label="Bank information">
            <div className="profile-page__bank-head">
              <p className="profile-page__bank-cap">Primary bank account</p>
              <div className="profile-page__bank-trail">
                <span className="profile-page__verified profile-page__verified--desktop">
                  <FiCheck size={12} strokeWidth={3} aria-hidden />
                  Verified
                </span>
                <button
                  type="button"
                  className="profile-page__eye-btn"
                  onClick={() => setBankRevealFirstGroup((v) => !v)}
                  aria-pressed={bankRevealFirstGroup}
                  aria-label={
                    bankRevealFirstGroup
                      ? 'Hide first digits of account'
                      : 'Show first digits of account'
                  }
                >
                  {bankRevealFirstGroup ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            <div className="profile-page__bank-body">
              <div className="profile-page__bank-icon-wrap" aria-hidden>
                <svg className="profile-page__bank-icon" viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path
                    d="M3 10h18v10H3V10zm0-4h18v4H3V6zm9-3v3M7 21v-6m10 6v-6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="profile-page__bank-details">
                <p className="profile-page__bank-label">Bank account number</p>
                <p className="profile-page__bank-number" dir="ltr">
                  {bankFormatted}
                </p>
                <p className="profile-page__bank-name profile-page__bank-name--desktop">{BANK_NAME}</p>
              </div>
            </div>
          </section>

          <nav className="profile-page__nav profile-page__nav--mobile" aria-label="Profile options">
            <button type="button" className="profile-page__nav-row" onClick={openEdit}>
              <span className="profile-page__nav-icon-wrap">
                <FiEdit2 size={18} strokeWidth={2} aria-hidden />
              </span>
              <span className="profile-page__nav-label">Edit name</span>
              <FiChevronRight className="profile-page__nav-chev" aria-hidden />
            </button>
            <button type="button" className="profile-page__nav-row" onClick={() => setActivePanel('support')}>
              <span className="profile-page__nav-icon-wrap">
                <FiHelpCircle size={18} strokeWidth={2} aria-hidden />
              </span>
              <span className="profile-page__nav-label">Support</span>
              <FiChevronRight className="profile-page__nav-chev" aria-hidden />
            </button>
          </nav>

          <div className="profile-page__actions-desktop" aria-label="Profile options">
            <button type="button" className="profile-page__action-card" onClick={openEdit}>
              <span className="profile-page__action-icon">
                <FiEdit2 size={20} strokeWidth={2} aria-hidden />
              </span>
              <span className="profile-page__action-title">Edit name</span>
              <span className="profile-page__action-desc">Change display and legal names</span>
            </button>
            <button type="button" className="profile-page__action-card" onClick={() => setActivePanel('support')}>
              <span className="profile-page__action-icon">
                <FiHelpCircle size={20} strokeWidth={2} aria-hidden />
              </span>
              <span className="profile-page__action-title">Support</span>
              <span className="profile-page__action-desc">24/7 dedicated help center</span>
            </button>
          </div>

          <button type="button" className="profile-page__logout" onClick={() => setShowLogoutConfirm(true)}>
            <FiLogOut size={18} strokeWidth={2} aria-hidden />
            Log out
          </button>
        </div>

        <aside className="profile-page__aside" aria-label="Credit summary">
          <section className="profile-page__credit profile-page__credit--desktop">
            <h2 className="profile-page__credit-title-desktop">Credit limit</h2>
            <CreditDonut className="profile-page__donut profile-page__donut--lg" />
            <div className="profile-page__credit-box">
              <p className="profile-page__credit-line">
                Total limit <strong>{CREDIT_LIMIT_LABEL}</strong>
              </p>
              <p className="profile-page__credit-line profile-page__credit-line--avail">
                Available <strong>{CREDIT_LIMIT_LABEL}</strong>
              </p>
            </div>
            <p className="profile-page__credit-hint">
              Maintain a healthy credit score by keeping your utilization below 30%. Your limit is reviewed
              every 6 months.
            </p>
            <button type="button" className="profile-page__request-btn">
              Request increase
            </button>
          </section>
        </aside>
      </div>

      {showLogoutConfirm ? (
        <div className="profile-page__dialog-backdrop" role="presentation">
          <div className="profile-page__dialog" role="dialog" aria-modal="true" aria-label="Confirm logout">
            <h2 className="profile-page__dialog-title">Log out?</h2>
            <p className="profile-page__dialog-text">
              This will clear your current session and take you back to the login screen.
            </p>
            <div className="profile-page__dialog-actions">
              <button type="button" className="profile-page__btn-lite" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button type="button" className="profile-page__btn-danger" onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
