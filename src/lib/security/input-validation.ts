import { z } from 'zod'

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Invalid email address').max(320, 'Email too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  url: z.string().url('Invalid URL').max(2048, 'URL too long'),
  uuid: z.string().uuid('Invalid UUID format'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  positiveInt: z.number().int().positive('Must be a positive integer'),
  nonEmptyString: z.string().min(1, 'This field is required'),
}

// Sanitization utilities
export class InputSanitizer {
  // HTML sanitization - removes potentially dangerous HTML tags
  static sanitizeHtml(input: string): string {
    // Basic HTML sanitization - in production consider using a library like DOMPurify
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
  }

  // SQL injection prevention - escape special characters
  static sanitizeSql(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
      .replace(/xp_/gi, '')
      .replace(/sp_/gi, '')
  }

  // XSS prevention - escape dangerous characters
  static escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  // Remove null bytes and control characters
  static removeControlChars(input: string): string {
    return input.replace(/[\x00-\x1f\x7f-\x9f]/g, '')
  }

  // Trim and normalize whitespace
  static normalizeWhitespace(input: string): string {
    return input.trim().replace(/\s+/g, ' ')
  }

  // Complete sanitization pipeline
  static sanitize(input: string, options: {
    html?: boolean
    sql?: boolean
    xss?: boolean
    controlChars?: boolean
    whitespace?: boolean
  } = {}): string {
    const {
      html = true,
      sql = true,
      xss = true,
      controlChars = true,
      whitespace = true,
    } = options

    let result = input

    if (controlChars) result = this.removeControlChars(result)
    if (whitespace) result = this.normalizeWhitespace(result)
    if (html) result = this.sanitizeHtml(result)
    if (sql) result = this.sanitizeSql(result)
    if (xss) result = this.escapeHtml(result)

    return result
  }
}

// Content Security Policy helpers
export class CSPBuilder {
  private directives: Map<string, string[]> = new Map()

  directive(name: string, sources: string[]): this {
    this.directives.set(name, sources)
    return this
  }

  defaultSrc(sources: string[]): this {
    return this.directive('default-src', sources)
  }

  scriptSrc(sources: string[]): this {
    return this.directive('script-src', sources)
  }

  styleSrc(sources: string[]): this {
    return this.directive('style-src', sources)
  }

  imgSrc(sources: string[]): this {
    return this.directive('img-src', sources)
  }

  connectSrc(sources: string[]): this {
    return this.directive('connect-src', sources)
  }

  fontSrc(sources: string[]): this {
    return this.directive('font-src', sources)
  }

  frameSrc(sources: string[]): this {
    return this.directive('frame-src', sources)
  }

  mediaSrc(sources: string[]): this {
    return this.directive('media-src', sources)
  }

  objectSrc(sources: string[]): this {
    return this.directive('object-src', sources)
  }

  build(): string {
    const policies: string[] = []
    
    this.directives.forEach((sources, directive) => {
      policies.push(`${directive} ${sources.join(' ')}`)
    })
    
    return policies.join('; ')
  }
}

// Validation middleware for API routes
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    try {
      const validated = schema.parse(data)
      return { success: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
        return { success: false, errors }
      }
      return { success: false, errors: ['Validation failed'] }
    }
  }
}

// Common validation schemas for API endpoints
export const apiSchemas = {
  // User registration
  userRegistration: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: commonSchemas.name,
    termsAccepted: z.boolean().refine(val => val === true, 'Terms must be accepted'),
  }),

  // User login
  userLogin: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),

  // Password reset
  passwordReset: z.object({
    email: commonSchemas.email,
  }),

  // Password update
  passwordUpdate: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: commonSchemas.password,
  }),

  // Profile update
  profileUpdate: z.object({
    name: commonSchemas.name.optional(),
    email: commonSchemas.email.optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    website: commonSchemas.url.optional(),
    phoneNumber: commonSchemas.phoneNumber.optional(),
  }),

  // File upload
  fileUpload: z.object({
    fileName: z.string().min(1, 'File name is required').max(255, 'File name too long'),
    fileSize: z.number().positive('File size must be positive').max(10 * 1024 * 1024, 'File too large (max 10MB)'),
    fileType: z.string().min(1, 'File type is required'),
  }),

  // Pagination
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),

  // Search
  search: z.object({
    query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
    filters: z.record(z.string(), z.any()).optional(),
  }),
}

// Rate limiting validation
export const rateLimitSchemas = {
  // Different rate limits for different endpoints
  strict: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  moderate: { requests: 50, windowMs: 15 * 60 * 1000 }, // 50 requests per 15 minutes
  lenient: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
}