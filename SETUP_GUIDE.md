# DemoFlow Setup Guide (Simplified)

This guide will walk you through setting up DemoFlow with the core demo functionality. We'll start simple without teams, subscriptions, or complex limits.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- A Supabase account
- Optional: Resend account (for emails), PostHog account (for analytics)

## Step 1: Supabase Project Setup

### 1.1 Create New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Set project name: `demoflow` (or your preferred name)
5. Set database password (save this!)
6. Choose region closest to your users
7. Click "Create new project"

### 1.2 Get Supabase Configuration

Once your project is created:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: Long JWT token starting with `eyJ...`
   - **service_role key**: Long JWT token starting with `eyJ...`

### 1.3 Run Database Migrations

Since we're setting up for production, we'll run the migrations directly in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Go to **SQL Editor** 
3. Copy and paste the content from `supabase/migrations/01_essential_saas_schema.sql`
4. Click **Run** to execute the migration
5. Then copy and paste the content from `supabase/migrations/20250920_demoflow_tables.sql`
6. Click **Run** to execute the DemoFlow tables

Alternatively, if you have Docker installed, you can use the Supabase CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase db push
```

### 1.4 Set up Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click "Create bucket"
3. Name: `demo-assets`
4. Public: `Yes` (for demo sharing)
5. Click "Create"

## Step 2: Environment Variables Setup

### 2.1 Copy Environment File

```bash
cp .env.local.example .env.local
```

### 2.2 Fill in Supabase Variables

Edit `.env.local` and add your Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 3: Basic Configuration

For the simplified version, we'll skip Stripe payments and focus on core demo functionality. You can add payments later.

## Step 4: Application Setup

### 4.1 Set App URL

Edit `.env.local` and set:

For development:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Generate TypeScript Types

Update the types generation command with your Supabase project ID:

1. Edit `package.json`
2. Replace `YOUR_PROJECT_ID` in the `types:generate` script with your actual project ID
3. Run the command:

```bash
npm run types:generate
```

## Step 5: Test the Setup

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Test Basic Functionality

1. Open `http://localhost:3000`
2. Try signing up for an account
3. Check that profile is created in Supabase

### 5.3 Test Database

Check your Supabase dashboard **Table Editor** and verify these tables exist:
- `profiles`
- `teams`  
- `team_members`
- `user_subscriptions`
- `user_usage`
- `demos`
- `demo_steps`
- `demo_analytics`
- `demo_shares`
- `demo_templates`

## Next Steps

Once setup is complete, you can proceed to build DemoFlow features:
- Demo management API endpoints
- Demo creation and editing interface
- Chrome extension for recording
- Demo viewer for public sharing

## Troubleshooting

### Common Issues

**Migration Errors:**
- Ensure you're linked to the correct project with `supabase link`
- Check that you have the latest Supabase CLI version

**Authentication Issues:**
- Verify your Supabase URL and keys are correct
- Check that RLS policies are set up correctly

**Type Generation Errors:**
- Ensure you replaced `YOUR_PROJECT_ID` with actual project ID
- Make sure you're authenticated with Supabase CLI

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Create an issue in the project repository

## What We Built

This simplified setup gives you:
- ✅ User authentication with Supabase
- ✅ Demo storage and management
- ✅ Public demo sharing with tokens
- ✅ Analytics tracking for demo views
- ✅ Basic demo templates
- ✅ Step-by-step demo recording structure

Your DemoFlow foundation is now ready! 🚀