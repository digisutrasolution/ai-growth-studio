import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function currencyFor(country?: string | null): 'USD' | 'INR' {
  return country === 'IN' ? 'INR' : 'USD'
}

export async function GET(req: Request) {
  // 1) Cloudflare (if the site is proxied / orange-cloud) — instant, no lookup.
  const cf = req.headers.get('cf-ipcountry')
  if (cf && cf !== 'XX') {
    return NextResponse.json({ country: cf, currency: currencyFor(cf) })
  }

  // 2) Otherwise resolve the client IP (forwarded by Caddy) and geo-look it up.
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || ''
  if (!ip || ip.startsWith('127.') || ip.startsWith('::1') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return NextResponse.json({ country: null, currency: 'USD' })
  }

  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 2500)
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'ai-growth-studio' },
    })
    clearTimeout(timer)
    const country = (await res.text()).trim().slice(0, 2).toUpperCase()
    return NextResponse.json({ country: /^[A-Z]{2}$/.test(country) ? country : null, currency: currencyFor(country) })
  } catch {
    return NextResponse.json({ country: null, currency: 'USD' })
  }
}
