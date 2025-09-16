import { NextRequest } from 'next/server'
import { withAuth, apiResponse } from '@/lib/api/middleware'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/user/subscription - Get current user subscription and usage
export const GET = withAuth(async (request, user) => {
  // Get subscription
  const { data: subscription, error: subError } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get usage
  const { data: usage, error: usageError } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (subError && subError.code !== 'PGRST116') {
    throw new Error('Failed to fetch subscription')
  }

  if (usageError && usageError.code !== 'PGRST116') {
    throw new Error('Failed to fetch usage')
  }

  return apiResponse({
    subscription: subscription || null,
    usage: usage || null
  })
})