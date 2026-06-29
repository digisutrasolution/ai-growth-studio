import { NextResponse } from 'next/server'
import { SESSION_COOKIE, SESSION_MAX_AGE, encodeSession, nameFromEmail } from '@/lib/auth'

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}) as Record<string, string>)

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  // DEMO: accept any credentials. Replace with DB lookup + password verify.
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, encodeSession({ email, name: nameFromEmail(email) }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return res
}
