'use client'

import { FiCheck } from 'react-icons/fi'

export interface Step {
  id: string
  title: string
  description?: string
}

export interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
  variant?: 'default' | 'compact' | 'minimal'
  className?: string
}

export function ProgressSteps({ 
  steps, 
  currentStep, 
  variant = 'default',
  className = '' 
}: ProgressStepsProps) {
  
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-primary' : 'bg-base-300'
              }`} />
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-primary' : 'bg-base-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index <= currentStep 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-300 text-base-content/50'
              }`}>
                {index < currentStep ? <FiCheck className="w-4 h-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-colors ${
                  index < currentStep ? 'bg-primary' : 'bg-base-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-base-content">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={className}>
      {/* Progress indicators */}
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
              index <= currentStep 
                ? 'bg-primary text-primary-content shadow-lg scale-110' 
                : 'bg-base-300 text-base-content/50 scale-100'
            }`}>
              {index < currentStep ? (
                <FiCheck className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
              
              {/* Active step pulse effect */}
              {index === currentStep && (
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25"></div>
              )}
            </div>
            
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-all duration-500 ${
                index < currentStep 
                  ? 'bg-primary shadow-sm' 
                  : 'bg-base-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current step info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-base-content mb-2">
          {steps[currentStep]?.title}
        </h2>
        {steps[currentStep]?.description && (
          <p className="text-base-content/70 max-w-lg mx-auto">
            {steps[currentStep].description}
          </p>
        )}
      </div>
    </div>
  )
}