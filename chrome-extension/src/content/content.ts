// DemoFlow Content Script
// Captures user interactions and DOM elements for demo recording

interface ElementData {
  tagName: string;
  id: string;
  className: string;
  name: string;
  type: string;
  textContent: string;
  value: string;
  placeholder: string;
  alt: string;
  title: string;
  href: string;
  boundingRect: DOMRect;
  styles: any;
  selector: string;
  xpath: string;
  url: string;
  timestamp: number;
  viewport: {
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
  };
}

interface StepData {
  type: string;
  element: ElementData | any;
  interactions?: any;
}

interface MessageData {
  type: string;
  data?: any;
}

class DemoFlowCapture {
  private isCapturing: boolean = false;
  private stepCount: number = 0;
  private lastInteraction: Element | null = null;
  private overlay: HTMLElement | null = null;
  
  constructor() {
    this.setupEventListeners();
    this.createOverlay();
  }

  private setupEventListeners(): void {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });

    // Capture user interactions
    document.addEventListener('click', this.handleClick.bind(this), true);
    document.addEventListener('input', this.handleInput.bind(this), true);
    document.addEventListener('change', this.handleChange.bind(this), true);
    document.addEventListener('submit', this.handleSubmit.bind(this), true);
    document.addEventListener('keydown', this.handleKeydown.bind(this), true);
    
    // Capture hover for better UX
    document.addEventListener('mouseover', this.handleMouseover.bind(this), true);
  }

  private handleMessage(message: MessageData, _sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): void {
    switch (message.type) {
      case 'START_CAPTURE':
        this.startCapture(message.data);
        sendResponse({ success: true });
        break;

      case 'STOP_CAPTURE':
        this.stopCapture();
        sendResponse({ success: true });
        break;

      case 'STATE_UPDATE':
        this.updateState(message.data);
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  }

  private startCapture(data: { demoId: string }): void {
    console.log('Starting DOM capture for demo:', data.demoId);
    this.isCapturing = true;
    this.stepCount = 0;
    
    this.showOverlay();
    this.captureInitialState();
  }

  private stopCapture(): void {
    console.log('Stopping DOM capture');
    this.isCapturing = false;
    this.hideOverlay();
  }

  private updateState(state: any): void {
    if (state.isRecording && !this.isCapturing) {
      this.startCapture({ demoId: state.demoId });
    } else if (!state.isRecording && this.isCapturing) {
      this.stopCapture();
    }
  }

  private async handleClick(event: MouseEvent): Promise<void> {
    if (!this.isCapturing) return;

    const element = event.target as Element;
    const elementData = this.captureElement(element);
    
    // Don't capture clicks on our overlay
    if (element.closest('.demoflow-overlay')) {
      return;
    }

    const stepData: StepData = {
      type: 'click',
      element: {
        ...elementData,
        clickPosition: {
          x: event.clientX,
          y: event.clientY,
          pageX: event.pageX,
          pageY: event.pageY
        }
      },
      interactions: {
        type: 'click',
        button: event.button,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey
      }
    };

    await this.sendStep(stepData);
    this.highlightElement(element);
  }

  private async handleInput(event: Event): Promise<void> {
    if (!this.isCapturing) return;

    const element = event.target as HTMLInputElement;
    const elementData = this.captureElement(element);

    const stepData: StepData = {
      type: 'input',
      element: elementData,
      interactions: {
        type: 'input',
        value: element.value,
        inputType: element.type
      }
    };

    await this.sendStep(stepData);
  }

  private async handleChange(event: Event): Promise<void> {
    if (!this.isCapturing) return;

    const element = event.target as HTMLInputElement;
    const elementData = this.captureElement(element);

    const stepData: StepData = {
      type: 'change',
      element: elementData,
      interactions: {
        type: 'change',
        value: element.value,
        checked: element.checked,
        selected: (element as any).selected
      }
    };

    await this.sendStep(stepData);
  }

  private async handleSubmit(event: Event): Promise<void> {
    if (!this.isCapturing) return;

    const form = event.target as HTMLFormElement;
    const elementData = this.captureElement(form);

    const stepData: StepData = {
      type: 'submit',
      element: elementData,
      interactions: {
        type: 'submit',
        action: form.action,
        method: form.method
      }
    };

    await this.sendStep(stepData);
  }

  private async handleKeydown(event: KeyboardEvent): Promise<void> {
    if (!this.isCapturing) return;

    // Capture important keyboard shortcuts
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === 'Escape') {
      const element = event.target as Element;
      const elementData = this.captureElement(element);

      const stepData: StepData = {
        type: 'keydown',
        element: elementData,
        interactions: {
          type: 'keydown',
          key: event.key,
          code: event.code,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey
        }
      };

      await this.sendStep(stepData);
    }
  }

  private handleMouseover(event: MouseEvent): void {
    if (!this.isCapturing) return;

    const element = event.target as Element;
    
    // Don't highlight our overlay elements
    if (element.closest('.demoflow-overlay')) return;

    // Only highlight interactive elements
    if (this.isInteractiveElement(element)) {
      this.previewElement(element);
    }
  }

  private captureElement(element: Element): ElementData {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    const htmlElement = element as HTMLElement;

    return {
      // Element identification
      tagName: element.tagName.toLowerCase(),
      id: htmlElement.id,
      className: htmlElement.className,
      name: (element as HTMLInputElement).name || '',
      type: (element as HTMLInputElement).type || '',
      
      // Element content
      textContent: element.textContent?.substring(0, 100) || '',
      value: (element as HTMLInputElement).value || '',
      placeholder: (element as HTMLInputElement).placeholder || '',
      alt: (element as HTMLImageElement).alt || '',
      title: htmlElement.title || '',
      href: (element as HTMLAnchorElement).href || '',
      
      // Element position and size
      boundingRect: rect,
      
      // Element styles (for recreation)
      styles: {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily,
        border: computedStyle.border,
        borderRadius: computedStyle.borderRadius,
        padding: computedStyle.padding,
        margin: computedStyle.margin
      },
      
      // DOM path for element recreation
      selector: this.generateSelector(element),
      xpath: this.generateXPath(element),
      
      // Context
      url: window.location.href,
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY
      }
    };
  }

  private generateSelector(element: Element): string {
    // Generate a unique CSS selector for the element
    if ((element as HTMLElement).id) {
      return `#${(element as HTMLElement).id}`;
    }

    let selector = element.tagName.toLowerCase();
    
    if ((element as HTMLElement).className) {
      const classes = (element as HTMLElement).className.split(' ').filter(c => c && !c.startsWith('demoflow-'));
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }

    // Add nth-child if needed for uniqueness
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(child => 
        child.tagName === element.tagName && 
        (child as HTMLElement).className === (element as HTMLElement).className
      );
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(element) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    return selector;
  }

  private generateXPath(element: Element): string {
    // Generate XPath for robust element finding
    const parts: string[] = [];
    let current: Element | null = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let part = current.tagName.toLowerCase();
      
      if ((current as HTMLElement).id) {
        parts.unshift(`//${part}[@id="${(current as HTMLElement).id}"]`);
        break;
      }

      const siblings = Array.from(current.parentNode?.children || [])
        .filter(child => child.tagName === current!.tagName);
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        part += `[${index}]`;
      }

      parts.unshift(part);
      current = current.parentElement;
    }

    return '/' + parts.join('/');
  }

  private isInteractiveElement(element: Element): boolean {
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    const interactiveRoles = ['button', 'link', 'tab', 'menuitem'];
    
    return interactiveTags.includes(element.tagName.toLowerCase()) ||
           interactiveRoles.includes(element.getAttribute('role') || '') ||
           (element as any).onclick !== null ||
           (element as HTMLElement).style.cursor === 'pointer';
  }

  private async sendStep(stepData: StepData): Promise<void> {
    try {
      await chrome.runtime.sendMessage({
        type: 'ADD_STEP',
        data: stepData
      });
      
      this.stepCount++;
      this.updateOverlay();
    } catch (error) {
      console.error('Failed to send step data:', error);
    }
  }

  private captureInitialState(): void {
    // Capture the initial page state
    const stepData: StepData = {
      type: 'navigation',
      element: {
        type: 'page',
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    this.sendStep(stepData);
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
    
    this.overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      display: none;
      pointer-events: none;
    `;
  }

  private showOverlay(): void {
    if (!document.body.contains(this.overlay!)) {
      document.body.appendChild(this.overlay!);
    }
    this.overlay!.style.display = 'block';
  }

  private hideOverlay(): void {
    this.overlay!.style.display = 'none';
  }

  private updateOverlay(): void {
    const stepCountEl = this.overlay!.querySelector('.demoflow-step-count');
    if (stepCountEl) {
      stepCountEl.textContent = `${this.stepCount} steps`;
    }
  }

  private highlightElement(element: Element): void {
    // Briefly highlight the clicked element
    const highlight = document.createElement('div');
    highlight.className = 'demoflow-highlight';
    
    const rect = element.getBoundingClientRect();
    highlight.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid #007bff;
      background: rgba(0, 123, 255, 0.1);
      pointer-events: none;
      z-index: 999998;
      border-radius: 4px;
    `;
    
    document.body.appendChild(highlight);
    
    setTimeout(() => {
      if (document.body.contains(highlight)) {
        document.body.removeChild(highlight);
      }
    }, 500);
  }

  private previewElement(element: Element): void {
    // Remove any existing preview
    const existing = document.querySelector('.demoflow-preview');
    if (existing) existing.remove();

    // Don't preview if we just highlighted
    if (element === this.lastInteraction) return;

    const preview = document.createElement('div');
    preview.className = 'demoflow-preview';
    
    const rect = element.getBoundingClientRect();
    preview.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 1px dashed #007bff;
      pointer-events: none;
      z-index: 999997;
      border-radius: 4px;
    `;
    
    document.body.appendChild(preview);
    
    // Auto-remove after a short delay
    setTimeout(() => {
      if (document.body.contains(preview)) {
        document.body.removeChild(preview);
      }
    }, 100);
  }
}

// Initialize content script
if (!(window as any).demoFlowCapture) {
  (window as any).demoFlowCapture = new DemoFlowCapture();
  console.log('DemoFlow content script initialized');
}