'use client'

import { useAdminActivity } from '@/hooks/useAdminActivity'
import { FiUser, FiDollarSign, FiSettings, FiActivity } from 'react-icons/fi'

const activityIcons = {
  user_signup: FiUser,
  subscription_created: FiDollarSign,
  subscription_canceled: FiDollarSign,
  user_login: FiActivity,
  settings_changed: FiSettings,
} as const

const activityColors = {
  user_signup: 'text-success',
  subscription_created: 'text-primary',
  subscription_canceled: 'text-warning',
  user_login: 'text-info',
  settings_changed: 'text-accent',
} as const

export function AdminRecentActivity() {
  const { data: activities, isLoading, error } = useAdminActivity()

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Recent Activity</h2>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-8 h-8 bg-base-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-base-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Recent Activity</h2>
          <div className="alert alert-error">
            <span>Failed to load recent activity</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Recent Activity</h2>
        
        <div className="space-y-4">
          {activities?.map((activity) => {
            const Icon = activityIcons[activity.type as keyof typeof activityIcons] || FiActivity
            const colorClass = activityColors[activity.type as keyof typeof activityColors] || 'text-base-content'
            
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-base-200 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {activity.description}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                  {activity.metadata && (
                    <div className="text-xs text-base-content/50 mt-1">
                      {activity.user_email && `by ${activity.user_email}`}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {!activities?.length && (
          <div className="text-center py-8 text-base-content/50">
            No recent activity
          </div>
        )}
      </div>
    </div>
  )
}