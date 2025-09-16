# Configuration Guide

This guide covers all configuration options and customization possibilities for the Next.js SaaS boilerplate.

## Environment Variables

### Required Variables

#### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Stripe
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key
STRIPE_SECRET_KEY=sk_test_or_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_MONTHLY_PRICE_ID=price_monthly_id
STRIPE_ANNUAL_PRICE_ID=price_annual_id
```

#### Email
```env
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

#### App
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Variables

#### Analytics
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

#### OAuth
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Security
```env
ENABLE_AUDIT_DB_LOGGING=true
AUDIT_WEBHOOK_URL=https://your-logging-service.com/webhook
AUDIT_WEBHOOK_TOKEN=your_webhook_token
```

#### Rate Limiting
```env
RATE_LIMIT_STRICT_REQUESTS=5
RATE_LIMIT_STRICT_WINDOW=15
RATE_LIMIT_MODERATE_REQUESTS=50
RATE_LIMIT_MODERATE_WINDOW=15
RATE_LIMIT_LENIENT_REQUESTS=100
RATE_LIMIT_LENIENT_WINDOW=15
```

## Subscription Plans Configuration

### Modifying Plans
Edit `src/lib/subscription-config.ts`:

```typescript
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    interval: null,
    features: {
      projects: 1,
      feedbackPerMonth: 20,
      teamMembers: 1,
      analytics: false,
      priority_support: false,
    }
  },
  PRO_MONTHLY: {
    name: 'Pro',
    price: 19,
    interval: 'month',
    stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID,
    features: {
      projects: 10,
      feedbackPerMonth: 1000,
      teamMembers: 5,
      analytics: true,
      priority_support: true,
    }
  }
}
```

### Creating Stripe Products

1. **Create Products in Stripe Dashboard:**
   - Go to Products in your Stripe dashboard
   - Create a product for each plan
   - Set up recurring prices with appropriate intervals

2. **Update Environment Variables:**
   - Copy the price IDs from Stripe
   - Update your environment variables

3. **Update Plan Features:**
   - Modify the features object for each plan
   - Update usage limit checks throughout the app

## Database Configuration

### Custom Tables
Add your business logic tables to `supabase/migrations/`:

```sql
-- Example: Add a custom table
CREATE TABLE custom_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS policy
ALTER TABLE custom_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage custom_features for their projects"
ON custom_features FOR ALL USING (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);
```

### Regenerate Types
After schema changes:
```bash
npm run types:generate
```

## UI Customization

### Branding

#### Update Logo
1. Replace files in `public/`:
   - `logo.svg` - Main logo
   - `logo-dark.svg` - Dark mode logo
   - `favicon.ico` - Favicon

#### Update Colors
Edit `tailwind.config.ts`:
```javascript
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          primary: "#your-primary-color",
          secondary: "#your-secondary-color",
          // ... other colors
        }
      }
    ]
  }
}
```

#### Update Metadata
Edit `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your SaaS Name',
  description: 'Your SaaS description',
  keywords: ['your', 'keywords'],
  authors: [{ name: 'Your Name' }],
  // ... other metadata
}
```

### Landing Page
Customize `src/features/hero/` components:
- `HeroSection.tsx` - Main hero content
- `PricingSection.tsx` - Pricing display
- `FeatureSection.tsx` - Feature highlights

## API Configuration

### Rate Limiting
Configure in `src/lib/api/rate-limit.ts`:

```typescript
export const rateLimitConfig = {
  strict: { requests: 5, windowMs: 15 * 60 * 1000 },    // Auth endpoints
  moderate: { requests: 50, windowMs: 15 * 60 * 1000 }, // API endpoints
  lenient: { requests: 100, windowMs: 15 * 60 * 1000 }  // Public endpoints
}
```

### CORS Settings
Configure in `src/middleware.ts`:

```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://yourdomain.com',
    // Add allowed origins
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}
```

## Security Configuration

### Content Security Policy
Configure in `src/lib/security/headers.ts`:

```typescript
const csp = new CSPBuilder()
  .defaultSrc(["'self'"])
  .scriptSrc(["'self'", "'unsafe-eval'", "https://js.stripe.com"])
  .styleSrc(["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"])
  .imgSrc(["'self'", "data:", "https:"])
  .connectSrc(["'self'", "https://*.supabase.co"])
  .build()
```

### Rate Limiting Rules
Configure in `src/lib/security/security-middleware.ts`:

```typescript
const securityConfig = {
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000,
    max: 100,
    skipPaths: ['/health', '/api/health']
  },
  csrf: {
    enabled: true,
    skipPaths: ['/api/auth/callback', '/api/webhooks/']
  },
  geoBlocking: {
    enabled: false,
    blockedCountries: ['CN', 'RU'], // ISO country codes
    allowedCountries: [] // Empty means all allowed
  }
}
```

### Input Sanitization
Configure validation schemas in `src/lib/security/input-validation.ts`:

```typescript
export const customSchemas = {
  productName: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name too long')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid characters in product name'),
}
```

## Email Configuration

### Custom Templates
Create templates in `src/lib/email/templates/`:

```typescript
export const customWelcomeTemplate = (data: { name: string; loginUrl: string }) => ({
  subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!`,
  html: `
    <h1>Welcome ${data.name}!</h1>
    <p>Your custom welcome message here.</p>
    <a href="${data.loginUrl}">Get Started</a>
  `
})
```

### Email Settings
Configure in `src/lib/email/config.ts`:

```typescript
export const emailConfig = {
  from: process.env.RESEND_FROM_EMAIL!,
  replyTo: 'support@yourdomain.com',
  defaultSubject: 'Notification from Your SaaS',
  templates: {
    welcome: customWelcomeTemplate,
    passwordReset: passwordResetTemplate,
    // ... other templates
  }
}
```

## Analytics Configuration

### PostHog Setup
Configure in `src/lib/analytics/posthog.ts`:

```typescript
export const analyticsConfig = {
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
  options: {
    capture_pageview: true,
    capture_pageleave: false,
    disable_cookie: false,
  }
}
```

### Custom Events
Add custom tracking in `src/hooks/useAnalytics.ts`:

```typescript
export const useAnalytics = () => {
  const trackCustomEvent = (event: string, properties: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(event, properties)
    }
  }

  return {
    trackCustomEvent,
    // ... other methods
  }
}
```

## Widget Configuration

### Widget Settings
Configure in `widget-build/src/config.ts`:

```typescript
export const widgetConfig = {
  defaultPosition: 'bottom-right',
  defaultColors: {
    primary: '#3b82f6',
    background: '#ffffff',
    text: '#1f2937'
  },
  animationDuration: 300,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif']
}
```

### Build Configuration
Configure Rollup in `widget-build/rollup.config.js`:

```javascript
export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/widget.js',
    format: 'iife',
    name: 'FeedbackWidget',
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    }
  },
  // ... other options
}
```

## Deployment Configuration

### Vercel
Create `vercel.json`:

```json
{
  "functions": {
    "src/app/api/**": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://yourdomain.com"
  }
}
```

### Docker
Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment-Specific Settings

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Use Stripe test keys
# Use development database
```

### Staging
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com
# Use Stripe test keys
# Use staging database
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
# Use Stripe live keys  
# Use production database
# Enable all security features
```

## Performance Configuration

### Caching
Configure in `next.config.js`:

```javascript
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-project.supabase.co',
      },
    ],
  },
}
```

### Bundle Analysis
Add bundle analyzer:

```bash
npm install --save-dev @next/bundle-analyzer
```

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

Run with: `ANALYZE=true npm run build`