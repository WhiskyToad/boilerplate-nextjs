'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export interface AdminStats {
  totalUsers: number
  activeSubscriptions: number
  monthlyRevenue: number
  dailyActiveUsers: number
  userGrowth: number
  subscriptionGrowth: number
  revenueGrowth: number
  dauGrowth: number
}

async function fetchAdminStats(): Promise<AdminStats> {
  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Get active subscriptions
  const { count: activeSubscriptions } = await supabase
    .from('user_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Get this month's revenue
  const thisMonth = new Date()
  thisMonth.setDate(1) // First day of current month
  
  // Simplified revenue calculation (would need actual pricing data)
  const monthlyRevenue = (activeSubscriptions || 0) * 19 // Assume $19/month average

  // Get DAU (simplified - count recent profiles for now)
  const today = new Date()
  today.setDate(today.getDate() - 1) // Active in last 24 hours
  
  const { count: dailyActiveUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('updated_at', today.toISOString())

  // Calculate growth percentages (simplified - in production you'd compare to previous period)
  const userGrowth = Math.floor(Math.random() * 20) - 5 // Mock data
  const subscriptionGrowth = Math.floor(Math.random() * 15)
  const revenueGrowth = Math.floor(Math.random() * 25)
  const dauGrowth = Math.floor(Math.random() * 10) - 2

  return {
    totalUsers: totalUsers || 0,
    activeSubscriptions: activeSubscriptions || 0,
    monthlyRevenue,
    dailyActiveUsers: dailyActiveUsers || 0,
    userGrowth,
    subscriptionGrowth,
    revenueGrowth,
    dauGrowth
  }
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchAdminStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}