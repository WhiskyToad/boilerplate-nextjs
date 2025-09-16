import crypto from 'crypto'
import { NextRequest } from 'next/server'

// CSRF Token management
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32
  private static readonly TOKEN_HEADER = 'x-csrf-token'
  private static readonly TOKEN_COOKIE = 'csrf-token'
  private static readonly SESSION_KEY = 'csrf-secret'

  // Generate a cryptographically secure token
  static generateToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH).toString('hex')
  }

  // Generate CSRF token pair (secret and token)
  static generateTokenPair(): { secret: string; token: string } {
    const secret = this.generateToken()
    const token = this.generateToken()
    return { secret, token }
  }

  // Verify CSRF token
  static verifyToken(token: string, secret: string, userAgent?: string): boolean {
    if (!token || !secret) return false
    
    // Basic verification - in production, you might want more sophisticated validation
    const expectedToken = crypto
      .createHmac('sha256', secret)
      .update(userAgent || '')
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(expectedToken, 'hex')
    )
  }

  // Create CSRF token for client
  static createToken(secret: string, userAgent?: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(userAgent || '')
      .digest('hex')
  }

  // Extract CSRF token from request
  static extractTokenFromRequest(request: NextRequest): string | null {
    // Check header first
    const headerToken = request.headers.get(this.TOKEN_HEADER)
    if (headerToken) return headerToken

    // Check form data for POST requests
    const contentType = request.headers.get('content-type')
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      // This would need to be implemented based on your form handling
      // For now, return null to rely on header-based CSRF
      return null
    }

    return null
  }

  // Middleware to validate CSRF tokens
  static async validateRequest(request: NextRequest): Promise<{ valid: boolean; error?: string }> {
    // Skip CSRF validation for GET, HEAD, OPTIONS
    const safeMethods = ['GET', 'HEAD', 'OPTIONS']
    if (safeMethods.includes(request.method)) {
      return { valid: true }
    }

    // Extract token from request
    const token = this.extractTokenFromRequest(request)
    if (!token) {
      return { valid: false, error: 'CSRF token missing' }
    }

    // Get secret from session/cookie (implement based on your session management)
    const secret = this.getSecretFromSession(request)
    if (!secret) {
      return { valid: false, error: 'CSRF secret missing' }
    }

    // Verify token
    const userAgent = request.headers.get('user-agent') || ''
    const isValid = this.verifyToken(token, secret, userAgent)

    return {
      valid: isValid,
      error: isValid ? undefined : 'Invalid CSRF token'
    }
  }

  // Get secret from session (implement based on your session system)
  private static getSecretFromSession(request: NextRequest): string | null {
    // This should integrate with your session management system
    // For cookie-based sessions:
    const csrfCookie = request.cookies.get(this.TOKEN_COOKIE)
    return csrfCookie?.value || null
  }
}

// Double Submit Cookie pattern
export class DoubleSubmitCSRF {
  private static readonly COOKIE_NAME = 'csrf-token'
  private static readonly HEADER_NAME = 'x-csrf-token'

  // Generate token for double submit pattern
  static generateToken(): string {
    return crypto.randomBytes(32).toString('base64url')
  }

  // Validate double submit CSRF
  static validate(request: NextRequest): boolean {
    const cookieToken = request.cookies.get(this.COOKIE_NAME)?.value
    const headerToken = request.headers.get(this.HEADER_NAME)

    if (!cookieToken || !headerToken) return false

    return crypto.timingSafeEqual(
      Buffer.from(cookieToken, 'base64url'),
      Buffer.from(headerToken, 'base64url')
    )
  }

  // Create cookie options for CSRF token
  static getCookieOptions() {
    return {
      httpOnly: false, // Client needs to read this for double submit
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    }
  }
}

// SameSite CSRF protection
export class SameSiteCSRF {
  // Check if request is same-site
  static isSameSite(request: NextRequest): boolean {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    const host = request.headers.get('host')

    // For same-site requests, origin should match host
    if (origin) {
      const originHost = new URL(origin).host
      return originHost === host
    }

    // Fallback to referer check
    if (referer) {
      const refererHost = new URL(referer).host
      return refererHost === host
    }

    // If no origin or referer, consider suspicious
    return false
  }

  // Validate same-site request
  static validate(request: NextRequest): { valid: boolean; reason?: string } {
    // Skip validation for safe methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS']
    if (safeMethods.includes(request.method)) {
      return { valid: true }
    }

    if (!this.isSameSite(request)) {
      return { 
        valid: false, 
        reason: 'Cross-site request detected' 
      }
    }

    return { valid: true }
  }
}

// CSRF middleware factory
export function createCSRFMiddleware(options: {
  useDoubleSubmit?: boolean
  useSameSite?: boolean
  skipPaths?: string[]
  methods?: string[]
} = {}) {
  const {
    useDoubleSubmit = true,
    useSameSite = true,
    skipPaths = [],
    methods = ['POST', 'PUT', 'DELETE', 'PATCH']
  } = options

  return async (request: NextRequest) => {
    // Skip paths that don't need CSRF protection
    const pathname = request.nextUrl.pathname
    if (skipPaths.some(path => pathname.startsWith(path))) {
      return { valid: true }
    }

    // Skip methods that don't need CSRF protection
    if (!methods.includes(request.method)) {
      return { valid: true }
    }

    // SameSite validation
    if (useSameSite) {
      const sameSiteResult = SameSiteCSRF.validate(request)
      if (!sameSiteResult.valid) {
        return sameSiteResult
      }
    }

    // Double submit validation
    if (useDoubleSubmit) {
      const doubleSubmitValid = DoubleSubmitCSRF.validate(request)
      if (!doubleSubmitValid) {
        return { 
          valid: false, 
          reason: 'CSRF token mismatch' 
        }
      }
    }

    return { valid: true }
  }
}