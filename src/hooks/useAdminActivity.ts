'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export interface AdminActivity {
  id: string
  type: string
  description: string
  user_id: string | null
  user_email: string | null
  metadata: Record<string, any> | null
  created_at: string
}

async function fetchAdminActivity(): Promise<AdminActivity[]> {
  // In a real app, you'd have an admin_activity table
  // For now, we'll simulate with recent user signups and subscription events
  const activities: AdminActivity[] = []

  // Get recent user signups
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  // Get recent subscription events
  const { data: recentSubscriptions } = await supabase
    .from('user_subscriptions')
    .select(`
      id,
      user_id,
      status,
      tier,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  // Add user signups to activities
  recentUsers?.forEach(user => {
    activities.push({
      id: `signup_${user.id}`,
      type: 'user_signup',
      description: `New user registered: ${user.email}`,
      user_id: user.id,
      user_email: user.email,
      metadata: null,
      created_at: user.created_at
    })
  })

  // Get user emails for subscriptions
  const subUserIds = recentSubscriptions?.map(sub => sub.user_id) || []
  const { data: subUsers } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', subUserIds)

  const subUserMap = new Map(subUsers?.map(user => [user.id, user]) || [])

  // Add subscription events to activities
  recentSubscriptions?.forEach(subscription => {
    const user = subUserMap.get(subscription.user_id)
    activities.push({
      id: `sub_${subscription.id}`,
      type: 'subscription_created',
      description: `New ${subscription.tier} subscription by ${user?.email || 'Unknown user'}`,
      user_id: subscription.user_id,
      user_email: user?.email || null,
      metadata: { plan_name: subscription.tier },
      created_at: subscription.created_at
    })
  })

  // Sort by date and return recent 20
  return activities
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20)
}

export function useAdminActivity() {
  return useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: fetchAdminActivity,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}