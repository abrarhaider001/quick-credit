import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { FlowNav } from '@/components/layout/FlowNav'
import { PageShell } from '@/components/layout/PageShell'
import { Card } from '@/components/ui/Card'
import { paths } from '@/routes/paths'

export default function OrdersPage() {
  return (
    <AnimatedPage>
      <main className="qc-main">
        <PageShell
          eyebrow="Activity"
          title="Orders"
          description="Expandable order cards and filters will be built from your Orders prompt."
        />
        <Card>
          <p style={{ margin: 0, fontSize: '0.9375rem' }}>
            Placeholder — list + expand/collapse interactions TBD.
          </p>
        </Card>
        <FlowNav prev={{ to: paths.home, label: 'Home' }} />
      </main>
    </AnimatedPage>
  )
}
