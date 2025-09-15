# SaaS Boilerplate - Next.js Production Starter

> **Production-ready Next.js SaaS boilerplate with authentication, payments, dashboards, and more. Build your MVP in days, not months.**

## 🚀 Features

- **🔐 Authentication** - Complete auth system with Supabase (email, social logins, password reset)
- **💳 Payments** - Stripe integration with subscription management and billing portal
- **📊 Dashboards** - Pre-built responsive dashboards with charts and analytics
- **🎨 UI Components** - Beautiful components built with Tailwind CSS and daisyUI
- **📧 Email System** - Automated emails with Resend integration
- **🔧 Admin Panel** - Separate admin dashboard for user and analytics management
- **📱 Responsive** - Mobile-first design that works on all devices
- **⚡ Performance** - Next.js 15 with App Router, TypeScript, and optimization
- **🧪 Testing** - Storybook for component development and testing
- **🚀 Deployment** - Ready for Vercel deployment with proper configuration

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

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-saas-boilerplate
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations in `supabase/migrations/`
   - Update your environment variables with Supabase keys

4. **Set up Stripe**
   - Create products and prices in your Stripe dashboard
   - Update the price IDs in your environment variables
   - Set up webhooks pointing to `/api/stripe/webhooks`

5. **Start development**
   ```bash
   npm run dev
   ```

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

This is a clean SaaS boilerplate with essential features only. Here's how to customize it for your needs:

### 1. Update Branding

- Replace logos in `public/logo/`
- Update metadata in `src/app/layout.tsx`
- Customize colors in `tailwind.config.ts`
- Update landing page content in `src/features/landing/`

### 2. Modify Pricing Plans

- Update plans in `src/lib/stripe-config.ts`
- Modify subscription features in `src/lib/subscription-config.ts`
- Create corresponding Stripe products and prices
- Update pricing display components

### 3. Add Your Features

- Create new feature directories in `src/features/`
- Add corresponding database tables
- Build API routes in `src/app/api/`
- Create dashboard components

### 4. Database Schema

- Add your business logic tables in `supabase/migrations/`
- Use the existing auth, subscriptions, and projects as foundation
- Run `npm run types:generate` after schema changes

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
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run tsc          # TypeScript type checking
npm run storybook    # Start Storybook
npm run types:generate  # Generate Supabase types
```


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

## 🔐 Security Features

- **Row Level Security** - Database-level access control
- **API Protection** - Rate limiting and validation
- **CSRF Protection** - Cross-site request forgery prevention
- **Environment Isolation** - Secure environment variable handling

## 📚 Documentation

- **Component Library** - View all components in Storybook
- **API Reference** - Check `src/app/api/` for endpoint documentation
- **Database Schema** - See migration files for table structure

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
