import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { FlowNav } from '@/components/layout/FlowNav'
import { PageShell } from '@/components/layout/PageShell'
import { Card } from '@/components/ui/Card'
import { paths } from '@/routes/paths'

export default function ProfilePage() {
  return (
    <AnimatedPage>
      <main className="qc-main">
        <PageShell
          eyebrow="Account"
          title="Profile"
          description="Profile management, KYC hints, and preferences will follow your Profile prompt."
        />
        <Card>
          <p style={{ margin: 0, fontSize: '0.9375rem' }}>
            Placeholder — editable fields and avatar upload TBD.
          </p>
        </Card>
        <FlowNav prev={{ to: paths.home, label: 'Home' }} />
      </main>
    </AnimatedPage>
  )
}
