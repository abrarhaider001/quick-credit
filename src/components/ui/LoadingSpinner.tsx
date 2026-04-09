import { LoadingBackdropBlockOne, LoadingBackdropBlockTwo } from '@/components/ui/LoadingBackdropDecor'

export function LoadingSpinner() {
  return (
    <div className="qc-loading" role="status" aria-live="polite" aria-label="Loading">
      <div className="qc-loading__shell">
        <LoadingBackdropBlockOne />
        <LoadingBackdropBlockTwo />
        <div className="qc-loading__card">
          <div className="qc-loading__glow" aria-hidden />
          <div className="qc-loading__brand">
            <span className="qc-loading__mark" aria-hidden>
              QC
            </span>
            <span className="qc-loading__label">QuickCredit</span>
          </div>
          <div className="qc-loading__track" aria-hidden>
            <span className="qc-loading__ring" />
          </div>
          <p className="qc-loading__hint">Preparing your experience…</p>
          <div className="qc-loading__dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  )
}
