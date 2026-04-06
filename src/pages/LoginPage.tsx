import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { FlowNav } from '@/components/layout/FlowNav'
import { PageShell } from '@/components/layout/PageShell'
import { Card } from '@/components/ui/Card'
import { paths } from '@/routes/paths'

export default function LoginPage() {
  return (
    <AnimatedPage>
      <main className="qc-main">
        <PageShell
          eyebrow="Authentication"
          title="Welcome back"
          description="Sign in with your phone or email. Form fields will be added in the Login page prompt."
        />
        <Card>
          <p style={{ margin: 0, fontSize: '0.9375rem' }}>
            Placeholder — inputs, validation, and API hooks arrive with your next prompt.
          </p>
        </Card>
        <FlowNav
          prev={{ to: paths.splash, label: 'Splash' }}
          next={{ to: paths.otp, label: 'OTP' }}
        />
      </main>
    </AnimatedPage>
  )
}
