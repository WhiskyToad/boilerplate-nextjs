'use client'

import { useState, useEffect, useRef } from 'react'
import { useOnboarding } from './OnboardingProvider'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface TourStep {
  target: string // CSS selector
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  offset?: { x: number; y: number }
}

interface OnboardingTourProps {
  steps: TourStep[]
  onComplete?: () => void
  onClose?: () => void
  className?: string
  highlightPadding?: number
}

export function OnboardingTour({
  steps,
  onComplete,
  onClose,
  className = '',
  highlightPadding = 8
}: OnboardingTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  const currentStep = steps[currentStepIndex]

  useEffect(() => {
    if (!isActive || !currentStep) return

    const updatePositions = () => {
      const targetElement = document.querySelector(currentStep.target) as HTMLElement
      if (!targetElement) return

      const rect = targetElement.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      // Update highlight position
      setHighlightPosition({
        x: rect.left + scrollLeft - highlightPadding,
        y: rect.top + scrollTop - highlightPadding,
        width: rect.width + highlightPadding * 2,
        height: rect.height + highlightPadding * 2,
      })

      // Calculate tooltip position
      let tooltipX = rect.left + scrollLeft
      let tooltipY = rect.top + scrollTop

      const position = currentStep.position || 'bottom'
      const offset = currentStep.offset || { x: 0, y: 0 }

      switch (position) {
        case 'top':
          tooltipX += rect.width / 2
          tooltipY -= 10
          break
        case 'bottom':
          tooltipX += rect.width / 2
          tooltipY += rect.height + 10
          break
        case 'left':
          tooltipX -= 10
          tooltipY += rect.height / 2
          break
        case 'right':
          tooltipX += rect.width + 10
          tooltipY += rect.height / 2
          break
      }

      setTooltipPosition({
        x: tooltipX + offset.x,
        y: tooltipY + offset.y,
      })

      // Scroll element into view
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }

    updatePositions()
    window.addEventListener('resize', updatePositions)
    window.addEventListener('scroll', updatePositions)

    return () => {
      window.removeEventListener('resize', updatePositions)
      window.removeEventListener('scroll', updatePositions)
    }
  }, [currentStepIndex, isActive, currentStep, highlightPadding])

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      handleComplete()
    }
  }

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleComplete = () => {
    setIsActive(false)
    onComplete?.()
  }

  const handleClose = () => {
    setIsActive(false)
    onClose?.()
  }

  if (!isActive || !currentStep) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />
      
      {/* Highlight cutout */}
      <div
        className="fixed bg-white/10 border-2 border-primary rounded-lg z-[9999] pointer-events-none"
        style={{
          left: highlightPosition.x,
          top: highlightPosition.y,
          width: highlightPosition.width,
          height: highlightPosition.height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        }}
      />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-[10000] max-w-sm ${className}`}
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="bg-base-100 rounded-lg shadow-xl border border-base-300 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base-content">{currentStep.title}</h3>
            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          
          {/* Content */}
          <p className="text-base-content/80 text-sm mb-4">
            {currentStep.content}
          </p>
          
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-base-content/60">
              {currentStepIndex + 1} of {steps.length}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={previousStep}
                disabled={currentStepIndex === 0}
                className="btn btn-outline btn-xs gap-1"
              >
                <FiChevronLeft className="w-3 h-3" />
                Back
              </button>
              
              <button
                onClick={nextStep}
                className="btn btn-primary btn-xs gap-1"
              >
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStepIndex < steps.length - 1 && <FiChevronRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Arrow pointer */}
        <div className={`absolute w-3 h-3 bg-base-100 border border-base-300 transform rotate-45 ${
          currentStep.position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2' :
          currentStep.position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2' :
          currentStep.position === 'right' ? 'left-[-6px] top-1/2 -translate-y-1/2' :
          'top-[-6px] left-1/2 -translate-x-1/2'
        }`} />
      </div>
    </>
  )
}