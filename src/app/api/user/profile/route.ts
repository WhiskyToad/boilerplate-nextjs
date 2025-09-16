import { NextRequest } from 'next/server'
import { withAuth, apiResponse, parseRequestBody } from '@/lib/api/middleware'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/user/profile - Get current user profile
export const GET = withAuth(async (request, user) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    throw new Error('Failed to fetch profile')
  }

  return apiResponse(profile)
})

// PUT /api/user/profile - Update user profile
export const PUT = withAuth(async (request, user) => {
  const body = await parseRequestBody<{
    display_name?: string
    avatar_url?: string
  }>(request)

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update profile')
  }

  return apiResponse(profile, 'Profile updated successfully')
})