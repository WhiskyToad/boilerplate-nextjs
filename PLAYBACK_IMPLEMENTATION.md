# Playback Implementation - Getting Started

## Phase 1: Core Playback (Start Here)

### What We're Building First
A simple but smooth demo player that can:
- Navigate through recorded steps (next/previous)
- Highlight the element from each step
- Show progress (step 3 of 10)
- Smooth animations

### File Structure to Create

```
src/features/playback/
├── components/
│   ├── DemoPlayer.tsx           # Main player container
│   ├── PlaybackControls.tsx     # Next/prev/progress buttons
│   ├── ElementHighlight.tsx     # Visual element highlighting
│   └── PlaybackOverlay.tsx      # Full-screen overlay UI
├── hooks/
│   ├── usePlaybackState.ts      # State management hook
│   └── useElementHighlight.ts   # Highlighting logic
└── utils/
    ├── element-finder.ts        # Find DOM elements from step data
    └── scroll-helper.ts         # Smooth scroll utilities

src/app/demos/[id]/play/
└── page.tsx                     # Playback route
```

### Implementation Steps (Day 1-2)

#### Step 1: Create Playback State Hook
**File:** `src/hooks/usePlaybackState.ts`

```typescript
interface PlaybackState {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
}

export function usePlaybackState(steps: any[]) {
  const [state, setState] = useState<PlaybackState>({
    currentStepIndex: 0,
    totalSteps: steps.length,
    isPlaying: false,
    speed: 1
  });

  const nextStep = () => {
    if (state.currentStepIndex < state.totalSteps - 1) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
    }
  };

  const prevStep = () => {
    if (state.currentStepIndex > 0) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex - 1 }));
    }
  };

  const jumpToStep = (index: number) => {
    if (index >= 0 && index < state.totalSteps) {
      setState(prev => ({ ...prev, currentStepIndex: index }));
    }
  };

  return { state, nextStep, prevStep, jumpToStep };
}
```

**Test:** Create simple component, call nextStep(), verify state updates.

---

#### Step 2: Create Element Finder Utility
**File:** `src/features/playback/utils/element-finder.ts`

```typescript
export function findElementFromStep(stepData: any): Element | null {
  // Try multiple strategies to find the element

  // 1. Try ID (most reliable)
  if (stepData.element?.id) {
    const el = document.getElementById(stepData.element.id);
    if (el) return el;
  }

  // 2. Try CSS selector
  if (stepData.element?.selector) {
    const el = document.querySelector(stepData.element.selector);
    if (el) return el;
  }

  // 3. Try XPath
  if (stepData.element?.xpath) {
    const result = document.evaluate(
      stepData.element.xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    if (result.singleNodeValue) return result.singleNodeValue as Element;
  }

  // 4. Fuzzy match by text content (fallback)
  if (stepData.element?.textContent) {
    const allElements = document.querySelectorAll('button, a, input, [role="button"]');
    for (const el of allElements) {
      if (el.textContent?.trim() === stepData.element.textContent.trim()) {
        return el;
      }
    }
  }

  return null;
}
```

**Test:** Pass step data, verify element is found correctly.

---

#### Step 3: Create Element Highlighter Hook
**File:** `src/hooks/useElementHighlight.ts`

```typescript
export function useElementHighlight() {
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const highlightElement = (element: Element | null) => {
    // Remove previous highlight
    document.querySelectorAll('.demo-highlight').forEach(el => el.remove());

    if (!element) return;

    const rect = element.getBoundingClientRect();

    // Create highlight overlay
    const highlight = document.createElement('div');
    highlight.className = 'demo-highlight';
    highlight.style.cssText = `
      position: fixed;
      top: ${rect.top - 5}px;
      left: ${rect.left - 5}px;
      width: ${rect.width + 10}px;
      height: ${rect.height + 10}px;
      border: 3px solid #3b82f6;
      border-radius: 8px;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2),
                  0 0 20px rgba(59, 130, 246, 0.4);
      pointer-events: none;
      z-index: 999999;
      transition: all 0.3s ease;
      animation: pulse 2s infinite;
    `;

    document.body.appendChild(highlight);

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setHighlightedElement(element);
  };

  const clearHighlight = () => {
    document.querySelectorAll('.demo-highlight').forEach(el => el.remove());
    setHighlightedElement(null);
  };

  return { highlightElement, clearHighlight, highlightedElement };
}
```

**Add to global CSS:**
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

**Test:** Call highlightElement() with a button, verify blue border appears and pulses.

---

#### Step 4: Create Playback Controls Component
**File:** `src/features/playback/components/PlaybackControls.tsx`

```tsx
interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function PlaybackControls({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose
}: PlaybackControlsProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100000]">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          ← Previous
        </button>

        {/* Progress */}
        <div className="text-sm font-medium">
          {currentStep + 1} / {totalSteps}
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          Next →
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="ml-4 p-2 rounded-full hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

**Test:** Render component, click next/prev, verify callbacks fire.

---

#### Step 5: Create Main DemoPlayer Component
**File:** `src/features/playback/components/DemoPlayer.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaybackState } from '@/hooks/usePlaybackState';
import { useElementHighlight } from '@/hooks/useElementHighlight';
import { findElementFromStep } from '../utils/element-finder';
import { PlaybackControls } from './PlaybackControls';

interface DemoPlayerProps {
  steps: any[];
  demoId: string;
}

export function DemoPlayer({ steps, demoId }: DemoPlayerProps) {
  const router = useRouter();
  const { state, nextStep, prevStep, jumpToStep } = usePlaybackState(steps);
  const { highlightElement, clearHighlight } = useElementHighlight();

  // Highlight current step element
  useEffect(() => {
    const currentStep = steps[state.currentStepIndex];
    if (!currentStep) return;

    const element = findElementFromStep(currentStep);
    if (element) {
      highlightElement(element);
    }

    return () => clearHighlight();
  }, [state.currentStepIndex, steps]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
      if (e.key === 'Escape') router.push(`/demos/${demoId}`);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextStep, prevStep, router, demoId]);

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99999]" />

      {/* Controls */}
      <PlaybackControls
        currentStep={state.currentStepIndex}
        totalSteps={state.totalSteps}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={() => router.push(`/demos/${demoId}`)}
      />
    </>
  );
}
```

**Test:** Load a demo, verify overlay appears, controls work, keyboard shortcuts work.

---

#### Step 6: Create Playback Page Route
**File:** `src/app/demos/[id]/play/page.tsx`

```tsx
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { DemoPlayer } from '@/features/playback/components/DemoPlayer';

export default async function DemoPlayPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient();

  // Fetch demo and steps
  const { data: demo, error } = await supabase
    .from('demos')
    .select('*, steps:demo_steps(*)')
    .eq('id', params.id)
    .single();

  if (error || !demo) {
    redirect('/demos');
  }

  return (
    <div className="min-h-screen">
      {/* Original page content (blurred in background) */}
      <div className="blur-sm pointer-events-none">
        {/* Render the actual page being demoed */}
        <iframe
          src={demo.steps[0]?.element?.url || '/'}
          className="w-full h-screen border-0"
        />
      </div>

      {/* Playback UI */}
      <DemoPlayer steps={demo.steps} demoId={demo.id} />
    </div>
  );
}
```

**Test:** Navigate to `/demos/:id/play`, verify page loads, player appears.

---

### Testing Checklist (Phase 1)

- [ ] Navigate to `/demos/:id/play`
- [ ] Verify playback controls appear at bottom
- [ ] Click "Next" - element should highlight with blue border and pulse
- [ ] Click "Previous" - previous element should highlight
- [ ] Press right arrow key - should advance to next step
- [ ] Press left arrow key - should go to previous step
- [ ] Press Escape - should exit playback
- [ ] Verify progress bar updates correctly
- [ ] Check that element scrolls into view smoothly
- [ ] Test with demo that has 10+ steps
- [ ] Test on mobile - controls should be responsive

---

## Quick Start Commands

```bash
# 1. Create the playback feature structure
mkdir -p src/features/playback/components
mkdir -p src/features/playback/utils
mkdir -p src/hooks

# 2. Create the playback route
mkdir -p src/app/demos/[id]/play

# 3. Start implementing files in order:
# - usePlaybackState.ts (state hook)
# - element-finder.ts (utility)
# - useElementHighlight.ts (highlight hook)
# - PlaybackControls.tsx (UI component)
# - DemoPlayer.tsx (main component)
# - page.tsx (route)

# 4. Test after each file
npm run dev
# Navigate to http://localhost:3000/demos/:id/play
```

---

## Next Steps After Phase 1

Once basic playback works:
1. **Add zoom/pan** - Smooth camera movement to elements
2. **Add annotations** - Show tooltip with step description
3. **Add spotlight** - Dim everything except highlighted element
4. **Add auto-play** - Automatically advance with delays

Want me to start implementing Phase 1 now?
