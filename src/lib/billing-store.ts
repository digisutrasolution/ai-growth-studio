import { getPrisma } from './db'

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
  }
  return { ok: true, plan: order.plan }
}

export async function getUserPlan(email: string): Promise<string | null> {
  const prisma = getPrisma()
  if (!prisma) return null
  const user = await prisma.user.findUnique({ where: { email }, select: { plan: true } }).catch(() => null)
  return user?.plan ?? null
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
