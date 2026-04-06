import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pageTransition } from '@/lib/motion'

export function AnimatedPage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="qc-app"
    >
      {children}
    </motion.div>
  )
}
