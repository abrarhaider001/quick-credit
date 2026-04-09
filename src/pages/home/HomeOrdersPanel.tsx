import { Card } from '@/components/ui/Card'
import { useOrders } from '@/hooks/useOrders'

export default function HomeOrdersPanel() {
  const { orders } = useOrders()
  const pending = orders.filter((o) => o.status === 'pending')

  return (
    <div className="home-tab">
      <header className="home-tab__header">
        <p className="home-tab__eyebrow">Activity</p>
        <h1 className="home-tab__title">Orders</h1>
        <p className="home-tab__desc">
          Loans you apply for from Recommended Loans appear here while pending.
        </p>
      </header>

      {orders.length === 0 ? (
        <Card>
          <p className="home-tab__placeholder">No orders yet. Apply from the Home tab.</p>
        </Card>
      ) : (
        <ul className="orders-list">
          {orders.map((o) => (
            <li key={o.id}>
              <Card>
                <div className="orders-list__row">
                  <div>
                    <strong className="orders-list__name">{o.loanName}</strong>
                    <p className="orders-list__amt">{o.amountLabel}</p>
                  </div>
                  <span
                    className={`orders-list__badge orders-list__badge--${o.status}`}
                  >
                    {o.status === 'pending' ? 'Pending' : 'Cleared'}
                  </span>
                </div>
                <p className="orders-list__meta">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {pending.length > 0 ? (
        <p className="orders-list__hint">
          You have {pending.length} pending order(s). Clear dues before applying again.
        </p>
      ) : null}
    </div>
  )
}
