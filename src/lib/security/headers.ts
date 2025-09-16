import { NextResponse } from 'next/server'

// Security headers configuration
export interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    directives: Record<string, string[]>
    reportOnly?: boolean
  }
  strictTransportSecurity?: {
    maxAge: number
    includeSubDomains?: boolean
    preload?: boolean
  }
  xFrameOptions?: 'DENY' | 'SAMEORIGIN' | string
  xContentTypeOptions?: boolean
  referrerPolicy?: 
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url'
  permissionsPolicy?: Record<string, string[]>
  crossOriginEmbedderPolicy?: 'unsafe-none' | 'require-corp'
  crossOriginOpenerPolicy?: 'unsafe-none' | 'same-origin-allow-popups' | 'same-origin'
  crossOriginResourcePolicy?: 'same-site' | 'same-origin' | 'cross-origin'
}

// Default security headers configuration
export const defaultSecurityConfig: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://va.vercel-scripts.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https:', 'wss:'],
      'media-src': ["'self'"],
      'object-src': ["'none'"],
      'child-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'manifest-src': ["'self'"],
    },
  },
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  xFrameOptions: 'DENY',
  xContentTypeOptions: true,
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    'interest-cohort': [],
  },
  crossOriginEmbedderPolicy: 'unsafe-none',
  crossOriginOpenerPolicy: 'same-origin-allow-popups',
  crossOriginResourcePolicy: 'same-origin',
}

// Security headers utility class
export class SecurityHeaders {
  private config: SecurityHeadersConfig

  constructor(config: SecurityHeadersConfig = defaultSecurityConfig) {
    this.config = { ...defaultSecurityConfig, ...config }
  }

  // Generate Content Security Policy header value
  private generateCSP(): string {
    if (!this.config.contentSecurityPolicy) return ''

    const { directives } = this.config.contentSecurityPolicy
    const policies: string[] = []

    for (const [directive, sources] of Object.entries(directives)) {
      policies.push(`${directive} ${sources.join(' ')}`)
    }

    return policies.join('; ')
  }

  // Generate Strict Transport Security header value
  private generateHSTS(): string {
    if (!this.config.strictTransportSecurity) return ''

    const { maxAge, includeSubDomains, preload } = this.config.strictTransportSecurity
    let hsts = `max-age=${maxAge}`

    if (includeSubDomains) hsts += '; includeSubDomains'
    if (preload) hsts += '; preload'

    return hsts
  }

  // Generate Permissions Policy header value
  private generatePermissionsPolicy(): string {
    if (!this.config.permissionsPolicy) return ''

    const policies: string[] = []
    for (const [directive, allowlist] of Object.entries(this.config.permissionsPolicy)) {
      if (allowlist.length === 0) {
        policies.push(`${directive}=()`)
      } else {
        policies.push(`${directive}=(${allowlist.join(' ')})`)
      }
    }

    return policies.join(', ')
  }

  // Apply security headers to response
  applyHeaders(response: NextResponse): NextResponse {
    // Content Security Policy
    if (this.config.contentSecurityPolicy) {
      const csp = this.generateCSP()
      if (csp) {
        const headerName = this.config.contentSecurityPolicy.reportOnly 
          ? 'Content-Security-Policy-Report-Only' 
          : 'Content-Security-Policy'
        response.headers.set(headerName, csp)
      }
    }

    // Strict Transport Security (HTTPS only)
    if (this.config.strictTransportSecurity && process.env.NODE_ENV === 'production') {
      const hsts = this.generateHSTS()
      if (hsts) {
        response.headers.set('Strict-Transport-Security', hsts)
      }
    }

    // X-Frame-Options
    if (this.config.xFrameOptions) {
      response.headers.set('X-Frame-Options', this.config.xFrameOptions)
    }

    // X-Content-Type-Options
    if (this.config.xContentTypeOptions) {
      response.headers.set('X-Content-Type-Options', 'nosniff')
    }

    // Referrer Policy
    if (this.config.referrerPolicy) {
      response.headers.set('Referrer-Policy', this.config.referrerPolicy)
    }

    // Permissions Policy
    if (this.config.permissionsPolicy) {
      const permissionsPolicy = this.generatePermissionsPolicy()
      if (permissionsPolicy) {
        response.headers.set('Permissions-Policy', permissionsPolicy)
      }
    }

    // Cross-Origin-Embedder-Policy
    if (this.config.crossOriginEmbedderPolicy) {
      response.headers.set('Cross-Origin-Embedder-Policy', this.config.crossOriginEmbedderPolicy)
    }

    // Cross-Origin-Opener-Policy
    if (this.config.crossOriginOpenerPolicy) {
      response.headers.set('Cross-Origin-Opener-Policy', this.config.crossOriginOpenerPolicy)
    }

    // Cross-Origin-Resource-Policy
    if (this.config.crossOriginResourcePolicy) {
      response.headers.set('Cross-Origin-Resource-Policy', this.config.crossOriginResourcePolicy)
    }

    // Remove potentially revealing headers
    response.headers.delete('Server')
    response.headers.delete('X-Powered-By')

    return response
  }

  // Create middleware function
  createMiddleware() {
    return (response: NextResponse) => {
      return this.applyHeaders(response)
    }
  }
}

// Environment-specific configurations
export const securityConfigs = {
  development: {
    ...defaultSecurityConfig,
    contentSecurityPolicy: {
      directives: {
        ...defaultSecurityConfig.contentSecurityPolicy!.directives,
        'script-src': [
          "'self'", 
          "'unsafe-inline'", 
          "'unsafe-eval'", // Needed for development
          'https://va.vercel-scripts.com'
        ],
      },
    },
    strictTransportSecurity: undefined, // No HSTS in development
  },

  production: {
    ...defaultSecurityConfig,
    contentSecurityPolicy: {
      directives: {
        ...defaultSecurityConfig.contentSecurityPolicy!.directives,
        'script-src': [
          "'self'",
          'https://va.vercel-scripts.com',
          // Remove unsafe-inline and unsafe-eval in production
        ],
      },
    },
  },

  // More restrictive config for high-security applications
  strict: {
    ...defaultSecurityConfig,
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'none'"],
        'script-src': ["'self'"],
        'style-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'media-src': ["'none'"],
        'object-src': ["'none'"],
        'child-src': ["'none'"],
        'worker-src': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'none'"],
        'manifest-src': ["'self'"],
      },
    },
    xFrameOptions: 'DENY',
    crossOriginEmbedderPolicy: 'require-corp',
    crossOriginOpenerPolicy: 'same-origin',
    crossOriginResourcePolicy: 'same-origin',
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      'interest-cohort': [],
      'sync-xhr': [],
      'usb': [],
      'web-share': [],
    },
  },
}

// Get configuration based on environment
export function getSecurityConfig(): SecurityHeadersConfig {
  const env = process.env.NODE_ENV

  switch (env) {
    case 'production':
      return securityConfigs.production
    case 'development':
      return securityConfigs.development
    default:
      return defaultSecurityConfig
  }
}

// Create security headers instance
export const securityHeaders = new SecurityHeaders(getSecurityConfig())