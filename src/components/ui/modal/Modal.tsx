'use client'

import { HTMLAttributes, forwardRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '../button/Button'

const modalVariants = cva(
  'modal-box relative bg-base-100 shadow-xl',
  {
    variants: {
      size: {
        sm: 'w-11/12 max-w-sm',
        md: 'w-11/12 max-w-md',
        lg: 'w-11/12 max-w-lg',
        xl: 'w-11/12 max-w-xl',
        '2xl': 'w-11/12 max-w-2xl',
        full: 'w-11/12 max-w-7xl h-5/6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof modalVariants> {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    size,
    isOpen,
    onClose,
    title,
    description,
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
    children,
    ...props
  }, ref) => {
    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'
      }

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }, [isOpen, onClose, closeOnEscape])

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="modal modal-open">
            {/* Animated Backdrop */}
            <motion.div 
              className="modal-backdrop bg-black/50" 
              onClick={closeOnBackdrop ? onClose : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Animated Modal Content */}
            <motion.div
              className={cn(modalVariants({ size, className }))}
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30,
                mass: 0.5,
                duration: 0.25
              }}
              style={props.style}
              id={props.id}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {title && (
                      <h3 className="font-bold text-lg text-base-content">{title}</h3>
                    )}
                    {description && (
                      <p className="text-sm text-base-content/70 mt-1">{description}</p>
                    )}
                  </div>
                  {showCloseButton && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="btn-circle p-3"
                        aria-label="Close modal"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="modal-content">
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }
)
Modal.displayName = 'Modal'

// Modal Footer Component
export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between'
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, justify = 'end', children, ...props }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center', 
      end: 'justify-end',
      between: 'justify-between',
    }

    return (
      <div
        className={cn(
          'modal-action flex gap-2 mt-6',
          justifyClasses[justify],
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
ModalFooter.displayName = 'ModalFooter'

export { Modal, ModalFooter, modalVariants }