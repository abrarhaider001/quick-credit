import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  interactive?: boolean
}

export function Card({ children, className = '', interactive = false }: CardProps) {
  return (
    <div
      className={`qc-card${interactive ? ' qc-card--interactive' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
