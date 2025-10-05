// DemoFlow Background Script - Modular Architecture
// Main entry point that orchestrates all modules

// Import combined API script for service worker (includes utilities)
declare function importScripts(...urls: string[]): void;
importScripts('../utils/combined-api.js');

// Import all background modules (compiled to JS)
importScripts('./types.js');
importScripts('./recording-state.js');
importScripts('./screenshot-manager.js');
importScripts('./tab-manager.js');
importScripts('./recording-manager.js');
importScripts('./message-router.js');

// Access utilities and modules from globalThis
const bgGlobal = globalThis as any;
const BG_CONFIG = bgGlobal.CONFIG;
const BG_Logger = bgGlobal.BackgroundLogger;

class DemoFlowBackground {
  private api: any;
  private recordingManager: any;
  private messageRouter: any;

  constructor() {
    this.initializeAPI();
    this.setupEventListeners();
  }

  private async initializeAPI(): Promise<void> {
    const checkAPI = () => {
      if ((globalThis as any).DemoFlowAPI) {
        this.api = (globalThis as any).DemoFlowAPI;
        this.api.initialize();
        BG_Logger.info('Background script API initialized');

        // Initialize managers after API is ready
        this.initializeManagers();
      } else {
        setTimeout(checkAPI, 100);
      }
    };
    checkAPI();
  }

  private initializeManagers(): void {
    // Get the RecordingManager and MessageRouter classes from globalThis
    const RecordingManager = (globalThis as any).RecordingManager;
    const MessageRouter = (globalThis as any).MessageRouter;

    this.recordingManager = new RecordingManager(this.api, BG_Logger, BG_CONFIG);
    this.messageRouter = new MessageRouter(this.api, BG_Logger, this.recordingManager);

    // Setup message routing
    this.messageRouter.setupListeners();
  }

  private setupEventListeners(): void {
    // Tab update events
    chrome.tabs.onUpdated.addListener((
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      if (this.recordingManager) {
        this.recordingManager.handleTabUpdate(tabId, changeInfo, tab);
      }
    });

    // Tab removed events
    chrome.tabs.onRemoved.addListener((
      tabId: number,
      _removeInfo: chrome.tabs.TabRemoveInfo
    ) => {
      if (this.recordingManager) {
        this.recordingManager.handleTabRemoved(tabId);
      }
    });

    // Navigation completed events
    chrome.webNavigation.onCompleted.addListener((
      details: chrome.webNavigation.WebNavigationFramedCallbackDetails
    ) => {
      if (details.frameId !== 0) return;

      const state = this.recordingManager?.getState();
      if (!state?.isRecording) return;

      BG_Logger.debug(`Navigation completed on tab ${details.tabId}`);
    });
  }
}

// Initialize
new DemoFlowBackground();
BG_Logger.info('DemoFlow background script initialized (modular)');
