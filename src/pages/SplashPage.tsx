import { Link } from 'react-router-dom'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { FlowNav } from '@/components/layout/FlowNav'
import { LazyImage } from '@/components/ui/LazyImage'
import { paths } from '@/routes/paths'

export default function SplashPage() {
  return (
    <AnimatedPage>
      <main className="qc-main">
        <div className="splash-hero">
          <LazyImage
            className="splash-hero__art"
            src="/illustrations/finance-hero.svg"
            alt="Abstract credit and finance illustration"
            width={320}
            height={240}
          />
          <p className="page-shell__eyebrow" style={{ marginTop: 8 }}>
            QuickCredit
          </p>
          <h1 className="page-shell__title">Credit that moves with you</h1>
          <p className="page-shell__desc">
            Apply for loans, track orders, and manage payments in one secure place.
          </p>
          <div className="splash-hero__actions">
            <Link to={paths.login} className="qc-btn qc-btn--primary">
              Get started
            </Link>
            <Link to={paths.login} className="qc-btn qc-btn--ghost">
              Sign in
            </Link>
          </div>
          <FlowNav next={{ to: paths.login, label: 'Login' }} />
        </div>
      </main>
    </AnimatedPage>
  )
}
