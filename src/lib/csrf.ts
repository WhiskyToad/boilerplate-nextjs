/**
 * CSRF Protection
 *
 * Protects against Cross-Site Request Forgery attacks by validating request origins.
 * Automatically configured from NEXT_PUBLIC_APP_URL environment variable.
 *
 * No manual configuration needed - just set NEXT_PUBLIC_APP_URL in .env.local!
 */

import { NextRequest } from 'next/server';

/**
 * Get allowed origins from environment variable
 * Automatically includes:
 * - localhost:3000 (main dev server)
 * - localhost:3001 (admin dashboard if applicable)
 * - Your production URL from NEXT_PUBLIC_APP_URL
 *
 * @returns Array of allowed origin URLs
 */
function getAllowedOrigins(): string[] {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Always include localhost for development
  const origins = [
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  // Add the configured app URL (for production)
  if (appUrl && !origins.includes(appUrl)) {
    origins.push(appUrl);
  }

  return origins;
}

/**
 * Validate CSRF token by checking request origin
 *
 * This function is automatically called by middleware for all POST/PUT/DELETE requests.
 *
 * @param request - Next.js request object
 * @returns true if request is from allowed origin, false otherwise
 */
export function validateCSRF(request: NextRequest): boolean {
  // Skip CSRF for safe methods and webhooks
  if (request.method === 'GET' || request.url.includes('/api/stripe/webhooks')) {
    return true;
  }

  // Skip CSRF for auth callback routes (OAuth redirects from external providers)
  const pathname = new URL(request.url).pathname;
  if (
    pathname.startsWith('/auth/callback') ||
    pathname === '/api/auth/webhook'
  ) {
    return true;
  }

  // Get allowed origins (automatically from environment)
  const allowedOrigins = getAllowedOrigins();

  // Verify request origin matches allowed origins
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Check origin header first (preferred method)
  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  // Fallback to referer if origin is missing (some browsers)
  if (referer) {
    const refererOrigin = new URL(referer).origin;
    if (allowedOrigins.includes(refererOrigin)) {
      return true;
    }
  }

  // Reject if no valid origin found
  return false;
}
