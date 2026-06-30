import { NextResponse } from 'next/server'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSession, nameFromEmail } from '@/lib/auth'
import { isDbEnabled, authenticate } from '@/lib/users'

// Prisma needs the Node.js runtime.
export const runtime = 'nodejs'

export async function POST(req: Request) {
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
