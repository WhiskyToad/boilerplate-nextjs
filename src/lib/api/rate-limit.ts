// Simple in-memory rate limiter
// In production, you'd want to use Redis or Upstash

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

export async function rateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60 * 1000
): Promise<RateLimitResult> {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  // If no entry exists or the window has expired, create a new one
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs
    }
    rateLimitMap.set(identifier, newEntry)
    
    return {
      success: true,
      remaining: limit - 1,
      reset: newEntry.resetTime
    }
  }

  // If limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime
    }
  }

  // Increment count
  entry.count++
  rateLimitMap.set(identifier, entry)

  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.resetTime
  }
}

// Get current rate limit status without incrementing
export async function getRateLimitStatus(
  identifier: string,
  limit: number = 60
): Promise<RateLimitResult> {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    return {
      success: true,
      remaining: limit,
      reset: now + (60 * 1000) // Default 1 minute window
    }
  }

  return {
    success: entry.count < limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.resetTime
  }
}