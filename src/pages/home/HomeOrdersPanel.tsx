import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FiInfo, FiSearch } from 'react-icons/fi'
import { OrderLoanCard } from '@/components/orders/OrderLoanCard'
import { DEMO_COMPLETED, DEMO_PENDING } from '@/data/ordersDemo'
import { useOrders } from '@/hooks/useOrders'
import { enrichOrder } from '@/lib/orderDisplay'
import type { EnrichedLoanOrder } from '@/lib/orderDisplay'
import type { LoanOrder } from '@/lib/ordersStore'
type Tab = 'pending' | 'completed'

function splitOrders(orders: LoanOrder[]) {
  const useDemo = orders.length === 0
  const pendingSrc = useDemo ? DEMO_PENDING : orders.filter((o) => o.status === 'pending')
  const completedSrc = useDemo
    ? DEMO_COMPLETED
    : orders.filter((o) => o.status === 'cleared')
  return {
    pending: pendingSrc.map(enrichOrder),
    completed: completedSrc.map(enrichOrder),
    useDemo,
  }
}

function filterList(list: EnrichedLoanOrder[], q: string) {
  const s = q.trim().toLowerCase()
  if (!s) return list
  return list.filter(
    (o) =>
      o.loanName.toLowerCase().includes(s) ||
      o.referenceId.toLowerCase().includes(s) ||
      o.totalToPay.toLowerCase().includes(s) ||
      o.loanAmountDisplay.toLowerCase().includes(s),
  )
}

export default function HomeOrdersPanel() {
  const { orders } = useOrders()
  const [tab, setTab] = useState<Tab>('pending')
  const [search, setSearch] = useState('')

  const { pending, completed, useDemo } = useMemo(
    () => splitOrders(orders),
    [orders],
  )

  const list = tab === 'pending' ? pending : completed
  const filtered = useMemo(() => filterList(list, search), [list, search])

  return (
    <div className="home-tab orders-page">
      <div className="orders-page__toolbar">
        <label className="orders-page__search" htmlFor="orders-search">
          <FiSearch size={18} strokeWidth={2} aria-hidden />
          <input
            id="orders-search"
            type="search"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </label>
        {/* <Link to={paths.home} className="orders-page__new-loan">
          New loan
        </Link> */}
      </div>

      {/* <header className="orders-page__intro">
        <p className="orders-page__eyebrow">Transaction history</p>
        <h1 className="orders-page__title">Loan history</h1>
      </header> */}

      <div className="orders-page__tabs" role="tablist" aria-label="Loan status">
        <motion.div
          className="orders-page__tab-indicator"
          initial={false}
          animate={{
            left: tab === 'pending' ? 4 : 'calc(50% + 2px)',
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
        <div className="orders-page__tabs-row">
          <button
            type="button"
            role="tab"
            id="tab-pending"
            aria-selected={tab === 'pending'}
            aria-controls="orders-panel"
            className={`orders-page__tab${tab === 'pending' ? ' orders-page__tab--active' : ''}`}
            onClick={() => setTab('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            role="tab"
            id="tab-completed"
            aria-selected={tab === 'completed'}
            aria-controls="orders-panel"
            className={`orders-page__tab${tab === 'completed' ? ' orders-page__tab--active' : ''}`}
            onClick={() => setTab('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <p className="orders-page__section-label">
        {tab === 'pending' ? 'Active obligations' : 'Past loans'}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          id="orders-panel"
          role="tabpanel"
          aria-labelledby={tab === 'pending' ? 'tab-pending' : 'tab-completed'}
          className="orders-page__panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {filtered.length === 0 ? (
            <p className="orders-page__empty">
              {list.length === 0
                ? tab === 'pending'
                  ? 'No pending loans. Apply from the home tab.'
                  : 'No completed loans yet.'
                : 'No matches for your search.'}
            </p>
          ) : (
            <ul className="orders-page__list">
              {filtered.map((o) => (
                <li key={o.id}>
                  <OrderLoanCard
                    order={o}
                    variant={tab === 'pending' ? 'pending' : 'completed'}
                    isDemo={useDemo}
                  />
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>

      <aside className="orders-page__note" role="note">
        <span className="orders-page__note-icon" aria-hidden>
          <FiInfo size={22} strokeWidth={2.25} />
        </span>
        <p className="orders-page__note-text">
          On time payment can increase your credit limit and unlock premium loan rates.
        </p>
      </aside>
    </div>
  )
}
