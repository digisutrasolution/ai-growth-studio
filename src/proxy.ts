import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, readSession } from '@/lib/auth'

// Next.js 16 renamed Middleware → Proxy (same functionality). Gates /dashboard.
export async function proxy(req: NextRequest) {
  const session = await readSession(req.cookies.get(SESSION_COOKIE)?.value)
  if (!session) {
    const url = new URL('/login', req.url)
    url.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
}
