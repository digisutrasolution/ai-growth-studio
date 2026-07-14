import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { isAdmin, adminSetOrderStatus, adminRefundOrder } from '@/lib/admin-store'
import { markOrderPaid } from '@/lib/billing-store'
import { clientIp } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const runtime = 'nodejs'

type Action = 'mark_paid' | 'mark_failed' | 'refund'
type Body = { reference?: string; action?: Action }

/** Admin-only order actions: confirm a manual payment, void it, or refund it. */
export async function POST(req: Request) {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (!isAdmin(session.email)) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })

  const { reference, action } = (await req.json().catch(() => ({}))) as Body
  if (!reference || !action) return NextResponse.json({ error: 'Missing reference or action.' }, { status: 400 })

  const ip = clientIp(req)

  if (action === 'mark_paid') {
    // Reuses the normal paid path — activates the plan and emails the buyer.
    const r = await markOrderPaid(reference)
    await logAudit({ actor: session.email, action: 'order.mark_paid', target: reference, ip })
    return NextResponse.json({ ok: r.ok, plan: r.plan })
  }
  if (action === 'mark_failed') {
    const r = await adminSetOrderStatus(reference, 'failed')
    await logAudit({ actor: session.email, action: 'order.mark_failed', target: reference, ip })
    return NextResponse.json(r)
  }
  if (action === 'refund') {
    const r = await adminRefundOrder(reference)
    await logAudit({ actor: session.email, action: 'order.refund', target: reference, ip })
    return NextResponse.json(r)
  }
  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
