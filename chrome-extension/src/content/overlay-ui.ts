// Overlay UI
// No visual indicators during recording - methods are stubs for compatibility

class OverlayUI {
  constructor() {
    // No overlay created
  }

  show(): void {
    // No overlay to show
  }

  hide(): void {
    // No overlay to hide
  }

  updateStepCount(_count: number): void {
    // No overlay to update
  }

  highlightElement(_element: Element): void {
    // No highlighting
  }

  previewElement(_element: Element): void {
    // No preview
  }

  removePreview(): void {
    // No preview to remove
  }
}

// Export to globalThis
if (typeof globalThis !== 'undefined') {
  (globalThis as any).OverlayUI = OverlayUI;
}
