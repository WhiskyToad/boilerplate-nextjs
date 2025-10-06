# Phase 1 Playback Testing Guide

## ✅ Implementation Complete!

All Phase 1 components have been implemented and are ready for testing.

## What Was Built

### Files Created:
```
src/hooks/
├── usePlaybackState.ts          ✅ State management
└── useElementHighlight.ts       ✅ Element highlighting

src/features/playback/
├── utils/
│   ├── element-finder.ts        ✅ Element finding (5 strategies)
│   └── scroll-helper.ts         ✅ Smooth scrolling
└── components/
    ├── PlaybackControls.tsx     ✅ UI controls
    └── DemoPlayer.tsx           ✅ Main player

src/app/demos/[id]/play/
└── page.tsx                     ✅ Playback route
```

## Features Implemented

✅ **Step Navigation** - Next/Previous buttons
✅ **Keyboard Shortcuts** - Arrow keys, Escape, Home, End
✅ **Element Highlighting** - Blue pulsing border with shadow
✅ **Smooth Scrolling** - Auto-scroll element into view
✅ **Progress Bar** - Visual progress indicator
✅ **Responsive UI** - Works on desktop and mobile
✅ **Element Finding** - 5 fallback strategies (ID, selector, XPath, text, position)

## How to Test

### Step 1: Record a Demo

1. Navigate to `http://localhost:3000`
2. Use the Chrome extension to record a demo
3. Perform 5-10 interactions (clicks, form inputs, navigation)
4. Stop recording and save

### Step 2: Play the Demo

1. Go to `/demos` page
2. Find your recorded demo
3. Click the demo to view details
4. Navigate to `/demos/{demo-id}/play` (or add a "Play" button)

### Step 3: Test Playback Features

#### Navigation Controls ✅
- [ ] Click "Next" button - should highlight next element
- [ ] Click "Previous" button - should go back
- [ ] Verify progress bar updates
- [ ] Verify step counter shows correct numbers

#### Keyboard Shortcuts ✅
- [ ] Press → (right arrow) - advance to next step
- [ ] Press ← (left arrow) - go to previous step
- [ ] Press Escape - should exit playback and return to demo page
- [ ] Press Home - should jump to first step
- [ ] Press End - should jump to last step

#### Element Highlighting ✅
- [ ] Verify blue border appears around element
- [ ] Verify border has pulsing animation
- [ ] Verify shadow effect is visible
- [ ] Element should scroll into view automatically
- [ ] Highlight should move when navigating steps

#### Visual Polish ✅
- [ ] Semi-transparent overlay dims the page
- [ ] Controls appear at bottom center
- [ ] Demo title shows at top (if provided)
- [ ] Keyboard hints visible above controls
- [ ] Dev info panel shows in top-right (development only)

### Step 4: Test Edge Cases

#### Missing Elements
- [ ] If element can't be found, playback should continue
- [ ] Console should show warning about missing element
- [ ] No highlight should appear for missing elements

#### Different Element Types
- [ ] Test with buttons
- [ ] Test with form inputs
- [ ] Test with links
- [ ] Test with divs/spans
- [ ] Test with images

#### Responsive Design
- [ ] Resize browser window - controls should stay centered
- [ ] Test on mobile device (Chrome DevTools)
- [ ] Verify touch interactions work

## Known Limitations (Phase 1)

These will be addressed in future phases:

- ❌ No auto-play (manual navigation only)
- ❌ No annotations/tooltips yet
- ❌ No zoom/pan animation (just scroll)
- ❌ No spotlight effect (just overlay dim)
- ❌ No playback speed control
- ❌ IFrame rendering (may not work for all sites)

## Troubleshooting

### Issue: Elements not highlighting

**Possible causes:**
1. Element selectors changed since recording
2. Page structure is different
3. Elements are in an iframe

**Solutions:**
- Check console for "[Playback] Could not find element" warnings
- Verify element still exists on page
- Try re-recording the demo

### Issue: Page not loading in iframe

**Cause:** Some sites block iframe embedding (X-Frame-Options)

**Solution:**
- This is expected for sites like Google, Facebook, etc.
- Future: We'll render outside iframe or use different approach

### Issue: Keyboard shortcuts not working

**Cause:** Focus may be on iframe

**Solution:**
- Click outside the iframe first
- Future: We'll add focus management

## Next Steps (Phase 2)

Once Phase 1 is tested and working:

1. **Add zoom/pan animations** - Smooth camera movement to elements
2. **Add spotlight effect** - Dim everything except active element
3. **Add annotation tooltips** - Show descriptions for each step
4. **Add auto-play mode** - Automatically advance with delays

## Quick Test Checklist

```bash
✅ Phase 1 Core Features
├── ✅ Navigate with arrow keys
├── ✅ Click Next/Previous buttons
├── ✅ See element highlighting
├── ✅ Progress bar updates
├── ✅ Exit with Escape key
├── ✅ Smooth scrolling works
└── ✅ Controls are responsive

❌ Phase 2 Features (Not Yet)
├── ❌ Auto-play
├── ❌ Zoom animations
├── ❌ Tooltips
└── ❌ Speed control
```

## Testing URLs

Assuming you have demos recorded:

```
# View all demos
http://localhost:3000/demos

# Play a specific demo
http://localhost:3000/demos/{demo-id}/play

# Example (replace with actual ID)
http://localhost:3000/demos/c89750f9-e6cf-45f5-8068-c04c3638952e/play
```

## Success Criteria

Phase 1 is successful if:

- ✅ Can navigate through all steps
- ✅ Elements highlight correctly (most of the time)
- ✅ Keyboard shortcuts work
- ✅ UI is smooth and responsive
- ✅ No console errors during playback
- ✅ Can exit playback cleanly

Ready to test! 🎉
