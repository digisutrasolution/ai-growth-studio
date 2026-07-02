import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { setCancelAtPeriodEnd, getSubscription } from '@/lib/subscriptions'

export const runtime = 'nodejs'

type Body = { action?: 'cancel' | 'resume' }

/** Toggle auto-renew (cancel at period end / resume) for the signed-in user. */
export async function POST(req: Request) {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })

  const { action } = (await req.json().catch(() => ({}))) as Body
  if (action !== 'cancel' && action !== 'resume') {
    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
  }

  const r = await setCancelAtPeriodEnd(session.email, action === 'cancel')
  if (!r.ok) return NextResponse.json({ error: 'No active subscription.' }, { status: 404 })
  return NextResponse.json({ ok: true, subscription: await getSubscription(session.email) })
}
