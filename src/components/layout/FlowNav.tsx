import { Link } from 'react-router-dom'

type NavItem = { to: string; label: string }

type FlowNavProps = {
  prev?: NavItem
  next?: NavItem
}

/** Scaffold navigation along the auth + app flow (replace with real nav later). */
export function FlowNav({ prev, next }: FlowNavProps) {
  if (!prev && !next) return null

  return (
    <nav className="flow-nav" aria-label="Flow navigation">
      <span className="flow-nav__hint">Flow scaffold — full UI will replace these links.</span>
      {prev ? (
        <Link to={prev.to} className="qc-btn qc-btn--ghost">
          ← {prev.label}
        </Link>
      ) : null}
      {next ? (
        <Link to={next.to} className="qc-btn qc-btn--primary">
          {next.label} →
        </Link>
      ) : null}
    </nav>
  )
}
