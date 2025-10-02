// DemoFlow Background Script
// Handles cross-tab coordination, demo state management, and API communication

import { DemoFlowAPI } from '../utils/api.js';
import { RecordingState } from '../utils/state.js';

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

class DemoFlowBackground {
  private recordingState: RecordingState;
  private api: DemoFlowAPI;

  constructor() {
    this.recordingState = new RecordingState();
    this.api = new DemoFlowAPI();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Listen for tab updates during recording
    chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Listen for tab removal during recording
    chrome.tabs.onRemoved.addListener((tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
      this.handleTabRemoved(tabId, removeInfo);
    });

    // Listen for web navigation events
    chrome.webNavigation.onCompleted.addListener((details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      this.handleNavigationCompleted(details);
    });
  }

  private async handleMessage(message: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void): Promise<void> {
    try {
      switch (message.type) {
        case 'START_RECORDING':
          await this.startRecording(message.data as DemoData, sender.tab!);
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
          await this.authenticate(message.data as AuthData);
          sendResponse({ success: true });
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
    console.log('Starting demo recording:', demoData);

    // Create new demo via API
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

    // Initialize recording state
    this.recordingState.startRecording({
      demoId: demo.id,
      startTabId: tab.id!,
      startUrl: tab.url!,
      steps: []
    });

    // Inject content script if not already present
    await this.ensureContentScriptInjected(tab.id!);

    // Notify content script to start capturing
    await chrome.tabs.sendMessage(tab.id!, {
      type: 'START_CAPTURE',
      data: { demoId: demo.id }
    });

    // Update popup and other tabs
    this.broadcastStateUpdate();
  }

  private async stopRecording(): Promise<void> {
    const state = this.recordingState.getState();
    if (!state.isRecording) return;

    console.log('Stopping demo recording');

    try {
      // Save all recorded steps to API
      if (state.steps.length > 0 && state.demoId) {
        await this.api.saveSteps(state.demoId, state.steps);
      }

      // Update demo with final metadata
      if (state.demoId) {
        await this.api.updateDemo(state.demoId, {
        status: 'draft',
        total_steps: state.steps.length,
        estimated_duration: this.calculateDuration(state.steps)
        });
      }

      // Notify all tabs to stop capturing
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id!, { type: 'STOP_CAPTURE' });
        } catch (e) {
          // Tab might not have content script
        }
      }

      // Clear recording state
      this.recordingState.stopRecording();
      this.broadcastStateUpdate();

      console.log('Demo recording completed:', state.demoId);
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

    // Auto-save steps periodically
    if (state.steps.length % 5 === 0 && state.demoId) {
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

    // Handle navigation during recording
    if (changeInfo.status === 'complete' && changeInfo.url) {
      await this.ensureContentScriptInjected(tabId);
      
      // Add navigation step
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
      // Original tab was closed during recording
      console.log('Recording tab closed, stopping recording');
      this.stopRecording();
    }
  }

  private async handleNavigationCompleted(details: chrome.webNavigation.WebNavigationFramedCallbackDetails): Promise<void> {
    if (details.frameId !== 0) return; // Only main frame

    const state = this.recordingState.getState();
    if (!state.isRecording) return;

    // Re-inject content script after navigation
    await this.ensureContentScriptInjected(details.tabId);
  }

  private async ensureContentScriptInjected(tabId: number): Promise<void> {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['src/content/content.js']
      });
    } catch (error) {
      console.warn('Failed to inject content script:', error);
    }
  }

  private async authenticate(authData: AuthData): Promise<void> {
    // Store authentication token for API calls
    await chrome.storage.local.set({
      authToken: authData.token,
      user: authData.user
    });
    
    this.api.setAuthToken(authData.token);
  }

  private calculateDuration(steps: any[]): number {
    if (steps.length < 2) return 0;
    const first = steps[0].timing_data?.timestamp || 0;
    const last = steps[steps.length - 1].timing_data?.timestamp || 0;
    return Math.round((last - first) / 1000); // Duration in seconds
  }

  private broadcastStateUpdate(): void {
    const state = this.recordingState.getState();
    
    // Notify popup
    chrome.runtime.sendMessage({
      type: 'STATE_UPDATE',
      data: state
    }).catch(() => {
      // Popup might not be open
    });

    // Notify all content scripts
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

// Initialize background script
new DemoFlowBackground();

console.log('DemoFlow background script initialized');