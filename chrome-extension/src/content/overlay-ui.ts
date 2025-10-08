// Overlay UI
// Manages visual recording indicator and element highlighting

class OverlayUI {
  private overlay: HTMLElement | null = null;

  constructor() {
    this.createOverlay();
  }

  private createOverlay(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'demoflow-overlay';
    this.overlay.innerHTML = `
      <div class="demoflow-recording-indicator">
        <div class="demoflow-record-dot"></div>
        <span class="demoflow-record-text">Recording Demo</span>
        <span class="demoflow-step-count">0 steps</span>
      </div>
    `;
    this.overlay.style.display = 'none';
    document.body.appendChild(this.overlay);
  }

  show(): void {
    if (this.overlay) {
      this.overlay.style.display = 'block';
    }
  }

  hide(): void {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
  }

  updateStepCount(count: number): void {
    if (this.overlay) {
      const stepCountElement = this.overlay.querySelector('.demoflow-step-count');
      if (stepCountElement) {
        stepCountElement.textContent = `${count} step${count !== 1 ? 's' : ''}`;
      }
    }
  }

  highlightElement(element: Element): void {
    // Remove existing highlights
    document.querySelectorAll('.demoflow-highlight').forEach(el => el.remove());

    const rect = element.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.className = 'demoflow-highlight';
    highlight.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid #4CAF50;
      background: rgba(76, 175, 80, 0.1);
      pointer-events: none;
      z-index: 999999;
      transition: all 0.2s ease;
    `;

    document.body.appendChild(highlight);

    // Auto-remove after 1 second
    setTimeout(() => highlight.remove(), 1000);
  }

  previewElement(element: Element): void {
    // Remove existing previews
    document.querySelectorAll('.demoflow-preview').forEach(el => el.remove());

    const rect = element.getBoundingClientRect();
    const preview = document.createElement('div');
    preview.className = 'demoflow-preview';
    preview.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 1px dashed #2196F3;
      pointer-events: none;
      z-index: 999998;
    `;

    document.body.appendChild(preview);
  }

  removePreview(): void {
    document.querySelectorAll('.demoflow-preview').forEach(el => el.remove());
  }
}

// Export to globalThis
if (typeof globalThis !== 'undefined') {
  (globalThis as any).OverlayUI = OverlayUI;
}
