/**
 * Unified Analytics Service
 * Combines PostHog and admin analytics into a single, clean interface
 */

import { posthog } from './posthog'

interface AnalyticsEvent {
  userId?: string
  event: string
  properties?: Record<string, any>
  projectId?: string
}

class AnalyticsService {
  /**
   * Track any event in both PostHog and admin analytics
   */
  async track({ userId, event, properties = {}, projectId }: AnalyticsEvent): Promise<void> {
    try {
      // PostHog tracking (client-side)
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        posthog.capture(event, {
          ...properties,
          project_id: projectId,
          user_id: userId,
        })
      }

      // Admin analytics tracking (server-side)
      if (userId) {
        await fetch('/api/admin/track-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            eventType: event,
            eventData: properties,
            projectId
          })
        }).catch(error => {
          console.warn('Admin analytics tracking failed:', error)
        })
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }

  // Convenience methods for common events
  async trackProjectCreated(userId: string, projectId: string, projectName: string) {
    await this.track({
      userId,
      event: 'project_created',
      projectId,
      properties: { project_name: projectName }
    })
  }

  async trackProjectActivated(userId: string, projectId: string, feedbackType: string, daysToActivation: number) {
    await this.track({
      userId,
      event: 'project_activated',
      projectId,
      properties: { 
        feedback_type: feedbackType,
        days_to_activation: daysToActivation
      }
    })
  }

  async trackUserReturnedToDashboard(userId: string, projectId: string, daysAfterCreation: number) {
    await this.track({
      userId,
      event: 'user_returned_to_dashboard',
      projectId,
      properties: { days_after_creation: daysAfterCreation }
    })
  }

  async trackWidgetFirstOpened(projectId: string, domain: string) {
    await this.track({
      event: 'widget_first_opened',
      projectId,
      properties: { 
        domain,
        timestamp: new Date().toISOString()
      }
    })
  }
}

export const analytics = new AnalyticsService()