// Capture Handler
// Handles capturing user interactions during recording
// Note: Loaded as classic script (not ES6 module) via manifest content_scripts
// Types are loaded from types.ts (loaded first in manifest)

// Sanitization for element data
function sanitizeElementData(data: any): any {
  const sanitizeString = (str: string): string => {
    return String(str || '').substring(0, 500);
  };

  return {
    ...data,
    textContent: sanitizeString(data.textContent),
    value: sanitizeString(data.value),
    placeholder: sanitizeString(data.placeholder),
    alt: sanitizeString(data.alt),
    title: sanitizeString(data.title),
    href: sanitizeString(data.href),
    url: sanitizeString(data.url),
  };
}

class CaptureHandler {
  private logger: any;
  private overlayUI: any;
  private isCapturing: boolean = false;
  private stepCount: number = 0;
  private lastStep: { type: string; element: Element; timestamp: number; value?: string } | null = null;
  private inputDebounceTimers: Map<Element, ReturnType<typeof setTimeout>> = new Map();
  private pendingInputs: Map<Element, { value: string; element: Element }> = new Map();

  constructor(logger: any, overlayUI: any) {
    this.logger = logger;
    this.overlayUI = overlayUI;
  }

  private shouldSkipDuplicateEvent(element: Element, eventType: string): boolean {
    if (!this.lastStep) return false;

    const now = Date.now();
    const timeSinceLastStep = now - this.lastStep.timestamp;

    // Skip if it's the same element and event within 100ms
    if (
      this.lastStep.element === element &&
      this.lastStep.type === eventType &&
      timeSinceLastStep < 100
    ) {
      return true;
    }

    // Skip click on input fields (we only care about the input itself)
    if (eventType === 'click' && this.isInputElement(element)) {
      return true;
    }

    // Skip input events on non-text fields (handled by change)
    const inputElement = element as HTMLInputElement;
    if (eventType === 'input' && inputElement.type && 
        ['checkbox', 'radio', 'select-one', 'select-multiple'].includes(inputElement.type)) {
      return true;
    }

    return false;
  }

  private isInputElement(element: Element): boolean {
    const tagName = element.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
  }

  private updateLastStep(element: Element, eventType: string, value?: string): void {
    this.lastStep = {
      element,
      type: eventType,
      timestamp: Date.now(),
      ...(value !== undefined && { value }),
    };
  }

  private generateBubbleText(element: Element, actionType: string): string {
    const htmlElement = element as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    
    // Get meaningful text from element
    let elementText = '';
    if (htmlElement.innerText) {
      elementText = htmlElement.innerText.trim().substring(0, 50);
    } else if (htmlElement.getAttribute('aria-label')) {
      elementText = htmlElement.getAttribute('aria-label')!;
    } else if (htmlElement.getAttribute('title')) {
      elementText = htmlElement.getAttribute('title')!;
    } else if (htmlElement.getAttribute('placeholder')) {
      elementText = htmlElement.getAttribute('placeholder')!;
    } else if (htmlElement.getAttribute('alt')) {
      elementText = htmlElement.getAttribute('alt')!;
    }

    // Generate context-aware bubble text
    switch (actionType) {
      case 'click':
        if (tagName === 'button') return elementText ? `Click "${elementText}"` : 'Click this button';
        if (tagName === 'a') return elementText ? `Click "${elementText}"` : 'Click this link';
        if (element.getAttribute('role') === 'button') return elementText ? `Click "${elementText}"` : 'Click here';
        return elementText ? `Click "${elementText}"` : 'Click this element';

      case 'input':
        const inputType = (element as HTMLInputElement).type;
        if (inputType === 'email') return 'Enter your email address';
        if (inputType === 'password') return 'Enter your password';
        if (inputType === 'search') return 'Enter search terms';
        if (elementText) return `Enter ${elementText.toLowerCase()}`;
        return 'Enter text here';

      case 'change':
        if (tagName === 'select') return elementText ? `Select ${elementText}` : 'Select an option';
        if ((element as HTMLInputElement).type === 'checkbox') return elementText ? `Check "${elementText}"` : 'Check this option';
        if ((element as HTMLInputElement).type === 'radio') return elementText ? `Select "${elementText}"` : 'Select this option';
        return 'Change this value';

      case 'submit':
        return 'Submit the form';

      default:
        return elementText || 'Interact with this element';
    }
  }

  setupEventListeners(): void {
    // Capture user interactions
    document.addEventListener('click', this.handleClick.bind(this), true);
    document.addEventListener('input', this.handleInput.bind(this), true);
    document.addEventListener('change', this.handleChange.bind(this), true);
    document.addEventListener('submit', this.handleSubmit.bind(this), true);
    document.addEventListener('keydown', this.handleKeydown.bind(this), true);

    // Capture hover for better UX (throttled)
    document.addEventListener('mouseover', this.throttle(this.handleMouseover.bind(this), 100), true);
  }

  startCapture(): void {
    this.isCapturing = true;
    this.stepCount = 0;
    this.captureInitialState();
  }

  stopCapture(): void {
    this.isCapturing = false;
  }

  getStepCount(): number {
    return this.stepCount;
  }

  private async handleClick(event: MouseEvent): Promise<void> {
    if (!this.isCapturing) {
      return;
    }

    const element = event.target as Element;

    // Don't capture clicks on our overlay
    if (element.closest('.demoflow-overlay')) {
      return;
    }

    // Skip duplicate or redundant clicks
    if (this.shouldSkipDuplicateEvent(element, 'click')) {
      return;
    }

    const elementData = this.captureElement(element);
    const bubbleText = this.generateBubbleText(element, 'click');

    const stepData: ContentStepData = {
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
      },
      annotations: {
        bubble: {
          text: bubbleText,
          position: 'auto',
          style: 'callout',
          autoGenerated: true,
        }
      }
    };

    await this.sendStep(stepData);
    this.updateLastStep(element, 'click');
    this.overlayUI.highlightElement(element);
  }

  private async handleInput(event: Event): Promise<void> {
    if (!this.isCapturing) return;

    const element = event.target as HTMLInputElement;
    
    // Skip input events on checkboxes, radios, selects (handled by change event)
    if (this.shouldSkipDuplicateEvent(element, 'input')) {
      return;
    }

    // Debounce input events - only capture after user stops typing for 500ms
    if (this.inputDebounceTimers.has(element)) {
      clearTimeout(this.inputDebounceTimers.get(element)!);
    }

    // Store pending input
    this.pendingInputs.set(element, {
      value: element.value,
      element: element,
    });

    const debounceTimer = setTimeout(async () => {
      const pendingInput = this.pendingInputs.get(element);
      if (!pendingInput) return;

      const elementData = this.captureElement(element);
      const bubbleText = this.generateBubbleText(element, 'input');

      const stepData: ContentStepData = {
        type: 'input',
        element: elementData,
        interactions: {
          type: 'input',
          value: pendingInput.value,
          inputType: element.type
        },
        annotations: {
          bubble: {
            text: bubbleText,
            position: 'auto',
            style: 'callout',
            autoGenerated: true,
          }
        }
      };

      await this.sendStep(stepData);
      this.updateLastStep(element, 'input', pendingInput.value);
      
      // Clean up
      this.pendingInputs.delete(element);
      this.inputDebounceTimers.delete(element);
    }, 500); // Wait 500ms after user stops typing

    this.inputDebounceTimers.set(element, debounceTimer);
  }

  private async handleChange(event: Event): Promise<void> {
    if (!this.isCapturing) return;

    const element = event.target as HTMLInputElement;
    
    // Only capture change for checkboxes, radios, selects (not text inputs)
    const tagName = element.tagName.toLowerCase();
    const inputType = element.type?.toLowerCase();
    
    const isNonTextInput = 
      tagName === 'select' ||
      inputType === 'checkbox' ||
      inputType === 'radio' ||
      inputType === 'file';

    if (!isNonTextInput) {
      return; // Text inputs are handled by input event
    }

    const elementData = this.captureElement(element);
    const bubbleText = this.generateBubbleText(element, 'change');

    const stepData: ContentStepData = {
      type: 'change',
      element: elementData,
      interactions: {
        type: 'change',
        value: element.value,
        checked: element.checked,
        selected: (element as any).selected
      },
      annotations: {
        bubble: {
          text: bubbleText,
          position: 'auto',
          style: 'callout',
          autoGenerated: true,
        }
      }
    };

    await this.sendStep(stepData);
    this.updateLastStep(element, 'change', element.value);
  }

  private async handleSubmit(event: Event): Promise<void> {
    if (!this.isCapturing) return;

    const form = event.target as HTMLFormElement;
    const elementData = this.captureElement(form);
    const bubbleText = this.generateBubbleText(form, 'submit');

    const stepData: ContentStepData = {
      type: 'submit',
      element: elementData,
      interactions: {
        type: 'submit',
        action: form.action,
        method: form.method
      },
      annotations: {
        bubble: {
          text: bubbleText,
          position: 'auto',
          style: 'callout',
          autoGenerated: true,
        }
      }
    };

    await this.sendStep(stepData);
    this.updateLastStep(form, 'submit');
  }

  private async handleKeydown(event: KeyboardEvent): Promise<void> {
    if (!this.isCapturing) return;

    // Only capture Enter key (submitting forms, etc) - Tab and Escape are not user-visible actions
    if (event.key === 'Enter') {
      const element = event.target as Element;
      
      // Skip if this is just typing Enter in a text field (will be handled by form submit)
      const tagName = element.tagName.toLowerCase();
      if (tagName === 'textarea') {
        return; // Enter in textarea is just a newline
      }

      const elementData = this.captureElement(element);

      const stepData: ContentStepData = {
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
      this.overlayUI.previewElement(element);
    }
  }

  private captureElement(element: Element): ElementData {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    const htmlElement = element as HTMLElement;

    const rawData = {
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
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY
      }
    };

    // Sanitize before returning
    return sanitizeElementData(rawData) as ElementData;
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

  private async sendStep(stepData: ContentStepData): Promise<void> {
    try {
      await chrome.runtime.sendMessage({
        type: 'ADD_STEP',
        data: stepData
      });

      this.stepCount++;
      this.overlayUI.updateStepCount(this.stepCount);
    } catch (error) {
      this.logger.error('Failed to send step data:', error);
    }
  }

  private captureInitialState(): void {
    // Capture the initial page state
    const stepData: ContentStepData = {
      type: 'navigation',
      element: {
        type: 'page',
        url: window.location.href,
        title: document.title,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    this.sendStep(stepData);
  }

  // Utility function to throttle frequent events
  private throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastExecTime = 0;
    return ((...args: any[]) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    }) as T;
  }
}

// Export to globalThis
if (typeof globalThis !== 'undefined') {
  (globalThis as any).CaptureHandler = CaptureHandler;
}
