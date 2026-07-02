import { getPrisma } from './db'
import { sendRenewalDueEmail, sendDunningEmail, sendSubscriptionCanceledEmail } from './email'

const GRACE_DAYS = 7 // days past period end before the plan is downgraded
const REMINDER_INTERVAL_DAYS = 3 // spacing between dunning reminders

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000)

export interface RenewalRun {
  processed: number
  dueInvoices: number
  reminders: number
  canceled: number
}

/**
 * Invoice-based renewal + dunning. Idempotent to run often (e.g. hourly/daily):
 *   active + period ended        → past_due, send renewal invoice
 *   past_due + within grace      → send a reminder every few days
 *   past_due past grace          → downgrade to Free, send "ended" email
 *   cancelAtPeriodEnd + ended    → downgrade to Free, send "canceled" email
 * Payment (via normal checkout → markOrderPaid) resets the sub to active.
 */
export async function runRenewals(): Promise<RenewalRun> {
  const prisma = getPrisma()
  if (!prisma) return { processed: 0, dueInvoices: 0, reminders: 0, canceled: 0 }

  const now = new Date()
  const subs = await prisma.subscription
    .findMany({ where: { status: { in: ['active', 'past_due'] } } })
    .catch(() => [])

  let dueInvoices = 0, reminders = 0, canceled = 0

  const cancel = async (email: string, plan: string, reason: 'nonpayment' | 'requested') => {
    await prisma.subscription.update({ where: { email }, data: { status: 'canceled', cancelAtPeriodEnd: false } })
    await prisma.user.updateMany({ where: { email, plan }, data: { plan: 'Free' } }).catch(() => {})
    await sendSubscriptionCanceledEmail({ to: email, plan, reason }).catch(() => {})
    canceled++
  }

  for (const sub of subs) {
    const end = sub.currentPeriodEnd
    const graceEnd = addDays(end, GRACE_DAYS)

    // Scheduled cancellation at period end.
    if (sub.cancelAtPeriodEnd && end <= now) {
      await cancel(sub.email, sub.plan, 'requested')
      continue
    }

    // Active period just ended → become past due and send the renewal invoice.
    if (sub.status === 'active' && end <= now) {
      await prisma.subscription.update({ where: { email: sub.email }, data: { status: 'past_due', lastReminderAt: now } })
      await sendRenewalDueEmail({ to: sub.email, plan: sub.plan, cycle: sub.cycle, amount: sub.amount, currency: sub.currency, graceEnd }).catch(() => {})
      dueInvoices++
      continue
    }

    if (sub.status === 'past_due') {
      // Grace expired → downgrade.
      if (now >= graceEnd) {
        await cancel(sub.email, sub.plan, 'nonpayment')
        continue
      }
      // Otherwise nudge on the reminder cadence.
      const last = sub.lastReminderAt ?? end
      if (now.getTime() - last.getTime() >= REMINDER_INTERVAL_DAYS * 86_400_000) {
        await prisma.subscription.update({ where: { email: sub.email }, data: { lastReminderAt: now } })
        await sendDunningEmail({ to: sub.email, plan: sub.plan, amount: sub.amount, currency: sub.currency, graceEnd }).catch(() => {})
        reminders++
      }
    }
  }

  return { processed: subs.length, dueInvoices, reminders, canceled }
}
