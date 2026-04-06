import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { FlowNav } from '@/components/layout/FlowNav'
import { PageShell } from '@/components/layout/PageShell'
import { Card } from '@/components/ui/Card'
import { paths } from '@/routes/paths'

export default function OtpPage() {
  return (
    <AnimatedPage>
      <main className="qc-main">
        <PageShell
          eyebrow="Verify"
          title="Enter OTP"
          description="Auto verification simulation will plug in here. For now this route only scaffolds layout."
        />
        <Card>
          <p style={{ margin: 0, fontSize: '0.9375rem' }}>
            Placeholder — OTP inputs, countdown, and resend will be implemented per your OTP prompt.
          </p>
        </Card>
        <FlowNav
          prev={{ to: paths.login, label: 'Login' }}
          next={{ to: paths.home, label: 'Home' }}
        />
      </main>
    </AnimatedPage>
  )
}
