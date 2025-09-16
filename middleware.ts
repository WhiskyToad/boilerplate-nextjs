import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { securityMiddleware } from '@/lib/security/security-middleware'

export async function middleware(request: NextRequest) {
  try {
    // Apply security middleware first
    const securityResponse = await securityMiddleware.apply(request)
    
    // If security middleware blocks the request, return immediately
    if (securityResponse.status !== 200 && securityResponse.status !== 404) {
      return securityResponse
    }

    // Handle Supabase auth
    const response = await updateSession(request)
    
    // Check for admin routes protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set() {
              // No-op for middleware
            },
            remove() {
              // No-op for middleware
            },
          },
        }
      )

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // For now, allow all authenticated users to access admin
      // In production, add role checking here
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // Fail securely - continue with the request
    return await updateSession(request)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}