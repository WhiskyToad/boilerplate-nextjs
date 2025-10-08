# Smart Step Capture & Filtering System

## 🎯 Problem Solved

**Before:** Extension captured every micro-interaction, creating noisy step sequences:

- Click on login → Click on input → Focus input → Type "e" → Type "em" → Type "ema" → Type "emai" → Type "email" → Blur input → Change input → Click password → ...

**After:** Clean, user-intent focused steps:

- Click "Login"
- Enter email address
- Enter password
- Click "Submit"

## 🧠 How It Works

### **1. Duplicate Event Detection**

```typescript
shouldSkipDuplicateEvent(element, eventType);
```

- Tracks last captured step (element, type, timestamp)
- Skips duplicate events on same element within 100ms
- Prevents double-capturing of the same action

### **2. Smart Click Filtering**

**Skips:**

- Clicks on input/textarea/select fields (only care about typing, not clicking into them)

**Captures:**

- Clicks on buttons, links, interactive elements
- User-meaningful click actions

### **3. Input Debouncing (500ms)**

**Problem:** `input` event fires on every keystroke
**Solution:** Wait 500ms after user stops typing, then capture once

**Benefits:**

- Single "Enter email address" step instead of 15 keystroke steps
- Captures final value only
- Clean, understandable workflow

### **4. Event Type Separation**

| Element Type     | Event Captured      | Reason                        |
| ---------------- | ------------------- | ----------------------------- |
| Text inputs      | `input` (debounced) | Capture after typing complete |
| Checkboxes       | `change`            | Toggle state change           |
| Radio buttons    | `change`            | Selection change              |
| Select dropdowns | `change`            | Option selection              |
| Forms            | `submit`            | Form submission               |
| Buttons/Links    | `click`             | User action                   |

### **5. Keydown Filtering**

**Before:** Captured Enter, Tab, Escape
**After:** Only captures Enter on non-textarea elements

**Rationale:**

- Tab navigation isn't user-visible in playback
- Escape doesn't change state
- Enter in textarea is just newline (not meaningful)
- Enter elsewhere usually submits (captured by submit event)

## 📊 Results

### Example: Login Flow

**Old Capture (noisy):**

```
1. click - input field
2. focus - input field
3. input - "a"
4. input - "ad"
5. input - "adm"
6. input - "admi"
7. input - "admin"
8. blur - input field
9. change - input field
10. click - password field
11. focus - password field
12. input - "*"
13. input - "**"
... (20 more steps)
```

**New Capture (clean):**

```
1. click - "Login" button
2. input - Enter email address (value: "admin@example.com")
3. input - Enter password (value: "********")
4. click - "Submit" button
```

**Reduction: 75-90% fewer steps!**

## 🔧 Technical Implementation

### New Properties:

```typescript
private lastStep: {
  type: string;
  element: Element;
  timestamp: number;
  value?: string;
} | null = null;

private inputDebounceTimers: Map<Element, ReturnType<typeof setTimeout>>;
private pendingInputs: Map<Element, { value: string; element: Element }>;
```

### Key Methods:

1. `shouldSkipDuplicateEvent()` - Deduplication logic
2. `isInputElement()` - Element type checking
3. `updateLastStep()` - Track captured steps
4. Debounced `handleInput()` - Smart input capture
5. Filtered `handleChange()` - Only non-text inputs
6. Filtered `handleKeydown()` - Only meaningful keys

## 🎨 User Experience

### Recording:

- User sees fewer "Step X captured" notifications
- Cleaner step list in sidebar
- Less visual noise during capture

### Playback:

- Steps make logical sense
- Easy to follow workflow
- Each step represents a meaningful action
- Bubble text accurately describes intent

### Editing:

- Fewer steps to manage
- Clear action sequence
- Easier to add manual annotations
- Better for creating tutorials

## 🚀 Additional Benefits

1. **Performance**: Fewer API calls, less data stored
2. **Clarity**: Steps match user mental model
3. **Reliability**: Less chance of playback errors from noisy data
4. **Maintainability**: Cleaner demo editing experience
5. **Professionalism**: Demos look polished and intentional

## 🔍 Edge Cases Handled

- **Toggle switches**: Captured once on change, not on click + change
- **Multi-keystroke input**: Single step after typing complete
- **Form submission**: Captured once, not per input + submit
- **Navigation**: No redundant page change steps
- **Focus events**: Not captured (implementation detail)
- **Rapid clicking**: Deduplicated within 100ms window

## 📝 Future Enhancements

Could add:

- User-configurable debounce timing
- Step merging in backend (combine consecutive similar steps)
- Smart grouping (e.g., "Fill login form" for email + password)
- Navigation step detection (URL changes)
- Screenshot comparison to skip unchanged screens

## ✅ Testing Checklist

Test these scenarios to verify filtering works:

- [ ] Type in text input → should create 1 step after typing stops
- [ ] Click checkbox → should create 1 change step
- [ ] Click button multiple times quickly → should deduplicate
- [ ] Submit form → should not duplicate with Enter key
- [ ] Toggle switch → should create 1 step, not 2-3
- [ ] Type in textarea then press Enter → should not capture Enter
- [ ] Select dropdown option → should create 1 change step
