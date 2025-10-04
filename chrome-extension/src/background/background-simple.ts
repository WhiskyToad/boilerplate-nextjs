// DemoFlow Background Script - No Module Imports
// Handles cross-tab coordination, demo state management, and API communication

interface DemoData {
  title?: string;
  description?: string;
}

interface StepData {
  type?: string;
  element?: any;
  annotations?: any;
  interactions?: any;
}

interface AuthData {
  token: string;
  user: any;
}

interface MessageData {
  type: string;
  data?: any;
}

interface DemoRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  demoId: string | null;
  startTabId: number | null;
  startUrl: string | null;
  startTime: number | null;
  steps: any[];
  currentStep: number;
}

class SimpleRecordingState {
  private state: DemoRecordingState;

  constructor() {
    this.state = this.getDefaultState();
  }

  getState(): DemoRecordingState {
    return { ...this.state };
  }

  startRecording(data: any): void {
    this.state = {
      isRecording: true,
      isPaused: false,
      demoId: data.demoId,
      startTabId: data.startTabId,
      startUrl: data.startUrl,
      startTime: Date.now(),
      steps: data.steps || [],
      currentStep: 0,
    };
  }

  stopRecording(): void {
    this.state = this.getDefaultState();
  }

  pauseRecording(): void {
    if (this.state.isRecording) {
      this.state.isPaused = true;
    }
  }

  resumeRecording(): void {
    if (this.state.isRecording) {
      this.state.isPaused = false;
    }
  }

  addStep(step: any): void {
    if (this.state.isRecording && !this.state.isPaused) {
      this.state.steps.push({
        ...step,
        id: this.generateStepId(),
      });
      this.state.currentStep = this.state.steps.length - 1;
    }
  }

  private generateStepId(): string {
    return crypto.randomUUID();
  }

  private getDefaultState(): DemoRecordingState {
    return {
      isRecording: false,
      isPaused: false,
      demoId: null,
      startTabId: null,
      startUrl: null,
      startTime: null,
      steps: [],
      currentStep: 0,
    };
  }
}

class DemoFlowBackground {
  private recordingState: SimpleRecordingState;
  private api: any; // Will be window.DemoFlowAPI

  constructor() {
    this.recordingState = new SimpleRecordingState();
    this.setupEventListeners();
    this.initializeAPI();
  }

  private async initializeAPI(): Promise<void> {
    // Wait for the API to be loaded
    const checkAPI = () => {
      if ((globalThis as any).DemoFlowAPI) {
        this.api = (globalThis as any).DemoFlowAPI;
        this.api.initialize();
        console.log('Background script API initialized');
      } else {
        setTimeout(checkAPI, 100);
      }
    };
    checkAPI();
  }

  private setupEventListeners(): void {
    chrome.runtime.onMessage.addListener((message: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });

    chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    chrome.tabs.onRemoved.addListener((tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
      this.handleTabRemoved(tabId, removeInfo);
    });

    chrome.webNavigation.onCompleted.addListener((details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      this.handleNavigationCompleted(details);
    });
  }

  private async handleMessage(message: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): Promise<void> {
    try {
      switch (message.type) {
        case 'START_RECORDING':
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!activeTab) {
            sendResponse({ success: false, error: 'No active tab found' });
            return;
          }
          await this.startRecording(message.data as DemoData, activeTab);
          sendResponse({ success: true });
          break;

        case 'STOP_RECORDING':
          await this.stopRecording();
          sendResponse({ success: true });
          break;

        case 'PAUSE_RECORDING':
          this.pauseRecording();
          sendResponse({ success: true });
          break;

        case 'RESUME_RECORDING':
          this.resumeRecording();
          sendResponse({ success: true });
          break;

        case 'ADD_STEP':
          await this.addStep(message.data as StepData, sender.tab!);
          sendResponse({ success: true });
          break;

        case 'GET_RECORDING_STATE':
          sendResponse({ 
            success: true, 
            data: this.recordingState.getState() 
          });
          break;

        case 'AUTHENTICATE':
          await this.handleAuthentication(message.data as AuthData);
          sendResponse({ success: true });
          break;

        case 'AUTH_SUCCESS_FROM_WEB':
          console.log('Received auth success from web page:', message.data);
          await this.handleAuthentication(message.data as AuthData);
          
          try {
            chrome.runtime.sendMessage({
              type: 'AUTH_COMPLETED',
              data: message.data
            });
          } catch (error) {
            console.log('Popup not open, auth will be detected on next open');
          }
          
          sendResponse({ success: true });
          break;

        case 'GET_AUTH_STATE':
          if (this.api) {
            sendResponse({ 
              success: true, 
              data: this.api.getAuthState() 
            });
          } else {
            sendResponse({ success: false, error: 'API not initialized' });
          }
          break;

        case 'TRIGGER_AUTH':
          if (this.api) {
            try {
              await this.api.triggerAuthFlow();
              sendResponse({ success: true });
            } catch (error) {
              sendResponse({ success: false, error: (error as Error).message });
            }
          } else {
            sendResponse({ success: false, error: 'API not initialized' });
          }
          break;

        default:
          console.warn('Unknown message type:', message.type);
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: (error as Error).message });
    }
  }

  private async startRecording(demoData: DemoData, tab: chrome.tabs.Tab): Promise<void> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    if (!this.api.isAuthenticated()) {
      throw new Error('Authentication required - please log in first');
    }

    await this.api.loadConfig();

    try {
      const demo = await this.api.createDemo({
        title: demoData.title || `Demo recorded on ${new Date().toLocaleDateString()}`,
        description: demoData.description || '',
        settings: {
          startUrl: tab.url,
          startTitle: tab.title,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });

      this.recordingState.startRecording({
        demoId: demo.id,
        startTabId: tab.id!,
        startUrl: tab.url!,
        steps: []
      });

      // Inject content script and start capture
      const contentScriptReady = await this.ensureContentScriptInjected(tab.id!);
      
      if (contentScriptReady) {
        try {
          await chrome.tabs.sendMessage(tab.id!, {
            type: 'START_CAPTURE',
            data: { demoId: demo.id }
          });
        } catch (error) {
          console.error('Failed to start content script capture:', error);
        }
      }

      this.broadcastStateUpdate();
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  private async stopRecording(): Promise<void> {
    const state = this.recordingState.getState();
    if (!state.isRecording) return;

    try {
      // Save any remaining steps
      if (state.steps.length > 0 && state.demoId && this.api) {
        await this.api.saveSteps(state.demoId, state.steps);
      }

      if (state.demoId && this.api) {
        await this.api.updateDemo(state.demoId, {
          status: 'draft',
          total_steps: state.steps.length,
          estimated_duration: this.calculateDuration(state.steps)
        });
      }

      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id!, { type: 'STOP_CAPTURE' });
        } catch (e) {
          // Tab might not have content script
        }
      }

      this.recordingState.stopRecording();
      this.broadcastStateUpdate();

    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  private pauseRecording(): void {
    this.recordingState.pauseRecording();
    this.broadcastStateUpdate();
  }

  private resumeRecording(): void {
    this.recordingState.resumeRecording();
    this.broadcastStateUpdate();
  }

  private async addStep(stepData: StepData, tab: chrome.tabs.Tab): Promise<void> {
    const state = this.recordingState.getState();
    if (!state.isRecording || state.isPaused) return;

    const step = {
      sequence_order: state.steps.length,
      step_type: stepData.type || 'interaction',
      element_data: stepData.element || {},
      annotations: stepData.annotations || {},
      interactions: stepData.interactions || {},
      timing_data: {
        timestamp: Date.now(),
        url: tab.url || '',
        title: tab.title || ''
      }
    };

    this.recordingState.addStep(step);

    if (state.steps.length % 5 === 0 && state.demoId && this.api) {
      try {
        await this.api.saveSteps(state.demoId, [step]);
      } catch (error) {
        console.warn('Failed to auto-save step:', error);
      }
    }
  }

  private async handleTabUpdate(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): Promise<void> {
    const state = this.recordingState.getState();
    if (!state.isRecording || state.isPaused) return;

    if (changeInfo.status === 'complete' && changeInfo.url) {
      await this.addStep({
        type: 'navigation',
        element: {
          type: 'navigation',
          url: tab.url || '',
          title: tab.title || ''
        }
      }, tab);
    }
  }

  private handleTabRemoved(tabId: number, _removeInfo: chrome.tabs.TabRemoveInfo): void {
    const state = this.recordingState.getState();
    if (state.isRecording && state.startTabId === tabId) {
      console.log('Recording tab closed, stopping recording');
      this.stopRecording();
    }
  }

  private async handleNavigationCompleted(details: chrome.webNavigation.WebNavigationFramedCallbackDetails): Promise<void> {
    if (details.frameId !== 0) return;

    const state = this.recordingState.getState();
    if (!state.isRecording) return;

    console.log(`Navigation completed on tab ${details.tabId}`);
  }

  private async ensureContentScriptInjected(tabId: number): Promise<boolean> {
    try {
      // First check if we can access this tab
      const tab = await chrome.tabs.get(tabId);
      
      // Don't inject into restricted URLs
      if (!tab.url || this.isRestrictedUrl(tab.url)) {
        return false;
      }

      // Check if content script is already injected and responding
      if (await this.isContentScriptReady(tabId)) {
        return true;
      }

      // Inject content script
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/content.js']
      });

      // Wait for content script to be ready (with timeout)
      const isReady = await this.waitForContentScript(tabId, 5000);
      if (!isReady) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to inject content script:', error);
      return false;
    }
  }

  private isRestrictedUrl(url: string): boolean {
    const restrictedProtocols = ['chrome:', 'chrome-extension:', 'moz-extension:', 'edge:', 'opera:'];
    const restrictedDomains = ['chrome.google.com'];
    
    return restrictedProtocols.some(protocol => url.startsWith(protocol)) ||
           restrictedDomains.some(domain => url.includes(domain));
  }

  private async isContentScriptReady(tabId: number): Promise<boolean> {
    try {
      const response = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
      return response && response.success;
    } catch {
      return false;
    }
  }

  private async waitForContentScript(tabId: number, timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now();
    const checkInterval = 100;

    while (Date.now() - startTime < timeout) {
      if (await this.isContentScriptReady(tabId)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    return false;
  }

  private async handleAuthentication(authData: AuthData): Promise<void> {
    console.log('Handling authentication with data:', {
      token: authData.token ? 'Present' : 'Missing',
      user: authData.user
    });
    
    try {
      if (this.api) {
        await this.api.setAuthData(authData);
        this.api.notifyAuthCompletion(authData);
        console.log('Authentication completed successfully');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  private calculateDuration(steps: any[]): number {
    if (steps.length < 2) return 0;
    const first = steps[0].timing_data?.timestamp || 0;
    const last = steps[steps.length - 1].timing_data?.timestamp || 0;
    return Math.round((last - first) / 1000);
  }

  private broadcastStateUpdate(): void {
    const state = this.recordingState.getState();
    
    chrome.runtime.sendMessage({
      type: 'STATE_UPDATE',
      data: state
    }).catch(() => {
      // Popup might not be open
    });

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id!, {
          type: 'STATE_UPDATE',
          data: state
        }).catch(() => {
          // Tab might not have content script
        });
      });
    });
  }
}

new DemoFlowBackground();
console.log('DemoFlow background script initialized');