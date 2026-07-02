import { getPrisma } from './db'
import { sendPlanActivatedEmail } from './email'
import { addPeriod } from './subscriptions'
import { amountMinor, type Currency, type Cycle } from './payments'

/** Store the gateway's order/link id on our order (best-effort). */
export async function recordOrderProvider(reference: string, provider: string) {
  await getPrisma()?.order.update({ where: { reference }, data: { provider } }).catch(() => {})
}

/**
 * Mark an order paid and activate the buyer's plan. Idempotent — safe to call
 * from both the return-verify path and a webhook.
 */
export async function markOrderPaid(reference: string): Promise<{ ok: boolean; plan?: string }> {
  const prisma = getPrisma()
  if (!prisma) return { ok: false }
  const order = await prisma.order.findUnique({ where: { reference } })
  if (!order) return { ok: false }
  if (order.status !== 'paid') {
    await prisma.order.update({ where: { reference }, data: { status: 'paid', paidAt: new Date() } })
    // Activate the plan on the buyer's account (if they have one).
    await prisma.user.updateMany({ where: { email: order.email }, data: { plan: order.plan } }).catch(() => {})

    // Start / renew the subscription. The recurring price is the *full* catalog
    // price (order.amount may be a one-time prorated charge), and the period is
    // reset to one cycle from now.
    const recurring = amountMinor(order.plan, order.currency as Currency, order.cycle as Cycle)
    const periodEnd = addPeriod(new Date(), order.cycle)
    await prisma.subscription.upsert({
      where: { email: order.email },
      update: {
        plan: order.plan, cycle: order.cycle, currency: order.currency, amount: recurring,
        status: 'active', currentPeriodEnd: periodEnd, cancelAtPeriodEnd: false, lastReminderAt: null,
      },
      create: {
        email: order.email, plan: order.plan, cycle: order.cycle, currency: order.currency,
        amount: recurring, status: 'active', currentPeriodEnd: periodEnd,
      },
    }).catch(() => {})

    // Confirmation email (best-effort — no-op when SMTP isn't configured). Fires
    // once, only on the pending → paid transition.
    await sendPlanActivatedEmail({
      to: order.email,
      plan: order.plan,
      cycle: order.cycle,
      reference: order.reference,
      amount: order.amount,
      currency: order.currency,
      method: order.method,
    }).catch(() => {})
  }
  return { ok: true, plan: order.plan }
}

export async function getUserPlan(email: string): Promise<string | null> {
  const prisma = getPrisma()
  if (!prisma) return null
  const user = await prisma.user.findUnique({ where: { email }, select: { plan: true } }).catch(() => null)
  return user?.plan ?? null
}

export interface OrderDetail {
  reference: string
  email: string
  plan: string
  cycle: string
  currency: string
  amount: number
  method: string
  status: string
  paidAt: string | null
  createdAt: string
}

/** Full order for a receipt. Returns null when absent or the DB is off. */
export async function getOrder(reference: string): Promise<OrderDetail | null> {
  const prisma = getPrisma()
  if (!prisma) return null
  const o = await prisma.order.findUnique({ where: { reference } }).catch(() => null)
  if (!o) return null
  return {
    reference: o.reference,
    email: o.email,
    plan: o.plan,
    cycle: o.cycle,
    currency: o.currency,
    amount: o.amount,
    method: o.method,
    status: o.status,
    paidAt: o.paidAt ? o.paidAt.toISOString() : null,
    createdAt: o.createdAt.toISOString(),
  }
}

export interface OrderRow {
  reference: string
  plan: string
  cycle: string
  currency: string
  amount: number
  method: string
  status: string
  createdAt: string
}

export async function getUserOrders(email: string): Promise<OrderRow[]> {
  const prisma = getPrisma()
  if (!prisma) return []
  const orders = await prisma.order
    .findMany({ where: { email }, orderBy: { createdAt: 'desc' }, take: 25 })
    .catch(() => [])
  return orders.map((o) => ({
    reference: o.reference,
    plan: o.plan,
    cycle: o.cycle,
    currency: o.currency,
    amount: o.amount,
    method: o.method,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }))
}
