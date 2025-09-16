import { useAnalytics } from '@/hooks/useAnalytics'

export interface OnboardingAnalyticsEvent {
  step_id: string
  step_title: string
  step_index: number
  total_steps: number
  action: 'started' | 'completed' | 'skipped' | 'abandoned'
  duration_ms?: number
  user_id?: string
}

export class OnboardingAnalytics {
  private analytics: ReturnType<typeof useAnalytics> | null = null
  private stepStartTimes: Map<string, number> = new Map()

  constructor(analytics?: ReturnType<typeof useAnalytics>) {
    this.analytics = analytics || null
  }

  // Track when onboarding starts
  trackOnboardingStarted(totalSteps: number, userId?: string) {
    this.analytics?.track('onboarding_started', {
      total_steps: totalSteps,
      user_id: userId,
      timestamp: new Date().toISOString(),
    })
  }

  // Track when a step is entered
  trackStepStarted(stepId: string, stepTitle: string, stepIndex: number, totalSteps: number) {
    this.stepStartTimes.set(stepId, Date.now())
    
    this.analytics?.track('onboarding_step_started', {
      step_id: stepId,
      step_title: stepTitle,
      step_index: stepIndex,
      total_steps: totalSteps,
      timestamp: new Date().toISOString(),
    })
  }

  // Track when a step is completed
  trackStepCompleted(stepId: string, stepTitle: string, stepIndex: number, totalSteps: number) {
    const startTime = this.stepStartTimes.get(stepId)
    const duration = startTime ? Date.now() - startTime : undefined
    
    this.analytics?.track('onboarding_step_completed', {
      step_id: stepId,
      step_title: stepTitle,
      step_index: stepIndex,
      total_steps: totalSteps,
      duration_ms: duration,
      timestamp: new Date().toISOString(),
    })

    this.stepStartTimes.delete(stepId)
  }

  // Track when a step is skipped
  trackStepSkipped(stepId: string, stepTitle: string, stepIndex: number, totalSteps: number) {
    const startTime = this.stepStartTimes.get(stepId)
    const duration = startTime ? Date.now() - startTime : undefined
    
    this.analytics?.track('onboarding_step_skipped', {
      step_id: stepId,
      step_title: stepTitle,
      step_index: stepIndex,
      total_steps: totalSteps,
      duration_ms: duration,
      timestamp: new Date().toISOString(),
    })

    this.stepStartTimes.delete(stepId)
  }

  // Track when onboarding is completed
  trackOnboardingCompleted(totalSteps: number, completedSteps: number, skippedSteps: number, userId?: string) {
    this.analytics?.track('onboarding_completed', {
      total_steps: totalSteps,
      completed_steps: completedSteps,
      skipped_steps: skippedSteps,
      completion_rate: completedSteps / totalSteps,
      user_id: userId,
      timestamp: new Date().toISOString(),
    })
  }

  // Track when onboarding is abandoned
  trackOnboardingAbandoned(stepId: string, stepIndex: number, totalSteps: number, userId?: string) {
    this.analytics?.track('onboarding_abandoned', {
      abandoned_at_step: stepId,
      abandoned_at_index: stepIndex,
      total_steps: totalSteps,
      progress_percentage: (stepIndex / totalSteps) * 100,
      user_id: userId,
      timestamp: new Date().toISOString(),
    })
  }

  // Track custom onboarding events
  trackCustomEvent(eventName: string, properties: Record<string, any>) {
    this.analytics?.track(`onboarding_${eventName}`, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  }

  // Get onboarding metrics summary
  getMetricsSummary() {
    return {
      active_steps: this.stepStartTimes.size,
      step_start_times: Object.fromEntries(this.stepStartTimes),
    }
  }

  // Clear tracking data
  reset() {
    this.stepStartTimes.clear()
  }
}

// Hook for using onboarding analytics
export function useOnboardingAnalytics() {
  const analytics = useAnalytics()
  
  return new OnboardingAnalytics(analytics)
}