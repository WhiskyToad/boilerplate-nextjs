'use client'

import { AdminStats } from './AdminStats'
import { AdminRecentActivity } from './AdminRecentActivity'
import { AdminQuickActions } from './AdminQuickActions'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Admin Dashboard</h1>
        <p className="text-base-content/70 mt-2">
          Overview of system metrics and recent activity
        </p>
      </div>

      <AdminStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentActivity />
        <AdminQuickActions />
      </div>
    </div>
  )
}