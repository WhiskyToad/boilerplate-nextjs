'use client'

import { OnboardingStepProps } from '../OnboardingProvider'
import { FiHeart, FiPlay } from 'react-icons/fi'

export function WelcomeStep({ onNext }: OnboardingStepProps) {
  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiHeart className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Welcome to the Platform!</h3>
        <p className="text-base-content/70 max-w-md mx-auto">
          We're excited to have you here. Let's get you set up with everything you need to get started.
        </p>
      </div>

      <div className="bg-base-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold mb-3">What you'll learn:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>How to set up your profile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Creating your first project</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Understanding key features</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Tips for getting the most value</span>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="btn btn-primary btn-lg gap-2"
      >
        <FiPlay className="w-5 h-5" />
        Let's Get Started!
      </button>
    </div>
  )
}