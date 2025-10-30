# 🎨 Customization Guide

Quick reference for customizing your SaaS boilerplate.

---

## 🎯 Quick Start Checklist

1. ✅ Update `src/config/site-config.ts` (FIRST!)
2. ✅ Update logo and favicon in `public/`
3. ✅ Customize landing page components
4. ✅ Update colors/theme
5. ✅ Update legal pages

---

## 📝 Site Configuration (Start Here!)

### File: `src/config/site-config.ts`

This is your **single source of truth** for site metadata, pricing, and features.

```typescript
export const siteConfig = {
  name: "Your SaaS Name",           // Change this!
  description: "Your description",  // Change this!
  email: "hello@yoursaas.com",      // Change this!

  pricing: {
    // Update your pricing here
  },

  features: [
    // Update your features here
  ],
}
```

**What to change:**
- `name` - Your SaaS name (appears everywhere)
- `description` - Short description for SEO
- `email` - Your support email
- `social` - Your social media handles
- `pricing` - Align with your Stripe products
- `features` - Landing page features

---

## 🖼️ Branding

### Logo & Favicon

**Files to replace:**
```
public/
  ├── logo.svg          # Main logo (used in header)
  ├── favicon.ico       # Browser tab icon
  ├── apple-touch-icon.png  # iOS home screen
  └── android-chrome-*.png  # Android icons
```

**Recommended sizes:**
- Logo: SVG (scalable) or PNG at 200x50px
- Favicon: 32x32px
- Apple touch icon: 180x180px
- Android icons: 192x192px and 512x512px

### Where logo appears:
- `src/components/shared/Header.tsx`
- `src/features/landing/Hero.tsx`
- `src/app/layout.tsx` (metadata)

---

## 🎨 Colors & Theme

### Primary Method: Tailwind Config

**File: `tailwind.config.ts`**

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your brand colors here
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... your color scale
          900: '#0c4a6e',
        }
      }
    }
  }
}
```

### Quick Theme Colors

**File: `src/app/globals.css`**

Update these CSS variables for quick theme changes:

```css
:root {
  --primary: 210 100% 50%;    /* Main brand color */
  --secondary: 160 100% 50%;  /* Accent color */
  --background: 0 0% 100%;    /* Page background */
  --foreground: 0 0% 10%;     /* Text color */
}
```

### DaisyUI Themes

The boilerplate uses DaisyUI. Change theme in `tailwind.config.ts`:

```typescript
daisyui: {
  themes: ["light", "dark", "cupcake", /* add more */],
}
```

---

## 🏠 Landing Page

### Main Components (in order of appearance)

**File: `src/features/landing/`**

```
landing/
  ├── Hero.tsx          # Top section with headline & CTA
  ├── Features.tsx      # Feature grid
  ├── Pricing.tsx       # Pricing table
  ├── FAQ.tsx           # Frequently asked questions
  └── CTA.tsx           # Bottom call-to-action
```

### Quick Changes

#### 1. Hero Section (`Hero.tsx`)

```typescript
// Update headline and tagline
<h1>Your Amazing Headline</h1>
<p>Your compelling tagline that explains your value</p>

// Update CTA buttons
<Button href="/signup">Get Started Free</Button>
```

#### 2. Features (`Features.tsx`)

Features are pulled from `site-config.ts`:

```typescript
// src/config/site-config.ts
features: [
  {
    title: "Feature Name",
    description: "Feature description",
    icon: "🚀",  // Emoji or icon
  },
  // Add more features...
]
```

#### 3. Pricing (`Pricing.tsx`)

Pricing is also in `site-config.ts`:

```typescript
pricing: {
  free: {
    name: "Free",
    price: 0,
    features: ["Feature 1", "Feature 2"],
  },
  pro: {
    priceMonthly: 19,
    priceAnnual: 189,
    features: ["Everything in Free", "Feature 3"],
    highlighted: true,  // This will be featured
  },
  // ...
}
```

#### 4. FAQ (`FAQ.tsx`)

Edit directly in the file:

```typescript
const faqs = [
  {
    question: "Your question?",
    answer: "Your answer here",
  },
  // Add more FAQs...
]
```

---

## 📄 Page Structure

### Main Pages

```
src/app/
  ├── page.tsx                    # Landing page (/)
  ├── dashboard/page.tsx          # Dashboard home
  ├── signup/page.tsx             # Signup page
  ├── login/page.tsx              # Login page (currently uses modal)
  ├── privacy/page.tsx            # Privacy policy
  └── terms/page.tsx              # Terms of service
```

### Dashboard Pages

```
src/app/dashboard/
  ├── page.tsx              # Dashboard home
  └── profile/page.tsx      # User profile settings
```

---

## 🔐 Legal Pages

### Privacy Policy & Terms

**Files:**
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`

**Important:** These contain placeholder text! Update with your actual legal documents.

**Options:**
1. Edit the MDX/React components directly
2. Use a legal generator (e.g., termsfeed.com, iubenda.com)
3. Hire a lawyer for custom terms

---

## 📧 Email Templates

**File: `src/lib/emails/`**

```
emails/
  └── welcome-template.tsx    # Welcome email
```

Email templates use `@react-email/render` for beautiful HTML emails.

**To customize:**

```typescript
export const WelcomeEmail = ({ name }: { name: string }) => (
  <Html>
    <Head />
    <Preview>Welcome to Your SaaS!</Preview>
    <Body>
      {/* Your email content */}
    </Body>
  </Html>
)
```

**Test emails:**
- Use Resend's email preview
- Send test emails to yourself
- Check spam folder!

---

## 🎛️ Navigation

### Header Navigation

**File: `src/components/shared/Header.tsx`**

```typescript
const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Docs', href: '/docs' },
  // Add more links...
]
```

### Footer

**File: `src/components/shared/Footer.tsx`**

Update links, social media, and copyright information.

---

## 🎨 Font & Typography

### Change Default Font

**File: `src/app/layout.tsx`**

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Or use a different font:
import { Poppins } from 'next/font/google'
const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin']
})
```

### Typography Styles

**File: `src/app/globals.css`**

```css
/* Headings */
h1 { @apply text-4xl font-bold; }
h2 { @apply text-3xl font-semibold; }

/* Body text */
p { @apply text-base leading-relaxed; }
```

---

## 🔧 Advanced Customization

### Adding New Pages

1. Create file in `src/app/your-page/page.tsx`
2. Add route to navigation
3. Export metadata for SEO

```typescript
// src/app/your-page/page.tsx
export const metadata = {
  title: 'Your Page Title',
  description: 'Page description',
}

export default function YourPage() {
  return <div>Your content</div>
}
```

### Adding New Features

1. Create feature directory: `src/features/your-feature/`
2. Create components (UI and Controller)
3. Add Storybook stories if needed
4. Import in relevant pages

### Environment-Based Config

```typescript
// Different configs for dev/prod
const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.yoursaas.com'
    : 'http://localhost:3000/api',
}
```

---

## 📱 Responsive Design

### Mobile-First Approach

All components use Tailwind's responsive prefixes:

```typescript
<div className="
  px-4           // Mobile: 16px padding
  md:px-8        // Tablet: 32px padding
  lg:px-12       // Desktop: 48px padding
">
```

### Breakpoints

```
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

---

## ✅ Customization Checklist

Use this checklist when setting up a new project:

- [ ] Update `src/config/site-config.ts`
- [ ] Replace logo and favicon
- [ ] Update colors in `tailwind.config.ts`
- [ ] Customize Hero section headline
- [ ] Update Features list
- [ ] Adjust Pricing (align with Stripe)
- [ ] Update FAQ questions
- [ ] Edit Privacy Policy
- [ ] Edit Terms of Service
- [ ] Update email templates
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Update social media links
- [ ] Add your Google Analytics/PostHog

---

## 🆘 Need Help?

- **Setup issues**: See `SETUP.md`
- **Architecture**: See `docs/UNIVERSAL_SAAS_PATTERNS.md`
- **Component library**: Run `npm run storybook`
- **TypeScript errors**: Run `npm run tsc`

---

## 🎯 Pro Tips

1. **Use site-config.ts** - Keep all customizable data there
2. **Mobile first** - Always check mobile view
3. **Test emails** - Send test emails before launch
4. **Check contrast** - Ensure text is readable
5. **SEO metadata** - Update page metadata for each route
6. **Legal review** - Have a lawyer review terms/privacy
7. **Brand consistency** - Use the same colors/fonts throughout

---

**Happy customizing! 🎨**
