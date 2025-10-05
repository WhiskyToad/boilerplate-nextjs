// DemoFlow Popup - Modular Version
// Main entry point that orchestrates all popup modules

// Load utility modules first (from combined-api.js loaded in HTML)
const popupGlobal = globalThis as any;
const POPUP_CONFIG = popupGlobal.CONFIG;
const POPUP_ERROR_MESSAGES = popupGlobal.ERROR_MESSAGES;
const POPUP_Logger = popupGlobal.PopupLogger;

// Import popup modules (compiled to JS, loaded via script tags)
// types.js, ui-controller.js, recording-controls.js should be loaded in HTML

// Sanitization functions (inline for now since they're small)
function sanitizeText(text: string, maxLength: number = 1000): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .substring(0, maxLength);
}

function sanitizeDemoTitle(title: string): string {
  return sanitizeText(title, 200);
}

function sanitizeDemoDescription(desc: string): string {
  return sanitizeText(desc, 2000);
}

function sanitizeAnnotation(text: string): string {
  return sanitizeText(text, 500);
}

class DemoFlowPopup {
  private api: any;
  private authState: any = null;
  private recordingState: any = null;
  private uiController: any;
  private recordingControls: any;

  constructor() {
    this.setupModules();
    this.setupEventListeners();
    this.loadState();

    // Clean up on unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  private setupModules(): void {
    // Get module classes from globalThis
    const UIController = popupGlobal.UIController;
    const RecordingControls = popupGlobal.RecordingControls;

    // Initialize modules
    this.uiController = new UIController(POPUP_Logger);
    this.recordingControls = new RecordingControls(
      null, // API will be set after it loads
      POPUP_Logger,
      POPUP_ERROR_MESSAGES,
      this.uiController
    );
  }

  private setupEventListeners(): void {
    // Control buttons
    document.getElementById('connectBtn')?.addEventListener('click', () => {
      this.recordingControls.handleConnect();
    });

    document.getElementById('recordBtn')?.addEventListener('click', () => {
      this.recordingControls.handleRecord(sanitizeDemoTitle, sanitizeDemoDescription);
    });

    document.getElementById('pauseBtn')?.addEventListener('click', () => {
      this.recordingControls.handlePause(this.recordingState);
    });

    document.getElementById('stopBtn')?.addEventListener('click', () => {
      this.recordingControls.handleStop();
    });

    // Quick actions
    document.getElementById('addAnnotationBtn')?.addEventListener('click', () => {
      this.recordingControls.handleAddAnnotation(sanitizeAnnotation);
    });

    document.getElementById('addPauseBtn')?.addEventListener('click', () => {
      this.recordingControls.handleAddPause();
    });

    // Footer actions
    document.getElementById('openDashboard')?.addEventListener('click', () => {
      this.handleOpenDashboard();
    });

    document.getElementById('settingsBtn')?.addEventListener('click', () => {
      this.handleOpenSettings();
    });

    // Settings modal
    document.getElementById('closeSettings')?.addEventListener('click', () => {
      this.handleCloseSettings();
    });

    // Listen for background script messages
    chrome.runtime.onMessage.addListener((message: any) => {
      this.handleMessage(message);
    });
  }

  private async loadState(): Promise<void> {
    try {
      // Wait for API to be available
      const checkAPI = () => {
        if (popupGlobal.DemoFlowAPI) {
          this.api = popupGlobal.DemoFlowAPI;
          this.recordingControls.api = this.api;
          this.initializeWithAPI();
        } else {
          setTimeout(checkAPI, 100);
        }
      };
      checkAPI();
    } catch (error) {
      POPUP_Logger.error('Failed to load popup state', error as Error);
      this.updateUI();
    }
  }

  private async initializeWithAPI(): Promise<void> {
    try {
      await this.api.initialize();

      this.authState = this.api.getAuthState();
      this.recordingControls.setAuthState(this.authState);

      // Set up auth state listener
      this.api.addListener((newState: any) => {
        this.authState = newState;
        this.recordingControls.setAuthState(newState);
        this.updateUI();
      });

      // Get current recording state
      const response = await chrome.runtime.sendMessage({ type: 'GET_RECORDING_STATE' });
      if (response.success) {
        this.recordingState = response.data;
      }

      // Update UI
      this.updateUI();
    } catch (error) {
      POPUP_Logger.error('Failed to initialize popup with API', error as Error);
      this.updateUI();
    }
  }

  private handleMessage(message: any): void {
    switch (message.type) {
      case 'STATE_UPDATE':
        this.recordingState = message.data;
        this.updateUI();
        break;
      case 'AUTH_COMPLETED':
        POPUP_Logger.debug('Auth completed message received in popup');
        break;
    }
  }

  private handleOpenDashboard(): void {
    chrome.tabs.create({ url: POPUP_CONFIG.DASHBOARD_URL });
  }

  private handleOpenSettings(): void {
    const modal = document.getElementById('settingsModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  private handleCloseSettings(): void {
    const modal = document.getElementById('settingsModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
  }

  private updateUI(): void {
    this.uiController.updateUI(this.authState, this.recordingState);
  }

  private cleanup(): void {
    this.recordingControls.cleanup();
    POPUP_Logger.debug('Popup cleaned up');
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DemoFlowPopup();
  });
} else {
  new DemoFlowPopup();
}
