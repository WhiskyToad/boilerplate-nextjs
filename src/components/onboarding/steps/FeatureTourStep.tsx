'use client'

import { OnboardingStepProps } from '../OnboardingProvider'
import { FiLayout, FiSettings, FiBarChart, FiUsers } from 'react-icons/fi'

export function FeatureTourStep({ onNext }: OnboardingStepProps) {
  const features = [
    {
      icon: FiLayout,
      title: 'Dashboard',
      description: 'Your central hub for managing all your projects and activities.',
      color: 'text-primary',
    },
    {
      icon: FiBarChart,
      title: 'Analytics',
      description: 'Track your progress with detailed insights and reports.',
      color: 'text-success',
    },
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Work together with your team members seamlessly.',
      color: 'text-warning',
    },
    {
      icon: FiSettings,
      title: 'Customization',
      description: 'Personalize your workspace to match your workflow.',
      color: 'text-info',
    },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-2">Explore Key Features</h3>
        <p className="text-base-content/70">
          Here are some of the powerful features that will help you achieve your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-base-200 rounded-lg p-6 hover:bg-base-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-base-100 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-base-content/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <h4 className="font-semibold mb-2">Ready to explore?</h4>
        <p className="text-sm text-base-content/70 mb-4">
          You can always access these features from the main navigation menu.
        </p>
        <button
          onClick={onNext}
          className="btn btn-primary"
        >
          Continue Tour
        </button>
      </div>
    </div>
  )
}