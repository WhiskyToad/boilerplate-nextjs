/**
 * Site Configuration
 *
 * This is the single source of truth for your site's metadata, branding, and pricing.
 * Update these values to customize your SaaS without touching multiple files.
 *
 * 🎯 This is one of the FIRST files you should edit when setting up your project!
 */

export const siteConfig = {
  // =============================================================================
  // BASIC INFO - Change these first!
  // =============================================================================
  name: "DailyReflect",
  description: "Your personal 5-minute journal for daily gratitude, reflection, and growth.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // =============================================================================
  // BRANDING
  // =============================================================================
  tagline: "5 minutes a day to a better you",
  hero: {
    title: "Start Your Day with Gratitude",
    subtitle: "A simple daily journal inspired by the 5-minute journal. Reflect, grow, and build better habits.",
  },
  keywords: ["journal", "gratitude", "daily reflection", "mindfulness", "habit tracking", "5-minute journal"],

  // =============================================================================
  // CONTACT & SUPPORT
  // =============================================================================
  email: "hello@dailyreflect.app",
  supportEmail: "support@dailyreflect.app",

  // =============================================================================
  // SOCIAL LINKS (optional - remove if not needed)
  // =============================================================================
  social: {
    twitter: "@dailyreflect",
    // linkedin: "company/dailyreflect",
    // discord: "https://discord.gg/your-server",
  },

  // =============================================================================
  // LEGAL (update with your links)
  // =============================================================================
  links: {
    privacy: "/privacy",
    terms: "/terms",
    // docs: "/docs",
    // blog: "/blog",
  },

  // =============================================================================
  // LEGAL PAGES CONTENT (easy configuration for Terms & Privacy)
  // =============================================================================
  legal: {
    companyName: "DailyReflect",
    effectiveDate: "January 1, 2025", // Update this when you launch
    contactEmail: "legal@dailyreflect.app",
    country: "United States",

    // Terms of Service - Update these to match your service
    terms: {
      serviceDescription: "a digital journaling platform that helps you practice daily gratitude and reflection",
      acceptableUse: [
        "Use the service for any illegal or unauthorized purpose",
        "Interfere with or disrupt the service",
        "Attempt to gain unauthorized access to the service",
        "Violate any laws in your jurisdiction",
      ],
      subscriptionInfo: {
        hasFreePlan: true,
        billingPeriods: ["monthly", "annually"],
        canCancelAnytime: true,
      },
    },

    // Privacy Policy - Update these to match your practices
    privacy: {
      dataCollected: [
        "Account information (email, name)",
        "Journal entries and reflections (encrypted and private)",
        "Usage data and analytics (with consent)",
        "Payment information (processed securely by Stripe)",
        "Technical information (browser type, IP address)",
      ],
      dataUsage: [
        "To provide and maintain your personal journal",
        "To process transactions and send related information",
        "To send you optional daily reminders and prompts",
        "To improve our service (with your consent for analytics)",
      ],
      thirdPartyServices: [
        { name: "Supabase", purpose: "Database and authentication" },
        { name: "Stripe", purpose: "Payment processing" },
        { name: "Resend", purpose: "Transactional emails" },
        { name: "PostHog", purpose: "Analytics (with consent)" },
      ],
      dataRetention: "We retain your data for as long as your account is active or as needed to provide services.",
      userRights: [
        "Access and update your personal information",
        "Delete your account and data",
        "Withdraw consent for analytics cookies",
        "Data portability",
      ],
    },
  },

  // =============================================================================
  // PRICING CONFIGURATION
  // =============================================================================
  // These should match your Stripe products and .env variables
  pricing: {
    free: {
      name: "Free",
      price: 0,
      priceMonthly: 0,
      priceAnnual: 0,
      description: "Perfect for getting started",
      features: [
        "Daily journal prompts",
        "Basic gratitude practice",
        "7-day entry history",
        "Mobile friendly",
      ],
      cta: "Start Journaling",
      highlighted: false,
    },

    pro: {
      name: "Premium",
      priceMonthly: 5,
      priceAnnual: 50, // Save $10/year
      description: "For committed journalers",
      features: [
        "Unlimited journal history",
        "Advanced prompts & templates",
        "Mood & habit tracking",
        "Search & insights",
        "Daily email reminders",
        "Export your data",
        "Everything in Free",
      ],
      cta: "Go Premium",
      highlighted: true, // This will be featured
      stripePriceIds: {
        monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
        annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "",
      },
    },

    teams: {
      name: "Lifetime",
      priceMonthly: 99,
      priceAnnual: 99, // One-time payment
      description: "One-time investment in yourself",
      features: [
        "Everything in Premium",
        "Lifetime access",
        "All future features included",
        "Priority support",
        "Support indie development",
        "No recurring payments",
      ],
      cta: "Get Lifetime Access",
      highlighted: false,
      stripePriceIds: {
        monthly: process.env.STRIPE_TEAMS_MONTHLY_PRICE_ID || "",
        annual: process.env.STRIPE_TEAMS_ANNUAL_PRICE_ID || "",
      },
    },
  },

  // =============================================================================
  // FEATURES (for landing page)
  // =============================================================================
  features: [
    {
      title: "Daily Prompts",
      description: "Start and end your day with guided gratitude and reflection prompts inspired by the 5-minute journal.",
      icon: "✨",
    },
    {
      title: "Private & Secure",
      description: "Your thoughts are encrypted and private. Only you can access your journal entries.",
      icon: "🔐",
    },
    {
      title: "Habit Tracking",
      description: "Track your daily wins, lessons learned, and build positive habits over time.",
      icon: "📈",
    },
    {
      title: "Daily Reminders",
      description: "Optional email or push reminders to keep your journaling streak alive.",
      icon: "🔔",
    },
    {
      title: "Search & Reflect",
      description: "Look back on past entries, track your growth, and see patterns in your journey.",
      icon: "🔍",
    },
    {
      title: "Mobile Friendly",
      description: "Journal anytime, anywhere. Fully responsive design works on all devices.",
      icon: "📱",
    },
  ],

  // =============================================================================
  // SEO & META
  // =============================================================================
  seo: {
    defaultTitle: "DailyReflect - Your 5-Minute Gratitude Journal",
    titleTemplate: "%s | DailyReflect",
    openGraph: {
      type: "website",
      locale: "en_US",
      site_name: "DailyReflect",
    },
    twitter: {
      handle: "@dailyreflect",
      site: "@dailyreflect",
      cardType: "summary_large_image",
    },
  },

  // =============================================================================
  // THEME SYSTEM (Color presets)
  // =============================================================================
  theme: {
    // Choose your color preset
    preset: 'lavender' as 'ocean' | 'sunset' | 'forest' | 'midnight' | 'coral' | 'lavender' | 'custom',

    // Theme preset definitions
    presets: {
      // Professional blue tones
      ocean: {
        primary: '#3B82F6',    // Blue
        secondary: '#0EA5E9',  // Sky blue
        accent: '#06B6D4',     // Cyan
        success: '#10B981',    // Green
      },

      // Warm orange/red tones
      sunset: {
        primary: '#F97316',    // Orange
        secondary: '#EF4444',  // Red
        accent: '#F59E0B',     // Amber
        success: '#10B981',    // Green
      },

      // Natural green tones
      forest: {
        primary: '#10B981',    // Green
        secondary: '#059669',  // Emerald
        accent: '#84CC16',     // Lime
        success: '#22C55E',    // Light green
      },

      // Dark/purple tones
      midnight: {
        primary: '#6366F1',    // Indigo
        secondary: '#8B5CF6',  // Purple
        accent: '#A78BFA',     // Light purple
        success: '#10B981',    // Green
      },

      // Pink/rose tones
      coral: {
        primary: '#EC4899',    // Pink
        secondary: '#F43F5E',  // Rose
        accent: '#FB7185',     // Light pink
        success: '#10B981',    // Green
      },

      // Soft purple tones
      lavender: {
        primary: '#8B5CF6',    // Purple
        secondary: '#A78BFA',  // Light purple
        accent: '#C084FC',     // Lighter purple
        success: '#10B981',    // Green
      },

      // Customize your own colors
      custom: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        success: '#10B981',
      },
    },

    // Visual style options
    style: {
      roundedness: 'lg' as 'sm' | 'md' | 'lg' | 'xl' | '2xl', // Border radius intensity
      shadows: 'medium' as 'none' | 'sm' | 'medium' | 'lg',   // Shadow intensity
      animations: true,                                        // Enable micro-interactions
    },
  },

  // =============================================================================
  // LANDING PAGE CONFIGURATION
  // =============================================================================
  landingPage: {
    // Enable/disable sections (order matters!)
    sections: [
      'hero',           // Hero with CTA
      'pain-points',    // Problem agitation (emotional hook)
      'how-it-works',   // 3-step process (builds trust)
      'features',       // Feature grid
      'benefits',       // Benefits comparison
      'social-proof',   // Testimonials/trust indicators
      'pricing',        // Pricing table
      'faq',            // FAQ section
      'final-cta',      // Strong closer
    ] as const,

    // Disable specific sections by commenting out above or override here:
    // disabledSections: ['benefits', 'social-proof'],
  },

  // =============================================================================
  // FEATURE FLAGS (toggle features on/off)
  // =============================================================================
  features_enabled: {
    waitlist: false, // Enable waitlist mode
    blog: false, // Enable blog
    docs: false, // Enable documentation
    analytics: true, // Enable PostHog analytics
    oauth: true, // Enable OAuth providers
  },
} as const;

// Type helper for autocomplete
export type SiteConfig = typeof siteConfig;

// Helper to get active theme colors
export const getThemeColors = () => {
  const preset = siteConfig.theme.preset;
  return siteConfig.theme.presets[preset];
};
