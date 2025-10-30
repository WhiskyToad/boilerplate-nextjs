# 🚀 Quick Setup Guide (60 Minutes)

Get your SaaS running in under an hour. This guide assumes you're starting fresh.

---

## ⏱️ Timeline

- **15 min** - Supabase setup
- **10 min** - Environment variables
- **15 min** - Stripe setup
- **10 min** - Customize landing page
- **10 min** - Test everything

---

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- A Stripe account (test mode is fine)
- Resend account for emails (optional, can skip initially)
- PostHog account for analytics (optional, can skip initially)

---

## 🏁 Step 1: Supabase Setup (10 min)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization, name your project, create a database password
4. **Save your database password!**
5. Wait 2 minutes for project to initialize

### 1.2 Get Your API Keys

1. Go to Project Settings → API
2. Copy these values (you'll need them in Step 2):
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - `anon` `public` key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `service_role` `secret` key (`SUPABASE_SERVICE_ROLE_KEY`)

### 1.3 Initialize Database

**Use our automated setup script:**

```bash
npm run db:init
```

The script will:
1. Ask for your Supabase project ID
2. Let you choose:
   - **Solo/Simple** (no teams) ✨ Recommended for starting
   - **Teams/Collaboration** (full features)
3. Apply the correct database schema
4. Confirm everything is set up

**What's the difference?**

| Feature | Solo | Teams |
|---------|------|-------|
| User profiles | ✅ | ✅ |
| Subscriptions | ✅ | ✅ |
| Usage tracking | ✅ | ✅ |
| Team collaboration | ❌ | ✅ |
| Team invites | ❌ | ✅ |
| Role-based permissions | ❌ | ✅ |

**💡 Tip:** Start with Solo if unsure. It's simpler and you can migrate to Teams later if needed.

**Manual setup:**
If you prefer manual setup, see `supabase/migrations/README.md` for detailed instructions.

**Done!** Your database is ready with auth, subscriptions, and all necessary tables.

---

## 🔐 Step 2: Environment Variables (10 min)

### 2.1 Copy the example file

```bash
cp .env.local.example .env.local
```

### 2.2 Fill in REQUIRED variables

Open `.env.local` and fill in these **REQUIRED** variables:

```env
# ========================================
# REQUIRED - Your app won't work without these
# ========================================

# Get from Supabase (Step 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Your app URL (use localhost for development)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (Step 3 - we'll fill these next)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (Step 3 - we'll fill these next)
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_TEAMS_MONTHLY_PRICE_ID=price_...
STRIPE_TEAMS_ANNUAL_PRICE_ID=price_...
```

### 2.3 OPTIONAL variables (can skip for now)

```env
# ========================================
# OPTIONAL - Add these when you're ready
# ========================================

# Emails (Resend) - Signup works without this, but no emails
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@yourdomain.com

# Analytics (PostHog) - Works fine without this
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# OAuth Providers (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 💳 Step 3: Stripe Setup (15 min)

### 3.1 Get Stripe API Keys

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Toggle "Test mode" ON (top right)
3. Go to Developers → API keys
4. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

### 3.2 Create Products & Prices

**Option A: Use Stripe Dashboard (Recommended)**

1. Go to Products → Add Product
2. Create these products:

**Pro Plan:**
- Name: "Pro"
- Monthly price: $19
- Annual price: $189
- Copy Price IDs to `STRIPE_PRO_MONTHLY_PRICE_ID` and `STRIPE_PRO_ANNUAL_PRICE_ID`

**Teams Plan:**
- Name: "Teams"
- Monthly price: $49
- Annual price: $489
- Copy Price IDs to `STRIPE_TEAMS_MONTHLY_PRICE_ID` and `STRIPE_TEAMS_ANNUAL_PRICE_ID`

**Option B: Use Stripe CLI (Faster)**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Create products (run these commands)
stripe products create --name="Pro" --description="Pro plan"
stripe prices create --product=prod_XXX --unit-amount=1900 --currency=usd --recurring[interval]=month
stripe prices create --product=prod_XXX --unit-amount=18900 --currency=usd --recurring[interval]=year

stripe products create --name="Teams" --description="Teams plan"
stripe prices create --product=prod_YYY --unit-amount=4900 --currency=usd --recurring[interval]=month
stripe prices create --product=prod_YYY --unit-amount=48900 --currency=usd --recurring[interval]=year
```

### 3.3 Setup Webhook (for production)

**Local Development** (use Stripe CLI):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
# Copy the webhook secret (whsec_...) to STRIPE_WEBHOOK_SECRET
```

**Production** (setup in Stripe Dashboard):
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/stripe/webhooks`
4. Events: Select all `customer.subscription.*` events
5. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## 🎨 Step 4: Customize Landing Page (10 min)

### 4.1 Update Site Config

Edit `src/config/site-config.ts`:

```typescript
export const siteConfig = {
  name: "Your SaaS Name",
  description: "Your awesome SaaS description",
  url: "https://yourdomain.com",

  // Contact
  email: "hello@yourdomain.com",

  // Social
  twitter: "@yoursaas",
  github: "yourusername/your-repo",

  // Pricing
  pricing: {
    free: {
      name: "Free",
      price: 0,
      features: ["Feature 1", "Feature 2", "Feature 3"]
    },
    pro: {
      name: "Pro",
      monthlyPrice: 19,
      annualPrice: 189,
      features: ["Everything in Free", "Feature 4", "Feature 5"]
    },
    teams: {
      name: "Teams",
      monthlyPrice: 49,
      annualPrice: 489,
      features: ["Everything in Pro", "Feature 6", "Feature 7"]
    }
  }
}
```

### 4.2 Update Landing Page Content

Edit `src/features/landing/`:
- `Hero.tsx` - Update headline and CTA
- `Features.tsx` - Update feature list
- `Pricing.tsx` - Update pricing details (or use site-config)
- `FAQ.tsx` - Update frequently asked questions

### 4.3 Update Logo & Favicon

- Replace `public/logo.svg` with your logo
- Replace `public/favicon.ico` with your favicon
- Update `src/app/layout.tsx` metadata

---

## ✅ Step 5: Test Everything (10 min)

### 5.1 Start Development Server

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 5.2 Test Checklist

- [ ] Landing page loads
- [ ] Sign up works (creates user in Supabase)
- [ ] Sign in works
- [ ] Dashboard loads
- [ ] Profile page works
- [ ] Subscription page loads
- [ ] Stripe checkout works (test mode)
- [ ] After payment, subscription activates

### 5.3 Common Issues

**"Supabase connection failed"**
- Check your Supabase URL and keys in `.env.local`
- Make sure project is not paused (Supabase pauses inactive projects)

**"Stripe error"**
- Make sure you're in test mode
- Check Stripe keys are correct
- Verify Price IDs match your Stripe products

**"Page not loading"**
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

---

## 🚀 Deploy to Production

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add all environment variables (use production values)
5. Deploy!

**Don't forget:**
- Change `NEXT_PUBLIC_APP_URL` to your production domain
- Setup production Stripe webhook
- Update CORS/CSRF allowed origins in `src/lib/csrf.ts`

### Environment Variables for Production

Update these in Vercel:
- `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- Use production Stripe keys (not test mode)
- Use production Stripe webhook secret
- Add production Supabase URL/keys (or keep same for simplicity)

---

## 📱 Next Steps

Now that you're running, you might want to:

1. **Setup emails** - Add Resend API key to send transactional emails
2. **Add analytics** - Add PostHog key for user tracking
3. **Setup OAuth** - Enable Google/GitHub login
4. **Custom domain** - Configure custom domain in Vercel
5. **Email domain** - Setup email sending domain in Resend

---

## 🆘 Need Help?

- Check `/docs/UNIVERSAL_SAAS_PATTERNS.md` for architecture details
- Review `/docs/MISSING_FEATURES_ANALYSIS.md` for future enhancements
- Check Supabase logs: Project → Logs
- Check Stripe logs: Dashboard → Developers → Logs

---

## 🎯 Quick Reference

**Where to customize:**
- Site info: `src/config/site-config.ts`
- Landing page: `src/features/landing/`
- Dashboard: `src/app/dashboard/`
- Pricing: `src/features/landing/Pricing.tsx`
- Colors/Theme: `tailwind.config.ts` and `src/app/globals.css`

**Key files:**
- `.env.local` - All secrets and API keys
- `middleware.ts` - Security, auth, rate limiting
- `src/lib/stripe-config.ts` - Stripe configuration
- `supabase/migrations/` - Database schema

**Quick commands:**
```bash
npm run dev          # Start dev server
npm run build        # Test production build
npm run lint         # Check code quality
npm run tsc          # Check TypeScript
```

---

**You're done! Your SaaS boilerplate is ready to customize. 🎉**
