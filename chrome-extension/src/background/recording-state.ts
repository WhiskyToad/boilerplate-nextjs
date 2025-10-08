// Recording State Manager
// Handles the state of demo recording sessions

import { DemoRecordingState } from './types.js';

export class RecordingStateManager {
  private state: DemoRecordingState;
  private readonly storageKey = 'demoflowRecordingState';
  private readonly storage: chrome.storage.StorageArea;
  private ready: Promise<void>;

  constructor() {
    this.state = this.getDefaultState();
    this.storage = (chrome.storage && chrome.storage.session)
      ? chrome.storage.session
      : chrome.storage.local;
    this.ready = this.loadState();
  }

  private async loadState(): Promise<void> {
    try {
      const result = await this.storage.get(this.storageKey);
      const storedState = result?.[this.storageKey];
      if (storedState) {
        this.state = {
          ...this.getDefaultState(),
          ...storedState,
          steps: Array.isArray(storedState.steps) ? storedState.steps : [],
        };
      }
    } catch (error) {
      console.error('[Background][RecordingState] Failed to load recording state', error);
    }
  }

  async waitUntilReady(): Promise<void> {
    await this.ready;
  }

  async getState(): Promise<DemoRecordingState> {
    await this.waitUntilReady();
    return {
      ...this.state,
      steps: [...this.state.steps],
    };
  }

  async startRecording(data: {
    demoId: string;
    startTabId: number;
    startUrl: string;
    steps?: any[];
  }): Promise<void> {
    await this.waitUntilReady();
    const steps = data.steps ? [...data.steps] : [];
    this.state = {
      isRecording: true,
      isPaused: false,
      demoId: data.demoId,
      startTabId: data.startTabId,
      startUrl: data.startUrl,
      startTime: Date.now(),
      steps,
      currentStep: steps.length > 0 ? steps.length - 1 : 0,
    };
    await this.persistState();
  }

  async stopRecording(): Promise<void> {
    await this.waitUntilReady();
    this.state = this.getDefaultState();
    await this.persistState();
  }

  async pauseRecording(): Promise<void> {
    await this.waitUntilReady();
    if (this.state.isRecording) {
      this.state.isPaused = true;
      await this.persistState();
    }
  }

  async resumeRecording(): Promise<void> {
    await this.waitUntilReady();
    if (this.state.isRecording) {
      this.state.isPaused = false;
      await this.persistState();
    }
  }

  async addStep(step: any): Promise<void> {
    await this.waitUntilReady();
    if (this.state.isRecording && !this.state.isPaused) {
      this.state.steps.push({
        ...step,
        id: this.generateStepId(),
      });
      this.state.currentStep = this.state.steps.length - 1;
      await this.persistState();
    }
  }

  private async persistState(): Promise<void> {
    try {
      await this.storage.set({ [this.storageKey]: this.state });
    } catch (error) {
      console.error('[Background][RecordingState] Failed to persist recording state', error);
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

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).RecordingStateManager = RecordingStateManager;
}
