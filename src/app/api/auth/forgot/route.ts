import { NextResponse } from 'next/server'
import { createResetToken } from '@/lib/auth'
import { isDbEnabled, userExists } from '@/lib/users'
import { sendPasswordResetEmail } from '@/lib/email'
import { appUrl } from '@/lib/payments'

export const runtime = 'nodejs'

/**
 * Start a password reset. Always responds the same way regardless of whether
 * the account exists (no user enumeration). Emails a signed, 30-min link.
 */
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string }
  const generic = NextResponse.json({ ok: true, message: 'If an account exists for that email, a reset link is on its way.' })

  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  if (!isDbEnabled()) return generic // demo mode has no user store

  if (await userExists(email)) {
    const token = await createResetToken(email)
    const url = `${appUrl}/reset?token=${encodeURIComponent(token)}`
    await sendPasswordResetEmail({ to: email, url }).catch(() => {})
  }
  return generic
}
