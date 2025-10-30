# Universal SaaS Patterns - Missing from Boilerplate

This document identifies **reusable SaaS infrastructure patterns** from the feedback project that should be added to the boilerplate. These are NOT feedback-specific features, but universal patterns applicable to any SaaS product.

---

## 🔐 1. Security & Protection Patterns

### Missing Infrastructure:
- **CSRF Protection** (`lib/csrf.ts`)
  - Origin validation for authenticated endpoints
  - Configurable allowed origins
  - Automatic bypass for webhooks and GET requests

- **Signup Rate Limiting** (`lib/signup-rate-limiter.ts`)
  - Prevents spam signups by IP address
  - Configurable limits (3 signups per 15 min per IP)
  - Auto-blocking with exponential backoff
  - In-memory store with cleanup
  - `getClientIP()` utility for various hosting providers

- **Disposable Email Blocking** (`lib/disposable-email-blocker.ts`)
  - Blocks temporary email addresses (10minutemail, guerrillamail, etc.)
  - Comprehensive list of 40+ disposable email domains
  - Validation helper functions

- **Enhanced Middleware**:
  - Global API rate limiting (50 req/min per IP)
  - Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
  - IP-based request tracking
  - Proper header management for different contexts

### Current State:
- ✅ Basic Supabase auth middleware
- ❌ No CSRF protection
- ❌ No rate limiting
- ❌ No disposable email blocking
- ❌ Limited security headers

---

## 🏢 2. Multi-Tenancy / Project Management Pattern

### Missing Infrastructure:

#### Projects Table Structure:
```sql
- id (uuid, pk)
- owner_id (uuid, fk to users)
- team_id (uuid, fk to teams, nullable)
- name, description, domain
- created_at, updated_at
- RLS policies for team-based access
```

#### Hooks Pattern (`useProjects`):
- Query key factories for cache management
- CRUD operations with automatic cache invalidation
- Team-aware project fetching
- Supports both owned and team-member projects
- Usage tracking integration (`increment_project_count`)

#### Why This Pattern Is Universal:
- Most SaaS apps have a "workspace/project/organization" concept
- Provides multi-tenancy out of the box
- Enables team collaboration
- Foundation for feature access control

### Current State:
- ❌ No projects/workspace table
- ❌ No multi-tenancy structure
- ❌ Users have direct access, no organizational layer

---

## 👥 3. Team Collaboration Pattern

### Missing Infrastructure:

#### Database Tables:
```sql
-- teams table
- id, name, is_personal, created_by, created_at

-- team_members table
- id, team_id, user_id, role (owner/admin/member/viewer)
- joined_at, RLS policies

-- team_invites table
- id, team_id, email, role, invited_by
- expires_at, accepted_at, token
```

#### Hooks Pattern (`useTeams`, `useTeamMembers`, `useTeamAuth`):
- **useTeams()** - Get user's teams, create teams, personal team management
- **useTeamMembers()** - Fetch members, invite via email
- **useTeamInvites()** - Manage pending invitations
- **useTeamAuth()** - Role-based permissions checking
- **useTeamMemberActions()** - Remove members, cancel/resend invites

#### Email Integration:
- Team invite emails with branded templates
- 7-day expiration tokens
- Auto-accept on login

#### Why This Pattern Is Universal:
- Most B2B SaaS needs team collaboration
- Role-based access control is fundamental
- Invitation system is standard practice
- Personal vs team workspaces common pattern

### Current State:
- ❌ No teams table
- ❌ No team member management
- ❌ No invitation system
- ❌ No role-based permissions

---

## 💳 4. Enhanced Subscription with Usage Tracking

### Missing Infrastructure:

#### Database Functions:
```sql
-- Usage tracking functions
- increment_project_count(user_id)
- increment_feedback_count(user_id)
- get_user_limits(user_id)
- check_feedback_limit(user_id)
```

#### Enhanced Subscription Table:
```sql
user_subscriptions:
- stripe_customer_id
- stripe_subscription_id
- status, tier (free/pro/teams/lifetime)
- current_period_start, current_period_end
- projects_used, feedback_used (usage tracking)
- max_projects, max_feedback (limits)
- cancel_at_period_end
```

#### Utility Functions (`lib/subscription-utils.ts`):
- `getUsagePercentage()` - Calculate usage %
- `getUsageStatus()` - low/medium/high/critical
- `shouldShowUpgradePrompt()` - Smart upgrade prompts
- `getUpgradeReason()` - Why user should upgrade
- `getRemainingUsage()` - Calculate remaining quota
- Format helpers for currency, dates, status

#### Configuration Pattern (`lib/subscription-config.ts`):
- Centralized plan definitions
- Limits per tier
- Price IDs organized by plan
- Easy to modify and extend

#### Why This Pattern Is Universal:
- Usage-based limits common in SaaS
- Soft limits better UX than hard stops
- Upgrade prompts drive revenue
- Centralized config simplifies pricing changes

### Current State:
- ✅ Basic Stripe integration
- ✅ Subscription table exists
- ❌ No usage tracking functions
- ❌ No limit enforcement
- ❌ No utility functions
- ❌ No centralized subscription config

---

## 📧 5. Email Notification System

### Missing Infrastructure:

#### Email Templates (`lib/emails/`):
- React Email templates with consistent branding
- **welcome-template.tsx** - Welcome new users
- **team-invite-template.tsx** - Team invitations
- Responsive HTML email generation

#### Email Preferences:
```sql
email_preferences table:
- user_id, project_id (per-project preferences)
- new_feedback, new_bugs, new_reviews, weekly_digest
- Enables users to control notifications
```

#### Hooks Pattern:
- `useEmailPreferences(projectId)` - Manage per-project email settings
- Automatic invalidation on changes

#### API Endpoints:
- `/api/emails/team-invite` - Send team invitations
- `/api/emails/welcome` - Welcome emails

#### Why This Pattern Is Universal:
- Email notifications critical for engagement
- Per-project preferences common in multi-tenant apps
- Team invites standard feature
- Welcome emails best practice

### Current State:
- ✅ Resend integration exists
- ✅ Basic email templates
- ❌ No email preferences table
- ❌ No per-project notification settings
- ❌ No team invite emails
- ❌ Limited email template variety

---

## 📊 Summary of Universal Patterns

| Pattern | Current | Needed | Priority |
|---------|---------|--------|----------|
| **CSRF Protection** | ❌ None | ✅ Full implementation | HIGH |
| **Rate Limiting** | ❌ None | ✅ Signup + API limiting | HIGH |
| **Disposable Email Blocking** | ❌ None | ✅ Validation utility | MEDIUM |
| **Security Headers** | ⚠️ Basic | ✅ Enhanced CSP | HIGH |
| **Projects/Multi-tenancy** | ❌ None | ✅ Full pattern | HIGH |
| **Team Collaboration** | ❌ None | ✅ Full pattern | HIGH |
| **Usage Tracking** | ❌ None | ✅ Database functions | HIGH |
| **Subscription Config** | ⚠️ Scattered | ✅ Centralized | MEDIUM |
| **Subscription Utils** | ❌ None | ✅ Helper functions | MEDIUM |
| **Email Preferences** | ❌ None | ✅ Per-project settings | MEDIUM |
| **Email Templates** | ⚠️ Basic | ✅ More varieties | LOW |

---

## 🚀 Implementation Priority

### **PHASE 1: Security Foundation** (Immediate)
1. ✅ CSRF protection middleware
2. ✅ Signup rate limiting
3. ✅ Disposable email blocking
4. ✅ Enhanced security headers
5. ✅ Global API rate limiting

**Impact**: Prevents spam, abuse, and security vulnerabilities
**Effort**: 2-3 hours
**Files**: `lib/csrf.ts`, `lib/signup-rate-limiter.ts`, `lib/disposable-email-blocker.ts`, `middleware.ts`

---

### **PHASE 2: Multi-Tenancy Foundation** (High Value)
1. ✅ Projects table + migrations
2. ✅ `useProjects` hook with CRUD operations
3. ✅ Project components (list, card, form)
4. ✅ Project-based RLS policies
5. ✅ Dashboard integration

**Impact**: Enables workspace/organization pattern for any SaaS
**Effort**: 4-5 hours
**Files**: Migration, `hooks/useProjects.ts`, `features/project-management/`

---

### **PHASE 3: Team Collaboration** (B2B Essential)
1. ✅ Teams + team_members + team_invites tables
2. ✅ `useTeams`, `useTeamMembers`, `useTeamAuth` hooks
3. ✅ Team management UI components
4. ✅ Email invitation system
5. ✅ Role-based permissions

**Impact**: Enables B2B collaboration for any SaaS
**Effort**: 6-8 hours
**Files**: Migrations, `hooks/useTeams.ts`, `features/team-management/`, email templates

---

### **PHASE 4: Usage Tracking** (Monetization)
1. ✅ Usage tracking database functions
2. ✅ Enhanced subscription table fields
3. ✅ Subscription utilities library
4. ✅ Subscription config centralization
5. ✅ Upgrade prompt components

**Impact**: Enables usage-based pricing and upgrade flows
**Effort**: 3-4 hours
**Files**: Migrations, `lib/subscription-utils.ts`, `lib/subscription-config.ts`

---

### **PHASE 5: Email System** (Engagement)
1. ✅ Email preferences table + migrations
2. ✅ `useEmailPreferences` hook
3. ✅ Additional email templates (invites, etc.)
4. ✅ Email preference UI
5. ✅ Email API endpoints

**Impact**: Better user engagement and communication
**Effort**: 3-4 hours
**Files**: Migrations, `hooks/useEmailPreferences.ts`, `lib/emails/`, email components

---

## 🎯 What Makes These Patterns Universal?

1. **Security (Phase 1)**: Every app needs CSRF, rate limiting, and abuse prevention
2. **Multi-tenancy (Phase 2)**: Most SaaS apps organize work around projects/workspaces
3. **Teams (Phase 3)**: B2B apps need collaboration and role-based access
4. **Usage Tracking (Phase 4)**: SaaS pricing usually has limits and tiers
5. **Email System (Phase 5)**: Apps need transactional emails and notifications

## ❌ What We're NOT Including (Feedback-Specific)

- Widget system and embedding
- Bug report tracking
- Feature voting/roadmap
- NPS/review collection
- Smart prompts
- Admin dashboard
- Blog/SEO tools
- Feedback-specific forms

---

## 📝 Notes for Implementation

- Each phase builds on the previous one
- Phases 1-3 are HIGH PRIORITY for production-ready boilerplate
- Phases 4-5 are valuable but can be added later
- All patterns are product-agnostic and reusable
- Database migrations should be numbered sequentially
- Include comprehensive TypeScript types
- Follow the UI/Controller pattern for components
- Use React Query for all server state
- Include Storybook stories for UI components
