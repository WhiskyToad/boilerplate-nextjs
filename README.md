# SaaS Boilerplate - Next.js Production Starter

> **Production-ready Next.js SaaS boilerplate with authentication, payments, dashboards, and more. Build your MVP in days, not months.**

## 🚀 Features

- **🔐 Authentication** - Complete auth system with Supabase (email, social logins, password reset)
- **💳 Payments** - Stripe integration with subscription management and billing portal
- **👥 Teams** - Optional team collaboration with invites and roles (choose Solo or Teams schema)
- **🔒 Security** - Production-ready CSRF, rate limiting, and email validation (auto-configured)
- **📊 Dashboards** - Pre-built responsive dashboards with charts and analytics
- **🎨 UI Components** - Beautiful components built with Tailwind CSS and daisyUI
- **📧 Email System** - Automated emails with Resend integration
- **📱 Responsive** - Mobile-first design that works on all devices
- **⚡ Performance** - Next.js 15 with App Router, TypeScript, and optimization
- **🧪 Testing** - Storybook for component development and testing
- **⚙️ Easy Setup** - Interactive scripts guide you through everything (60 minutes total)

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + daisyUI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **Email:** Resend
- **Analytics:** PostHog
- **State Management:** Zustand + React Query
- **Components:** Storybook
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Resend account (for emails)
- PostHog account (for analytics)

## ⚡ Quick Start (45 Minutes)

**Interactive setup guide walks you through everything:**

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Follow the interactive setup guide**
   - Visit `http://localhost:3000/dev`
   - Check off each step as you complete it
   - Your progress is saved automatically
   - Resume anytime - takes ~45 minutes total

**That's it!** The guide walks you through:
1. Supabase setup (account, keys, .env.local)
2. Database initialization (Solo or Teams)
3. Stripe setup (account, keys, products)
4. Test everything works

**💡 Need more detail?** See [SETUP.md](./SETUP.md) for the full written guide.

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable UI components
│   ├── features/           # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and configs
│   ├── stores/             # Zustand state stores
│   └── types/              # TypeScript type definitions
├── supabase/
│   └── migrations/         # Database migration files
└── public/                 # Static assets
```

## 🎯 Customization Guide

### 📖 **[See docs/CUSTOMIZATION.md for complete guide →](./docs/CUSTOMIZATION.md)**

### Quick Customization Checklist:

1. ✅ **Update `src/config/site-config.ts`** (FIRST!)
   - Your SaaS name, description, email
   - Pricing plans and features
   - Social media links

2. ✅ **Replace branding assets**
   - `public/logo.svg` - Your logo
   - `public/favicon.ico` - Your favicon

3. ✅ **Customize colors**
   - Update `tailwind.config.ts` for brand colors
   - Modify `src/app/globals.css` for theme

4. ✅ **Update landing page**
   - `src/features/landing/Hero.tsx` - Headline and CTA
   - Features, pricing, and FAQ are in `site-config.ts`

5. ✅ **Update legal pages**
   - `src/app/privacy/page.tsx` - Privacy policy
   - `src/app/terms/page.tsx` - Terms of service

**💡 Pro Tip:** Everything is centralized in `site-config.ts` for easy updates!

## 🗄️ Database Schema

The boilerplate includes a complete schema with:

- **Users & Authentication** - Supabase auth tables
- **Subscriptions** - User subscription and billing data
- **Projects** - Multi-tenant project structure
- **Usage Tracking** - API usage and limits
- **Admin Analytics** - User behavior and metrics

## 💳 Stripe Integration

Complete payment system included:

- **Subscription Plans** - Free, Pro, Teams tiers
- **Billing Portal** - Self-service billing management
- **Webhooks** - Automatic subscription updates
- **Usage Limits** - Enforce plan restrictions

## 📧 Email System

Automated email flows:
- Welcome emails
- Password reset
- Subscription notifications
- Usage alerts

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                 # Start development server with Turbopack
npm run build              # Build for production
npm run start              # Start production server

# Quality & Testing
npm run lint               # Run ESLint
npm run tsc                # TypeScript type checking
npm run storybook          # Start Storybook component library

# Setup & Configuration
npm run setup:check        # Validate environment setup
npm run setup              # Show setup instructions
npm run types:generate     # Generate Supabase types from database
```

### Development Workflow

1. Make changes to your code
2. Test in browser at http://localhost:3000
3. **Visit http://localhost:3000/dev for setup status and quick commands**
4. Run `npm run tsc` to check for TypeScript errors
5. Run `npm run lint` before committing
6. Use Storybook for component development

### Developer Dashboard

Access **http://localhost:3000/dev** (development only) for:
- ✅ Visual setup checklist with status
- 📊 Environment variable validation
- 📋 Quick commands with copy buttons
- 📚 Links to documentation
- 🏗️ Architecture overview
- 🔧 Troubleshooting tips


## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Environment Variables for Production

Make sure to set all required environment variables:

- Supabase URL and keys
- Stripe keys and webhook secret
- Resend API key
- PostHog configuration
- App URL (your production domain)

## 🔐 Security Features (Production-Ready)

- **CSRF Protection** - Automatic origin validation (no config needed!)
- **Rate Limiting** - API (50 req/min) and signup limits (3 per IP per 15min)
- **Disposable Email Blocking** - Prevents 40+ temp email domains
- **Row Level Security** - Database-level access control
- **Security Headers** - CSP, X-Frame-Options, X-Content-Type-Options
- **Environment Isolation** - Secure environment variable handling

All security features are **automatically configured** from your `.env.local` - no hidden config files to edit!

## 📚 Documentation

### Setup & Configuration
- **[SETUP.md](./SETUP.md)** - Complete setup guide (60 minutes)
- **[CUSTOMIZATION.md](./docs/CUSTOMIZATION.md)** - Customize your SaaS
- **[.env.local.example](./.env.local.example)** - Environment variables reference

### Architecture & Patterns
- **[UNIVERSAL_SAAS_PATTERNS.md](./docs/UNIVERSAL_SAAS_PATTERNS.md)** - Reusable SaaS patterns and architecture
- **[Agent Pack](./docs/agents/README.md)** - Specialized build agents for UI, forms, state, React Query, and data layer delivery
- **[Component Library](http://localhost:6006)** - View all components in Storybook (`npm run storybook`)

### Code Organization
- **API Routes** - `src/app/api/` for endpoint documentation
- **Database Schema** - `supabase/migrations/` for table structure
- **Site Config** - `src/config/site-config.ts` for centralized settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation Issues** - Create an issue on GitHub
- **Bug Reports** - Use GitHub issues
- **Feature Requests** - Discuss in GitHub discussions

---

**Built with ❤️ for the SaaS community**

This boilerplate provides everything you need to launch your SaaS quickly. Focus on building your unique features instead of reinventing the wheel.
