import { useEffect } from 'react'

type SnackbarProps = {
  message: string
  open: boolean
  onClose: () => void
  variant?: 'error' | 'info'
}

export function Snackbar({ message, open, onClose, variant = 'info' }: SnackbarProps) {
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(onClose, 4200)
    return () => window.clearTimeout(t)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={`qc-snackbar qc-snackbar--${variant}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
