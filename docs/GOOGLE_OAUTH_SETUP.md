# Google OAuth Setup Guide

Google OAuth is **optional** - email/password authentication works without it. Add Google OAuth when you're ready to give users a faster signup option.

## Quick Setup (5 minutes)

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name: "Your SaaS Name" → Create

### 2. Configure OAuth Consent Screen

1. In sidebar: **APIs & Services** → **OAuth consent screen**
2. Choose **External** → Create
3. Fill required fields:
   - App name: Your SaaS Name
   - User support email: your@email.com
   - Developer contact: your@email.com
4. Click **Save and Continue** (skip scopes)
5. Add test users (your email) → Save

### 3. Create OAuth Credentials

1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: "Web Client"
4. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
5. Click **Create**
6. **Copy both values:**
   - Client ID (starts with numbers, ends with `.apps.googleusercontent.com`)
   - Client secret (starts with `GOCSPX-`)

### 4. Add to Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Your project → **Authentication** → **Providers**
3. Find **Google** → Enable
4. Paste:
   - Client ID
   - Client Secret
5. Copy the **Callback URL** (looks like `https://xxx.supabase.co/auth/v1/callback`)
6. Save

### 5. Update Google Cloud (Add Supabase Callback)

1. Back to Google Cloud Console → **Credentials**
2. Click your OAuth 2.0 Client ID
3. **Authorized redirect URIs** → Add:
   - The Supabase callback URL you just copied
4. Save

### 6. Add to .env.local

```bash
# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

### 7. Test It

1. Restart dev server: `npm run dev`
2. Go to `/login` or `/signup`
3. Click "Continue with Google"
4. Sign in with Google
5. You should be redirected to `/dashboard`

## Production Checklist

Before deploying:

- [ ] Add production redirect URI to Google Cloud: `https://yourdomain.com/auth/callback`
- [ ] Update `NEXT_PUBLIC_APP_URL` in production env
- [ ] Publish OAuth consent screen (in Google Cloud Console)
- [ ] Remove test mode if needed

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Your redirect URI doesn't match Google Cloud Console
- Check both localhost AND Supabase callback are added
- Make sure URLs match exactly (no trailing slashes)

**Error: "Access blocked: This app's request is invalid"**
- OAuth consent screen not configured properly
- Make sure you added your email as a test user
- Check all required fields are filled

**Google button doesn't work**
- Check `.env.local` has correct values
- Restart dev server after adding env variables
- Check browser console for errors

**User stuck on Google consent screen**
- Supabase callback URL not added to Google Cloud
- Go to Credentials → Add Supabase callback to Authorized redirect URIs

## How It Works

1. User clicks "Continue with Google"
2. Redirected to Google to sign in
3. Google redirects to Supabase callback
4. Supabase creates/updates user account
5. User redirected to your app `/auth/callback`
6. App redirects to `/dashboard`

## Need Help?

- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
