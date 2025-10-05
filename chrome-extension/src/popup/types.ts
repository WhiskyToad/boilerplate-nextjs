// Shared types for popup modules

export interface PopupRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  demoId: string;
  steps: any[];
}

export interface MessageData {
  type: string;
  data?: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: any;
  needsReauth: boolean;
}
