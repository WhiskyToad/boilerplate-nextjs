'use client'

import { FiPlayCircle, FiRefreshCw } from 'react-icons/fi'
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow'
import { OnboardingModal } from './OnboardingModal'
import { OnboardingTour } from './OnboardingTour'

interface OnboardingTriggerProps {
  variant?: 'button' | 'banner' | 'floating'
  showResetOption?: boolean
  className?: string
  tourSteps?: Array<{
    target: string
    title: string
    content: string
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>
}

export function OnboardingTrigger({
  variant = 'button',
  showResetOption = false,
  className = '',
  tourSteps = [],
}: OnboardingTriggerProps) {
  const {
    isActive,
    triggerOnboarding,
    resetOnboarding,
    hasCompletedOnboarding,
  } = useOnboardingFlow()

  if (variant === 'banner' && hasCompletedOnboarding) {
    return null
  }

  const handleStartOnboarding = () => {
    triggerOnboarding()
  }

  const handleResetOnboarding = () => {
    resetOnboarding()
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-primary/10 border border-primary/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <FiPlayCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Get started with a quick tour</h3>
              <p className="text-sm text-base-content/70">
                Learn how to make the most of the platform in just a few minutes.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStartOnboarding}
              className="btn btn-primary btn-sm"
            >
              Start Tour
            </button>
            <button className="btn btn-ghost btn-sm">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="dropdown dropdown-top dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-primary btn-circle">
            <FiPlayCircle className="w-5 h-5" />
          </div>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
            <li>
              <button onClick={handleStartOnboarding} className="gap-2">
                <FiPlayCircle className="w-4 h-4" />
                {hasCompletedOnboarding ? 'Restart Tour' : 'Start Tour'}
              </button>
            </li>
            {showResetOption && hasCompletedOnboarding && (
              <li>
                <button onClick={handleResetOnboarding} className="gap-2">
                  <FiRefreshCw className="w-4 h-4" />
                  Reset Progress
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    )
  }

  // Default button variant
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleStartOnboarding}
        className="btn btn-primary gap-2"
      >
        <FiPlayCircle className="w-4 h-4" />
        {hasCompletedOnboarding ? 'Restart Onboarding' : 'Start Onboarding'}
      </button>
      
      {showResetOption && hasCompletedOnboarding && (
        <button
          onClick={handleResetOnboarding}
          className="btn btn-outline gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          Reset Progress
        </button>
      )}
      
      {/* Render the actual onboarding components */}
      {isActive && <OnboardingModal />}
      
      {/* Optional tour overlay */}
      {tourSteps.length > 0 && (
        <OnboardingTour
          steps={tourSteps}
          onComplete={() => console.log('Tour completed')}
        />
      )}
    </div>
  )
}