type HomeLimitsRowProps = {
  minAmount: number
  maxAmount: number
  usedAmount: number
}

function formatInr(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export function HomeLimitsRow({ minAmount, maxAmount, usedAmount }: HomeLimitsRowProps) {
  const range = maxAmount - minAmount
  const pct =
    range <= 0 ? 0 : Math.min(100, Math.max(0, ((usedAmount - minAmount) / range) * 100))

  return (
    <section
      className="home-limits home-limits--desktop"
      aria-labelledby="home-limits-heading"
    >
      <div className="home-limits__head">
        <div>
          <p className="home-limits__eyebrow">Credit limits</p>
          <h2 id="home-limits-heading" className="home-limits__title">
            Your range
          </h2>
        </div>
      </div>
      <div className="home-limits__grid">
        <article className="home-limit-card">
          <p className="home-limit-card__label">Minimum limit</p>
          <p className="home-limit-card__value">{formatInr(minAmount)}</p>
          <p className="home-limit-card__hint">Floor for withdrawals</p>
        </article>
        <article className="home-limit-card">
          <p className="home-limit-card__label">Maximum limit</p>
          <p className="home-limit-card__value">{formatInr(maxAmount)}</p>
          <p className="home-limit-card__hint">Upper cap on this line</p>
        </article>
        <article className="home-limit-card home-limit-card--accent">
          <p className="home-limit-card__label">Selected amount</p>
          <p className="home-limit-card__value">{formatInr(usedAmount)}</p>
          <div className="home-limit-card__bar" role="presentation">
            <span
              className="home-limit-card__bar-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="home-limit-card__hint">{Math.round(pct)}% within min–max range</p>
        </article>
      </div>
    </section>
  )
}
