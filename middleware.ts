import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { validateCSRF } from '@/lib/csrf'

// Simple in-memory rate limiting for API endpoints
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function rateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // Clean up expired records
  if (record && now > record.resetTime) {
    rateLimitMap.delete(identifier)
  }

  const current = rateLimitMap.get(identifier) || { count: 0, resetTime: now + windowMs }

  if (current.count >= limit) {
    return false
  }

  current.count++
  rateLimitMap.set(identifier, current)
  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  // Skip middleware for SEO files
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return NextResponse.next()
  }

  // CSRF protection for authenticated endpoints
  if (!validateCSRF(request)) {
    return NextResponse.json(
      { error: 'Invalid request origin' },
      { status: 403 }
    )
  }

  // Global rate limit for all API endpoints
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(clientIP, 50, 60 * 1000)) { // 50 requests per minute per IP
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down.' },
        { status: 429 }
      )
    }
  }

  // Continue with Supabase auth middleware
  const response = await updateSession(request)

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-RateLimit-Policy', 'global:50/min')

  // Strict CSP for dashboard and auth pages
  response.headers.set('Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://app.posthog.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co https://api.stripe.com https://app.posthog.com;"
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}