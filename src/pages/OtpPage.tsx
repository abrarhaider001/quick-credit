import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiShield } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { Snackbar } from '@/components/ui/Snackbar'
import { readCachedAuth, writeCachedAuth } from '@/lib/authCache'
import { formatPhoneLoginMask } from '@/lib/phone'
import { paths } from '@/routes/paths'
import { isLoginToOtpState } from '@/types/navigation'

const OTP_LEN = 6

function randomDigits(len: number): string {
  let s = ''
  for (let i = 0; i < len; i += 1) {
    s += String(Math.floor(Math.random() * 10))
  }
  return s
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function OtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirected = useRef(false)

  const gate = useMemo(() => {
    const st = location.state
    return isLoginToOtpState(st) ? st : null
  }, [location.state])

  const cached = useMemo(() => readCachedAuth(), [])

  const phoneDigits = useMemo(() => {
    if (gate) return gate.phoneDigits.replace(/\D/g, '').slice(0, 10)
    return cached.phoneDigits
  }, [gate, cached.phoneDigits])

  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LEN).fill(''))
  const [phase, setPhase] = useState<'waiting' | 'filling' | 'done'>('waiting')
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const timersRef = useRef<number[]>([])
  const intervalRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!gate) {
      if (!redirected.current) {
        redirected.current = true
        navigate(paths.login, { replace: true })
      }
      return
    }

    const delayMs = 10000 + Math.floor(Math.random() * 6000)

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const tFetch = window.setTimeout(() => {
      const code = randomDigits(OTP_LEN)
      setPhase('filling')

      const fillNext = (index: number) => {
        if (index >= OTP_LEN) {
          setPhase('done')
          const tNav = window.setTimeout(() => {
            writeCachedAuth({
              fullName: gate.fullName,
              phoneDigits: gate.phoneDigits.replace(/\D/g, '').slice(0, 10),
              userId: gate.expectedUid,
              minLimit: gate.minLimit,
              maxLimit: gate.maxLimit,
            })
            navigate(paths.home, { replace: true })
          }, 900)
          timersRef.current.push(tNav)
          return
        }
        setOtp((prev) => {
          const next = [...prev]
          next[index] = code[index] ?? ''
          return next
        })
        const t = window.setTimeout(() => fillNext(index + 1), 140)
        timersRef.current.push(t)
      }
      fillNext(0)
    }, delayMs)
    timersRef.current.push(tFetch)

    return () => {
      clearTimers()
    }
  }, [clearTimers, gate, navigate])

  const closeSnackbar = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }))
  }, [])

  const handleVerifyClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (phase !== 'done') {
      setSnackbar({
        open: true,
        message:
          phase === 'waiting'
            ? 'Please wait — we are still fetching your verification code.'
            : 'Please wait while the code is being entered automatically.',
      })
    }
  }

  const displayPhone = useMemo(
    () => (gate ? gate.phoneDisplay : formatPhoneLoginMask(phoneDigits)),
    [gate, phoneDigits],
  )

  if (!gate) {
    return null
  }

  return (
    <motion.main
      className="otp-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <section className="otp-shell">
        <div className="otp-bg-block otp-bg-block--one" aria-hidden />
        <div className="otp-bg-block otp-bg-block--two" aria-hidden />

        <div className="otp-card">
          <div className="otp-brand__icon" aria-hidden>
            <FiShield size={22} />
          </div>
          <h1 className="otp-title">Verification Code</h1>
          <p className="otp-instruction">
            Please enter the 6-digit code sent to{' '}
            <strong className="otp-phone">{displayPhone}</strong>
          </p>

          <div className="otp-row" role="group" aria-label="Verification code">
            {otp.map((digit, idx) => (
              <div key={idx} className="otp-box">
                <input
                  className="otp-box__input"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  value={digit}
                  placeholder="•"
                  aria-label={`Digit ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          <p className="otp-fetching">
            We are fetching the code automatically — you do not need to type anything.
          </p>

          <div className="otp-timer">
            <FiClock size={14} aria-hidden />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          <button type="button" className="otp-resend" disabled>
            Resend OTP
          </button>

          <button
            type="button"
            className="qc-btn qc-btn--primary otp-verify"
            disabled={phase === 'done'}
            onClick={handleVerifyClick}
          >
            Verify &amp; Proceed
          </button>
        </div>

        <p className="otp-footer">
          If you&apos;re having trouble receiving the code, contact the QuickCredit support team.
        </p>
      </section>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant="error"
        onClose={closeSnackbar}
      />
    </motion.main>
  )
}
