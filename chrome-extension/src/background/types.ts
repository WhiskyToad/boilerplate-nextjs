// Shared types for background script modules

export interface DemoData {
  title?: string;
  description?: string;
}

export interface BackgroundStepData {
  type?: string;
  element?: any;
  annotations?: any;
  interactions?: any;
}

export interface MessageData {
  type: string;
  data?: any;
}

export interface DemoRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  demoId: string | null;
  startTabId: number | null;
  startUrl: string | null;
  startTime: number | null;
  steps: any[];
  currentStep: number;
}
