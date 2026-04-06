import type { ReactNode } from 'react'

type PageShellProps = {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <div className="page-shell">
      {eyebrow ? <p className="page-shell__eyebrow">{eyebrow}</p> : null}
      <h1 className="page-shell__title">{title}</h1>
      {description ? <p className="page-shell__desc">{description}</p> : null}
      {children ?? null}
    </div>
  )
}
