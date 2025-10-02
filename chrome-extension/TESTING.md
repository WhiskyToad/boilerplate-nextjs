# DemoFlow Chrome Extension Testing Guide

## Prerequisites

1. **Chrome Browser** (version 88+ for Manifest V3 support)
2. **Node.js** (version 16+)
3. **Built Extension** (run `npm run build` first)

## Installation & Testing Steps

### 1. Build the Extension

```bash
cd chrome-extension
npm install
npm run build
```

### 2. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project
5. The DemoFlow extension should appear in your extensions list

### 3. Basic Functionality Tests

#### Test 1: Extension Installation
- ✅ Extension loads without errors
- ✅ Extension icon appears in Chrome toolbar
- ✅ No console errors in `chrome://extensions/`

#### Test 2: Popup Interface
1. Click the DemoFlow extension icon
2. Verify popup opens with authentication UI
3. Check browser console for any JavaScript errors
4. Expected: Clean popup interface with "Connect Account" button

#### Test 3: Background Script
1. Go to `chrome://extensions/`
2. Find DemoFlow extension
3. Click "service worker" link
4. Check for console log: "DemoFlow background script initialized"
5. Test message passing by opening popup again

#### Test 4: Content Script Injection
1. Navigate to any website (e.g., `https://example.com`)
2. Open browser DevTools (F12)
3. Check console for: "DemoFlow content script initialized"
4. Verify no errors in console

### 4. TypeScript Compilation Tests

```bash
# Verify TypeScript compilation
npm run typecheck

# Test build process
npm run build

# Validate manifest
npm run validate
```

## What Should Work

✅ **Extension loads** without manifest errors  
✅ **Popup opens** with TypeScript-compiled UI  
✅ **Background script** initializes and handles messages  
✅ **Content script** injects on all pages  
✅ **Type safety** - all Chrome APIs properly typed  
✅ **Build process** - TypeScript compiles to working JavaScript  

## What Won't Work (Expected)

❌ **Authentication flow** - requires Next.js backend running  
❌ **Demo recording** - requires API endpoints  
❌ **File uploads** - requires Supabase storage setup  
❌ **Icons** - placeholder icons only  

## Testing Without Backend

Since the Next.js backend isn't running, you can test:

1. **Static functionality**: Popup UI, extension loading
2. **Message passing**: Background ↔ Popup ↔ Content script communication
3. **DOM capture logic**: Content script element detection (check console)
4. **TypeScript compilation**: All code compiles without errors

## Common Issues & Solutions

### Extension won't load
- Check `chrome://extensions/` for error messages
- Ensure `dist/` folder contains all built files
- Verify manifest.json syntax

### Popup doesn't open
- Check for JavaScript errors in popup console
- Right-click extension icon → "Inspect popup"
- Verify popup.html and popup.js exist in dist/popup/

### Content script not injecting
- Check website's Content Security Policy
- Test on simple sites like `example.com` first
- Verify permissions in manifest.json

## Manual Testing Checklist

- [ ] Extension installs without errors
- [ ] Popup opens and displays UI
- [ ] Background script console shows initialization
- [ ] Content script console shows on webpage load
- [ ] No TypeScript compilation errors
- [ ] Build process completes successfully
- [ ] Extension can be enabled/disabled without issues

## Development Testing

For active development:

```bash
# Watch mode for auto-rebuild
npm run dev

# Type checking
npm run typecheck

# Lint TypeScript files
npm run lint
```

After code changes:
1. Reload extension in `chrome://extensions/`
2. Test affected functionality
3. Check browser console for errors

## Next Steps

Once basic loading works, the next integration step would be:
1. Start the Next.js backend (`npm run dev` in main project)
2. Test authentication flow
3. Test demo creation API calls
4. Implement actual demo recording workflow