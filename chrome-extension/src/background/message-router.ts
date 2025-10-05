// Message Router
// Routes messages to appropriate handlers

import { RecordingManager } from './recording-manager';
import { MessageData, DemoData, BackgroundStepData } from './types';

export class MessageRouter {
  private recordingManager: RecordingManager;
  private api: any;
  private logger: any;

  constructor(api: any, logger: any, recordingManager: RecordingManager) {
    this.api = api;
    this.logger = logger;
    this.recordingManager = recordingManager;
  }

  setupListeners(): void {
    chrome.runtime.onMessage.addListener((
      message: MessageData,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: any) => void
    ) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });
  }

  private async handleMessage(
    message: MessageData,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ): Promise<void> {
    try {
      switch (message.type) {
        case 'START_RECORDING':
          await this.handleStartRecording(message.data, sendResponse);
          break;

        case 'STOP_RECORDING':
          await this.handleStopRecording(sendResponse);
          break;

        case 'PAUSE_RECORDING':
          this.handlePauseRecording(sendResponse);
          break;

        case 'RESUME_RECORDING':
          this.handleResumeRecording(sendResponse);
          break;

        case 'ADD_STEP':
          await this.handleAddStep(message.data, sender.tab!, sendResponse);
          break;

        case 'GET_RECORDING_STATE':
          this.handleGetRecordingState(sendResponse);
          break;

        case 'AUTH_SUCCESS_FROM_WEB':
          await this.handleAuthSuccess(message.data, sendResponse);
          break;

        case 'GET_AUTH_STATE':
          this.handleGetAuthState(sendResponse);
          break;

        default:
          this.logger.warn('Unknown message type:', message.type);
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      this.logger.error('Error handling message', error as Error);
      sendResponse({ success: false, error: (error as Error).message });
    }
  }

  private async handleStartRecording(data: DemoData, sendResponse: (response: any) => void): Promise<void> {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab) {
      sendResponse({ success: false, error: 'No active tab found' });
      return;
    }
    await this.recordingManager.startRecording(data, activeTab);
    sendResponse({ success: true });
  }

  private async handleStopRecording(sendResponse: (response: any) => void): Promise<void> {
    await this.recordingManager.stopRecording();
    sendResponse({ success: true });
  }

  private handlePauseRecording(sendResponse: (response: any) => void): void {
    this.recordingManager.pauseRecording();
    sendResponse({ success: true });
  }

  private handleResumeRecording(sendResponse: (response: any) => void): void {
    this.recordingManager.resumeRecording();
    sendResponse({ success: true });
  }

  private async handleAddStep(
    data: BackgroundStepData,
    tab: chrome.tabs.Tab,
    sendResponse: (response: any) => void
  ): Promise<void> {
    await this.recordingManager.addStep(data, tab);
    sendResponse({ success: true });
  }

  private handleGetRecordingState(sendResponse: (response: any) => void): void {
    sendResponse({
      success: true,
      data: this.recordingManager.getState()
    });
  }

  private async handleAuthSuccess(data: any, sendResponse: (response: any) => void): Promise<void> {
    this.logger.info('💾 Storing authentication data...');
    this.logger.debug('Token present:', !!data.token);
    this.logger.debug('User:', data.user?.email);

    try {
      if (this.api) {
        await this.api.setAuthData(data);
        this.api.notifyAuthCompletion(data);
        this.logger.info('✅ Authentication stored successfully!');

        // Verify it was stored
        const stored = this.api.getAuthState();
        this.logger.debug('Verified stored auth state:', stored.isAuthenticated ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');
      } else {
        this.logger.error('API not initialized!', new Error('API not ready'));
      }
    } catch (error) {
      this.logger.error('Authentication storage failed', error as Error);
      throw error;
    }

    // Notify popup
    try {
      chrome.runtime.sendMessage({
        type: 'AUTH_COMPLETED',
        data: data
      });
      this.logger.debug('Notified popup of auth completion');
    } catch (error) {
      this.logger.debug('Popup not open, auth will be detected on next open');
    }

    sendResponse({ success: true });
  }

  private handleGetAuthState(sendResponse: (response: any) => void): void {
    if (this.api) {
      sendResponse({
        success: true,
        data: this.api.getAuthState()
      });
    } else {
      sendResponse({ success: false, error: 'API not initialized' });
    }
  }
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).MessageRouter = MessageRouter;
}
