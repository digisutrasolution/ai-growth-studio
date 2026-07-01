import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { markOrderPaid } from '@/lib/billing-store'

export const runtime = 'nodejs'

/** Recursively sort object keys — NOWPayments signs the key-sorted JSON. */
function sortObject(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObject)
  if (obj && typeof obj === 'object') {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce((acc: Record<string, unknown>, key) => {
        acc[key] = sortObject((obj as Record<string, unknown>)[key])
        return acc
      }, {})
  }
  return obj
}

/**
 * NOWPayments IPN webhook. Verifies the HMAC-SHA512 signature (when the IPN
 * secret is set) and marks the order paid once the crypto payment settles.
 */
export async function POST(req: Request) {
  const raw = await req.text()
  const signature = req.headers.get('x-nowpayments-sig')
  const secret = process.env.NOWPAYMENTS_IPN_SECRET

  let body: Record<string, unknown> = {}
  try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'Bad payload.' }, { status: 400 }) }

  if (secret && signature) {
    const expected = crypto.createHmac('sha512', secret).update(JSON.stringify(sortObject(body))).digest('hex')
    if (expected !== signature) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
    }
  }

  const reference = body.order_id as string | undefined
  const status = body.payment_status as string | undefined

  // NOWPayments statuses: waiting → confirming → confirmed → sending → finished.
  if (reference && (status === 'finished' || status === 'confirmed')) {
    await markOrderPaid(reference)
  }

  return NextResponse.json({ ok: true })
}
