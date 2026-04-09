import { motion } from 'framer-motion'
import { useId, useMemo } from 'react'

type CreditUsageRingProps = {
  min: number
  max: number
  used: number
  width?: number
  stroke?: number
}

function buildUpperSemicirclePath(
  cx: number,
  cy: number,
  r: number,
  segments = 72,
): string {
  const parts: string[] = []
  for (let i = 0; i <= segments; i++) {
    const t = Math.PI - (i / segments) * Math.PI
    const x = cx + r * Math.cos(t)
    const y = cy - r * Math.sin(t)
    parts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return parts.join(' ')
}

/** Upper semicircle gauge (left → right), animated stroke. */
export function CreditUsageRing({
  min,
  max,
  used,
  width = 260,
  stroke = 14,
}: CreditUsageRingProps) {
  const uid = useId()
  const gradId = `credit-arc-grad-${uid.replace(/:/g, '')}`

  const { vbW, vbH, pathD } = useMemo(() => {
    const vbW = 280
    const vbH = 150
    const cx = vbW / 2
    const cy = vbH - 10
    const r = vbW / 2 - stroke - 14
    return { vbW, vbH, pathD: buildUpperSemicirclePath(cx, cy, r) }
  }, [stroke])

  const pct = useMemo(() => {
    if (max <= min) return 0
    const p = (used - min) / (max - min)
    return Math.min(1, Math.max(0, p))
  }, [min, max, used])

  return (
    <div className="credit-arc" style={{ width, maxWidth: '100%' }}>
      <svg
        className="credit-arc__svg"
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--qc-primary, #3f36c9)" />
            <stop offset="55%" stopColor="var(--qc-secondary, #5347d8)" />
            <stop offset="100%" stopColor="#5b4de0" />
          </linearGradient>
        </defs>
        <path
          className="credit-arc__track"
          d={pathD}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          className="credit-arc__progress"
          d={pathD}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: pct }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  )
}
