'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export interface OnboardingStep {
  id: string
  title: string
  description?: string
  component?: React.ComponentType<OnboardingStepProps>
  isRequired?: boolean
  isCompleted?: boolean
  canSkip?: boolean
}

export interface OnboardingStepProps {
  step: OnboardingStep
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  onComplete: () => void
  currentStepIndex: number
  totalSteps: number
  isFirst: boolean
  isLast: boolean
}

interface OnboardingState {
  isActive: boolean
  currentStepIndex: number
  steps: OnboardingStep[]
  completedSteps: Set<string>
  skippedSteps: Set<string>
}

type OnboardingAction =
  | { type: 'START_ONBOARDING'; steps: OnboardingStep[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SKIP_STEP' }
  | { type: 'COMPLETE_STEP'; stepId: string }
  | { type: 'GO_TO_STEP'; stepIndex: number }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'RESET_ONBOARDING' }

const initialState: OnboardingState = {
  isActive: false,
  currentStepIndex: 0,
  steps: [],
  completedSteps: new Set(),
  skippedSteps: new Set(),
}

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'START_ONBOARDING':
      return {
        ...state,
        isActive: true,
        currentStepIndex: 0,
        steps: action.steps,
        completedSteps: new Set(),
        skippedSteps: new Set(),
      }

    case 'NEXT_STEP':
      if (state.currentStepIndex < state.steps.length - 1) {
        return {
          ...state,
          currentStepIndex: state.currentStepIndex + 1,
        }
      }
      return { ...state, isActive: false }

    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStepIndex: Math.max(0, state.currentStepIndex - 1),
      }

    case 'SKIP_STEP': {
      const currentStep = state.steps[state.currentStepIndex]
      const newSkippedSteps = new Set(state.skippedSteps)
      newSkippedSteps.add(currentStep.id)
      
      return {
        ...state,
        skippedSteps: newSkippedSteps,
        currentStepIndex: state.currentStepIndex < state.steps.length - 1 
          ? state.currentStepIndex + 1 
          : state.currentStepIndex,
        isActive: state.currentStepIndex >= state.steps.length - 1 ? false : state.isActive,
      }
    }

    case 'COMPLETE_STEP': {
      const newCompletedSteps = new Set(state.completedSteps)
      newCompletedSteps.add(action.stepId)
      
      return {
        ...state,
        completedSteps: newCompletedSteps,
        currentStepIndex: state.currentStepIndex < state.steps.length - 1 
          ? state.currentStepIndex + 1 
          : state.currentStepIndex,
        isActive: state.currentStepIndex >= state.steps.length - 1 ? false : state.isActive,
      }
    }

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStepIndex: Math.max(0, Math.min(action.stepIndex, state.steps.length - 1)),
      }

    case 'FINISH_ONBOARDING':
      return {
        ...state,
        isActive: false,
      }

    case 'RESET_ONBOARDING':
      return initialState

    default:
      return state
  }
}

interface OnboardingContextType {
  state: OnboardingState
  startOnboarding: (steps: OnboardingStep[]) => void
  nextStep: () => void
  previousStep: () => void
  skipStep: () => void
  completeStep: (stepId: string) => void
  goToStep: (stepIndex: number) => void
  finishOnboarding: () => void
  resetOnboarding: () => void
  getCurrentStep: () => OnboardingStep | null
  getProgress: () => number
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

interface OnboardingProviderProps {
  children: React.ReactNode
  persistKey?: string
}

export function OnboardingProvider({ children, persistKey = 'onboarding' }: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)
  const { user } = useAuth()

  // Persist onboarding state
  useEffect(() => {
    if (!user || !persistKey) return

    const savedState = localStorage.getItem(`${persistKey}_${user.id}`)
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        if (parsed.completedSteps) {
          // Restore completed steps
          parsed.completedSteps.forEach((stepId: string) => {
            dispatch({ type: 'COMPLETE_STEP', stepId })
          })
        }
      } catch (error) {
        console.error('Failed to parse saved onboarding state:', error)
      }
    }
  }, [user, persistKey])

  // Save state changes
  useEffect(() => {
    if (!user || !persistKey) return

    const stateToSave = {
      completedSteps: Array.from(state.completedSteps),
      skippedSteps: Array.from(state.skippedSteps),
      isCompleted: !state.isActive && state.steps.length > 0,
    }

    localStorage.setItem(`${persistKey}_${user.id}`, JSON.stringify(stateToSave))
  }, [state, user, persistKey])

  const contextValue: OnboardingContextType = {
    state,
    startOnboarding: (steps: OnboardingStep[]) => {
      dispatch({ type: 'START_ONBOARDING', steps })
    },
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    previousStep: () => dispatch({ type: 'PREVIOUS_STEP' }),
    skipStep: () => dispatch({ type: 'SKIP_STEP' }),
    completeStep: (stepId: string) => dispatch({ type: 'COMPLETE_STEP', stepId }),
    goToStep: (stepIndex: number) => dispatch({ type: 'GO_TO_STEP', stepIndex }),
    finishOnboarding: () => dispatch({ type: 'FINISH_ONBOARDING' }),
    resetOnboarding: () => dispatch({ type: 'RESET_ONBOARDING' }),
    getCurrentStep: () => state.steps[state.currentStepIndex] || null,
    getProgress: () => {
      if (state.steps.length === 0) return 0
      return ((state.currentStepIndex + 1) / state.steps.length) * 100
    },
  }

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}