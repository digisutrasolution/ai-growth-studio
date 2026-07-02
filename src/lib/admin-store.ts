import { Prisma } from '@prisma/client'
import { getPrisma } from './db'

/** Comma-separated allowlist of admin emails, e.g. ADMIN_EMAILS="a@x.com,b@y.com". */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return adminEmails().includes(email.toLowerCase())
}

export interface AdminOrder {
  reference: string
  email: string
  plan: string
  cycle: string
  currency: string
  amount: number
  method: string
  status: string
  createdAt: string
  paidAt: string | null
}

export interface OrderFilter {
  from?: string
  to?: string
  status?: string
  limit?: number
}

/** Build a Prisma where-clause from date-range + status filters. */
function orderWhere(f: OrderFilter): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {}
  if (f.status) where.status = f.status
  if (f.from || f.to) {
    const createdAt: Prisma.DateTimeFilter = {}
    if (f.from) createdAt.gte = new Date(f.from)
    if (f.to) {
      const end = new Date(f.to)
      end.setHours(23, 59, 59, 999) // inclusive end-of-day
      createdAt.lte = end
    }
    where.createdAt = createdAt
  }
  return where
}

export async function getAdminOrders(f: OrderFilter = {}): Promise<AdminOrder[]> {
  const prisma = getPrisma()
  if (!prisma) return []
  const orders = await prisma.order
    .findMany({ where: orderWhere(f), orderBy: { createdAt: 'desc' }, take: f.limit ?? 200 })
    .catch(() => [])
  return orders.map((o) => ({
    reference: o.reference,
    email: o.email,
    plan: o.plan,
    cycle: o.cycle,
    currency: o.currency,
    amount: o.amount,
    method: o.method,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    paidAt: o.paidAt ? o.paidAt.toISOString() : null,
  }))
}

export interface AdminUser {
  email: string
  name: string
  plan: string
  createdAt: string
  orders: number
  paid: number
  subStatus: string | null // active | past_due | canceled | null
  renewsAt: string | null // ISO — subscription currentPeriodEnd
  cancelAtPeriodEnd: boolean
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const prisma = getPrisma()
  if (!prisma) return []
  const [users, orders, subs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.order.findMany({ select: { email: true, status: true } }).catch(() => []),
    prisma.subscription.findMany().catch(() => []),
  ])
  const counts = new Map<string, { orders: number; paid: number }>()
  for (const o of orders) {
    const key = o.email.toLowerCase()
    const c = counts.get(key) ?? { orders: 0, paid: 0 }
    c.orders += 1
    if (o.status === 'paid') c.paid += 1
    counts.set(key, c)
  }
  const subByEmail = new Map(subs.map((s) => [s.email.toLowerCase(), s]))
  return users.map((u) => {
    const sub = subByEmail.get(u.email.toLowerCase())
    return {
      email: u.email,
      name: u.name,
      plan: u.plan,
      createdAt: u.createdAt.toISOString(),
      orders: counts.get(u.email.toLowerCase())?.orders ?? 0,
      paid: counts.get(u.email.toLowerCase())?.paid ?? 0,
      subStatus: sub?.status ?? null,
      renewsAt: sub ? sub.currentPeriodEnd.toISOString() : null,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
    }
  })
}

export interface AdminSummary {
  users: number
  orders: number
  paidOrders: number
  revenue: { currency: string; amount: number }[] // minor units, paid only
  activeSubs: number
  pastDue: number
}

export async function getAdminSummary(): Promise<AdminSummary> {
  const prisma = getPrisma()
  if (!prisma) return { users: 0, orders: 0, paidOrders: 0, revenue: [], activeSubs: 0, pastDue: 0 }
  const [users, orders, paidOrders, revenue, activeSubs, pastDue] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.order.count().catch(() => 0),
    prisma.order.count({ where: { status: 'paid' } }).catch(() => 0),
    prisma.order
      .groupBy({ by: ['currency'], where: { status: 'paid' }, _sum: { amount: true } })
      .catch(() => [] as { currency: string; _sum: { amount: number | null } }[]),
    prisma.subscription.count({ where: { status: 'active' } }).catch(() => 0),
    prisma.subscription.count({ where: { status: 'past_due' } }).catch(() => 0),
  ])
  return {
    users,
    orders,
    paidOrders,
    revenue: revenue.map((r) => ({ currency: r.currency, amount: r._sum.amount ?? 0 })),
    activeSubs,
    pastDue,
  }
}

/** Set an order's status directly (admin override, e.g. mark a bank transfer failed). */
export async function adminSetOrderStatus(reference: string, status: string): Promise<{ ok: boolean }> {
  const prisma = getPrisma()
  if (!prisma) return { ok: false }
  const o = await prisma.order.update({ where: { reference }, data: { status } }).catch(() => null)
  return { ok: Boolean(o) }
}

/**
 * Refund an order: mark it refunded and revoke the plan on the buyer's account
 * (only if that plan is still their current one — avoids downgrading after a
 * later upgrade).
 */
export async function adminRefundOrder(reference: string): Promise<{ ok: boolean }> {
  const prisma = getPrisma()
  if (!prisma) return { ok: false }
  const order = await prisma.order.findUnique({ where: { reference } }).catch(() => null)
  if (!order) return { ok: false }
  await prisma.order.update({ where: { reference }, data: { status: 'refunded' } })
  await prisma.user
    .updateMany({ where: { email: order.email, plan: order.plan }, data: { plan: 'Free' } })
    .catch(() => {})
  return { ok: true }
}
