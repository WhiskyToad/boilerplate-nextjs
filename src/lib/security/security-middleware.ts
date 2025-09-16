import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/api/rate-limit'
import { createCSRFMiddleware } from './csrf'
import { securityHeaders } from './headers'
import { AuditLogger, AuditEventTypes } from './audit-log'
import { InputSanitizer } from './input-validation'

export interface SecurityMiddlewareConfig {
  rateLimit?: {
    enabled: boolean
    windowMs?: number
    max?: number
    skipPaths?: string[]
  }
  csrf?: {
    enabled: boolean
    skipPaths?: string[]
    useDoubleSubmit?: boolean
    useSameSite?: boolean
  }
  auditLogging?: {
    enabled: boolean
    logAllRequests?: boolean
    sensitiveEndpoints?: string[]
  }
  headers?: {
    enabled: boolean
  }
  inputSanitization?: {
    enabled: boolean
    skipPaths?: string[]
  }
  geoBlocking?: {
    enabled: boolean
    blockedCountries?: string[]
    allowedCountries?: string[]
  }
}

const defaultConfig: SecurityMiddlewareConfig = {
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    skipPaths: ['/health', '/api/health'],
  },
  csrf: {
    enabled: true,
    skipPaths: ['/api/auth/callback', '/api/webhooks/'],
    useDoubleSubmit: true,
    useSameSite: true,
  },
  auditLogging: {
    enabled: true,
    logAllRequests: false,
    sensitiveEndpoints: [
      '/api/auth/',
      '/api/admin/',
      '/api/user/',
      '/api/subscription/',
    ],
  },
  headers: {
    enabled: true,
  },
  inputSanitization: {
    enabled: true,
    skipPaths: ['/api/webhooks/'],
  },
  geoBlocking: {
    enabled: false,
    blockedCountries: [],
    allowedCountries: [],
  },
}

export class SecurityMiddleware {
  private config: SecurityMiddlewareConfig
  private csrfMiddleware: ReturnType<typeof createCSRFMiddleware>

  constructor(config: Partial<SecurityMiddlewareConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.csrfMiddleware = createCSRFMiddleware({
      skipPaths: this.config.csrf?.skipPaths,
      useDoubleSubmit: this.config.csrf?.useDoubleSubmit,
      useSameSite: this.config.csrf?.useSameSite,
    })
  }

  // Extract client information from request
  private extractClientInfo(request: NextRequest) {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const country = 'Unknown' // request.geo?.country would be available in production
    const referer = request.headers.get('referer')
    
    return { ip, userAgent, country, referer }
  }

  // Get real client IP address
  private getClientIP(request: NextRequest): string {
    // Check various headers for the real IP
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const clientIP = request.headers.get('x-client-ip')
    
    if (forwarded) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      return forwarded.split(',')[0].trim()
    }
    
    return realIP || clientIP || '127.0.0.1'
  }

  // Check if request is from a blocked country
  private async checkGeoBlocking(request: NextRequest): Promise<{ blocked: boolean; reason?: string }> {
    if (!this.config.geoBlocking?.enabled) {
      return { blocked: false }
    }

    const country = 'Unknown' // request.geo?.country would be available in Vercel
    if (!country) {
      return { blocked: false }
    }

    const { blockedCountries = [], allowedCountries = [] } = this.config.geoBlocking

    // If allowlist exists, only allow those countries
    if (allowedCountries.length > 0) {
      if (!allowedCountries.includes(country)) {
        return { blocked: true, reason: `Country ${country} not in allowlist` }
      }
    }

    // Check blocklist
    if (blockedCountries.includes(country)) {
      return { blocked: true, reason: `Country ${country} is blocked` }
    }

    return { blocked: false }
  }

  // Check for suspicious patterns in the request
  private detectSuspiciousActivity(request: NextRequest, clientInfo: ReturnType<typeof this.extractClientInfo>): {
    suspicious: boolean
    reasons: string[]
  } {
    const reasons: string[] = []
    const { userAgent, referer } = clientInfo
    const pathname = request.nextUrl.pathname

    // Check for suspicious user agents
    const suspiciousUAPatterns = [
      /curl/i,
      /wget/i,
      /python/i,
      /ruby/i,
      /perl/i,
      /php/i,
      /scanner/i,
      /bot/i,
    ]

    if (suspiciousUAPatterns.some(pattern => pattern.test(userAgent))) {
      reasons.push('Suspicious user agent detected')
    }

    // Check for SQL injection patterns in URL
    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    ]

    if (sqlPatterns.some(pattern => pattern.test(pathname + request.nextUrl.search))) {
      reasons.push('Potential SQL injection attempt detected')
    }

    // Check for XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ]

    const fullUrl = pathname + request.nextUrl.search
    if (xssPatterns.some(pattern => pattern.test(decodeURIComponent(fullUrl)))) {
      reasons.push('Potential XSS attempt detected')
    }

    // Check for path traversal
    if (pathname.includes('..') || pathname.includes('%2e%2e')) {
      reasons.push('Path traversal attempt detected')
    }

    // Check for suspicious referers
    if (referer && !referer.includes(request.nextUrl.host)) {
      const suspiciousRefererPatterns = [
        /malware/i,
        /viagra/i,
        /casino/i,
        /porn/i,
      ]

      if (suspiciousRefererPatterns.some(pattern => pattern.test(referer))) {
        reasons.push('Suspicious referer detected')
      }
    }

    return {
      suspicious: reasons.length > 0,
      reasons,
    }
  }

  // Apply rate limiting
  private async applyRateLimit(request: NextRequest, clientInfo: ReturnType<typeof this.extractClientInfo>): Promise<{
    allowed: boolean
    error?: string
  }> {
    if (!this.config.rateLimit?.enabled) {
      return { allowed: true }
    }

    const { skipPaths = [] } = this.config.rateLimit
    const pathname = request.nextUrl.pathname

    // Skip rate limiting for certain paths
    if (skipPaths.some(path => pathname.startsWith(path))) {
      return { allowed: true }
    }

    try {
      const identifier = clientInfo.ip
      
      // Use the rate limit function from api middleware
      const result = await rateLimit(`security_${identifier}`)
      
      if (!result.success) {
        // Log rate limit violation
        await AuditLogger.logSecurityEvent(
          AuditEventTypes.SECURITY.RATE_LIMIT_EXCEEDED,
          { endpoint: pathname, limit_exceeded: true },
          clientInfo
        )

        return { allowed: false, error: 'Rate limit exceeded' }
      }

      return { allowed: true }
    } catch (error) {
      console.error('Rate limiting error:', error)
      return { allowed: true } // Fail open
    }
  }

  // Log security-relevant requests
  private async logRequest(request: NextRequest, clientInfo: ReturnType<typeof this.extractClientInfo>): Promise<void> {
    if (!this.config.auditLogging?.enabled) return

    const { logAllRequests = false, sensitiveEndpoints = [] } = this.config.auditLogging
    const pathname = request.nextUrl.pathname
    
    // Check if this endpoint should be logged
    const shouldLog = logAllRequests || sensitiveEndpoints.some(endpoint => pathname.startsWith(endpoint))
    
    if (shouldLog) {
      await AuditLogger.log({
        event_type: 'request.received',
        action: request.method,
        resource_type: 'endpoint',
        resource_id: pathname,
        details: {
          method: request.method,
          url: request.url,
          query: Object.fromEntries(request.nextUrl.searchParams),
          headers: Object.fromEntries(request.headers.entries()),
        },
        ip_address: clientInfo.ip,
        user_agent: clientInfo.userAgent,
        severity: 'low',
        success: true,
      })
    }
  }

  // Apply input sanitization
  private sanitizeRequest(request: NextRequest): void {
    if (!this.config.inputSanitization?.enabled) return

    const { skipPaths = [] } = this.config.inputSanitization
    const pathname = request.nextUrl.pathname

    // Skip sanitization for certain paths (like webhooks)
    if (skipPaths.some(path => pathname.startsWith(path))) {
      return
    }

    // Sanitize URL parameters
    const searchParams = new URLSearchParams()
    for (const [key, value] of request.nextUrl.searchParams) {
      const sanitizedKey = InputSanitizer.sanitize(key)
      const sanitizedValue = InputSanitizer.sanitize(value)
      searchParams.set(sanitizedKey, sanitizedValue)
    }
    
    // Note: In a real implementation, you'd need to modify the request object
    // This is a simplified example showing the concept
  }

  // Main security middleware function
  async apply(request: NextRequest): Promise<NextResponse> {
    const clientInfo = this.extractClientInfo(request)
    
    try {
      // 1. Geographic blocking
      const geoCheck = await this.checkGeoBlocking(request)
      if (geoCheck.blocked) {
        await AuditLogger.logSecurityEvent(
          AuditEventTypes.SECURITY.UNAUTHORIZED_ACCESS,
          { reason: geoCheck.reason, geo_block: true },
          clientInfo
        )

        return new NextResponse('Access denied', { status: 403 })
      }

      // 2. Suspicious activity detection
      const suspiciousCheck = this.detectSuspiciousActivity(request, clientInfo)
      if (suspiciousCheck.suspicious) {
        await AuditLogger.logSecurityEvent(
          AuditEventTypes.SECURITY.SUSPICIOUS_ACTIVITY,
          { reasons: suspiciousCheck.reasons },
          clientInfo
        )

        // For high-risk patterns, block immediately
        const highRiskReasons = ['SQL injection', 'XSS attempt']
        const isHighRisk = suspiciousCheck.reasons.some(reason => 
          highRiskReasons.some(hrReason => reason.includes(hrReason))
        )

        if (isHighRisk) {
          return new NextResponse('Security violation detected', { status: 403 })
        }
      }

      // 3. Rate limiting
      const rateLimitCheck = await this.applyRateLimit(request, clientInfo)
      if (!rateLimitCheck.allowed) {
        return new NextResponse('Rate limit exceeded', { status: 429 })
      }

      // 4. CSRF protection
      if (this.config.csrf?.enabled) {
        const csrfCheck = await this.csrfMiddleware(request)
        if (!csrfCheck.valid) {
          await AuditLogger.logSecurityEvent(
            AuditEventTypes.SECURITY.CSRF_VIOLATION,
            { reason: csrfCheck.reason },
            clientInfo
          )

          return new NextResponse('CSRF token invalid', { status: 403 })
        }
      }

      // 5. Input sanitization
      this.sanitizeRequest(request)

      // 6. Audit logging
      await this.logRequest(request, clientInfo)

      // Continue with the request
      const response = NextResponse.next()

      // 7. Apply security headers
      if (this.config.headers?.enabled) {
        securityHeaders.applyHeaders(response)
      }

      return response

    } catch (error) {
      console.error('Security middleware error:', error)
      
      await AuditLogger.log({
        event_type: 'security.middleware_error',
        action: 'error',
        details: { error: String(error) },
        ip_address: clientInfo.ip,
        user_agent: clientInfo.userAgent,
        severity: 'high',
        success: false,
      })

      // Fail securely - let the request through but log the error
      return NextResponse.next()
    }
  }

  // Create a middleware function
  createMiddleware() {
    return (request: NextRequest) => this.apply(request)
  }
}

// Default security middleware instance
export const securityMiddleware = new SecurityMiddleware()

// Export factory function for custom configurations
export function createSecurityMiddleware(config?: Partial<SecurityMiddlewareConfig>) {
  return new SecurityMiddleware(config)
}