import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { FiCalendar, FiChevronDown } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import type { EnrichedLoanOrder } from '@/lib/orderDisplay'
import {
  formatDueDate,
  formatDueDateDesktop,
  formatLoanDate,
  formatLoanDateDesktop,
  referenceDesktopLabel,
} from '@/lib/orderDisplay'
import { paths } from '@/routes/paths'

type OrderLoanCardProps = {
  order: EnrichedLoanOrder
  variant: 'pending' | 'completed'
  isDemo: boolean
}

const URGENT_MS = 4 * 24 * 60 * 60 * 1000

export function OrderLoanCard({ order, variant, isDemo }: OrderLoanCardProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => setOpen((v) => !v), [])

  const onPay = useCallback(() => {
    navigate(paths.payment, {
      state: {
        orderId: order.id,
        demo: isDemo || order.id.startsWith('demo-'),
        loan: {
          id: order.id,
          loanName: order.loanName,
          totalToPay: order.totalToPay,
          referenceId: order.referenceId,
          loanAmountDisplay: order.loanAmountDisplay,
          imageUrl: order.imageUrl,
          dueDateMs: order.dueDateMs,
          createdAt: order.createdAt,
        },
      },
    })
  }, [isDemo, navigate, order])

  const isPending = variant === 'pending'

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const dueUrgent =
    isPending &&
    order.dueDateMs - now < URGENT_MS &&
    order.dueDateMs > now

  return (
    <article className={`order-card${isPending ? ' order-card--pending' : ''}`}>
      <div className="order-card__head">
        <div className="order-card__identity">
          <div className="order-card__thumb">
            <img src={order.imageUrl} alt="" loading="lazy" decoding="async" />
          </div>
          <div className="order-card__titles">
            <h3 className="order-card__name">{order.loanName}</h3>
            <p className="order-card__ref">
              <span className="order-card__ref-m">{order.referenceId}</span>
              <span className="order-card__ref-d">
                {referenceDesktopLabel(order.referenceId)}
              </span>
            </p>
          </div>
        </div>
        <div className="order-card__total-due order-card__total-due--desktop">
          <span className="order-card__total-label">TOTAL DUE</span>
          <span className="order-card__total-value">{order.totalToPay}</span>
        </div>
      </div>

      <div className="order-card__amount-block order-card__amount-block--mobile">
        <p className="order-card__amt-label">Total amount to pay</p>
        <div className="order-card__amt-row">
          <span className="order-card__amt-value">{order.totalToPay}</span>
          <span
            className={`order-card__due${dueUrgent ? ' order-card__due--urgent' : ''}`}
          >
            Due {formatDueDate(order.dueDateMs)}
          </span>
        </div>
      </div>

      <div className="order-card__mid order-card__mid--desktop">
        <span
          className={`order-card__due-inline${isPending ? ' order-card__due-inline--pending' : ''}`}
        >
          <FiCalendar size={16} strokeWidth={2} aria-hidden />
          Due {formatDueDateDesktop(order.dueDateMs)}
        </span>
        <div className="order-card__mid-actions">
          <button
            type="button"
            className="order-card__linkish"
            onClick={toggle}
            aria-expanded={open}
          >
            <span className="order-card__view-m">View details</span>
            <span className="order-card__view-d">View Details</span>
            <FiChevronDown
              size={16}
              className={`order-card__chev${open ? ' order-card__chev--open' : ''}`}
              aria-hidden
            />
          </button>
          {isPending ? (
            <button
              type="button"
              className="order-card__cta order-card__cta--pay order-card__cta--compact"
              onClick={onPay}
            >
              Pay now
            </button>
          ) : (
            <span className="order-card__cta order-card__cta--paid order-card__cta--compact">
              Paid
            </span>
          )}
        </div>
      </div>

      {isPending ? (
        <button
          type="button"
          className="order-card__cta order-card__cta--pay order-card__cta--mobile"
          onClick={onPay}
        >
          Pay now
        </button>
      ) : (
        <div className="order-card__cta order-card__cta--paid order-card__cta--mobile" role="status">
          Paid
        </div>
      )}

      <div className="order-card__expand-wrap">
        <button
          type="button"
          className="order-card__expand-trigger order-card__expand-trigger--mobile"
          onClick={toggle}
          aria-expanded={open}
        >
          <span>View details</span>
          <FiChevronDown
            size={18}
            className={`order-card__chev${open ? ' order-card__chev--open' : ''}`}
            aria-hidden
          />
        </button>
        <motion.div
          className="order-card__expand-panel"
          initial={false}
          animate={{
            maxHeight: open ? 240 : 0,
            opacity: open ? 1 : 0,
          }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div className="order-card__expand-inner">
            <dl className="order-card__details">
              <div className="order-card__detail-pair">
                <dt>Loan amount</dt>
                <dd>{order.loanAmountDisplay}</dd>
              </div>
              <div className="order-card__detail-pair">
                <dt>Loan date</dt>
                <dd>
                  <span className="order-card__loan-date-m">
                    {formatLoanDate(order.createdAt)}
                  </span>
                  <span className="order-card__loan-date-d">
                    {formatLoanDateDesktop(order.createdAt)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
