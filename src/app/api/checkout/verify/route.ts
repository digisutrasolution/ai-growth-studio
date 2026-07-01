import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/db'
import { markOrderPaid } from '@/lib/billing-store'

export const runtime = 'nodejs'

type Body = { reference?: string }

/**
 * Called from the billing page when the buyer returns from a gateway
 * (?status=success&ref=...). Confirms payment with the gateway and, when
 * settled, marks the order paid + activates the plan. Idempotent.
 */
export async function POST(req: Request) {
  const { reference } = (await req.json().catch(() => ({}))) as Body
  if (!reference) return NextResponse.json({ status: 'error', error: 'Missing reference.' }, { status: 400 })

  const prisma = getPrisma()
  if (!prisma) return NextResponse.json({ status: 'pending', message: 'Database not enabled.' })

  const order = await prisma.order.findUnique({ where: { reference } }).catch(() => null)
  if (!order) return NextResponse.json({ status: 'error', error: 'Order not found.' }, { status: 404 })

  // Already settled — nothing to do.
  if (order.status === 'paid') return NextResponse.json({ status: 'paid', plan: order.plan })

  try {
    if (order.method === 'paypal') {
      const base = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
      const tokRes = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=client_credentials',
      })
      const tok = await tokRes.json()
      if (!order.provider) return NextResponse.json({ status: 'pending' })
      // Capture the approved order (idempotent on PayPal's side once captured).
      const capRes = await fetch(`${base}/v2/checkout/orders/${order.provider}/capture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' },
      })
      const cap = await capRes.json().catch(() => ({}))
      const done = cap.status === 'COMPLETED' || cap.status === 'APPROVED'
      // If already captured, PayPal returns 422 ORDER_ALREADY_CAPTURED — treat as paid.
      const alreadyCaptured = cap?.details?.some?.((d: { issue?: string }) => d.issue === 'ORDER_ALREADY_CAPTURED')
      if (done || alreadyCaptured) {
        await markOrderPaid(reference)
        return NextResponse.json({ status: 'paid', plan: order.plan })
      }
      return NextResponse.json({ status: 'pending' })
    }

    if (order.method === 'cashfree') {
      const base = process.env.CASHFREE_ENV === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg'
      const res = await fetch(`${base}/links/${reference}`, {
        headers: {
          'x-client-id': process.env.CASHFREE_APP_ID!,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
          'x-api-version': '2023-08-01',
        },
      })
      const data = await res.json().catch(() => ({}))
      if (data.link_status === 'PAID') {
        await markOrderPaid(reference)
        return NextResponse.json({ status: 'paid', plan: order.plan })
      }
      return NextResponse.json({ status: 'pending' })
    }

    // Crypto settles asynchronously — confirmation arrives via the NOWPayments IPN webhook.
    return NextResponse.json({ status: 'pending', message: 'Awaiting confirmation.' })
  } catch (err) {
    console.error('[verify] failed:', err)
    return NextResponse.json({ status: 'pending', error: 'Verification failed. We will confirm shortly.' })
  }
}
