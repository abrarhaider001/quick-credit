import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiShield } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { Snackbar } from '@/components/ui/Snackbar'
import { readCachedAuth, writeCachedAuth } from '@/lib/authCache'
import { formatPhoneLoginMask, toIndiaE164FromDigits } from '@/lib/phone'
import { LOGIN_INVALID_PHONE_MESSAGE, validateLoginPhone } from '@/lib/validateLoginPhone'
import { paths } from '@/routes/paths'

export default function LoginPage() {
  const navigate = useNavigate()
  const cached = useMemo(() => readCachedAuth(), [])
  const [phoneDigits, setPhoneDigits] = useState(cached.phoneDigits)
  const [isPhoneFocused, setIsPhoneFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    variant: 'error' | 'info' | 'success'
  }>({ open: false, message: '', variant: 'error' })

  const closeSnackbar = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }))
  }, [])

  const maskedPhone = useMemo(() => {
    if (phoneDigits.length <= 3) return phoneDigits
    return `${phoneDigits.slice(0, 3)} ${phoneDigits.slice(3)}`
  }, [phoneDigits])

  const handlePhoneChange = (value: string) => {
    const onlyDigits = value.replace(/\D/g, '').slice(0, 10)
    setPhoneDigits(onlyDigits)
  }

  /** Persist phone; omit userId/limits so returning to login clears the home session gate. */
  useEffect(() => {
    const c = readCachedAuth()
    writeCachedAuth({
      fullName: c.fullName,
      phoneDigits,
    })
  }, [phoneDigits])

  const handleContinue = async () => {
    if (phoneDigits.length !== 10) {
      setSnackbar({
        open: true,
        variant: 'error',
        message: LOGIN_INVALID_PHONE_MESSAGE,
      })
      return
    }

    const e164 = toIndiaE164FromDigits(phoneDigits)
    if (!e164) {
      setSnackbar({
        open: true,
        variant: 'error',
        message: LOGIN_INVALID_PHONE_MESSAGE,
      })
      return
    }

    setSubmitting(true)
    const result = await validateLoginPhone(e164)
    setSubmitting(false)

    if (!result.ok) {
      setSnackbar({
        open: true,
        variant: 'error',
        message: LOGIN_INVALID_PHONE_MESSAGE,
      })
      return
    }

    navigate(paths.otp, {
      state: {
        phoneDigits,
        phoneDisplay: formatPhoneLoginMask(phoneDigits),
        expectedUid: result.userId,
        fullName: result.fullName,
        minLimit: result.minLimit,
        maxLimit: result.maxLimit,
      },
    })
  }

  return (
    <motion.main
      className="login-screen"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <section className="login-shell">
        <div className="login-bg-block login-bg-block--one" aria-hidden />
        <div className="login-bg-block login-bg-block--two" aria-hidden />
        <div className="login-bg-block login-bg-block--three" aria-hidden />

        <div className="login-brand">
          <div className="login-brand__icon" aria-hidden>
            <FiShield size={24} />
          </div>
          <h1 className="login-brand__title">QuickCredit</h1>
          <p className="login-brand__subtitle">Create your secure gateway to growth</p>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <label className="login-field">
              <span className="login-field__label">Phone Number</span>
              <div className={`login-phone ${phoneDigits.length > 0 ? 'login-phone--active' : ''}`}>
                <span className="login-phone__code" aria-label="Country code">
                  +91
                </span>
                <input
                  className="login-input login-phone__input"
                  type="tel"
                  placeholder="111 2345678"
                  autoComplete="tel"
                  inputMode="numeric"
                  value={maskedPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </div>
              {isPhoneFocused ? (
                <span className="login-field__meta">{phoneDigits.length}/10</span>
              ) : null}
            </label>

            <button
              type="button"
              className="qc-btn qc-btn--primary login-continue"
              onClick={() => void handleContinue()}
              disabled={submitting}
            >
              Continue <FiArrowRight size={16} />
            </button>
          </form>

          <p className="login-support">
            Having trouble logging into your account? Contact the support team.
          </p>
        </div>
      </section>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={closeSnackbar}
      />
    </motion.main>
  )
}
