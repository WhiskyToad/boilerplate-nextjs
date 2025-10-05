// UI Controller
// Handles all DOM updates and UI rendering

import { PopupRecordingState, AuthState } from './types';

export class UIController {
  private logger: any;

  constructor(logger: any) {
    this.logger = logger;
  }

  updateUI(authState: AuthState | null, recordingState: PopupRecordingState | null): void {
    if (!authState) return;

    // Update authentication UI
    const authSection = document.getElementById('authSection');
    const recordingSection = document.getElementById('recordingSection');

    if (authSection && recordingSection) {
      if (authState.isAuthenticated) {
        authSection.style.display = 'none';
        recordingSection.style.display = 'block';
      } else {
        authSection.style.display = 'block';
        recordingSection.style.display = 'none';
      }
    }

    // Update recording UI
    this.updateRecordingUI(recordingState);
  }

  private updateRecordingUI(recordingState: PopupRecordingState | null): void {
    const recordBtn = document.getElementById('recordBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const demoInfo = document.getElementById('demoInfo');
    const currentDemo = document.getElementById('currentDemo');
    const quickActions = document.getElementById('quickActions');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    if (!recordingState?.isRecording) {
      // Not recording
      if (recordBtn) recordBtn.style.display = 'block';
      if (pauseBtn) pauseBtn.style.display = 'none';
      if (stopBtn) stopBtn.style.display = 'none';
      if (demoInfo) demoInfo.style.display = 'block';
      if (currentDemo) currentDemo.style.display = 'none';
      if (quickActions) quickActions.style.display = 'none';
      if (statusIndicator) statusIndicator.className = 'status-indicator';
      if (statusText) statusText.textContent = 'Ready';
    } else {
      // Recording
      if (recordBtn) recordBtn.style.display = 'none';
      if (pauseBtn) pauseBtn.style.display = 'block';
      if (stopBtn) stopBtn.style.display = 'block';
      if (demoInfo) demoInfo.style.display = 'none';
      if (currentDemo) currentDemo.style.display = 'block';
      if (quickActions) quickActions.style.display = 'flex';

      if (recordingState.isPaused) {
        if (statusIndicator) statusIndicator.className = 'status-indicator status-paused';
        if (statusText) statusText.textContent = 'Paused';
        if (pauseBtn) {
          const icon = pauseBtn.querySelector('.btn-icon');
          const text = pauseBtn.querySelector('.btn-text');
          if (icon) icon.textContent = '▶';
          if (text) text.textContent = 'Resume';
        }
      } else {
        if (statusIndicator) statusIndicator.className = 'status-indicator status-recording';
        if (statusText) statusText.textContent = 'Recording';
        if (pauseBtn) {
          const icon = pauseBtn.querySelector('.btn-icon');
          const text = pauseBtn.querySelector('.btn-text');
          if (icon) icon.textContent = '⏸';
          if (text) text.textContent = 'Pause';
        }
      }

      // Update step count
      const stepCount = document.getElementById('stepCount');
      if (stepCount) {
        const count = recordingState.steps?.length || 0;
        stepCount.textContent = `${count} step${count !== 1 ? 's' : ''}`;
      }
    }
  }

  updateDuration(duration: string): void {
    const durationElement = document.getElementById('duration');
    if (durationElement) {
      durationElement.textContent = duration;
    }
  }

  clearDemoInputs(): void {
    const titleInput = document.getElementById('demoTitle') as HTMLInputElement;
    const descriptionInput = document.getElementById('demoDescription') as HTMLTextAreaElement;

    if (titleInput) titleInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
  }

  showSuccess(message: string): void {
    this.logger.info(message);
    // Could add toast notification here
  }

  showError(message: string): void {
    this.logger.error(message);
    // Could add toast notification here
    alert(message);
  }
}

// Export to globalThis
if (typeof globalThis !== 'undefined') {
  (globalThis as any).UIController = UIController;
}
