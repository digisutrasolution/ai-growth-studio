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

export async function getAdminOrders(limit = 200): Promise<AdminOrder[]> {
  const prisma = getPrisma()
  if (!prisma) return []
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: limit }).catch(() => [])
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
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const prisma = getPrisma()
  if (!prisma) return []
  const [users, orders] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.order.findMany({ select: { email: true, status: true } }).catch(() => []),
  ])
  const counts = new Map<string, { orders: number; paid: number }>()
  for (const o of orders) {
    const key = o.email.toLowerCase()
    const c = counts.get(key) ?? { orders: 0, paid: 0 }
    c.orders += 1
    if (o.status === 'paid') c.paid += 1
    counts.set(key, c)
  }
  return users.map((u) => ({
    email: u.email,
    name: u.name,
    plan: u.plan,
    createdAt: u.createdAt.toISOString(),
    orders: counts.get(u.email.toLowerCase())?.orders ?? 0,
    paid: counts.get(u.email.toLowerCase())?.paid ?? 0,
  }))
}

export interface AdminSummary {
  users: number
  orders: number
  paidOrders: number
  revenue: { currency: string; amount: number }[] // minor units, paid only
}

export async function getAdminSummary(): Promise<AdminSummary> {
  const prisma = getPrisma()
  if (!prisma) return { users: 0, orders: 0, paidOrders: 0, revenue: [] }
  const [users, orders, paidOrders, revenue] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.order.count().catch(() => 0),
    prisma.order.count({ where: { status: 'paid' } }).catch(() => 0),
    prisma.order
      .groupBy({ by: ['currency'], where: { status: 'paid' }, _sum: { amount: true } })
      .catch(() => [] as { currency: string; _sum: { amount: number | null } }[]),
  ])
  return {
    users,
    orders,
    paidOrders,
    revenue: revenue.map((r) => ({ currency: r.currency, amount: r._sum.amount ?? 0 })),
  }
}
