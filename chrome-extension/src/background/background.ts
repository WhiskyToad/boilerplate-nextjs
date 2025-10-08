// DemoFlow Background Script - ES6 Module Version
// Main entry point that orchestrates all modules

import { CONFIG } from '../utils/config.js';
import { BackgroundLogger } from '../utils/logger.js';
import { BackgroundAPI } from './background-api.js';
import { RecordingManager } from './recording-manager.js';
import { MessageRouter } from './message-router.js';

class DemoFlowBackground {
  private api: BackgroundAPI;
  private recordingManager: RecordingManager;
  private messageRouter: MessageRouter;

  constructor() {
    this.api = new BackgroundAPI();
    this.recordingManager = new RecordingManager(this.api, BackgroundLogger, CONFIG);
    this.messageRouter = new MessageRouter(this.api, BackgroundLogger, this.recordingManager);
    
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.api.initialize();
      BackgroundLogger.info('Background script API initialized');
      
      // Setup message routing
      this.messageRouter.setupListeners();
      
      // Setup event listeners
      this.setupEventListeners();
    } catch (error) {
      BackgroundLogger.error('Failed to initialize background script', error as Error);
    }
  }

  private setupEventListeners(): void {
    // Tab update events
    chrome.tabs.onUpdated.addListener((
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      void this.recordingManager.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Tab removed events
    chrome.tabs.onRemoved.addListener((
      tabId: number,
      _removeInfo: chrome.tabs.TabRemoveInfo
    ) => {
      void this.recordingManager.handleTabRemoved(tabId);
    });

    // Navigation completed events
    chrome.webNavigation.onCompleted.addListener(async (
      details: chrome.webNavigation.WebNavigationFramedCallbackDetails
    ) => {
      if (details.frameId !== 0) return;

      const state = await this.recordingManager.getState();
      if (!state?.isRecording) return;

      BackgroundLogger.debug(`Navigation completed on tab ${details.tabId}`);
    });
  }
}

// Initialize
new DemoFlowBackground();
BackgroundLogger.info('DemoFlow background script initialized (ES6 modules)');
