import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from './rate-limit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ApiError {
  error: string
  code?: string
  details?: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Standard API response helper
export function apiResponse<T>(
  data: T, 
  message?: string, 
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  }, { status })
}

export function apiError(
  error: string, 
  status: number = 400, 
  code?: string,
  details?: any
): NextResponse<ApiError> {
  return NextResponse.json({
    error,
    code,
    details
  }, { status })
}

// Authentication middleware
export async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw new Error('Invalid or expired token')
  }

  return user
}

// Rate limiting middleware
export async function withRateLimit(
  request: NextRequest,
  identifier: string,
  limit: number = 60, // requests per minute
  window: number = 60 * 1000 // 1 minute
) {
  const { success, remaining, reset } = await rateLimit(identifier, limit, window)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', remaining: 0, reset },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString()
        }
      }
    )
  }

  return {
    remaining,
    reset,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString()
    }
  }
}

// Input validation middleware
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  const missing = requiredFields.filter(field => {
    const value = data[field]
    return value === undefined || value === null || value === ''
  })

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }
}

// Request body parser with validation
export async function parseRequestBody<T>(
  request: NextRequest,
  requiredFields?: (keyof T)[]
): Promise<T> {
  try {
    const body = await request.json()
    
    if (requiredFields) {
      validateRequiredFields(body, requiredFields)
    }
    
    return body
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON in request body')
    }
    throw error
  }
}

// Enhanced API route wrapper
export function withApiMiddleware(
  handler: (
    request: NextRequest, 
    context: { params?: any }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: { params?: any }) => {
    try {
      return await handler(request, context || {})
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof Error) {
        return apiError(error.message, 400)
      }
      
      return apiError('Internal server error', 500)
    }
  }
}

// Protected API route wrapper (requires authentication)
export function withAuth(
  handler: (
    request: NextRequest,
    user: any,
    context: { params?: any }
  ) => Promise<NextResponse>
) {
  return withApiMiddleware(async (request, context) => {
    const user = await requireAuth(request)
    return handler(request, user, context)
  })
}

// Rate limited API route wrapper
export function withRateLimitAuth(
  handler: (
    request: NextRequest,
    user: any,
    context: { params?: any }
  ) => Promise<NextResponse>,
  limit: number = 60
) {
  return withApiMiddleware(async (request, context) => {
    const user = await requireAuth(request)
    
    // Apply rate limiting per user
    const rateLimitResult = await withRateLimit(request, user.id, limit)
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult
    }

    const response = await handler(request, user, context)
    
    // Add rate limit headers to successful responses
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  })
}