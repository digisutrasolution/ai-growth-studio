import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { getPrisma } from '@/lib/db'
import { recordOrderProvider } from '@/lib/billing-store'
import {
  type Currency, type Cycle, type MethodId,
  isMethodConfigured, planPrice, amountMinor, bankAccounts, newReference, appUrl,
} from '@/lib/payments'

export const runtime = 'nodejs'

type Body = { plan?: string; currency?: Currency; cycle?: Cycle; method?: MethodId }

export async function POST(req: Request) {
  const { plan, currency = 'USD', cycle = 'monthly', method } = (await req.json().catch(() => ({}))) as Body
  if (!plan || !method) return NextResponse.json({ error: 'Missing plan or method.' }, { status: 400 })

  const major = planPrice(plan, currency, cycle)
  if (major <= 0) {
    return NextResponse.json({ type: 'contact', message: 'Contact sales to set up the Enterprise plan.' })
  }

  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  const email = session?.email ?? 'guest@digisutra.solutions'
  const reference = newReference()

  // Record the order when a database is configured (pending until paid).
  await getPrisma()?.order.create({
    data: { reference, email, plan, cycle, currency, amount: amountMinor(plan, currency, cycle), method, status: 'pending' },
  }).catch(() => {})

  try {
    // Bank transfer — no gateway, always available.
    if (method === 'bank_transfer') {
      return NextResponse.json({ type: 'bank', reference, currency, amount: major, accounts: bankAccounts(currency) })
    }

    // Gateway not configured → demo response (wire keys to enable).
    if (!isMethodConfigured(method)) {
      return NextResponse.json({ type: 'demo', method, reference, message: `${method} is not configured yet. Add its keys to .env to enable live checkout.` })
    }

    const ret = `${appUrl}/dashboard/billing?status=success&ref=${reference}`
    const cancel = `${appUrl}/dashboard/billing?status=cancelled&ref=${reference}`

    if (method === 'paypal') {
      const base = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
      const tokRes = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=client_credentials',
      })
      const tok = await tokRes.json()
      const orderRes = await fetch(`${base}/v2/checkout/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{ amount: { currency_code: 'USD', value: major.toFixed(2) }, custom_id: reference, description: `AI Growth Studio — ${plan} (${cycle})` }],
          application_context: { return_url: ret, cancel_url: cancel, brand_name: 'DigiSutra', user_action: 'PAY_NOW' },
        }),
      })
      const order = await orderRes.json()
      const approve = order.links?.find((l: { rel: string; href: string }) => l.rel === 'approve')?.href
      if (!approve) return NextResponse.json({ error: 'PayPal order failed', detail: order }, { status: 502 })
      if (order.id) await recordOrderProvider(reference, order.id)
      return NextResponse.json({ type: 'redirect', url: approve, reference })
    }

    if (method === 'cashfree') {
      const base = process.env.CASHFREE_ENV === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg'
      const res = await fetch(`${base}/links`, {
        method: 'POST',
        headers: {
          'x-client-id': process.env.CASHFREE_APP_ID!,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
          'x-api-version': '2023-08-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link_id: reference,
          link_amount: major,
          link_currency: 'INR',
          link_purpose: `AI Growth Studio — ${plan} (${cycle})`,
          customer_details: { customer_email: email, customer_phone: process.env.CASHFREE_TEST_PHONE || '9999999999' },
          link_notify: { send_email: false, send_sms: false },
          link_meta: { return_url: ret },
        }),
      })
      const data = await res.json()
      if (!data.link_url) return NextResponse.json({ error: 'Cashfree link failed', detail: data }, { status: 502 })
      return NextResponse.json({ type: 'redirect', url: data.link_url, reference })
    }

    if (method === 'crypto') {
      const res = await fetch('https://api.nowpayments.io/v1/invoice', {
        method: 'POST',
        headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY!, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_amount: major,
          price_currency: 'usd',
          order_id: reference,
          order_description: `AI Growth Studio — ${plan} (${cycle})`,
          success_url: ret,
          cancel_url: cancel,
        }),
      })
      const data = await res.json()
      if (!data.invoice_url) return NextResponse.json({ error: 'Crypto invoice failed', detail: data }, { status: 502 })
      if (data.id) await recordOrderProvider(reference, String(data.id))
      return NextResponse.json({ type: 'redirect', url: data.invoice_url, reference })
    }

    return NextResponse.json({ error: 'Unknown method.' }, { status: 400 })
  } catch (err) {
    console.error('[checkout] failed:', err)
    return NextResponse.json({ error: 'Checkout failed. Please try another method.' }, { status: 500 })
  }
}
