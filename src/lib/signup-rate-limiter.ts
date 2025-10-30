/**
 * Signup Rate Limiter
 * Prevents spam signups by limiting signup attempts per IP address
 */

interface RateLimitRecord {
  count: number
  firstAttempt: number
  lastAttempt: number
  blockedUntil?: number
}

// In-memory store for rate limiting (consider Redis for production multi-server setup)
const signupAttempts = new Map<string, RateLimitRecord>()

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  // Max signups per IP in the time window
  maxSignups: 3,
  // Time window in milliseconds (15 minutes)
  windowMs: 15 * 60 * 1000,
  // Block duration after exceeding limit (1 hour)
  blockDurationMs: 60 * 60 * 1000,
  // Cleanup old entries every 2 hours
  cleanupIntervalMs: 2 * 60 * 60 * 1000,
}

// Cleanup old entries periodically
let lastCleanup = Date.now()
function cleanup() {
  const now = Date.now()

  // Only cleanup every 2 hours
  if (now - lastCleanup < RATE_LIMIT_CONFIG.cleanupIntervalMs) {
    return
  }

  for (const [ip, record] of signupAttempts.entries()) {
    // Remove if block expired and outside window
    if (
      (!record.blockedUntil || record.blockedUntil < now) &&
      (now - record.lastAttempt > RATE_LIMIT_CONFIG.windowMs)
    ) {
      signupAttempts.delete(ip)
    }
  }

  lastCleanup = now
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  reason?: string
}

/**
 * Check if a signup attempt from this IP is allowed
 */
export function checkSignupRateLimit(ip: string): RateLimitResult {
  cleanup()

  const now = Date.now()
  const record = signupAttempts.get(ip)

  // No previous attempts - allow
  if (!record) {
    signupAttempts.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    })

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxSignups - 1,
      resetAt: new Date(now + RATE_LIMIT_CONFIG.windowMs),
    }
  }

  // Check if currently blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(record.blockedUntil),
      reason: `Too many signup attempts. Please try again later.`,
    }
  }

  // Check if outside time window - reset counter
  if (now - record.firstAttempt > RATE_LIMIT_CONFIG.windowMs) {
    signupAttempts.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    })

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxSignups - 1,
      resetAt: new Date(now + RATE_LIMIT_CONFIG.windowMs),
    }
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_CONFIG.maxSignups) {
    const blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs

    signupAttempts.set(ip, {
      ...record,
      lastAttempt: now,
      blockedUntil,
    })

    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(blockedUntil),
      reason: `Too many signup attempts. Please try again later.`,
    }
  }

  // Increment counter and allow
  record.count++
  record.lastAttempt = now
  signupAttempts.set(ip, record)

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxSignups - record.count,
    resetAt: new Date(record.firstAttempt + RATE_LIMIT_CONFIG.windowMs),
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check common headers in order of preference
  const headers = request.headers

  // Vercel/Next.js
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Cloudflare
  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // General real IP header
  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

/**
 * Manually reset rate limit for an IP (admin function)
 */
export function resetSignupRateLimit(ip: string): void {
  signupAttempts.delete(ip)
}

/**
 * Get current rate limit stats (admin function)
 */
export function getSignupRateLimitStats() {
  return {
    totalTrackedIPs: signupAttempts.size,
    config: RATE_LIMIT_CONFIG,
    records: Array.from(signupAttempts.entries()).map(([ip, record]) => ({
      ip,
      ...record,
      isBlocked: record.blockedUntil ? record.blockedUntil > Date.now() : false,
    })),
  }
}
