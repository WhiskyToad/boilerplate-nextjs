# Next.js SaaS Boilerplate

This is a full-featured [Next.js](https://nextjs.org) SaaS boilerplate with user authentication, subscription management, and AI integration. It provides a solid foundation for building modern web applications with best practices.

![Project Screenshot](./public/screenshot.png)

## Features

- 🔐 **Authentication** - Complete user authentication flow with Supabase
- 💳 **Subscription Management** - Stripe integration for payments and subscription management
- 🤖 **AI Integration** - OpenAI API integration ready for AI-powered features
- 📊 **Analytics** - PostHog integration for tracking user behavior
- 🎨 **Styling** - Tailwind CSS with DaisyUI components for beautiful UI
- 🔄 **State Management** - Zustand for global state management
- 📡 **Data Fetching** - React Query for efficient data fetching and caching
- 📱 **Responsive Design** - Mobile-first responsive layouts
- 🔒 **Security** - Environment variable protection and security best practices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Payments**: Stripe
- **Analytics**: PostHog
- **AI**: OpenAI API

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm/bun
- Supabase account
- Stripe account (for payment features)
- OpenAI API key (for AI features)
- PostHog account (for analytics)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/your-project.git
cd your-project
```

2. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

This boilerplate provides a complete SaaS application structure that you can customize to your needs.

### Configuration

1. Modify the site configuration in `src/config/site.config.json` to set your site's details, including:
   - Site title, description, and branding
   - Landing page content and sections
   - Pricing plans and feature lists
   - FAQ content
   - Legal documents

### Customization

The boilerplate is designed to be easily customizable:

1. Modify UI components in the `components` directory
2. Add new features by expanding the modules in the `features` directory
3. Customize authentication flows in the `features/auth` directory
4. Extend AI capabilities in the `features/generation` directory

## Project Structure

```
/src
  /components      # Reusable UI components
    /LandingPage   # Components specific to landing page
    /Modals        # Modal components
  /features        # Feature modules
    /account       # Account management features
    /auth          # Authentication related code
    /generation    # AI generation features
    /hooks         # Custom React hooks
    /services      # Service layer for API calls
    /store         # Zustand stores
    /supabase      # Supabase client and utilities
    /subscription  # Subscription management
    /types         # TypeScript types and interfaces
  /pages           # Next.js pages
    /api           # API routes
    /account       # Account pages
    /checkout      # Checkout flow
  /utils           # Utility functions and helpers
```

## Customization

### Theme and Styling

The project uses Tailwind CSS with DaisyUI for theming. You can modify the theme in `src/globals.css`.

### Landing Page

Customize the landing page components in `src/components/LandingPage/` to match your branding.

### Product Features

Modify the product features and pricing tiers in the appropriate components to match your SaaS offering.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

For other deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [OpenAI](https://openai.com/)
- [PostHog](https://posthog.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)
