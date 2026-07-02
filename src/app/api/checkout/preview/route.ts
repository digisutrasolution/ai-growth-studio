import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { previewPlanChange } from '@/lib/subscriptions'
import { amountMinor, type Currency, type Cycle } from '@/lib/payments'

export const runtime = 'nodejs'

type Body = { plan?: string; currency?: Currency; cycle?: Cycle }

/** Preview the proration for a plan change (credit for unused time). */
export async function POST(req: Request) {
  const { plan, currency = 'USD', cycle = 'monthly' } = (await req.json().catch(() => ({}))) as Body
  if (!plan) return NextResponse.json({ error: 'Missing plan.' }, { status: 400 })

  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) {
    const full = amountMinor(plan, currency, cycle)
    return NextResponse.json({ fullMinor: full, creditMinor: 0, dueMinor: full, currency, prorated: false })
  }
  return NextResponse.json(await previewPlanChange(session.email, plan, currency, cycle))
}
