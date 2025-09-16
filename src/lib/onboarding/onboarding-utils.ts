import { OnboardingStep } from '@/components/onboarding/OnboardingProvider'

// Predefined onboarding templates for different use cases
export const OnboardingTemplates = {
  // Basic SaaS onboarding
  basicSaas: [
    {
      id: 'welcome',
      title: 'Welcome to the Platform',
      description: 'Get started with your new account',
      isRequired: false,
      canSkip: true,
    },
    {
      id: 'profile-setup',
      title: 'Complete Your Profile',
      description: 'Tell us about yourself',
      isRequired: true,
      canSkip: false,
    },
    {
      id: 'create-project',
      title: 'Create Your First Project',
      description: 'Set up your workspace',
      isRequired: true,
      canSkip: false,
    },
    {
      id: 'explore-features',
      title: 'Explore Key Features',
      description: 'Learn what you can do',
      isRequired: false,
      canSkip: true,
    },
    {
      id: 'completion',
      title: 'You\'re All Set!',
      description: 'Ready to get started',
      isRequired: false,
      canSkip: false,
    },
  ] as OnboardingStep[],

  // Quick setup for power users
  quickSetup: [
    {
      id: 'welcome',
      title: 'Quick Setup',
      description: 'Fast track to getting started',
      isRequired: false,
      canSkip: true,
    },
    {
      id: 'essentials',
      title: 'Essential Settings',
      description: 'Configure the basics',
      isRequired: true,
      canSkip: false,
    },
    {
      id: 'completion',
      title: 'Ready to Go!',
      description: 'Setup complete',
      isRequired: false,
      canSkip: false,
    },
  ] as OnboardingStep[],

  // Comprehensive walkthrough
  comprehensive: [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Let\'s get you started',
      isRequired: false,
      canSkip: true,
    },
    {
      id: 'profile-setup',
      title: 'Profile Setup',
      description: 'Complete your profile',
      isRequired: true,
      canSkip: false,
    },
    {
      id: 'team-setup',
      title: 'Team Setup',
      description: 'Invite your team members',
      isRequired: false,
      canSkip: true,
    },
    {
      id: 'project-creation',
      title: 'Create Project',
      description: 'Set up your first project',
      isRequired: true,
      canSkip: false,
    },
    {
      id: 'integrations',
      title: 'Connect Integrations',
      description: 'Connect your favorite tools',
      isRequired: false,
      canSkip: true,
    },
    {
      id: 'feature-tour',
      title: 'Feature Tour',
      description: 'Explore what you can do',
      isRequired: false,
      canSkip: true,
    },
    {
      id: 'completion',
      title: 'All Done!',
      description: 'You\'re ready to go',
      isRequired: false,
      canSkip: false,
    },
  ] as OnboardingStep[],
}

// Utility functions for onboarding management
export class OnboardingUtils {
  // Generate a custom onboarding flow based on user type
  static generateCustomFlow(
    userType: 'beginner' | 'intermediate' | 'expert',
    features: string[] = []
  ): OnboardingStep[] {
    const baseSteps = OnboardingTemplates.basicSaas

    if (userType === 'expert') {
      return OnboardingTemplates.quickSetup
    }

    if (userType === 'intermediate') {
      // Remove some tutorial steps for intermediate users
      return baseSteps.filter(step => 
        !['explore-features'].includes(step.id)
      )
    }

    // Beginner gets comprehensive flow
    return OnboardingTemplates.comprehensive
  }

  // Check if user should see onboarding based on various factors
  static shouldShowOnboarding(
    user: any,
    options: {
      skipForReturningUsers?: boolean
      triggerOnFirstVisit?: boolean
      accountAge?: number // in days
      hasCompletedActions?: boolean
    } = {}
  ): boolean {
    const {
      skipForReturningUsers = true,
      triggerOnFirstVisit = true,
      accountAge = 7,
      hasCompletedActions = false,
    } = options

    if (!user) return false

    // Skip if user has completed onboarding before
    if (skipForReturningUsers) {
      const completedKey = `onboarding_completed_${user.id}`
      if (localStorage.getItem(completedKey)) {
        return false
      }
    }

    // Skip if user account is too old (assume they don't need onboarding)
    if (user.created_at) {
      const accountCreatedAt = new Date(user.created_at)
      const daysSinceCreation = (Date.now() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceCreation > accountAge) {
        return false
      }
    }

    // Skip if user has already performed key actions
    if (hasCompletedActions) {
      return false
    }

    // Check first visit trigger
    if (triggerOnFirstVisit) {
      const firstVisitKey = `first_visit_${user.id}`
      const hasVisited = localStorage.getItem(firstVisitKey)
      
      if (!hasVisited) {
        localStorage.setItem(firstVisitKey, 'true')
        return true
      }
    }

    return true
  }

  // Save onboarding progress
  static saveProgress(
    userId: string,
    progress: {
      currentStepIndex: number
      completedSteps: string[]
      skippedSteps: string[]
      isCompleted: boolean
    }
  ): void {
    const key = `onboarding_progress_${userId}`
    localStorage.setItem(key, JSON.stringify({
      ...progress,
      lastUpdated: new Date().toISOString(),
    }))
  }

  // Load onboarding progress
  static loadProgress(userId: string): {
    currentStepIndex: number
    completedSteps: string[]
    skippedSteps: string[]
    isCompleted: boolean
    lastUpdated?: string
  } | null {
    const key = `onboarding_progress_${userId}`
    const saved = localStorage.getItem(key)
    
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Failed to parse onboarding progress:', error)
      }
    }
    
    return null
  }

  // Mark onboarding as completed
  static markCompleted(userId: string): void {
    const key = `onboarding_completed_${userId}`
    localStorage.setItem(key, JSON.stringify({
      completed: true,
      completedAt: new Date().toISOString(),
    }))
  }

  // Reset onboarding state
  static resetOnboarding(userId: string): void {
    const keys = [
      `onboarding_progress_${userId}`,
      `onboarding_completed_${userId}`,
      `first_visit_${userId}`,
    ]
    
    keys.forEach(key => localStorage.removeItem(key))
  }

  // Get onboarding statistics
  static getStats(userId: string): {
    hasStarted: boolean
    isCompleted: boolean
    completionRate: number
    stepsCompleted: number
    stepsSkipped: number
    totalSteps: number
    timeSpent?: number
  } {
    const progress = this.loadProgress(userId)
    const completed = localStorage.getItem(`onboarding_completed_${userId}`)
    
    if (!progress) {
      return {
        hasStarted: false,
        isCompleted: !!completed,
        completionRate: 0,
        stepsCompleted: 0,
        stepsSkipped: 0,
        totalSteps: 0,
      }
    }

    const totalSteps = progress.completedSteps.length + progress.skippedSteps.length
    const completionRate = totalSteps > 0 ? (progress.completedSteps.length / totalSteps) * 100 : 0

    return {
      hasStarted: true,
      isCompleted: progress.isCompleted,
      completionRate,
      stepsCompleted: progress.completedSteps.length,
      stepsSkipped: progress.skippedSteps.length,
      totalSteps,
    }
  }
}