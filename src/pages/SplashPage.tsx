import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiLock } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/routes/paths'

export default function SplashPage() {
  const navigate = useNavigate()
  const [isExiting, setIsExiting] = useState(false)
  const splashDelay = useMemo(() => 4000, [])

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
        y: isExiting ? -16 : 0,
      }}
      transition={{ duration: isExiting ? 0.4 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="splash-screen__content">
        <div className="splash-bg-block splash-bg-block--one" aria-hidden />
        <div className="splash-bg-block splash-bg-block--two" aria-hidden />
        <div className="splash-bg-block splash-bg-block--three" aria-hidden />

        <motion.div
          className="splash-logo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <span className="splash-logo__mark">
            <span />
            <span />
            <span />
          </span>
        </motion.div>

        <h1 className="splash-screen__title">QuickCredit</h1>
        <p className="splash-screen__tagline">Fast &amp; Easy Credit Access</p>

        <div className="splash-loader" aria-label="Loading">
          <span className="splash-loader__track">
            <span className="splash-loader__pulse" />
          </span>
          <span className="splash-loader__secure">
            <FiLock size={11} aria-hidden />
            <span>Verified secure access</span>
          </span>
        </div>
      </div>
    </motion.main>
  )
}
