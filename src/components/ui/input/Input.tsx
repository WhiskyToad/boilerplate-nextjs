'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base-content/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-error focus-visible:ring-error',
        success: 'border-success focus-visible:ring-success',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 py-2',
        lg: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BaseInputProps extends VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  required?: boolean
  className?: string
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseInputProps {}

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>, BaseInputProps {
  rows?: number
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, success, required, ...props }, ref) => {
    const inputVariant = error ? 'error' : success ? 'success' : variant

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-base-content">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          className={cn(inputVariants({ variant: inputVariant, size, className }))}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-error">{error}</p>
        )}
        {success && !error && (
          <p className="text-xs text-success">{success}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, label, error, success, required, rows = 3, ...props }, ref) => {
    const inputVariant = error ? 'error' : success ? 'success' : variant

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-base-content">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          className={cn(
            inputVariants({ variant: inputVariant, size, className }),
            'min-h-[60px] resize-y'
          )}
          rows={rows}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-error">{error}</p>
        )}
        {success && !error && (
          <p className="text-xs text-success">{success}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, Textarea, inputVariants }