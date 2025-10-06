# Demo Playback Roadmap

## Vision
Create a seamless, engaging demo playback experience with smooth transitions, auto-zoom, annotations, and editing capabilities.

## Feature Breakdown

### Phase 1: Core Playback Engine (Week 1)
**Goal:** Basic step-through with highlighting

#### 1.1 Playback State Management
- [ ] Create playback state store (current step, playing status, speed)
- [ ] Step navigation (next, previous, jump to step)
- [ ] Playback controls (play, pause, restart)

#### 1.2 Basic Element Highlighting
- [ ] Highlight current element with border/shadow
- [ ] Scroll element into view
- [ ] Clear highlighting on step change

#### 1.3 Simple Overlay UI
- [ ] Progress bar (step X of Y)
- [ ] Next/Previous buttons
- [ ] Close button

**Testing:** Load a recorded demo, click through steps, verify highlighting works

---

### Phase 2: Smooth Transitions & Zoom (Week 2)
**Goal:** Professional animations and focus

#### 2.1 Element Spotlight
- [ ] Dim background (semi-transparent overlay)
- [ ] Brighten/spotlight active element
- [ ] Smooth fade in/out transitions

#### 2.2 Auto Zoom & Pan
- [ ] Calculate element position and size
- [ ] Smooth zoom animation (CSS transform: scale)
- [ ] Pan to center element in viewport
- [ ] Responsive zoom (scale based on element importance)

#### 2.3 Transition Effects
- [ ] Fade transitions between steps
- [ ] Smooth scroll to elements
- [ ] Configurable animation duration

**Testing:** Verify smooth animations, no janky transitions, works on different screen sizes

---

### Phase 3: Annotations & Tooltips (Week 3)
**Goal:** Explain each step with rich content

#### 3.1 Tooltip System
- [ ] Create tooltip component (speech bubble style)
- [ ] Smart positioning (auto-adjust to avoid overflow)
- [ ] Support for text, images, rich content
- [ ] Arrow pointing to element

#### 3.2 Annotation Editor (Recording Time)
- [ ] Add annotation during recording
- [ ] Edit annotation text
- [ ] Choose tooltip position (top, right, bottom, left)
- [ ] Preview annotation

#### 3.3 Annotation Display (Playback Time)
- [ ] Show tooltip for current step
- [ ] Auto-hide previous tooltips
- [ ] Support markdown/HTML in annotations
- [ ] Keyboard navigation (arrow keys to advance)

**Testing:** Record demo with annotations, verify tooltips display correctly, test positioning edge cases

---

### Phase 4: Step Editor (Week 4)
**Goal:** Full control over demo steps

#### 4.1 Step Management UI
- [ ] Step list view (all steps in sidebar)
- [ ] Thumbnail preview for each step
- [ ] Drag-and-drop to reorder
- [ ] Add/delete steps

#### 4.2 Step Editing
- [ ] Edit step annotation
- [ ] Change step timing/delay
- [ ] Mark step as skippable
- [ ] Add custom actions (open URL, show modal)

#### 4.3 Bulk Operations
- [ ] Select multiple steps
- [ ] Delete selected steps
- [ ] Group steps into chapters
- [ ] Duplicate steps

**Testing:** Edit a demo, verify changes persist, test undo/redo

---

### Phase 5: Advanced Playback (Week 5)
**Goal:** Professional demo experience

#### 5.1 Playback Controls
- [ ] Speed control (0.5x, 1x, 1.5x, 2x)
- [ ] Auto-play with configurable delays
- [ ] Loop mode
- [ ] Chapter/section navigation

#### 5.2 Interactive Elements
- [ ] Clickable hotspots during playback
- [ ] Forms that viewers can interact with
- [ ] Branching demos (choose your path)
- [ ] Call-to-action buttons

#### 5.3 Responsive & Accessibility
- [ ] Mobile-optimized playback
- [ ] Keyboard shortcuts (space = play/pause, arrows = nav)
- [ ] Screen reader support
- [ ] High contrast mode

**Testing:** Test on mobile, tablet, desktop; verify keyboard navigation; test with screen readers

---

### Phase 6: Polish & Branding (Week 6)
**Goal:** Customizable, branded experience

#### 6.1 Custom Branding
- [ ] Custom logo
- [ ] Brand colors (primary, accent)
- [ ] Custom fonts
- [ ] White-label option

#### 6.2 Visual Themes
- [ ] Light/dark mode
- [ ] Preset themes (modern, minimal, playful)
- [ ] Custom CSS injection

#### 6.3 Export & Sharing
- [ ] Embed code generation
- [ ] Shareable link
- [ ] Export as video (optional)
- [ ] Analytics tracking (view count, completion rate)

**Testing:** Test all themes, verify embed works on various sites, check analytics

---

## Technical Architecture

### New Modules to Create

```
src/playback/
├── types.ts                 # Playback interfaces
├── playback-state.ts        # State management
├── playback-engine.ts       # Core playback logic
├── element-highlighter.ts   # Highlighting & spotlight
├── zoom-controller.ts       # Zoom & pan animations
├── annotation-renderer.ts   # Tooltip display
├── playback-ui.ts          # Overlay controls
└── step-editor.ts          # Step editing UI

src/components/demos/
├── DemoPlayer.tsx          # Main player component
├── DemoControls.tsx        # Play/pause/progress controls
├── AnnotationTooltip.tsx   # Tooltip component
├── StepEditor.tsx          # Step management UI
└── DemoSettings.tsx        # Playback settings
```

### Integration Points

1. **Database Schema Updates**
   - Add `annotations` JSON field to steps
   - Add `playback_settings` to demos (speed, theme, branding)
   - Add `step_order` for custom ordering

2. **API Endpoints**
   - `PATCH /api/demos/:id/steps/:stepId` - Update step
   - `DELETE /api/demos/:id/steps/:stepId` - Delete step
   - `POST /api/demos/:id/steps/reorder` - Reorder steps
   - `GET /api/demos/:id/playback-settings` - Get settings

3. **State Management**
   - Create `usePlaybackStore` (Zustand)
   - Track: currentStep, isPlaying, speed, settings
   - Actions: play, pause, nextStep, prevStep, jumpToStep

---

## Incremental Testing Strategy

### Phase 1 Testing
```bash
# 1. Record a simple demo (3-5 steps)
# 2. Navigate to /demos/:id/play
# 3. Click "Next" - verify element highlights
# 4. Click "Previous" - verify navigation works
# 5. Check console for errors
```

### Phase 2 Testing
```bash
# 1. Play same demo
# 2. Verify smooth zoom to each element
# 3. Check spotlight dims background correctly
# 4. Test on different screen sizes
# 5. Verify no scroll jank
```

### Phase 3 Testing
```bash
# 1. Record new demo with annotations
# 2. Verify tooltips show for each step
# 3. Test tooltip positioning (top/right/bottom/left)
# 4. Test with long annotation text
# 5. Verify markdown/HTML renders correctly
```

### Phase 4 Testing
```bash
# 1. Open step editor
# 2. Delete a step - verify it's removed
# 3. Reorder steps - verify new order persists
# 4. Edit annotation - verify changes save
# 5. Add new step manually - verify it works
```

### Phase 5 Testing
```bash
# 1. Test speed controls (0.5x to 2x)
# 2. Enable auto-play - verify delays work
# 3. Test loop mode
# 4. Test keyboard shortcuts
# 5. Test on mobile device
```

---

## Implementation Order (Prioritized)

### Sprint 1 (Most Important - Core UX)
1. ✅ Basic playback engine
2. ✅ Element highlighting
3. ✅ Progress bar UI
4. 🎯 Smooth transitions
5. 🎯 Auto zoom/pan

### Sprint 2 (High Value - Engagement)
6. Annotation tooltips
7. Spotlight effect
8. Playback controls (play/pause/speed)
9. Keyboard navigation

### Sprint 3 (Editor - Power Users)
10. Step list view
11. Delete steps
12. Reorder steps
13. Edit annotations

### Sprint 4 (Polish - Professional)
14. Custom branding
15. Themes
16. Auto-play
17. Embed code

---

## Success Metrics

- **Performance:** Playback starts < 1s after load
- **Smoothness:** 60fps animations (no jank)
- **Engagement:** Average completion rate > 70%
- **Usability:** Users can edit a demo without docs
- **Accessibility:** WCAG 2.1 AA compliant

---

## Next Steps

1. **Review this roadmap** - Approve/adjust phases
2. **Set up playback module structure** - Create folders/files
3. **Implement Phase 1.1** - Playback state management
4. **Test Phase 1.1** - Verify state changes work
5. **Continue incrementally** - One sub-feature at a time
