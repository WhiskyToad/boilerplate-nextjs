// Stripe Configuration for Free/Pro/Teams Pricing
// Monthly and Annual pricing with standard discounts

export const STRIPE_CONFIG = {
  products: {
    pro: 'prod_pro',        // Pro plan (both monthly/annual)
    teams: 'prod_teams',    // Teams plan (both monthly/annual)
  },
  prices: {
    pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',     // $19/month
    pro_annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',       // $189/year (save $39/year)
    teams_monthly: process.env.STRIPE_TEAMS_MONTHLY_PRICE_ID || 'price_teams_monthly', // $49/month
    teams_annual: process.env.STRIPE_TEAMS_ANNUAL_PRICE_ID || 'price_teams_annual',   // $489/year (save $99/year)
  }
} as const;

export const TIER_PRICING = {
  free: {
    name: 'Free',
    price: 0,
    interval: null,
    projects: 1,
    apiCalls: 1000,
    teamMembers: 1,
    features: ['Basic dashboard', 'Community support', 'Core features', 'Documentation access']
  },
  pro: {
    name: 'Pro', 
    priceMonthly: 19,
    priceAnnual: 189,
    saveAnnual: 39, // ~2 months free
    projects: 5,
    apiCalls: 10000,
    teamMembers: 3,
    features: ['Advanced analytics', 'Email notifications', 'API access', 'Custom branding', 'Priority support', 'Advanced integrations']
  },
  teams: {
    name: 'Teams',
    priceMonthly: 49,
    priceAnnual: 489,
    saveAnnual: 99, // ~2 months free
    projects: -1, // unlimited
    apiCalls: 100000,
    teamMembers: -1, // unlimited
    features: ['Everything in Pro', 'Team collaboration', 'User roles & permissions', 'Advanced security', 'Custom integrations', 'White-label options']
  }
} as const;

// Helper function to get price ID based on tier and interval
export function getStripePrice(tier: 'pro' | 'teams', interval: 'monthly' | 'annual'): string {
  const priceKey = `${tier}_${interval}` as keyof typeof STRIPE_CONFIG.prices;
  return STRIPE_CONFIG.prices[priceKey];
}

// Helper function to get tier limits
export function getTierLimits(tier: keyof typeof TIER_PRICING) {
  const tierInfo = TIER_PRICING[tier];
  return {
    projects: tierInfo.projects,
    apiCalls: tierInfo.apiCalls,
    teamMembers: tierInfo.teamMembers,
  };
}

// Helper function to normalize legacy tier names
export function normalizeTierName(tier: string): keyof typeof TIER_PRICING {
  if (tier === 'monthly' || tier === 'annual') return 'pro';
  if (tier === 'teams') return 'teams';
  return 'free';
}

export type TierName = keyof typeof TIER_PRICING;
export type BillingInterval = 'monthly' | 'annual';