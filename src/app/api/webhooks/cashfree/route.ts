import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { markOrderPaid } from '@/lib/billing-store'

export const runtime = 'nodejs'

/**
 * Cashfree Payment Link webhook. Verifies the signature (when a secret is set)
 * and marks the matching order paid when the link is settled.
 * Signature: base64( HMAC-SHA256( timestamp + rawBody, secretKey ) ).
 */
export async function POST(req: Request) {
  const raw = await req.text()
  const signature = req.headers.get('x-webhook-signature')
  const timestamp = req.headers.get('x-webhook-timestamp')
  const secret = process.env.CASHFREE_SECRET_KEY

  if (secret && signature && timestamp) {
    const expected = crypto.createHmac('sha256', secret).update(timestamp + raw).digest('base64')
    if (expected !== signature) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
    }
  }

  let body: Record<string, unknown> = {}
  try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'Bad payload.' }, { status: 400 }) }

  const data = (body.data ?? {}) as Record<string, unknown>
  const link = (data.link ?? data) as Record<string, unknown>
  const linkId = (link.link_id ?? data.link_id) as string | undefined
  const status = (link.link_status ?? data.link_status) as string | undefined

  if (linkId && status === 'PAID') {
    await markOrderPaid(linkId)
  }

  // Always 200 so Cashfree stops retrying once received.
  return NextResponse.json({ ok: true })
}
