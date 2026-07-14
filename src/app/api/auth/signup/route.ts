import { NextResponse } from 'next/server'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSession, nameFromEmail } from '@/lib/auth'
import { isDbEnabled, createUser } from '@/lib/users'
import { rateLimit, clientIp, tooMany } from '@/lib/rate-limit'

// Prisma needs the Node.js runtime.
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const rl = rateLimit(`signup:${clientIp(req)}`, 5, 60 * 60_000)
  if (!rl.ok) return tooMany(rl.retryAfter)

  const { name, email, password } = await req.json().catch(() => ({}) as Record<string, string>)

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  let user: { email: string; name: string }
  if (isDbEnabled()) {
    // Real mode: create the user with a hashed password.
    try {
      user = await createUser(name ?? '', email, password)
    } catch (err) {
      if (err instanceof Error && err.message === 'EXISTS') {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      throw err
    }
  } else {
    // Demo mode (no DATABASE_URL): just start a session.
    user = { email, name: name?.trim() || nameFromEmail(email) }
  }

  const token = await createSession(user)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return res
}
