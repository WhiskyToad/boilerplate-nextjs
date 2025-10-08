// Recording Manager
// Orchestrates demo recording lifecycle

import { RecordingStateManager } from './recording-state.js';
import { ScreenshotManager } from './screenshot-manager.js';
import { TabManager } from './tab-manager.js';
import { DemoData, BackgroundStepData } from './types.js';

export class RecordingManager {
  private stateManager: RecordingStateManager;
  private screenshotManager: ScreenshotManager;
  private tabManager: TabManager;
  private api: any;
  private logger: any;
  private broadcastDebounce?: number;

  constructor(
    api: any,
    logger: any,
    config: any
  ) {
    this.api = api;
    this.logger = logger;
    this.stateManager = new RecordingStateManager();
    this.screenshotManager = new ScreenshotManager(api, logger, config);
    this.tabManager = new TabManager(logger);
  }

  async getState() {
    return this.stateManager.getState();
  }

  async startRecording(demoData: DemoData, tab: chrome.tabs.Tab): Promise<void> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    if (!this.api.isAuthenticated()) {
      throw new Error('Authentication required - please log in first');
    }

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

      await this.stateManager.startRecording({
        demoId: demo.id,
        startTabId: tab.id!,
        startUrl: tab.url!,
        steps: []
      });

      await this.broadcastState();

      // Capture initial screenshot
      setTimeout(() => {
        void this.addStep({
          type: 'initial',
          element: {
            type: 'page',
            url: tab.url || '',
            title: tab.title || '',
            viewport: {
              width: 1920,
              height: 1080
            }
          }
        }, tab);
      }, 1000);

      // Inject content script and start capture
      const contentScriptReady = await this.tabManager.ensureContentScriptInjected(tab.id!);

      if (contentScriptReady) {
        try {
          await chrome.tabs.sendMessage(tab.id!, {
            type: 'START_CAPTURE',
            data: { demoId: demo.id }
          });
        } catch (error) {
          this.logger.error('Failed to start content script capture', error as Error);
        }
      }

    } catch (error) {
      this.logger.error('Failed to start recording', error as Error);
      throw error;
    }
  }

  async stopRecording(): Promise<void> {
    const state = await this.stateManager.getState();
    if (!state.isRecording) return;

    this.logger.info(`🛑 Stopping recording... (${state.steps.length} steps to save)`);

    try {
      if (state.steps.length > 0 && state.demoId && this.api) {
        this.logger.info(`💾 Saving ${state.steps.length} steps to demo ${state.demoId}...`);
        await this.api.saveSteps(state.demoId, state.steps);
        this.logger.info('✅ Steps saved successfully!');
      }

      if (state.demoId && this.api) {
        this.logger.debug('Updating demo metadata...');
        await this.api.updateDemo(state.demoId, {
          status: 'draft',
          total_steps: state.steps.length,
          estimated_duration: this.calculateDuration(state.steps)
        });
        this.logger.debug('Demo metadata updated');
      }

      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id!, { type: 'STOP_CAPTURE' });
        } catch (e) {
          // Tab might not have content script
        }
      }

      await this.stateManager.stopRecording();
      await this.broadcastState();

    } catch (error) {
      this.logger.error('Error stopping recording', error as Error);
      throw error;
    }
  }

  async pauseRecording(): Promise<void> {
    await this.stateManager.pauseRecording();
    await this.broadcastState();
  }

  async resumeRecording(): Promise<void> {
    await this.stateManager.resumeRecording();
    await this.broadcastState();
  }

  async addStep(stepData: BackgroundStepData, tab: chrome.tabs.Tab): Promise<void> {
    const state = await this.stateManager.getState();
    if (!state.isRecording || state.isPaused) return;

    // Capture screenshot for this step
    const screenshot = await this.screenshotManager.captureScreenshot(tab.id!);

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
      },
      screenshot_url: screenshot
    };

    await this.stateManager.addStep(step);

    const updatedState = await this.stateManager.getState();
    this.logger.debug(`📝 Step ${updatedState.steps.length} captured (not saved yet)`);
    await this.broadcastState();
  }

  async handleTabUpdate(_tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): Promise<void> {
    const state = await this.stateManager.getState();
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

  async handleTabRemoved(tabId: number): Promise<void> {
    const state = await this.stateManager.getState();

    if (state.isRecording && state.startTabId === tabId) {
      this.logger.warn('Recording tab closed, forcing stop');

      try {
        await this.stopRecording();
      } catch (error) {
        // Force state reset even if save fails
        this.logger.error('Failed to stop recording gracefully, forcing reset', error as Error);
        await this.stateManager.stopRecording();
        await this.broadcastState();
      }
    }
  }

  private calculateDuration(steps: any[]): number {
    if (steps.length < 2) return 0;
    const first = steps[0].timing_data?.timestamp || 0;
    const last = steps[steps.length - 1].timing_data?.timestamp || 0;
    return Math.round((last - first) / 1000);
  }

  private async broadcastState(): Promise<void> {
    // Debounce rapid updates (e.g., typing) to avoid spamming listeners
    if (this.broadcastDebounce) {
      clearTimeout(this.broadcastDebounce);
    }

    await new Promise<void>((resolve) => {
      this.broadcastDebounce = setTimeout(async () => {
        try {
          const state = await this.stateManager.getState();

          try {
            await chrome.runtime.sendMessage({
              type: 'STATE_UPDATE',
              data: state
            });
          } catch (error) {
            // Likely no popup open; log at debug level only
            this.logger.debug('Popup not available for state update', error as Error);
          }

          await this.tabManager.broadcastToAllTabs({
            type: 'STATE_UPDATE',
            data: state
          });
        } catch (error) {
          this.logger.error('Failed to broadcast recording state', error as Error);
        } finally {
          resolve();
        }
      }, 100);
    });
  }
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).RecordingManager = RecordingManager;
}
