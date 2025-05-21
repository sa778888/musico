import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './app/lib/auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  // Redirect logged-in users away from /login
  if (pathname === '/login') {
    if (token) {
      try {
        verifyToken(token)
        return NextResponse.redirect(new URL('/', req.url))
      } catch {
        // Invalid token – let them go to /login
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  // Public routes bypass auth
  if (
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Bypass logic (optional override)
  const bypass = req.cookies.get('redirect_bypass')?.value
  if (bypass === 'true') {
    const response = NextResponse.next()
    response.cookies.delete('redirect_bypass', { path: '/' })
    return response
  }

  // Auth check for protected routes
  if (!token) {
    const redirect = NextResponse.redirect(new URL('/login', req.url))
    redirect.headers.set('x-middleware-cache', 'no-cache')
    return redirect
  }

  try {
    verifyToken(token)
    return NextResponse.next()
  } catch {
    // Invalid token – redirect to login
    // const redirect = NextResponse.redirect(new URL('/login', req.url))
    // redirect.headers.set('x-middleware-cache', 'no-cache')
    // redirect.cookies.delete('token', { path: '/' })
    return null
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
