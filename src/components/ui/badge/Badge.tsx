'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        bug: 'border-error bg-error/10 text-error',
        feature: 'border-info bg-info/10 text-info',
        nps: 'border-warning bg-warning/10 text-warning',
        general: 'border-success bg-success/10 text-success',
        default: 'border-base-300 bg-base-200 text-base-content',
        secondary: 'border-secondary bg-secondary/10 text-secondary',
        destructive: 'border-error bg-error text-error-content',
        outline: 'border-base-300 text-base-content',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

// Status Badge Component for feedback types
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'bug' | 'feature' | 'nps' | 'general' | 'pending' | 'resolved' | 'dismissed'
}

const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const statusConfig = {
      bug: { variant: 'bug' as const, icon: '🐛', label: 'Bug' },
      feature: { variant: 'feature' as const, icon: '💡', label: 'Feature' },
      nps: { variant: 'nps' as const, icon: '⭐', label: 'NPS' },
      general: { variant: 'general' as const, icon: '💬', label: 'General' },
      pending: { variant: 'default' as const, icon: '⏳', label: 'Pending' },
      resolved: { variant: 'general' as const, icon: '✅', label: 'Resolved' },
      dismissed: { variant: 'outline' as const, icon: '❌', label: 'Dismissed' },
    }

    const config = statusConfig[status]

    return (
      <Badge
        variant={config.variant}
        icon={<span className="text-xs">{config.icon}</span>}
        ref={ref}
        {...props}
      >
        {config.label}
      </Badge>
    )
  }
)
StatusBadge.displayName = 'StatusBadge'

// Priority Badge Component
export interface PriorityBadgeProps extends Omit<BadgeProps, 'variant'> {
  priority: 'low' | 'medium' | 'high' | 'critical'
}

const PriorityBadge = forwardRef<HTMLDivElement, PriorityBadgeProps>(
  ({ priority, ...props }, ref) => {
    const priorityConfig = {
      low: { variant: 'outline' as const, label: 'Low' },
      medium: { variant: 'default' as const, label: 'Medium' },
      high: { variant: 'nps' as const, label: 'High' },
      critical: { variant: 'bug' as const, label: 'Critical' },
    }

    const config = priorityConfig[priority]

    return (
      <Badge
        variant={config.variant}
        ref={ref}
        {...props}
      >
        {config.label}
      </Badge>
    )
  }
)
PriorityBadge.displayName = 'PriorityBadge'

export { Badge, StatusBadge, PriorityBadge, badgeVariants }