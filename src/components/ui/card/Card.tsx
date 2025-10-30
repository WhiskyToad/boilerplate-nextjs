'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-lg bg-base-100 transition-colors',
  {
    variants: {
      variant: {
        default: 'border border-base-300',
        outlined: 'border-2 border-base-300',
        elevated: 'shadow-lg',
        ghost: 'border-0 bg-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          cardVariants({ variant, padding }),
          hover && 'hover:shadow-md hover:border-base-400 cursor-pointer',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// Card Header Component
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex flex-col space-y-1.5 pb-4', className)}
        ref={ref}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold leading-none tracking-tight text-base-content">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-base-content/70">
            {description}
          </p>
        )}
        {children}
      </div>
    )
  }
)
CardHeader.displayName = 'CardHeader'

// Card Content Component
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  // Extend with additional props if needed in the future
  children?: React.ReactNode
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('text-base-content', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
CardContent.displayName = 'CardContent'

// Card Footer Component
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between'
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, justify = 'start', ...props }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end', 
      between: 'justify-between',
    }

    return (
      <div
        className={cn(
          'flex items-center pt-4',
          justifyClasses[justify],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardFooter, cardVariants }