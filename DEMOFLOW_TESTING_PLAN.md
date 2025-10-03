# 🎬 DemoFlow Complete Testing Plan

## 📋 System Overview

DemoFlow is a comprehensive interactive demo creation platform consisting of:
- **Next.js Web Application** (localhost:3001)
- **Chrome Extension** (TypeScript-based recording tool)
- **Supabase Backend** (Database + Storage + Auth)
- **API Layer** (RESTful endpoints for demo management)

---

## 🚀 Initial Setup & Verification

### Prerequisites Checklist
- [ ] Docker Desktop running (for local Supabase)
- [ ] Node.js 18+ installed  
- [ ] Chrome browser available
- [ ] Git repository cloned
- [ ] Environment variables configured

### 1. Environment Setup

**Check Environment File:**
```bash
# Verify .env.local contains:
NEXT_PUBLIC_SUPABASE_URL=https://awhpbwucogskqttcmqdz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**Install Dependencies:**
```bash
# Main application
npm install

# Chrome extension
cd chrome-extension
npm install
cd ..
```

### 2. Database Setup Verification

**Check Migration Status:**
```bash
# If using local Supabase
supabase status
supabase migration list

# If using remote, verify tables exist in Supabase dashboard
```

**Required Tables:**
- `demos` - Core demo metadata
- `demo_steps` - Individual interaction steps  
- `demo_analytics` - Usage tracking
- `demo_shares` - Public sharing configuration
- `demo_templates` - Reusable templates

### 3. Storage Bucket Setup

**Verify Supabase Storage:**
1. Login to Supabase dashboard
2. Go to Storage section
3. Ensure bucket exists: `demo-assets`
4. Check bucket policies allow authenticated uploads

---

## 🔧 Development Server Testing

### Start Services

**1. Start Next.js Development Server:**
```bash
npm run dev
# Should start on http://localhost:3001
```

**2. Build Chrome Extension:**
```bash
cd chrome-extension
npm run build
# Creates distribution in dist/ folder
```

**3. Verify Server Health:**
```bash
curl -I http://localhost:3001
# Should return 200 OK
```

---

## 🌐 Web Application Testing

### Phase 1: Basic Navigation & Authentication

**Test Steps:**
1. Open http://localhost:3001
2. **Landing Page Test:**
   - [ ] Landing page loads correctly
   - [ ] "Get Started" button works
   - [ ] "Sign In" button works

3. **Authentication Test:**
   - [ ] Sign up with new email works
   - [ ] Email verification flow (check Supabase Auth)
   - [ ] Sign in with existing account works
   - [ ] Redirect to dashboard after login

4. **Dashboard Access:**
   - [ ] Dashboard loads at `/dashboard`
   - [ ] User info displays correctly
   - [ ] Navigation tabs work (Overview, Demos, Profile, Subscription)

### Phase 2: Demo Management Interface

**Navigate to Demos Section:**
1. Click "Demos" tab in dashboard OR go to `/demos`
2. **Demos Dashboard Test:**
   - [ ] Demos page loads without errors
   - [ ] "Create New Demo" section visible
   - [ ] Empty state shows when no demos exist
   - [ ] Chrome extension info card displays

3. **Demo Creation Test:**
   - [ ] Enter demo title and press "Create Demo"
   - [ ] New demo appears in list
   - [ ] Redirects to demo edit page
   - [ ] Demo status shows as "Draft"

4. **Demo Edit Page Test:**
   - [ ] Edit page loads at `/demos/[id]/edit`
   - [ ] Demo settings section functional
   - [ ] Title and description editable
   - [ ] Save button works
   - [ ] Instructions for Chrome extension visible

5. **Demo Player Test:**
   - [ ] Player loads at `/demos/[id]/play`
   - [ ] Shows "No steps" message for new demos
   - [ ] Navigation controls present
   - [ ] Back to demos link works

### Phase 3: API Endpoint Testing

**Manual API Tests:**
```bash
# Test demo listing (requires authentication in browser first)
curl http://localhost:3001/api/demos

# Test demo creation
curl -X POST http://localhost:3001/api/demos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Demo", "description": "API Test"}'
```

**Expected API Behaviors:**
- [ ] GET `/api/demos` returns user's demos
- [ ] POST `/api/demos` creates new demo
- [ ] GET `/api/demos/[id]` returns demo details
- [ ] PATCH `/api/demos/[id]` updates demo
- [ ] DELETE `/api/demos/[id]` removes demo
- [ ] Authentication required for all endpoints

---

## 🔌 Chrome Extension Testing

### Installation & Setup

**1. Install Extension in Developer Mode:**
```bash
# Extension is packaged at:
chrome-extension/demoflow-extension.zip

# Installation steps:
1. Open Chrome → chrome://extensions/
2. Enable "Developer Mode" 
3. Click "Load unpacked"
4. Select chrome-extension/dist/ folder
5. Verify extension appears in toolbar
```

**2. Extension Interface Test:**
- [ ] Extension icon appears in Chrome toolbar
- [ ] Click extension icon opens popup
- [ ] Popup shows DemoFlow interface
- [ ] "Record Demo" option available

### Recording Functionality Testing

**Test Scenario: Record Simple Demo**

**Setup:**
1. Create new demo in web app
2. Note the demo ID from URL
3. Open extension popup

**Recording Test:**
1. **Start Recording:**
   - [ ] Click "Start Recording" in extension
   - [ ] Select demo from dropdown (if multiple exist)
   - [ ] Recording indicator appears

2. **Perform Actions:**
   - [ ] Click various buttons on a webpage
   - [ ] Type in input fields
   - [ ] Navigate to different pages
   - [ ] Add annotations/notes

3. **Stop Recording:**
   - [ ] Click "Stop Recording" in extension
   - [ ] Confirm steps are saved
   - [ ] Check web app shows recorded steps

**Expected Behaviors:**
- [ ] Extension captures click coordinates
- [ ] Element selectors recorded correctly
- [ ] Input values captured
- [ ] Page navigation tracked
- [ ] Timing data recorded
- [ ] Steps appear in demo editor

### Integration Testing

**Extension ↔ Web App Communication:**
1. **Data Synchronization:**
   - [ ] Steps recorded in extension appear in web app
   - [ ] Demo metadata syncs between platforms
   - [ ] Real-time updates work (if implemented)

2. **Authentication:**
   - [ ] Extension respects user authentication
   - [ ] API calls include proper authorization
   - [ ] Logout in web app affects extension

---

## 🎭 End-to-End Demo Playback Testing

### Complete Demo Workflow

**Scenario: Create and Play Full Demo**

**1. Demo Creation:**
- [ ] Create demo: "Product Tour"
- [ ] Add description: "Complete product walkthrough"
- [ ] Save and note demo ID

**2. Recording Phase:**
- [ ] Install Chrome extension
- [ ] Start recording for "Product Tour" demo
- [ ] Navigate to target website (e.g., your landing page)
- [ ] Perform 5-7 meaningful actions:
  - Click navigation links
  - Fill out a form
  - Hover over elements
  - Scroll to different sections
  - Add annotations at key points
- [ ] Stop recording and verify steps saved

**3. Editing Phase:**
- [ ] Return to demo edit page
- [ ] Verify all steps appear correctly
- [ ] Check step descriptions are meaningful
- [ ] Verify step order is correct
- [ ] Test save functionality

**4. Playback Testing:**
- [ ] Navigate to demo player page
- [ ] Test playback controls:
  - Play/Pause functionality
  - Step navigation (next/previous)
  - Progress tracking
  - Stop and restart
- [ ] Verify step descriptions display
- [ ] Check annotations appear correctly
- [ ] Test click-through to specific steps

### Advanced Playback Features

**Interactive Elements:**
- [ ] Progress bar updates correctly
- [ ] Step counter accurate
- [ ] Current step highlighting works
- [ ] Step list navigation functional

**Error Handling:**
- [ ] Invalid demo IDs show appropriate errors
- [ ] Missing steps handled gracefully
- [ ] Network errors don't break playback

---

## 🔒 Security & Permissions Testing

### Authentication & Authorization

**User Isolation:**
1. **Create Test Users:**
   - Create 2 different user accounts
   - Create demos in each account

2. **Access Control Test:**
   - [ ] User A cannot see User B's demos
   - [ ] Direct URL access to other user's demos blocked
   - [ ] API endpoints reject unauthorized access

**Data Security:**
- [ ] User data properly scoped in database
- [ ] RLS policies working correctly
- [ ] Sensitive data not exposed in API responses

### Chrome Extension Permissions

**Permission Usage:**
- [ ] Extension only requests necessary permissions
- [ ] Content script access appropriate
- [ ] Background script permissions minimal
- [ ] Storage access secure

---

## 📊 Performance & Reliability Testing

### Load Testing

**Demo Management:**
- [ ] Test with 50+ demos in account
- [ ] Large demo with 100+ steps
- [ ] Multiple concurrent users (if possible)

**Browser Performance:**
- [ ] Extension doesn't slow down browsing
- [ ] Recording overhead minimal
- [ ] Memory usage reasonable
- [ ] No console errors during use

### Error Recovery

**Network Issues:**
- [ ] Offline recording handling
- [ ] Failed API requests retry
- [ ] Partial data recovery

**Browser Scenarios:**
- [ ] Page refresh during recording
- [ ] Tab switching behavior
- [ ] Browser restart recovery

---

## 🐛 Error Scenarios & Edge Cases

### Data Validation

**Invalid Inputs:**
- [ ] Empty demo titles
- [ ] Extremely long descriptions
- [ ] Special characters in demo names
- [ ] Invalid step data

**Extension Edge Cases:**
- [ ] Recording on protected pages (chrome://)
- [ ] Recording on HTTPS vs HTTP sites
- [ ] Recording with ad blockers enabled
- [ ] Recording in incognito mode

### UI Edge Cases

**Responsive Design:**
- [ ] Mobile browser testing (if applicable)
- [ ] Different screen resolutions
- [ ] Browser zoom levels

**Accessibility:**
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast requirements

---

## 📋 Testing Checklist Summary

### ✅ Core Functionality
- [ ] User registration and authentication
- [ ] Demo creation and management
- [ ] Chrome extension installation and setup
- [ ] Recording workflow (click, type, navigate)
- [ ] Step editing and management
- [ ] Demo playback and controls
- [ ] Data persistence and synchronization

### ✅ User Experience
- [ ] Intuitive navigation between all sections
- [ ] Clear instructions and feedback
- [ ] Error messages helpful and actionable
- [ ] Loading states during API calls
- [ ] Responsive design on different devices

### ✅ Technical Requirements
- [ ] All API endpoints functional
- [ ] Database migrations applied correctly
- [ ] Storage bucket configured and accessible
- [ ] TypeScript compilation without errors
- [ ] No console errors in browser
- [ ] Chrome extension builds successfully

### ✅ Security & Privacy
- [ ] User data properly isolated
- [ ] Authentication required for sensitive operations
- [ ] Extension permissions minimal and justified
- [ ] No sensitive data exposed in client-side code

---

## 🚀 Quick Start Testing Script

For rapid testing, follow this condensed workflow:

```bash
# 1. Start the application
npm run dev

# 2. Build extension
cd chrome-extension && npm run build && cd ..

# 3. Open browser and test:
# - Go to http://localhost:3001
# - Sign up/Login
# - Create a demo
# - Install extension from chrome-extension/dist/
# - Record some interactions
# - View recorded demo in player

# 4. Verify data persistence:
# - Refresh browser
# - Check demos still exist
# - Verify recorded steps intact
```

## 📞 Troubleshooting Guide

### Common Issues:

1. **"Failed to connect to server"**
   - Check if development server is running
   - Verify port 3001 is not blocked

2. **"Database connection failed"**
   - Check Supabase credentials in .env.local
   - Verify Supabase project is active
   - Check database migrations are applied

3. **"Extension not recording"**
   - Verify extension is loaded in developer mode
   - Check browser console for errors
   - Ensure proper permissions granted

4. **"Demos not showing"**
   - Check user authentication
   - Verify database policies
   - Check browser network tab for API errors

### Debug Tools:
- Browser Developer Tools → Network tab
- Browser Developer Tools → Console
- Supabase Dashboard → Database → Table Editor
- Chrome Extensions → Developer Mode → Inspect views

---

## 📈 Success Criteria

The DemoFlow system is considered fully functional when:

1. ✅ **Complete User Journey Works:**
   - Sign up → Create Demo → Record Steps → Edit Demo → Play Demo

2. ✅ **Data Persistence:**
   - All user data survives browser refresh
   - Demos and steps properly stored in database

3. ✅ **Cross-Platform Integration:**
   - Chrome extension communicates with web app
   - Real-time data synchronization works

4. ✅ **Production Ready:**
   - No TypeScript errors
   - No console errors in browser
   - Proper error handling for edge cases
   - Security measures implemented

Use this testing plan to systematically verify all aspects of the DemoFlow system and ensure a robust, user-friendly demo creation platform!