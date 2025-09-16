'use client'

import { FiMail, FiUsers, FiSettings, FiDownload, FiBarChart, FiShield } from 'react-icons/fi'
import Link from 'next/link'

interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    title: 'Send Announcement',
    description: 'Send email to all users',
    icon: FiMail,
    href: '/admin/announcements',
    color: 'text-primary'
  },
  {
    title: 'User Management',
    description: 'View and manage users',
    icon: FiUsers,
    href: '/admin/users',
    color: 'text-success'
  },
  {
    title: 'System Settings',
    description: 'Configure platform settings',
    icon: FiSettings,
    href: '/admin/settings',
    color: 'text-warning'
  },
  {
    title: 'Export Data',
    description: 'Download reports and analytics',
    icon: FiDownload,
    href: '/admin/exports',
    color: 'text-info'
  },
  {
    title: 'Analytics',
    description: 'View detailed metrics',
    icon: FiBarChart,
    href: '/admin/analytics',
    color: 'text-accent'
  },
  {
    title: 'Security',
    description: 'Monitor security events',
    icon: FiShield,
    href: '/admin/security',
    color: 'text-error'
  }
]

export function AdminQuickActions() {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            
            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-lg border border-base-300 hover:border-primary hover:bg-base-200 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-base-200 ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-base-content/60">
                    {action.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}