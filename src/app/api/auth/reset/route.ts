import { NextResponse } from 'next/server'
import { readResetToken } from '@/lib/auth'
import { setPassword } from '@/lib/users'
import { rateLimit, clientIp, tooMany } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const runtime = 'nodejs'

/** Complete a password reset with a valid token + new password. */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const rl = rateLimit(`reset:${ip}`, 10, 15 * 60_000)
  if (!rl.ok) return tooMany(rl.retryAfter)

  const { token, password } = (await req.json().catch(() => ({}))) as { token?: string; password?: string }

  if (!token || !password) return NextResponse.json({ error: 'Missing token or password.' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

  const email = await readResetToken(token)
  if (!email) return NextResponse.json({ error: 'This reset link is invalid or has expired. Please request a new one.' }, { status: 400 })

  const ok = await setPassword(email, password)
  if (!ok) return NextResponse.json({ error: 'Could not reset the password. Please request a new link.' }, { status: 400 })

  await logAudit({ actor: email, action: 'auth.password_reset', target: email, ip })
  return NextResponse.json({ ok: true })
}
