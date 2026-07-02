import { getPrisma } from './db'
import { amountMinor, type Currency, type Cycle } from './payments'

/** Advance a date by one billing cycle (calendar month / year). */
export function addPeriod(from: Date, cycle: string): Date {
  const d = new Date(from)
  if (cycle === 'yearly') d.setFullYear(d.getFullYear() + 1)
  else d.setMonth(d.getMonth() + 1)
  return d
}

/** Go back one billing cycle — used to estimate the current period's start. */
function subPeriod(from: Date, cycle: string): Date {
  const d = new Date(from)
  if (cycle === 'yearly') d.setFullYear(d.getFullYear() - 1)
  else d.setMonth(d.getMonth() - 1)
  return d
}

export interface SubRow {
  plan: string
  cycle: string
  currency: string
  amount: number // recurring price, minor units
  status: string // active | past_due | canceled
  currentPeriodEnd: string // ISO
  cancelAtPeriodEnd: boolean
}

function serialize(s: {
  plan: string; cycle: string; currency: string; amount: number; status: string
  currentPeriodEnd: Date; cancelAtPeriodEnd: boolean
}): SubRow {
  return {
    plan: s.plan, cycle: s.cycle, currency: s.currency, amount: s.amount, status: s.status,
    currentPeriodEnd: s.currentPeriodEnd.toISOString(), cancelAtPeriodEnd: s.cancelAtPeriodEnd,
  }
}

export async function getSubscription(email: string): Promise<SubRow | null> {
  const prisma = getPrisma()
  if (!prisma) return null
  const s = await prisma.subscription.findUnique({ where: { email } }).catch(() => null)
  return s ? serialize(s) : null
}

export interface ProrationPreview {
  fullMinor: number // full price of the target plan
  creditMinor: number // credit for unused time on the current plan
  dueMinor: number // charged today (full − credit, floored at 0)
  currency: Currency
  prorated: boolean
}

/**
 * Preview a plan change. When the buyer already has an active subscription in
 * the same currency, credit the unused portion of the current period against the
 * new plan's price. Cross-currency changes aren't prorated.
 */
export async function previewPlanChange(
  email: string, plan: string, currency: Currency, cycle: Cycle,
): Promise<ProrationPreview> {
  const fullMinor = amountMinor(plan, currency, cycle)
  const prisma = getPrisma()
  if (!prisma) return { fullMinor, creditMinor: 0, dueMinor: fullMinor, currency, prorated: false }

  const sub = await prisma.subscription.findUnique({ where: { email } }).catch(() => null)
  const noCredit = { fullMinor, creditMinor: 0, dueMinor: fullMinor, currency, prorated: false }
  if (!sub || sub.status === 'canceled' || sub.currency !== currency) return noCredit
  // Same plan + cycle → it's a renewal, not a change: charge full to extend.
  if (sub.plan === plan && sub.cycle === cycle) return noCredit

  const now = Date.now()
  const end = sub.currentPeriodEnd.getTime()
  const start = subPeriod(sub.currentPeriodEnd, sub.cycle).getTime()
  const total = end - start
  const remaining = end - now
  const fraction = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0
  const creditMinor = Math.round(sub.amount * fraction)
  const dueMinor = Math.max(0, fullMinor - creditMinor)
  return { fullMinor, creditMinor, dueMinor, currency, prorated: creditMinor > 0 }
}

export async function setCancelAtPeriodEnd(email: string, cancel: boolean): Promise<{ ok: boolean }> {
  const prisma = getPrisma()
  if (!prisma) return { ok: false }
  const r = await prisma.subscription
    .updateMany({ where: { email, status: { not: 'canceled' } }, data: { cancelAtPeriodEnd: cancel } })
    .catch(() => ({ count: 0 }))
  return { ok: r.count > 0 }
}
