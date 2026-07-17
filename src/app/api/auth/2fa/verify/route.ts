import { NextResponse } from 'next/server'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSession, readTwoFactorTicket, nameFromEmail } from '@/lib/auth'
import { getPublicUser } from '@/lib/users'
import { verifyTwoFactor } from '@/lib/twofactor'
import { rateLimit, clientIp, tooMany } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const runtime = 'nodejs'

/** Second login step: verify the TOTP/backup code and issue the session. */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const { ticket, code } = (await req.json().catch(() => ({}))) as { ticket?: string; code?: string }

  const email = await readTwoFactorTicket(ticket)
  if (!email) return NextResponse.json({ error: 'Your sign-in session expired. Please sign in again.' }, { status: 401 })

  // Throttle code attempts per account.
  const rl = rateLimit(`2fa:${email}`, 8, 5 * 60_000)
  if (!rl.ok) return tooMany(rl.retryAfter)

  if (!code) return NextResponse.json({ error: 'Enter your 6-digit code.' }, { status: 400 })

  const ok = await verifyTwoFactor(email, code)
  if (!ok) return NextResponse.json({ error: 'Invalid or expired code. Try again, or use a backup code.' }, { status: 401 })

  const user = (await getPublicUser(email)) ?? { email, name: nameFromEmail(email) }
  const token = await createSession(user)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  await logAudit({ actor: email, action: 'auth.2fa_login', target: email, ip })
  return res
}
