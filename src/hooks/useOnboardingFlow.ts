'use client'

import { useEffect } from 'react'
import { useOnboarding, OnboardingStep } from '@/components/onboarding/OnboardingProvider'
import { useAuth } from '@/hooks/useAuth'
import { WelcomeStep } from '@/components/onboarding/steps/WelcomeStep'
import { ProfileSetupStep } from '@/components/onboarding/steps/ProfileSetupStep'
import { FeatureTourStep } from '@/components/onboarding/steps/FeatureTourStep'
import { CompletionStep } from '@/components/onboarding/steps/CompletionStep'

export interface OnboardingConfig {
  autoStart?: boolean
  skipForReturningUsers?: boolean
  triggerOnFirstVisit?: boolean
  steps?: OnboardingStep[]
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Welcome to the platform',
    component: WelcomeStep,
    isRequired: false,
    canSkip: true,
  },
  {
    id: 'profile-setup',
    title: 'Set up your profile',
    description: 'Complete your profile information',
    component: ProfileSetupStep,
    isRequired: true,
    canSkip: false,
  },
  {
    id: 'feature-tour',
    title: 'Feature Tour',
    description: 'Learn about key features',
    component: FeatureTourStep,
    isRequired: false,
    canSkip: true,
  },
  {
    id: 'completion',
    title: 'You\'re all set!',
    description: 'Onboarding complete',
    component: CompletionStep,
    isRequired: false,
    canSkip: false,
  },
]

export function useOnboardingFlow(config: OnboardingConfig = {}) {
  const {
    autoStart = true,
    skipForReturningUsers = true,
    triggerOnFirstVisit = true,
    steps = defaultSteps,
  } = config

  const { user } = useAuth()
  const { startOnboarding, state, finishOnboarding } = useOnboarding()

  // Check if user should see onboarding
  const shouldShowOnboarding = () => {
    if (!user) return false

    // Check if user has completed onboarding before
    const onboardingKey = `onboarding_${user.id}`
    const savedState = localStorage.getItem(onboardingKey)
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        if (parsed.isCompleted && skipForReturningUsers) {
          return false
        }
      } catch (error) {
        console.error('Failed to parse onboarding state:', error)
      }
    }

    // Check if this is first visit
    if (triggerOnFirstVisit) {
      const firstVisitKey = `first_visit_${user.id}`
      const hasVisited = localStorage.getItem(firstVisitKey)
      
      if (!hasVisited) {
        localStorage.setItem(firstVisitKey, 'true')
        return true
      }
      
      return !hasVisited
    }

    return true
  }

  // Auto-start onboarding
  useEffect(() => {
    if (autoStart && user && shouldShowOnboarding() && !state.isActive) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        startOnboarding(steps)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [user, autoStart, startOnboarding, state.isActive, steps])

  // Manual trigger functions
  const triggerOnboarding = () => {
    startOnboarding(steps)
  }

  const resetOnboarding = () => {
    if (user) {
      const onboardingKey = `onboarding_${user.id}`
      const firstVisitKey = `first_visit_${user.id}`
      localStorage.removeItem(onboardingKey)
      localStorage.removeItem(firstVisitKey)
      triggerOnboarding()
    }
  }

  const skipOnboarding = () => {
    finishOnboarding()
  }

  // Get onboarding progress
  const getOnboardingProgress = () => {
    if (!user) return null

    const onboardingKey = `onboarding_${user.id}`
    const savedState = localStorage.getItem(onboardingKey)
    
    if (savedState) {
      try {
        return JSON.parse(savedState)
      } catch (error) {
        console.error('Failed to parse onboarding progress:', error)
      }
    }
    
    return null
  }

  // Check if specific step is completed
  const isStepCompleted = (stepId: string) => {
    return state.completedSteps.has(stepId)
  }

  // Check if onboarding was ever completed
  const hasCompletedOnboarding = () => {
    if (!user) return false
    
    const progress = getOnboardingProgress()
    return progress?.isCompleted || false
  }

  return {
    // State
    isActive: state.isActive,
    currentStep: state.steps[state.currentStepIndex],
    currentStepIndex: state.currentStepIndex,
    totalSteps: state.steps.length,
    completedSteps: state.completedSteps,
    skippedSteps: state.skippedSteps,
    
    // Actions
    triggerOnboarding,
    resetOnboarding,
    skipOnboarding,
    
    // Utils
    shouldShowOnboarding: shouldShowOnboarding(),
    hasCompletedOnboarding: hasCompletedOnboarding(),
    isStepCompleted,
    getOnboardingProgress,
  }
}