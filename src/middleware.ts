import { NextResponse, type NextRequest } from 'next/server'

// Inlined to keep middleware edge-safe (no Node APIs pulled in).
const SESSION_COOKIE = 'ags_session'

export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value)
  if (!hasSession) {
    const url = new URL('/login', req.url)
    url.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
}
