# Complete Next.js SaaS Boilerplate Guide

Welcome to the comprehensive guide for using this production-ready Next.js SaaS boilerplate. This guide will help you get up and running quickly and effectively customize the boilerplate for your specific needs.

## 🚀 Quick Start (5 Minutes)

### 1. Clone & Install
```bash
git clone <your-repository-url>
cd nextjs-boilerplate
npm install
```

### 2. Environment Setup
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your service keys:
```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Resend (for emails)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Database Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login and link to your project
supabase login
supabase link --project-ref your-project-id

# Run migrations
supabase db push

# Generate types
npm run types:generate
```

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` - your SaaS is now running! 🎉

## 📋 What's Included

### Core Features
- **🔐 Complete Authentication System**
  - Email/password signup and login
  - OAuth (Google, GitHub)
  - Password reset flow
  - Email verification
  - Protected routes

- **💳 Stripe Payment Integration**
  - Three-tier subscription system (Free, Pro, Teams)
  - Checkout and billing portal
  - Webhook handling
  - Usage-based billing limits

- **📊 Multi-tenant Architecture**
  - User profiles and teams
  - Role-based permissions (owner, admin, member)
  - Team invitations
  - Personal workspaces

- **🎨 Complete UI Component Library**
  - 20+ production-ready components
  - Storybook for component development
  - Dark/light theme support
  - Responsive design

- **🔧 Admin Dashboard**
  - User management
  - Subscription analytics
  - Security monitoring
  - System metrics

- **📧 Email System**
  - Automated welcome emails
  - Password reset emails
  - Subscription notifications
  - React Email templates

- **🛡️ Enterprise Security**
  - Rate limiting
  - CSRF protection
  - Input sanitization
  - Audit logging
  - Security headers

- **📱 File Upload System**
  - Avatar uploads
  - Document management
  - Image processing
  - Storage integration

## 🏗️ Architecture Overview

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   └── admin/          # Admin panel
├── components/          # React components
│   ├── ui/             # Design system components
│   ├── admin/          # Admin-specific components
│   └── shared/         # Shared components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication features
│   ├── landing/        # Landing page components
│   ├── profile/        # User profile features
│   └── subscription/   # Payment features
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── api/            # API utilities
│   ├── auth/           # Auth configuration
│   ├── email/          # Email service
│   ├── security/       # Security middleware
│   └── supabase/       # Database client
└── stores/             # State management
```

## 🎯 Customization Guide

### 1. Branding & Styling

#### Update Your Brand
1. **Logo**: Replace files in `public/logo/`
2. **Favicon**: Replace `public/favicon.svg`
3. **App Name**: Update `src/app/layout.tsx`
4. **Colors**: Modify `tailwind.config.ts`

```typescript
// tailwind.config.ts
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          primary: "#your-primary-color",
          secondary: "#your-secondary-color",
        }
      }
    ]
  }
}
```

#### Landing Page Customization
Edit components in `src/features/landing/`:
- `HeroSection.tsx` - Main hero content
- `FeaturesSection.tsx` - Feature highlights  
- `SimplePricing.tsx` - Pricing display
- `FAQSection.tsx` - Frequently asked questions

### 2. Subscription Plans

#### Modify Plans
Edit `src/lib/stripe-config.ts`:

```typescript
export const TIER_PRICING = {
  free: {
    name: 'Starter',
    price: 0,
    projects: 3,           // Increase free tier limit
    apiCalls: 5000,        // Increase API calls
    features: ['Basic analytics', 'Email support']
  },
  pro: {
    name: 'Professional',
    priceMonthly: 29,      // Change price
    priceAnnual: 290,      // Annual pricing
    projects: 15,          // Set limits
    apiCalls: 50000,
    features: ['Advanced analytics', 'Priority support', 'Custom domains']
  }
}
```

#### Create Stripe Products
1. Go to Stripe Dashboard → Products
2. Create products matching your tiers
3. Update environment variables with price IDs
4. Test with Stripe's test cards

### 3. Database Schema

#### Add Business Tables
Create new migration in `supabase/migrations/`:

```sql
-- 03_your_business_tables.sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  team_id UUID REFERENCES teams(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can manage their projects" ON projects
  FOR ALL USING (
    user_id = auth.uid() OR 
    team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
  );
```

Then run:
```bash
supabase db push
npm run types:generate
```

### 4. API Endpoints

#### Create New API Route
Example: `src/app/api/projects/route.ts`

```typescript
import { withAuth, apiResponse } from '@/lib/api/middleware'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const GET = withAuth(async (request, user) => {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)

  if (error) throw new Error('Failed to fetch projects')
  return apiResponse(projects)
})

export const POST = withAuth(async (request, user) => {
  const body = await request.json()
  
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...body,
      user_id: user.id
    })
    .select()
    .single()

  if (error) throw new Error('Failed to create project')
  return apiResponse(project, 'Project created successfully')
})
```

### 5. Custom Hooks

#### Create Business Logic Hooks
Example: `src/hooks/useProjects.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'

export function useProjects() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
    enabled: !!user
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (projectData: any) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access_token}`
        },
        body: JSON.stringify(projectData)
      })
      if (!res.ok) throw new Error('Failed to create project')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}
```

### 6. UI Components

#### Create New Components
Follow the existing pattern in `src/components/ui/`:

```typescript
// src/components/ui/project-card/ProjectCard.tsx
import { Card, CardHeader, CardContent } from '../card/Card'
import { Button } from '../button/Button'
import { Badge } from '../badge/Badge'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    status: 'active' | 'inactive'
    createdAt: string
  }
  onEdit?: () => void
  onDelete?: () => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Badge variant={project.status === 'active' ? 'success' : 'warning'}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-base-content/70 mb-4">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={onEdit}>Edit</Button>
          <Button size="sm" variant="outline" onClick={onDelete}>Delete</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

#### Add Storybook Story
```typescript
// src/components/ui/project-card/ProjectCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ProjectCard } from './ProjectCard'

const meta: Meta<typeof ProjectCard> = {
  title: 'UI/ProjectCard',
  component: ProjectCard,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    project: {
      id: '1',
      name: 'My Awesome Project',
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z'
    }
  }
}
```

## 🔧 Common Development Tasks

### Adding New Features

#### 1. Plan Your Feature
- Define the database schema
- Design the API endpoints
- Create the UI components
- Plan the user flow

#### 2. Database First
```bash
# Create migration
supabase migration new add_feature_name

# Edit the SQL file
# Run migration
supabase db push

# Update types
npm run types:generate
```

#### 3. API Routes
Create API endpoints following the existing pattern in `src/app/api/`

#### 4. React Hooks
Create custom hooks for data fetching in `src/hooks/`

#### 5. UI Components
Build components following the design system in `src/components/ui/`

#### 6. Feature Integration
Integrate everything in `src/features/your-feature/`

### Testing Your Changes

#### Run Type Checking
```bash
npm run tsc
```

#### Lint Code
```bash
npm run lint
```

#### Test Components in Storybook
```bash
npm run storybook
```

#### Build for Production
```bash
npm run build
```

### Security Best Practices

#### 1. Database Security
- Always use Row Level Security (RLS)
- Test policies thoroughly
- Use service role key only in API routes

#### 2. API Security
- Validate all inputs
- Use the `withAuth` middleware
- Implement rate limiting
- Sanitize user data

#### 3. Client-Side Security
- Never store secrets in client code
- Validate on both client and server
- Use HTTPS in production
- Implement CSRF protection

## 🚀 Deployment Guide

### Vercel Deployment (Recommended)

#### 1. Connect Repository
1. Go to vercel.com
2. Import your Git repository
3. Configure environment variables

#### 2. Environment Variables
Set all production environment variables:
- Switch to Stripe live keys
- Use production Supabase project
- Set production app URL
- Configure email service

#### 3. Custom Domain
1. Add domain in Vercel dashboard
2. Update DNS records
3. Update `NEXT_PUBLIC_APP_URL`

### Other Deployment Options

#### Docker
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

#### Self-Hosted
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Use PM2 for process management
4. Set up reverse proxy (Nginx)
5. Configure SSL certificates

## 🎓 Learning Resources

### Understanding the Codebase
1. Start with `src/app/page.tsx` - the landing page
2. Explore `src/app/dashboard/page.tsx` - main user interface
3. Check `src/hooks/useAuth.ts` - authentication logic
4. Review `src/lib/supabase/` - database integration
5. Study `src/components/ui/` - component library

### Key Concepts
- **Row Level Security**: Database-level access control
- **Server Actions**: Next.js server-side functions
- **React Query**: Server state management
- **Zustand**: Client state management
- **Middleware**: Request/response processing

### Next Steps
1. Customize the landing page
2. Add your first custom feature
3. Set up Stripe products
4. Deploy to production
5. Monitor and iterate

## ❓ Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check Supabase connection
supabase status
supabase db ping
```

#### Type Errors
```bash
# Regenerate types
npm run types:generate
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Stripe Issues
- Verify webhook endpoints
- Check environment variables
- Test with Stripe CLI in development

#### Email Issues
- Verify Resend API key
- Check DNS records for custom domains
- Test email templates

### Getting Help
1. Check existing GitHub issues
2. Review documentation
3. Check component stories in Storybook
4. Use TypeScript for better error messages

## 🎯 Production Checklist

Before launching:
- [ ] Update all branding and content
- [ ] Configure production environment variables
- [ ] Set up proper error monitoring
- [ ] Configure backup strategies
- [ ] Test all payment flows
- [ ] Verify email delivery
- [ ] Set up analytics
- [ ] Test security measures
- [ ] Configure domains and SSL
- [ ] Set up monitoring and alerts

---

## 🤝 Contributing

This boilerplate is designed to be a starting point. Customize it to match your specific needs:

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Document your modifications
5. Consider contributing improvements back

## 📄 License

MIT License - Use this boilerplate for any project, commercial or personal.

---

**Ready to build your SaaS?** Start with the Quick Start guide above and you'll have a production-ready application running in minutes! 🚀