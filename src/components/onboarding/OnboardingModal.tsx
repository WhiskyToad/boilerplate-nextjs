'use client'

import { useOnboarding } from './OnboardingProvider'
import { FiX, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi'

interface OnboardingModalProps {
  onClose?: () => void
  showProgress?: boolean
  allowClose?: boolean
  className?: string
}

export function OnboardingModal({ 
  onClose, 
  showProgress = true, 
  allowClose = true,
  className = '' 
}: OnboardingModalProps) {
  const { 
    state, 
    nextStep, 
    previousStep, 
    skipStep, 
    completeStep, 
    finishOnboarding,
    getCurrentStep,
    getProgress 
  } = useOnboarding()

  if (!state.isActive) return null

  const currentStep = getCurrentStep()
  if (!currentStep) return null

  const progress = getProgress()
  const isFirst = state.currentStepIndex === 0
  const isLast = state.currentStepIndex === state.steps.length - 1

  const handleNext = () => {
    if (currentStep.isRequired && !state.completedSteps.has(currentStep.id)) {
      // Step is required but not completed
      return
    }
    nextStep()
  }

  const handleSkip = () => {
    if (!currentStep.canSkip) return
    skipStep()
  }

  const handleComplete = () => {
    completeStep(currentStep.id)
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      finishOnboarding()
    }
  }

  const StepComponent = currentStep.component

  return (
    <div className="modal modal-open">
      <div className={`modal-box max-w-2xl ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{currentStep.title}</h2>
            {currentStep.description && (
              <p className="text-base-content/70 mt-1">{currentStep.description}</p>
            )}
          </div>
          
          {allowClose && (
            <button 
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-base-content/70">
                Step {state.currentStepIndex + 1} of {state.steps.length}
              </span>
              <span className="text-sm text-base-content/70">
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {StepComponent ? (
            <StepComponent
              step={currentStep}
              onNext={handleNext}
              onPrevious={previousStep}
              onSkip={handleSkip}
              onComplete={handleComplete}
              currentStepIndex={state.currentStepIndex}
              totalSteps={state.steps.length}
              isFirst={isFirst}
              isLast={isLast}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-base-content/70">
                {currentStep.description || 'No content for this step.'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={previousStep}
              disabled={isFirst}
              className="btn btn-outline btn-sm gap-2"
            >
              <FiChevronLeft className="w-4 h-4" />
              Previous
            </button>
          </div>

          <div className="flex gap-2">
            {currentStep.canSkip && (
              <button
                onClick={handleSkip}
                className="btn btn-ghost btn-sm"
              >
                Skip
              </button>
            )}
            
            {currentStep.isRequired ? (
              <button
                onClick={handleComplete}
                disabled={state.completedSteps.has(currentStep.id)}
                className="btn btn-primary btn-sm gap-2"
              >
                <FiCheck className="w-4 h-4" />
                {state.completedSteps.has(currentStep.id) ? 'Completed' : 'Complete'}
              </button>
            ) : isLast ? (
              <button
                onClick={finishOnboarding}
                className="btn btn-primary btn-sm gap-2"
              >
                <FiCheck className="w-4 h-4" />
                Finish
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn btn-primary btn-sm gap-2"
              >
                Next
                <FiChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {state.steps.map((step, index) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === state.currentStepIndex
                  ? 'bg-primary'
                  : index < state.currentStepIndex || state.completedSteps.has(step.id)
                  ? 'bg-success'
                  : state.skippedSteps.has(step.id)
                  ? 'bg-warning'
                  : 'bg-base-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}