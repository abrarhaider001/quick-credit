import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { FlowNav } from '@/components/layout/FlowNav'
import { PageShell } from '@/components/layout/PageShell'
import { Card } from '@/components/ui/Card'
import { paths } from '@/routes/paths'

export default function PaymentPage() {
  return (
    <AnimatedPage>
      <main className="qc-main">
        <PageShell
          eyebrow="Checkout"
          title="Payment"
          description="Payment submission flow, confirmations, and receipts — implementation deferred to your Payment prompt."
        />
        <Card>
          <p style={{ margin: 0, fontSize: '0.9375rem' }}>
            Placeholder — amount, method, and success states TBD.
          </p>
        </Card>
        <FlowNav prev={{ to: paths.home, label: 'Home' }} />
      </main>
    </AnimatedPage>
  )
}
