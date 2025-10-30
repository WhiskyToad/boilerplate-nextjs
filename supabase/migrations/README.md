# Modular Database Migrations

Your database setup is now fully modular! Mix and match features based on your needs.

## Structure

```
migrations/
├── core/                    # Base building blocks
│   ├── 00_base.sql         # Required: profiles, subscriptions, usage, admin roles
│   └── 01_teams.sql        # Optional: teams, members, invitations
│
├── optional/               # Add-on features
│   ├── admin.sql          # Admin activity logging & enhanced views
│   └── security.sql       # Comprehensive security & audit logging
│
└── archive/               # Old monolithic migrations (deprecated)
```

## How to Use

### Via Setup UI (Recommended)

1. Go to `/dev/setup` in your running app
2. Expand "Database Setup"
3. Check the modules you want:
   - ✅ **Base** (always included) - Profiles, subscriptions, usage, admin roles
   - ☑️ **Teams & Collaboration** - Team creation, invites, members
   - ☑️ **Admin Activity Logging** - Track admin actions
   - ☑️ **Security & Audit** - Failed logins, rate limits, session tracking
4. Click "Copy SQL"
5. Paste into Supabase SQL Editor
6. Click Run

### Manually

Combine the modules you need:

**Solo app (no teams):**
```bash
cat core/00_base.sql optional/admin.sql > combined.sql
```

**Teams app with security:**
```bash
cat core/00_base.sql core/01_teams.sql optional/security.sql > combined.sql
```

**Full-featured app:**
```bash
cat core/00_base.sql core/01_teams.sql optional/admin.sql optional/security.sql > combined.sql
```

## What Each Module Provides

### Core: Base (Required)
- `profiles` table with admin role support
- `user_subscriptions` for Stripe integration
- `user_usage` for quota tracking
- Signup triggers to auto-create profiles
- Admin-specific RLS policies

### Core: Teams (Optional)
- `teams` table
- `team_members` junction table
- `team_invites` for collaboration
- Personal team auto-creation on signup
- Team-aware tier limits

### Optional: Admin (Optional)
- `admin_activity` table for tracking admin actions
- `profiles_with_auth` view combining profile + auth data
- Enhanced admin-only policies

### Optional: Security (Optional)
- `audit_logs` - Comprehensive event logging
- `security_events` - High-priority security incidents
- `failed_login_attempts` - Brute force protection
- `rate_limit_violations` - API abuse tracking
- `user_sessions` - Active session management
- `suspicious_patterns` - Threat detection
- Helper functions for security operations

## Migration Files (Archived)

The following files are deprecated but kept for reference:
- `00_simple_solo_schema.sql` - Monolithic solo schema
- `01_essential_saas_schema.sql` - Monolithic teams schema
- `04_welcome_email_trigger.sql` - Welcome emails (hardcoded domain)
- `20250916_admin_system.sql` - Old admin system (conflicts with new base)
- `20250916_security_audit.sql` - Old security system (now modular)

**Don't use these** - they're replaced by the modular system.

## Tips

- Start with just Base for the simplest setup
- Add Teams later if you need collaboration
- Enable Admin logging if you plan to have admin features
- Only add Security if you need comprehensive auditing (adds ~6 tables)
- Admin roles are included in Base by default (just the `role` column)
- All modules work independently - no conflicts
