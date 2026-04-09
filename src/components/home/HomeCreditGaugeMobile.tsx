import { CreditUsageRing } from '@/components/home/CreditUsageRing'

type HomeCreditGaugeMobileProps = {
  min: number
  max: number
  used: number
}

function formatInr(n: number) {
  return n.toLocaleString('en-IN')
}

export function HomeCreditGaugeMobile({ min, max, used }: HomeCreditGaugeMobileProps) {
  return (
    <section
      className="home-credit home-credit--mobile-only"
      aria-labelledby="credit-heading-mobile"
    >
      <h2 id="credit-heading-mobile" className="visually-hidden">
        Credit usage
      </h2>
      <div className="home-credit__widget">
        <div className="home-credit__gauge">
          <div className="home-credit__gauge-inner">
            <CreditUsageRing min={min} max={max} used={used} />
            <div className="home-credit__gauge-text" aria-hidden>
              <p className="home-credit__amount">₹{formatInr(used)}</p>
              <p className="home-credit__sub">Selected amount</p>
            </div>
          </div>
        </div>
        <div className="home-credit__range">
          <div className="home-credit__range-col">
            <span className="home-credit__range-value">₹ {formatInr(min)}</span>
            <span className="home-credit__range-label">Minimum</span>
          </div>
          <div className="home-credit__range-col home-credit__range-col--end">
            <span className="home-credit__range-value">₹ {formatInr(max)}</span>
            <span className="home-credit__range-label">Maximum</span>
          </div>
        </div>
      </div>
    </section>
  )
}
