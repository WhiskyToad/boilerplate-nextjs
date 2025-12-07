# Changelog

All notable enhancements and features added to the boilerplate.

---

## [Latest Updates] - 2025-10-27

### 🎨 Universal UI Components

#### Added
- **DeleteConfirmationModal** (`src/components/ui/delete-confirmation-modal/`)
  - Reusable confirmation dialog for destructive actions
  - Customizable title, message, and button text
  - Loading state support
  - Warning and error variants

- **Tooltip** (`src/components/ui/tooltip/`)
  - Smart auto-positioning based on viewport space
  - Portal-based rendering for proper z-index
  - Hover-activated with fade animations

- **TimeToggle** (`src/components/ui/time-toggle/`)
  - Toggle between Week/Month/Year views
  - Perfect for analytics and metrics dashboards
  - UI/Controller separation pattern

### 📝 Blog System (pSEO-Ready)

#### Added
- **Markdown Blog System** (`src/lib/blog.ts`)
  - File-based markdown blog posts in `content/blog/`
  - Frontmatter support for metadata (title, excerpt, tags, SEO)
  - Category and tag organization
  - Featured post highlighting
  - Automatic excerpt generation

- **Blog Routes**
  - `/blog` - Blog index with featured post and grid layout
  - `/blog/[slug]` - Individual blog post pages
  - Responsive design with reading time estimates
  - Social sharing meta tags and JSON-LD structured data

- **Blog Components** (`src/features/blog/`)
  - `BlogLayout` - Consistent blog page wrapper with header/footer
  - `MarkdownRenderer` - Custom markdown parser with:
    - Syntax highlighting for code blocks
    - Copy-to-clipboard for code
    - Styled headers, lists, and inline elements
    - Auto-generated anchor links for headings

- **Sample Content**
  - Example blog post showing all markdown features
  - README guide for creating new posts

### 🔍 SEO & Indexing

#### Added
- **Dynamic robots.txt** (`src/app/robots.ts`)
  - Automatic sitemap reference
  - Proper disallow rules for private routes
  - Production-ready configuration

- **Dynamic sitemap.xml** (`src/app/sitemap.ts`)
  - Auto-generates from blog posts, categories, and tags
  - Proper priority and change frequency settings
  - Last modified dates for better crawling

### 👑 Admin Dashboard

#### Added
- **Basic Admin Dashboard** (`src/app/admin/`)
  - User metrics (total users, projects, subscriptions)
  - Revenue tracking (MRR calculation)
  - Email-based admin authentication
  - Protected route with authorization checks

- **Admin API** (`src/app/api/admin/stats/`)
  - Secure stats endpoint with admin-only access
  - Aggregates data from database
  - Extensible for custom metrics

### 🧹 Cleanup & Simplification

#### Removed
- **Legacy branding** - Removed feedback widget and tracking scripts
- **Hardcoded hero content** - Hero now pulls from site-config.ts
- **Fake social proof** - Removed "50+ developers" and other placeholder stats

#### Improved
- **Landing page** - Simple, clean hero that's easy to customize
- **Site config** - All hero content now in one place (site-config.ts)
- **Setup guide** - Added step for customizing landing page

### 🎯 Setup Progress Tracking

#### Added
- **Interactive Setup Guide** (`/dev/setup`)
  - Single source of truth for setup
  - 4 sections in logical order: Supabase → Database → Stripe → Test
  - Checkboxes to track progress (auto-saved)
  - Direct links to dashboards
  - ~45 minutes total

- **Simple /dev Route**
  - `/dev` redirects directly to setup guide
  - No dashboard clutter - just the guide
  - Start setup with one simple URL

- **Markdown Documentation Viewer** (`/dev/docs/*`)
  - In-browser markdown rendering with GitHub-flavored markdown
  - View all docs without leaving the app
  - Syntax highlighting for code files
  - Clean, readable typography

- **Progress Tracking System** (`src/lib/setup-progress.ts`)
  - Save/load progress from JSON file
  - Track 13 setup steps across 4 phases
  - API routes for updating progress
  - Gitignored to avoid committing local state

### 🔐 Security Enhancements (Production-Ready)

#### Added
- **CSRF Protection** (`src/lib/csrf.ts`)
  - Automatic configuration from `NEXT_PUBLIC_APP_URL`
  - No manual origin configuration needed
  - Protects all POST/PUT/DELETE requests
  - Smart exceptions for webhooks and OAuth

- **Signup Rate Limiting** (`src/lib/signup-rate-limiter.ts`)
  - Prevents spam signups (3 per IP per 15 minutes)
  - Automatic IP detection (Vercel, Cloudflare, etc.)
  - Auto-blocking with 1-hour cooldown
  - Memory-efficient with auto-cleanup

- **Disposable Email Blocking** (`src/lib/disposable-email-blocker.ts`)
  - Blocks 40+ temporary email domains
  - Prevents fake signups
  - Simple validation function

- **Enhanced Middleware** (`middleware.ts`)
  - Global API rate limiting (50 req/min per IP)
  - Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
  - Automatic cleanup of rate limit records
  - Production-ready configuration

### 🗄️ Database Improvements

#### Added
- **Dual Schema Options**
  - `00_simple_solo_schema.sql` - Simple setup without teams
  - `01_essential_saas_schema.sql` - Full setup with teams

#### Fixed
- **Team Invites Bug** - Added UNIQUE constraint on `(team_id, email)` to prevent duplicate invitations

### 🚀 Setup & Developer Experience

#### Added
- **Interactive Database Setup** (`npm run db:init`)
  - Guided setup script
  - Choose Solo vs Teams schema
  - Automatic project linking
  - Clear success/error messages

- **Setup Validation** (`npm run setup:check`)
  - Validates all environment variables
  - Checks REQUIRED vs OPTIONAL config
  - Provides specific error messages
  - Success summary with next steps

- **Centralized Configuration** (`src/config/site-config.ts`)
  - Single source of truth for site metadata
  - Pricing configuration
  - Feature lists
  - Social links
  - Feature flags

#### Documentation Added
- **SETUP.md** - Complete 60-minute setup guide
  - Step-by-step with time estimates
  - Supabase setup
  - Stripe configuration
  - Environment variables
  - Deployment guide

- **docs/CUSTOMIZATION.md** - Comprehensive customization guide
  - Branding updates
  - Landing page changes
  - Color themes
  - Typography
  - Navigation

- **docs/UNIVERSAL_SAAS_PATTERNS.md** - Architecture reference
  - Security patterns
  - Multi-tenancy structure
  - Team collaboration
  - Subscription tracking
  - Email system

- **supabase/migrations/README.md** - Database setup guide
  - Solo vs Teams comparison
  - Migration instructions
  - Troubleshooting
  - Table overview

#### Improved
- **Environment Variables** (`.env.local.example`)
  - Clear REQUIRED vs OPTIONAL sections
  - Setup time estimates
  - Direct links to credential sources
  - Example values

- **README.md**
  - Quick start in 5 steps
  - Links to all documentation
  - Clearer customization checklist
  - Better script documentation

### 🛠️ Scripts Added

#### New npm Scripts
```bash
npm run setup:check    # Validate environment setup
npm run setup          # Show setup instructions
npm run db:init        # Interactive database setup
```

#### New Shell Scripts
- `scripts/check-setup.js` - Environment validation
- `scripts/init-supabase.sh` - Interactive DB setup

---

## What's NOT Included (By Design)

These are **feedback-specific** features from the source project that are NOT needed for a universal boilerplate:

- ❌ Widget system (embeddable feedback widgets)
- ❌ Bug tracking features
- ❌ NPS/review collection
- ❌ Smart prompts system
- ❌ Public roadmap
- ❌ Feature voting
- ❌ Separate admin app (we now have basic admin built-in)
- ❌ SEO tools/calculators

These can be added if needed for your specific use case, but they're not universal SaaS requirements.

---

## File Structure

### New Files
```
nextjs-boilerplate/
├── SETUP.md                           # Complete setup guide
├── CHANGELOG.md                       # This file
├── content/blog/                      # Blog markdown files
│   ├── README.md                      # Blog setup guide
│   └── getting-started-with-nextjs.md # Sample post
├── src/
│   ├── app/
│   │   ├── admin/                     # Admin dashboard
│   │   │   └── page.tsx
│   │   ├── api/admin/stats/           # Admin stats API
│   │   │   └── route.ts
│   │   ├── blog/                      # Blog routes
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── robots.ts                  # Dynamic robots.txt
│   │   └── sitemap.ts                 # Dynamic sitemap
│   ├── components/ui/
│   │   ├── delete-confirmation-modal/ # Confirmation dialog
│   │   ├── tooltip/                   # Smart tooltips
│   │   └── time-toggle/               # Time range selector
│   ├── config/
│   │   └── site-config.ts            # Central configuration
│   ├── features/blog/                 # Blog components
│   │   ├── BlogLayout.tsx
│   │   └── MarkdownRenderer.tsx
│   └── lib/
│       ├── blog.ts                    # Blog system
│       ├── csrf.ts                   # CSRF protection
│       ├── signup-rate-limiter.ts    # Signup rate limiting
│       └── disposable-email-blocker.ts # Email validation
├── docs/
│   ├── CUSTOMIZATION.md              # Customization guide
│   └── UNIVERSAL_SAAS_PATTERNS.md    # Architecture patterns
├── scripts/
│   ├── check-setup.js                # Setup validator
│   └── init-supabase.sh              # DB setup script
└── supabase/migrations/
    ├── README.md                      # Migration guide
    ├── 00_simple_solo_schema.sql     # Simple schema
    └── 01_essential_saas_schema.sql  # Full schema (fixed)
```

### Modified Files
```
├── .env.local.example                # Improved with sections
├── README.md                         # Better quick start
├── middleware.ts                     # Enhanced security
└── package.json                      # New scripts
```

---

## Breaking Changes

### None!

All additions are backward compatible. Existing code continues to work.

---

## Upgrade Path

If you have an existing installation:

1. **Add new security features:**
   ```bash
   # Copy new files
   cp src/lib/csrf.ts src/lib/signup-rate-limiter.ts src/lib/disposable-email-blocker.ts

   # Update middleware.ts with new security features
   ```

2. **Update environment:**
   - No changes needed! CSRF auto-reads from existing `NEXT_PUBLIC_APP_URL`

3. **Database (optional):**
   - If using teams: Add UNIQUE constraint to team_invites
   ```sql
   ALTER TABLE team_invites ADD CONSTRAINT team_invites_team_id_email_key UNIQUE (team_id, email);
   ```

---

## Credits

Security patterns, database schemas, and setup workflows adapted from production SaaS applications.

---

## What's Included

✅ Essential UI components (Modals, Tooltips, Time Toggles)
✅ Markdown blog system with pSEO
✅ Dynamic sitemap and robots.txt
✅ Basic admin dashboard
✅ Authentication (Supabase)
✅ Payments (Stripe)
✅ Database setup tools
✅ Security features (CSRF, rate limiting)
✅ Developer experience (setup guide, docs)

## Future Enhancements

Potential additions (vote for what you need!):

- [ ] Email verification system
- [ ] 2FA/MFA support
- [ ] API key management
- [ ] Webhook system for integrations
- [ ] Advanced analytics
- [ ] File upload utilities
- [ ] Blog search functionality
- [ ] Notification system
- [ ] Blog category/tag pages

---

For questions or suggestions, open an issue!
