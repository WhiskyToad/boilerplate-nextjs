'use client'

import { posthog } from '@/lib/posthog'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { hasAnalyticsConsent } from '@/components/legal/CookieConsent'

export function useAnalytics() {
  const { user } = useAuth()

  // Identify user when they log in (only if consent given)
  useEffect(() => {
    if (user && hasAnalyticsConsent()) {
      posthog.identify(user.id, {
        email: user.email,
        created_at: user.created_at,
      })
    }
  }, [user])

  const track = (event: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'production') {
      // Basic events work cookieless, enhanced features need consent
      posthog.capture(event, properties)
    }
  }

  const trackSubscription = (tier: string, action: 'started' | 'completed' | 'cancelled') => {
    track(`subscription_${action}`, {
      tier,
      user_id: user?.id,
    })
  }

  const trackFeedback = (type: 'feedback' | 'bug' | 'review', properties?: Record<string, any>) => {
    track('feedback_submitted', {
      feedback_type: type,
      user_id: user?.id,
      ...properties,
    })
  }

  const trackProject = (action: 'created' | 'deleted', projectName?: string) => {
    track(`project_${action}`, {
      project_name: projectName,
      user_id: user?.id,
    })
  }

  const trackOnboarding = (step: string) => {
    track('onboarding_step', {
      step,
      user_id: user?.id,
    })
  }

  const trackWidgetFirstOpened = (projectId: string, domain?: string, userAgent?: string) => {
    track('widget_first_opened', {
      project_id: projectId,
      domain,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    })
  }

  const trackProjectActivated = (projectId: string, daysToActivation: number, firstFeedbackType: string) => {
    track('project_activated', {
      project_id: projectId,
      days_to_activation: daysToActivation,
      first_feedback_type: firstFeedbackType,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
    })
  }

  const trackUserReturnedToDashboard = (projectId: string, daysAfterCreation: number) => {
    track('user_returned_to_dashboard', {
      project_id: projectId,
      days_after_creation: daysAfterCreation,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
    })
  }

  return {
    track,
    trackSubscription,
    trackFeedback,
    trackProject,
    trackOnboarding,
    trackWidgetFirstOpened,
    trackProjectActivated,
    trackUserReturnedToDashboard,
    posthog,
  }
}