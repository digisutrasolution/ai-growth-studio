import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import { SESSION_COOKIE, readSession, createResetToken } from '@/lib/auth'
import { isAdmin } from '@/lib/admin-store'
import { isDbEnabled, userExists, setPassword } from '@/lib/users'
import { sendPasswordResetEmail, isEmailEnabled } from '@/lib/email'
import { appUrl } from '@/lib/payments'

export const runtime = 'nodejs'

type Action = 'send_reset_link' | 'set_temp_password'
type Body = { email?: string; action?: Action }

function genTempPassword() {
  return 'Tmp-' + crypto.randomBytes(9).toString('base64url').slice(0, 10)
}

/** Admin-only account actions: help a locked-out customer reset their password. */
export async function POST(req: Request) {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (!isAdmin(session.email)) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })

  const { email, action } = (await req.json().catch(() => ({}))) as Body
  if (!email || !action) return NextResponse.json({ error: 'Missing email or action.' }, { status: 400 })
  if (!isDbEnabled()) return NextResponse.json({ error: 'Unavailable in demo mode.' }, { status: 400 })
  if (!(await userExists(email))) return NextResponse.json({ error: 'No such account.' }, { status: 404 })

  if (action === 'send_reset_link') {
    const token = await createResetToken(email)
    const url = `${appUrl}/reset?token=${encodeURIComponent(token)}`
    await sendPasswordResetEmail({ to: email, url }).catch(() => {})
    return NextResponse.json({ ok: true, emailed: isEmailEnabled() })
  }

  if (action === 'set_temp_password') {
    const tempPassword = genTempPassword()
    const done = await setPassword(email, tempPassword)
    if (!done) return NextResponse.json({ error: 'Could not set a temporary password.' }, { status: 500 })
    return NextResponse.json({ ok: true, tempPassword })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
