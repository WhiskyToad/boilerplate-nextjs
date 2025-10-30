# ⚡ Quick Start (45 Minutes)

Get up and running with our interactive setup guide. For full details, see [SETUP.md](./SETUP.md).

---

## 🎯 Prerequisites

- Node.js 18+
- That's it! (we'll guide you through creating Supabase and Stripe accounts)

---

## 🚀 Steps

### 1. Install
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```

### 3. Follow the interactive guide
Visit http://localhost:3000/dev

The guide walks you through in order:
1. **Supabase Setup** (10 min) - Account, keys, add to .env.local
2. **Database Setup** (5 min) - Initialize with Solo or Teams schema
3. **Stripe Setup** (20 min) - Account, keys, products, add to .env.local
4. **Test Everything** (10 min) - Branding, auth, payments

**Just check off each step as you complete it.**

Your progress is automatically saved, so you can take breaks and resume anytime!

---

## 📖 Full Guides

- **Complete Setup:** [SETUP.md](./SETUP.md) - 60-minute guide
- **Customization:** [docs/CUSTOMIZATION.md](./docs/CUSTOMIZATION.md) - Make it yours
- **Architecture:** [docs/UNIVERSAL_SAAS_PATTERNS.md](./docs/UNIVERSAL_SAAS_PATTERNS.md) - How it works

---

## 🆘 Troubleshooting

**"Supabase connection failed"**
```bash
# Check your keys in .env.local
# Verify project isn't paused in Supabase dashboard
```

**"Stripe error"**
```bash
# Make sure you're in test mode
# Verify all price IDs are correct
```

**"Setup check fails"**
```bash
# Read the error messages - they tell you exactly what's missing
# Run: npm run setup:check
```

---

## 🎨 Quick Customization

Edit ONE file to update everything:
```bash
src/config/site-config.ts
```

Update:
- Site name
- Description
- Pricing plans
- Features list
- Social links

---

## ✅ Next Steps

1. Sign up on your local app
2. Test Stripe checkout (use test card: `4242 4242 4242 4242`)
3. Edit landing page in `src/features/landing/`
4. Customize colors in `tailwind.config.ts`
5. Deploy to Vercel!

---

**Need help?** See [SETUP.md](./SETUP.md) for detailed instructions.
