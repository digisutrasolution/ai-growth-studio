import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { isDbEnabled } from '@/lib/users'
import { enableTwoFactor } from '@/lib/twofactor'
import { clientIp } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const runtime = 'nodejs'

/** Confirm the staged secret with a code, enable 2FA, return one-time backup codes. */
export async function POST(req: Request) {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (!isDbEnabled()) return NextResponse.json({ error: 'Unavailable in demo mode.' }, { status: 400 })

  const { code } = (await req.json().catch(() => ({}))) as { code?: string }
  if (!code) return NextResponse.json({ error: 'Enter the 6-digit code from your app.' }, { status: 400 })

  const r = await enableTwoFactor(session.email, code)
  if (!r.ok) return NextResponse.json({ error: 'That code is incorrect. Make sure your device time is correct and try again.' }, { status: 400 })

  await logAudit({ actor: session.email, action: 'auth.2fa_enabled', target: session.email, ip: clientIp(req) })
  return NextResponse.json({ ok: true, backupCodes: r.backupCodes })
}
