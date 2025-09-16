'use client'

import { useAdminStats } from '@/hooks/useAdminStats'
import { FiUsers, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi'

export function AdminStats() {
  const { data: stats, isLoading, error } = useAdminStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="animate-pulse">
                <div className="h-4 bg-base-300 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-base-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Failed to load admin statistics</span>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      change: stats?.userGrowth || 0,
      color: 'text-primary'
    },
    {
      title: 'Active Subscriptions',
      value: stats?.activeSubscriptions || 0,
      icon: FiDollarSign,
      change: stats?.subscriptionGrowth || 0,
      color: 'text-success'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue || 0}`,
      icon: FiTrendingUp,
      change: stats?.revenueGrowth || 0,
      color: 'text-warning'
    },
    {
      title: 'Daily Active Users',
      value: stats?.dailyActiveUsers || 0,
      icon: FiActivity,
      change: stats?.dauGrowth || 0,
      color: 'text-info'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        const isPositive = stat.change >= 0
        
        return (
          <div key={index} className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className={`text-sm flex items-center gap-1 ${
                    isPositive ? 'text-success' : 'text-error'
                  }`}>
                    <span>{isPositive ? '+' : ''}{stat.change}%</span>
                    <span className="text-base-content/50">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-base-200 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}