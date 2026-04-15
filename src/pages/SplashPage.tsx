import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiShield } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { QuickCreditLogo } from '@/components/ui/QuickCreditLogo'
import { logFirebaseConnectionResult, testFirebaseConnection } from '@/lib/firebaseConnectionTest'
import { paths } from '@/routes/paths'

export default function SplashPage() {
  const navigate = useNavigate()
  const [isExiting, setIsExiting] = useState(false)
  const splashDelay = useMemo(() => 4000, [])

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.testQuickCreditFirebase = testFirebaseConnection
    }

    let cancelled = false
    void testFirebaseConnection().then((result) => {
      logFirebaseConnectionResult(result)
      if (cancelled) return
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const startExit = window.setTimeout(() => {
      setIsExiting(true)
    }, splashDelay)

    const completeNav = window.setTimeout(() => {
      navigate(paths.login, { replace: true })
    }, splashDelay + 450)

    return () => {
      window.clearTimeout(startExit)
      window.clearTimeout(completeNav)
    }
  }, [navigate, splashDelay])

  return (
    <motion.main
      className="splash-screen"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        y: isExiting ? -8 : 0,
      }}
      transition={{ duration: isExiting ? 0.4 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="splash-screen__content"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="splash-bg-block splash-bg-block--one" aria-hidden />
        <div className="splash-bg-block splash-bg-block--two" aria-hidden />
        <div className="splash-bg-block splash-bg-block--three" aria-hidden />

        <br /><br />
        <div className="splash-logo">
          <QuickCreditLogo className="splash-logo__glyph" size={22} />
        </div>
        <h1 className="splash-screen__title">QuickCredit</h1>
        <p className="splash-screen__tagline">Fast &amp; easy credit access</p>

        <div className="splash-loader" aria-label="Loading">
          <div className="splash-loader__track">
            <span className="splash-loader__pulse" />
          </div>
          <p className="splash-loader__secure">
            <FiShield size={12} aria-hidden />
            Bank-grade security
          </p>
        </div>
      </motion.div>
    </motion.main>
  )
}
