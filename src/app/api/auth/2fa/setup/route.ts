import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import QRCode from 'qrcode'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { isDbEnabled } from '@/lib/users'
import { generateSecret, keyuri, stageSecret } from '@/lib/twofactor'

export const runtime = 'nodejs'

/** Begin 2FA setup: generate a secret and return a QR + otpauth URI to scan. */
export async function POST() {
  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (!isDbEnabled()) return NextResponse.json({ error: 'Unavailable in demo mode.' }, { status: 400 })

  const secret = generateSecret()
  const staged = await stageSecret(session.email, secret)
  if (!staged) return NextResponse.json({ error: 'Could not start setup.' }, { status: 500 })

  const otpauth = keyuri(session.email, secret)
  const qr = await QRCode.toDataURL(otpauth, { margin: 1, width: 220 })
  return NextResponse.json({ ok: true, secret, otpauth, qr })
}
