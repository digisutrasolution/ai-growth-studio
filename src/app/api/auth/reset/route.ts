import { NextResponse } from 'next/server'
import { readResetToken } from '@/lib/auth'
import { setPassword } from '@/lib/users'

export const runtime = 'nodejs'

/** Complete a password reset with a valid token + new password. */
export async function POST(req: Request) {
  const { token, password } = (await req.json().catch(() => ({}))) as { token?: string; password?: string }

  if (!token || !password) return NextResponse.json({ error: 'Missing token or password.' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

  const email = await readResetToken(token)
  if (!email) return NextResponse.json({ error: 'This reset link is invalid or has expired. Please request a new one.' }, { status: 400 })

  const ok = await setPassword(email, password)
  if (!ok) return NextResponse.json({ error: 'Could not reset the password. Please request a new link.' }, { status: 400 })

  return NextResponse.json({ ok: true })
}
