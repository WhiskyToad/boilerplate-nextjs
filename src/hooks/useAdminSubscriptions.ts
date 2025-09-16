'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export interface AdminSubscription {
  id: string
  user_id: string
  user_email: string
  user_name: string | null
  status: string
  plan_name: string
  amount: number
  interval: string
  created_at: string
  current_period_end: string | null
}

interface UseAdminSubscriptionsParams {
  search?: string
  status?: string
  limit?: number
  offset?: number
}

async function fetchAdminSubscriptions(params: UseAdminSubscriptionsParams = {}): Promise<AdminSubscription[]> {
  const { search, status, limit = 50, offset = 0 } = params
  
  let query = supabase
    .from('user_subscriptions')
    .select(`
      id,
      user_id,
      status,
      tier,
      billing_interval,
      created_at,
      current_period_end
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Add status filter
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  // Get user data separately
  const userIds = (data || []).map(sub => sub.user_id)
  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, display_name')
    .in('id', userIds)

  const userMap = new Map(users?.map(user => [user.id, user]) || [])

  // Transform and filter data
  let subscriptions = (data || []).map(subscription => {
    const user = userMap.get(subscription.user_id)
    return {
      id: subscription.id,
      user_id: subscription.user_id,
      user_email: user?.email || '',
      user_name: user?.display_name || null,
      status: subscription.status,
      plan_name: subscription.tier,
      amount: subscription.tier === 'pro' ? 1900 : 0, // $19 in cents
      interval: subscription.billing_interval || 'month',
      created_at: subscription.created_at,
      current_period_end: subscription.current_period_end,
    }
  })

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    subscriptions = subscriptions.filter(sub => 
      sub.user_email.toLowerCase().includes(searchLower) ||
      sub.plan_name.toLowerCase().includes(searchLower) ||
      (sub.user_name && sub.user_name.toLowerCase().includes(searchLower))
    )
  }

  return subscriptions
}

export function useAdminSubscriptions(params: UseAdminSubscriptionsParams = {}) {
  return useQuery({
    queryKey: ['admin', 'subscriptions', params],
    queryFn: () => fetchAdminSubscriptions(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}