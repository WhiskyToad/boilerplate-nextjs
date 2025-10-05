// Recording State Manager
// Handles the state of demo recording sessions

import { DemoRecordingState } from './types';

export class RecordingStateManager {
  private state: DemoRecordingState;

  constructor() {
    this.state = this.getDefaultState();
  }

  getState(): DemoRecordingState {
    return { ...this.state };
  }

  startRecording(data: {
    demoId: string;
    startTabId: number;
    startUrl: string;
    steps?: any[];
  }): void {
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

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).RecordingStateManager = RecordingStateManager;
}
