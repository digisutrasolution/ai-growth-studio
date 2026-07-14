import { NextResponse } from 'next/server'

/**
 * Tiny in-memory fixed-window rate limiter. Fine for a single app instance
 * behind Caddy; resets on restart. For multi-instance, swap for Redis.
 */
interface Bucket { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }
  b.count += 1
  if (b.count > limit) return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) }
  return { ok: true, retryAfter: 0 }
}

/** Best-effort client IP from proxy headers (Cloudflare / X-Forwarded-For). */
export function clientIp(req: Request): string {
  const h = req.headers
  return (
    h.get('cf-connecting-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  )
}

/** Standard 429 response with Retry-After. */
export function tooMany(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many attempts. Please wait a bit and try again.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  )
}

/** Prune expired buckets occasionally so the map can't grow unbounded. */
if (typeof globalThis !== 'undefined') {
  const g = globalThis as unknown as { __rlSweep?: boolean }
  if (!g.__rlSweep) {
    g.__rlSweep = true
    setInterval(() => {
      const now = Date.now()
      for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k)
    }, 60_000).unref?.()
  }
}
