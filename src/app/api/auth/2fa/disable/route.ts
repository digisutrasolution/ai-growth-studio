import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { isDbEnabled } from '@/lib/users'
import { disableTwoFactor } from '@/lib/twofactor'
import { rateLimit, clientIp, tooMany } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const runtime = 'nodejs'

/** Turn 2FA off after verifying a current code (or a backup code). */
export async function POST(req: Request) {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (!isDbEnabled()) return NextResponse.json({ error: 'Unavailable in demo mode.' }, { status: 400 })

  const rl = rateLimit(`2fa-disable:${session.email}`, 8, 5 * 60_000)
  if (!rl.ok) return tooMany(rl.retryAfter)

  const { code } = (await req.json().catch(() => ({}))) as { code?: string }
  if (!code) return NextResponse.json({ error: 'Enter a current code to confirm.' }, { status: 400 })

  const ok = await disableTwoFactor(session.email, code)
  if (!ok) return NextResponse.json({ error: 'That code is incorrect.' }, { status: 400 })

  await logAudit({ actor: session.email, action: 'auth.2fa_disabled', target: session.email, ip: clientIp(req) })
  return NextResponse.json({ ok: true })
}
