import { NextResponse } from 'next/server'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSession, createTwoFactorTicket, nameFromEmail } from '@/lib/auth'
import { isDbEnabled, authenticate } from '@/lib/users'
import { isTwoFactorEnabled } from '@/lib/twofactor'
import { rateLimit, clientIp, tooMany } from '@/lib/rate-limit'

// Prisma needs the Node.js runtime.
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const rl = rateLimit(`login:${clientIp(req)}`, 10, 5 * 60_000)
  if (!rl.ok) return tooMany(rl.retryAfter)

  const { email, password } = await req.json().catch(() => ({}) as Record<string, string>)

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  let user: { email: string; name: string }
  if (isDbEnabled()) {
    // Real mode: verify against the database.
    const found = await authenticate(email, password)
    if (!found) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }
    user = found

    // If the account has 2FA on, don't issue a session yet — require a code.
    if (await isTwoFactorEnabled(user.email)) {
      const ticket = await createTwoFactorTicket(user.email)
      return NextResponse.json({ twoFactor: true, ticket })
    }
  } else {
    // Demo mode (no DATABASE_URL): accept any credentials.
    user = { email, name: nameFromEmail(email) }
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
