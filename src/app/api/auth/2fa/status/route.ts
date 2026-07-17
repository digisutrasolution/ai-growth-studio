import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { getTwoFactor } from '@/lib/twofactor'

export const runtime = 'nodejs'

/** Current user's 2FA status (for the Settings card). */
export async function GET() {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  return NextResponse.json(await getTwoFactor(session.email))
}
