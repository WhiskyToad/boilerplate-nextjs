// DemoFlow Content Script - Modular Version
// Main entry point that orchestrates content script modules

// Content scripts don't load combined-api.js, so we define minimal inline utilities
const CONTENT_Logger = {
  debug: (...args: any[]) => console.log('[DEBUG][Content]', ...args),
  info: (...args: any[]) => console.log('[INFO][Content]', ...args),
  warn: (...args: any[]) => console.warn('[WARN][Content]', ...args),
  error: (...args: any[]) => console.error('[ERROR][Content]', ...args),
};

// Config for allowed origins
const CONTENT_CONFIG = {
  ALLOWED_ORIGINS: ['*']
};

function isAllowedOrigin(origin: string): boolean {
  if (CONTENT_CONFIG.ALLOWED_ORIGINS.includes('*')) {
    return true;
  }

  return CONTENT_CONFIG.ALLOWED_ORIGINS.includes(origin);
}

// Import content modules (compiled to JS, loaded via script tags in manifest)
// types.js, auth-bridge.js, overlay-ui.js, capture-handler.js should be loaded in manifest

interface MessageData {
  type: string;
  data?: any;
}

class DemoFlowCapture {
  private instanceId: string;
  private authBridge: any;
  private overlayUI: any;
  private captureHandler: any;
  private isCapturing: boolean = false;

  constructor() {
    this.instanceId = `capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.setupModules();
    this.setupEventListeners();
  }

  private setupModules(): void {
    // Get module classes from globalThis
    const contentGlobal = globalThis as any;
    const AuthBridge = contentGlobal.AuthBridge;
    const OverlayUI = contentGlobal.OverlayUI;
    const CaptureHandler = contentGlobal.CaptureHandler;

    // Initialize modules
    this.authBridge = new AuthBridge(CONTENT_Logger, CONTENT_CONFIG.ALLOWED_ORIGINS);
    this.overlayUI = new OverlayUI();
    this.captureHandler = new CaptureHandler(CONTENT_Logger, this.overlayUI);

    // Setup auth bridge and event listeners
    this.authBridge.setup();
    this.captureHandler.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });
  }

  private handleMessage(message: MessageData, _sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): void {
    try {
      switch (message.type) {
        case 'PING':
          sendResponse({ success: true, ready: true, instanceId: this.instanceId });
          break;

        case 'START_CAPTURE':
          this.startCapture(message.data);
          sendResponse({ success: true, instanceId: this.instanceId });
          break;

        case 'STOP_CAPTURE':
          this.stopCapture();
          sendResponse({ success: true });
          break;

        case 'STATE_UPDATE':
          this.updateState(message.data);
          sendResponse({ success: true });
          break;

        case 'HIDE_OVERLAY':
          this.overlayUI.hide();
          sendResponse({ success: true });
          break;

        case 'SHOW_OVERLAY':
          if (this.isCapturing) {
            this.overlayUI.show();
          }
          sendResponse({ success: true });
          break;

        default:
          CONTENT_Logger.warn('Unknown message type:', message.type);
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      CONTENT_Logger.error('Error handling message:', error);
      sendResponse({ success: false, error: (error as Error).message });
    }
  }

  private startCapture(_data: { demoId: string }): void {
    this.isCapturing = true;
    // Don't show overlay - no visual indicator during recording
    // this.overlayUI.show();
    this.captureHandler.startCapture();
    CONTENT_Logger.info('Capture started');
  }

  private stopCapture(): void {
    this.isCapturing = false;
    // this.overlayUI.hide();
    this.captureHandler.stopCapture();
    CONTENT_Logger.info('Capture stopped');
  }

  private updateState(state: any): void {
    if (state.isRecording && !this.isCapturing) {
      this.startCapture({ demoId: state.demoId });
    } else if (!state.isRecording && this.isCapturing) {
      this.stopCapture();
    }
  }
}

// Initialize content script
if (!(window as any).demoFlowCapture) {
  (window as any).demoFlowCapture = new DemoFlowCapture();
  CONTENT_Logger.info('DemoFlow content script initialized');
}
