'use client'

import { OnboardingStepProps } from '../OnboardingProvider'
import { FiCheck, FiArrowRight, FiBook, FiHelpCircle } from 'react-icons/fi'

export function CompletionStep({ onComplete }: OnboardingStepProps) {
  const nextSteps = [
    {
      icon: FiArrowRight,
      title: 'Create your first project',
      description: 'Start by setting up your first project to organize your work.',
      action: 'Create Project',
    },
    {
      icon: FiBook,
      title: 'Read the documentation',
      description: 'Learn about advanced features and best practices.',
      action: 'View Docs',
    },
    {
      icon: FiHelpCircle,
      title: 'Get help when you need it',
      description: 'Access our support resources and community.',
      action: 'Get Support',
    },
  ]

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="w-10 h-10 text-success" />
        </div>
        <h3 className="text-2xl font-bold mb-2">You're all set!</h3>
        <p className="text-base-content/70 max-w-md mx-auto">
          Congratulations! You've completed the onboarding process. You're now ready to make the most of the platform.
        </p>
      </div>

      <div className="bg-base-200 rounded-lg p-6 mb-8">
        <h4 className="font-semibold mb-4">What's next?</h4>
        <div className="space-y-4">
          {nextSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-base-100 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h5 className="font-medium">{step.title}</h5>
                  <p className="text-sm text-base-content/70">{step.description}</p>
                </div>
                <button className="btn btn-outline btn-sm">
                  {step.action}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onComplete}
          className="btn btn-primary btn-lg gap-2"
        >
          <FiCheck className="w-5 h-5" />
          Finish Onboarding
        </button>
        <button
          className="btn btn-outline btn-lg gap-2"
        >
          <FiBook className="w-5 h-5" />
          View Documentation
        </button>
      </div>

      <p className="text-xs text-base-content/50 mt-6">
        You can always restart this onboarding tour from your settings.
      </p>
    </div>
  )
}