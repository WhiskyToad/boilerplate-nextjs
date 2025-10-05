# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run tsc` - TypeScript type checking (no emit)
- `npm run tsc:watch` - TypeScript type checking in watch mode

### Component Development
- `npm run storybook` - Start Storybook on port 6006
- `npm run build-storybook` - Build Storybook for production

### Database & Types
- `npm run types:generate` - Generate TypeScript types from Supabase schema
- `supabase db push` - Apply local migrations to remote database
- `supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts` - Generate types manually

### Supabase Local Development
- Local Supabase runs on custom ports (API: 54321, DB: 54322, Studio: 54323)
- Use `supabase start` and `supabase stop` for local development
- Database migrations are in `supabase/migrations/` and should be applied via Supabase CLI

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + daisyUI
- **Database**: Supabase (PostgreSQL)  
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend
- **Analytics**: PostHog
- **State Management**: Zustand + TanStack Query
- **Component Development**: Storybook

### Core Architecture Pattern
This is a feature-driven SaaS boilerplate with separation between:
- **App Router pages** (`src/app/`) - Next.js routes and API endpoints
- **Features** (`src/features/`) - Business logic components grouped by domain
- **UI Components** (`src/components/ui/`) - Reusable design system components
- **Shared Components** (`src/components/`) - Cross-cutting concerns (admin, analytics, etc.)
- **Hooks** (`src/hooks/`) - Custom React hooks for state and API calls
- **Lib** (`src/lib/`) - Utility functions and service configurations

### Database Schema
The schema follows a multi-tenant SaaS pattern:
- **profiles** - Extended user information beyond auth.users
- **teams** - Team/workspace organization with personal teams
- **team_members** - Team membership with roles (owner, admin, member)
- **user_subscriptions** - Stripe integration and subscription status
- **user_usage** - Usage tracking and quota enforcement
- **team_invites** - Team invitation system
- **demos** - DemoFlow demo recordings and metadata
- **demo_steps** - Individual steps within demo recordings
- **demo_assets** - Assets (screenshots, videos) associated with demos

### Authentication Flow
- Uses Supabase Auth with email/password and OAuth providers
- Profile creation is automatic via database triggers on user signup
- Personal teams are auto-created for each user
- Row Level Security (RLS) enforces data access policies

### Payment Integration
- Stripe integration with webhooks at `/api/stripe/webhooks`
- Three-tier pricing: Free, Pro ($19/mo), Teams ($49/mo)
- Subscription tiers control feature access and usage limits
- Billing portal integration for self-service account management

### State Management Pattern
- **Zustand** for client-side application state (`src/stores/`)
- **TanStack Query** for server state and API caching  
- **Supabase client** for real-time subscriptions and database queries
- Custom hooks abstract API calls and provide consistent interfaces

### Component Organization
- **UI components** (`src/components/ui/`) have `.stories.tsx` files for Storybook
- **Feature components** (`src/features/`) are organized by business domain (auth, landing, profile, subscription)
- **Shared components** (`src/components/`) handle cross-cutting concerns (admin, analytics, error handling, legal)
- **Specialized components**: onboarding system with tour steps, analytics integration, file upload utilities
- All components use TypeScript and follow the existing naming conventions

### File Upload System
- Multiple upload endpoints: `/api/upload/avatar`, `/api/upload/image`, `/api/upload/document`
- Uses Supabase Storage with security policies
- File validation and type checking in place

### Email System  
- Automated emails via Resend integration
- React Email templates in `src/lib/emails/templates/`
- Welcome emails, password reset, and notification flows

### Admin System
- Separate admin routes at `/admin/*` (users, subscriptions, security)
- Admin-only components in `src/components/admin/`
- User management, analytics, and subscription oversight
- Security middleware protects admin routes
- Admin dashboard includes: user management, subscription tracking, security monitoring, quick actions, and activity logs

### DemoFlow System (Chrome Extension + Web App)
- **Chrome Extension** (`chrome-extension/`) - Records interactive product demos
  - Background service worker for tab management and recording orchestration
  - Content scripts for capturing user interactions on web pages
  - Popup UI for authentication and recording controls
  - Built with TypeScript, bundled separately from main app
  - Build with `npm run build` in chrome-extension directory
- **Demo Components** (`src/components/demos/`) - Web-based demo playback
  - DemoPlayer: Interactive click-through demo player
  - ScreenshotDemoPlayer: Screenshot-based demo viewer
  - VideoExporter: Export demos as video files
- **Demo Features** (`src/features/demos/`) - Demo management UI
- **API Routes** (`src/app/api/demos/`) - Demo CRUD operations and asset management
- **Database Tables**: demos, demo_steps, demo_assets (see migrations/20250920_demoflow_tables.sql)

## Key Configuration Files
- `next.config.ts` - Minimal Next.js configuration
- `tsconfig.json` - TypeScript config with path aliases (`@/*` -> `src/*`)
- `eslint.config.mjs` - ESLint with Next.js and Storybook rules
- `supabase/config.toml` - Supabase local development configuration
- `src/lib/stripe-config.ts` - Stripe products and pricing configuration
- `chrome-extension/manifest.json` - Chrome extension manifest (v3)
- `chrome-extension/tsconfig.json` - Separate TypeScript config for extension

## Environment Variables Required
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Email: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`  
- Analytics: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- App: `NEXT_PUBLIC_APP_URL`

## Development Workflow
1. Database changes require migration files in `supabase/migrations/`
2. After schema changes, regenerate types with `npm run types:generate`
3. New UI components should include Storybook stories
4. All API routes include proper error handling and validation
5. Features should be organized by business domain, not technical layer
6. Chrome extension development is separate - build and test in `chrome-extension/` directory

## Security Considerations
- Row Level Security (RLS) policies enforce data access
- API routes include rate limiting and input validation (`src/lib/api/`)
- CSRF protection via security middleware (`src/lib/security/`)
- Sensitive operations require proper authentication checks
- File uploads have type and size restrictions
- Security audit logging system in place (`src/lib/security/audit-log.ts`)
- Admin security monitoring dashboard available

## Additional Features
- **Onboarding System**: Complete user onboarding flow with tour steps, progress tracking, and analytics
- **Export Utilities**: CSV and PDF export functionality (`src/lib/export/`)
- **Error Handling**: Error boundaries and comprehensive error management
- **Legal Components**: Cookie consent, privacy policy, and terms of service pages
- **Search & Filtering**: Reusable search input and filter components with hooks

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.