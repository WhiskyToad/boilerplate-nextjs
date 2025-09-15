'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-content hover:bg-primary/80 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]',
        secondary: 'bg-secondary text-secondary-content hover:bg-secondary/80 hover:shadow-md hover:scale-[1.01]',
        ghost: 'hover:bg-base-200 hover:text-base-content hover:scale-[1.01]',
        danger: 'bg-error text-error-content hover:bg-error/80 hover:shadow-md hover:shadow-error/20 hover:scale-[1.01]',
        neutral: 'bg-neutral text-neutral-content hover:bg-neutral/80 hover:shadow-md hover:scale-[1.01]',
        outline: 'border border-base-300 bg-transparent hover:bg-base-100 hover:border-primary/30 hover:shadow-sm hover:scale-[1.01]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 py-2',
        lg: 'h-10 px-6 py-2',
        xl: 'h-12 px-8 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, loadingText, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="loading loading-spinner loading-sm"></span>
        )}
        {loading ? (loadingText || 'Loading...') : children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }