/**
 * Phase 4 auth — session helpers.
 *
 * Sessions are signed JWTs (HS256 via `jose`), so the cookie cannot be forged
 * or tampered with. Edge-safe (no Node APIs) — usable from middleware.
 *
 * Still demo-grade in two ways, to be finished with the database phase:
 *   - credentials are accepted without a real user store (no password verify)
 *   - set a strong AUTH_SECRET in production (a dev fallback is used otherwise)
 * Production should add a PostgreSQL user table with hashed passwords + 2FA.
 */

import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'ags_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface Session {
  email: string
  name: string
}

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev-insecure-secret-change-me-in-production-please',
)

export async function createSession(session: Session): Promise<string> {
  return await new SignJWT({ email: session.email, name: session.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function readSession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    if (typeof payload.email === 'string') {
      return { email: payload.email, name: typeof payload.name === 'string' ? payload.name : payload.email }
    }
    return null
  } catch {
    return null
  }
}

export function nameFromEmail(email: string): string {
  const handle = email.split('@')[0] ?? 'there'
  return handle.charAt(0).toUpperCase() + handle.slice(1)
}
