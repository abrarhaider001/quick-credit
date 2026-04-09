import { FiLock, FiShield } from 'react-icons/fi'

export function HomeDashboardFooter() {
  return (
    <footer className="home-dash-footer">
      <div className="home-dash-footer__inner">
        <div className="home-dash-footer__copy">
          <h3 className="home-dash-footer__title">Your credit, secured</h3>
          <p className="home-dash-footer__text">
            Bank-grade encryption protects your data in transit and at rest. We follow strict
            privacy practices so your financial information stays yours.
          </p>
        </div>
        <ul className="home-dash-footer__badges" aria-label="Trust indicators">
          <li className="home-dash-footer__badge">
            <FiShield size={22} strokeWidth={2} aria-hidden />
            <span>RBI norms</span>
          </li>
          <li className="home-dash-footer__badge">
            <FiLock size={22} strokeWidth={2} aria-hidden />
            <span>SSL secured</span>
          </li>
        </ul>
      </div>
    </footer>
  )
}
