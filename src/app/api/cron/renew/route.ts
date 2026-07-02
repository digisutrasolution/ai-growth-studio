import { NextResponse } from 'next/server'
import { runRenewals } from '@/lib/renewals'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Renewal + dunning tick. Protect with CRON_SECRET and call on a schedule
 * (e.g. n8n / system cron, daily):
 *   curl -H "x-cron-secret: $CRON_SECRET" https://digisutra.solutions/api/cron/renew
 * Also accepts ?key=SECRET for schedulers that can't set headers.
 */
async function handle(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'CRON_SECRET not configured.' }, { status: 503 })

  const url = new URL(req.url)
  const provided = req.headers.get('x-cron-secret') || url.searchParams.get('key')
  if (provided !== secret) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const result = await runRenewals()
  return NextResponse.json({ ok: true, ...result })
}

export const GET = handle
export const POST = handle
