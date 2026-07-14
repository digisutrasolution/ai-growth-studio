import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { isDbEnabled, authenticate, setPassword } from '@/lib/users'
import { rateLimit, clientIp, tooMany } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const runtime = 'nodejs'

/** Change the signed-in user's password (requires the current password). */
export async function POST(req: Request) {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })

  const ip = clientIp(req)
  const rl = rateLimit(`change-pw:${session.email}`, 10, 15 * 60_000)
  if (!rl.ok) return tooMany(rl.retryAfter)

  const { currentPassword, newPassword } = (await req.json().catch(() => ({}))) as {
    currentPassword?: string; newPassword?: string
  }
  if (!currentPassword || !newPassword) return NextResponse.json({ error: 'Both passwords are required.' }, { status: 400 })
  if (newPassword.length < 8) return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
  if (newPassword === currentPassword) return NextResponse.json({ error: 'Choose a password different from your current one.' }, { status: 400 })
  if (!isDbEnabled()) return NextResponse.json({ error: 'Password change is unavailable in demo mode.' }, { status: 400 })

  // Verify the current password before changing it.
  const ok = await authenticate(session.email, currentPassword)
  if (!ok) return NextResponse.json({ error: 'Your current password is incorrect.' }, { status: 400 })

  const done = await setPassword(session.email, newPassword)
  if (!done) return NextResponse.json({ error: 'Could not update the password. Please try again.' }, { status: 500 })

  await logAudit({ actor: session.email, action: 'auth.password_change', target: session.email, ip })
  return NextResponse.json({ ok: true })
}
