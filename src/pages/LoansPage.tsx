import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { FlowNav } from '@/components/layout/FlowNav'
import { PageShell } from '@/components/layout/PageShell'
import { Card } from '@/components/ui/Card'
import { paths } from '@/routes/paths'

export default function LoansPage() {
  return (
    <AnimatedPage>
      <main className="qc-main">
        <PageShell
          eyebrow="Lending"
          title="Loans"
          description="Loan apply flow, pending checks, and product cards will ship with your Loans prompt."
        />
        <Card>
          <p style={{ margin: 0, fontSize: '0.9375rem' }}>
            Placeholder — expandable loan cards and application state machine TBD.
          </p>
        </Card>
        <FlowNav prev={{ to: paths.home, label: 'Home' }} />
      </main>
    </AnimatedPage>
  )
}
