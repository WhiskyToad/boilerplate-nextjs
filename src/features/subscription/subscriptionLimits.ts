/**
 * Configuration for feature limitations based on subscription status
 */
export const SUBSCRIPTION_LIMITS = {
  FREE: {
    maxProjects: 1,
    maxFeaturesPerProject: 8, // Enough for the initial "WOW" moment
    enabledFeatures: [
      'blueprint', // Allow blueprint generation
      'fundamentals', // Show essential features
      'core_preview', // Show but not enable customization of core features
    ],
    disabledFeatures: [
      'multiple_projects',
      'prioritization',
      'roadmap',
      'tasks',
      'validation',
      'launch',
    ],
  },
  PAID: {
    maxProjects: Infinity,
    maxFeaturesPerProject: Infinity,
    enabledFeatures: [
      'blueprint',
      'fundamentals',
      'core',
      'features',
      'prioritization',
      'roadmap',
      'tasks',
      'validation',
      'launch',
      'multiple_projects',
    ],
    disabledFeatures: [],
  }
};

/**
 * Helper function to check if a feature is available for a subscription type
 */
export function isFeatureAvailable(feature: string, isPaid: boolean): boolean {
  const plan = isPaid ? SUBSCRIPTION_LIMITS.PAID : SUBSCRIPTION_LIMITS.FREE;
  return plan.enabledFeatures.includes(feature);
}

/**
 * Helper function to get the maximum number of features allowed for a subscription
 */
export function getMaxFeaturesAllowed(isPaid: boolean): number {
  return isPaid ? SUBSCRIPTION_LIMITS.PAID.maxFeaturesPerProject : SUBSCRIPTION_LIMITS.FREE.maxFeaturesPerProject;
}
