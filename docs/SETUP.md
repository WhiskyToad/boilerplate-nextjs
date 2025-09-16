# Setup Guide

This guide will walk you through setting up the Next.js SaaS boilerplate step by step.

## Prerequisites

Before you begin, make sure you have:
- Node.js 18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

## Step 1: Clone and Install

```bash
git clone <your-repository-url>
cd nextjs-boilerplate
npm install
```

### Install Widget Dependencies
```bash
cd widget-build
npm install
cd ..
```

## Step 2: Environment Configuration

### Copy Environment Template
```bash
cp .env.local.example .env.local
```

### Required Environment Variables

#### Supabase Configuration
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API to find your keys
3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### Stripe Configuration
1. Go to [stripe.com](https://stripe.com) and create an account
2. Go to Developers > API keys
3. Create products and prices for your subscription plans
4. Add to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
STRIPE_ANNUAL_PRICE_ID=price_your_annual_price_id
```

#### Email Configuration (Resend)
1. Go to [resend.com](https://resend.com) and create an account
2. Generate an API key
3. Add to `.env.local`:

```env
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

#### Analytics (PostHog) - Optional
1. Go to [posthog.com](https://posthog.com) and create a project
2. Add to `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

#### App Configuration
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, change this to your actual domain.

## Step 3: Database Setup

### Run Supabase Migrations

1. Install Supabase CLI:
```bash
brew install supabase/tap/supabase
# or
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref your-project-id
```

4. Run migrations:
```bash
supabase db push
```

Alternatively, you can run the SQL files manually in your Supabase SQL editor:
1. `supabase/migrations/01_clean_setup.sql`
2. `supabase/migrations/02_row_level_security.sql`
3. `supabase/migrations/03_functions_and_triggers.sql`

### Generate TypeScript Types
```bash
npm run types:generate
```

## Step 4: Stripe Webhook Setup

### For Development (using Stripe CLI)
1. Install Stripe CLI
2. Login: `stripe login`
3. Forward events: `stripe listen --forward-to localhost:3000/api/stripe/webhooks`
4. Copy the webhook secret and add to your `.env.local`

### For Production
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhooks`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to your production environment

## Step 5: OAuth Setup (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
6. Add to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
4. Add client ID and secret to Supabase Auth providers

## Step 6: Start Development

```bash
npm run dev
```

Your app should now be running at `http://localhost:3000`

## Step 7: Test Core Features

### Test Authentication
1. Go to `/signup` and create an account
2. Check your email for verification
3. Test login/logout flows
4. Test password reset

### Test Subscriptions
1. Use Stripe test card: `4242 4242 4242 4242`
2. Create a subscription
3. Check Stripe dashboard for the subscription
4. Test webhook by updating subscription in Stripe

### Test Widget System
1. Build the widget: `npm run widget:build`
2. Test the widget at `http://localhost:3000/widget-demo`

## Common Issues

### Database Connection Issues
- Check your Supabase URL and keys
- Ensure RLS policies are correctly applied
- Verify your IP is allowed in Supabase

### Stripe Webhook Issues
- Check webhook endpoint URL
- Verify webhook secret matches
- Check Stripe CLI is forwarding events in development

### TypeScript Errors
- Run `npm run types:generate` to regenerate Supabase types
- Check your TypeScript configuration

### Build Issues
- Clear `.next` folder and rebuild
- Check all environment variables are set
- Verify all dependencies are installed

## Next Steps

Once setup is complete:
1. Review the [Configuration Guide](CONFIGURATION.md)
2. Read the [Development Guide](DEVELOPMENT.md)
3. Check out the [API Reference](API.md)
4. Review [Security Best Practices](SECURITY.md)

## Getting Help

If you encounter issues:
1. Check this guide again
2. Look at the example `.env.local.example` file
3. Check the GitHub issues for similar problems
4. Create a new issue with detailed error messages and steps to reproduce