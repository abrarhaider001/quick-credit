/**
 * Floating gradient blocks (same visual language as login-shell .login-bg-block).
 * Used behind the route loading card; styled for mobile in global.css.
 */
export function LoadingBackdropBlockOne() {
  return <div className="qc-loading-bg qc-loading-bg--one" aria-hidden />
}

export function LoadingBackdropBlockTwo() {
  return <div className="qc-loading-bg qc-loading-bg--two" aria-hidden />
}
