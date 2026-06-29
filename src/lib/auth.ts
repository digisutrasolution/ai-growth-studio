/**
 * Phase 4 auth — session helpers.
 *
 * NOTE: this is a DEMO/mock implementation. The session cookie is an unsigned
 * base64 payload and credentials are accepted without a real user store.
 * Production (Phase 4 backend) should replace this with:
 *   - a signed JWT or server-side session (AUTH_SECRET)
 *   - a real user table in PostgreSQL with hashed passwords
 *   - email verification + 2FA
 */

export const SESSION_COOKIE = 'ags_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface Session {
  email: string
  name: string
}

export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session)).toString('base64url')
}

export function decodeSession(value: string | undefined | null): Session | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString()) as Session
    if (parsed && typeof parsed.email === 'string') return parsed
    return null
  } catch {
    return null
  }
}

export function nameFromEmail(email: string): string {
  const handle = email.split('@')[0] ?? 'there'
  return handle.charAt(0).toUpperCase() + handle.slice(1)
}
