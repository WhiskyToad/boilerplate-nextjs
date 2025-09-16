'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export interface AdminUser {
  id: string
  email: string
  display_name: string | null
  created_at: string
  subscription_status: string | null
  subscription_plan: string | null
}

interface UseAdminUsersParams {
  search?: string
  status?: string
  limit?: number
  offset?: number
}

async function fetchAdminUsers(params: UseAdminUsersParams = {}): Promise<AdminUser[]> {
  const { search, status, limit = 50, offset = 0 } = params
  
  let query = supabase
    .from('profiles')
    .select(`
      id,
      email,
      display_name,
      created_at,
      user_subscriptions (
        status,
        plan_name
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Add search filter
  if (search) {
    query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  // Transform data to include subscription info
  return (data || []).map(user => ({
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    created_at: user.created_at,
    subscription_status: (user.user_subscriptions as any)?.[0]?.status || null,
    subscription_plan: (user.user_subscriptions as any)?.[0]?.tier || null,
  }))
}

export function useAdminUsers(params: UseAdminUsersParams = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => fetchAdminUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}