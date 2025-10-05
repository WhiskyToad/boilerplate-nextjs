// Recording Controls
// Handles recording, pause, stop, and annotation actions

export class RecordingControls {
  private api: any;
  private logger: any;
  private errorMessages: any;
  private uiController: any;
  private authState: any;
  private startTime: number | null = null;
  private timer: number | null = null;

  constructor(api: any, logger: any, errorMessages: any, uiController: any) {
    this.api = api;
    this.logger = logger;
    this.errorMessages = errorMessages;
    this.uiController = uiController;
  }

  setAuthState(authState: any): void {
    this.authState = authState;
  }

  async handleConnect(): Promise<void> {
    const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
    const originalText = connectBtn?.textContent || 'Sign In';

    try {
      if (!this.api) {
        this.uiController.showError('API not initialized');
        return;
      }

      if (connectBtn) {
        connectBtn.disabled = true;
        connectBtn.textContent = 'Opening login...';
      }

      this.logger.info('Starting authentication flow');
      await this.api.triggerAuthFlow();
      this.logger.info('Authentication flow completed');
      this.uiController.showSuccess('Successfully connected!');

    } catch (error) {
      this.logger.error('Authentication failed', error as Error);
      const errorMsg = (error as Error).message;

      if (errorMsg.includes('cancelled')) {
        this.uiController.showError(this.errorMessages.AUTH_CANCELLED);
      } else if (errorMsg.includes('timeout')) {
        this.uiController.showError(this.errorMessages.AUTH_TIMEOUT);
      } else {
        this.uiController.showError(`Failed to connect: ${errorMsg}`);
      }
    } finally {
      if (connectBtn) {
        connectBtn.disabled = false;
        connectBtn.textContent = originalText;
      }
    }
  }

  async handleRecord(sanitizeDemoTitle: (s: string) => string, sanitizeDemoDescription: (s: string) => string): Promise<void> {
    if (!this.authState?.isAuthenticated) {
      this.uiController.showError('Please connect your account first');
      return;
    }

    try {
      const titleInput = document.getElementById('demoTitle') as HTMLInputElement;
      const descriptionInput = document.getElementById('demoDescription') as HTMLTextAreaElement;

      const rawTitle = titleInput?.value.trim() || '';
      const rawDescription = descriptionInput?.value.trim() || '';

      // Sanitize inputs
      const title = sanitizeDemoTitle(rawTitle);
      const description = sanitizeDemoDescription(rawDescription);

      if (!title) {
        this.uiController.showError(this.errorMessages.DEMO_TITLE_REQUIRED);
        return;
      }

      const response = await chrome.runtime.sendMessage({
        type: 'START_RECORDING',
        data: { title, description }
      });

      if (response.success) {
        this.startTime = Date.now();
        this.startTimer();
        this.uiController.showSuccess('Recording started!');
        this.logger.info(`Started recording: "${title}"`);
      } else {
        this.uiController.showError(response.error || this.errorMessages.RECORDING_START_FAILED);
      }
    } catch (error) {
      this.logger.error('Failed to start recording', error as Error);
      this.uiController.showError(this.errorMessages.RECORDING_START_FAILED);
    }
  }

  async handlePause(recordingState: any): Promise<void> {
    try {
      const action = recordingState?.isPaused ? 'RESUME_RECORDING' : 'PAUSE_RECORDING';
      const response = await chrome.runtime.sendMessage({ type: action });

      if (response.success) {
        if (recordingState?.isPaused) {
          this.startTimer();
          this.uiController.showSuccess('Recording resumed');
        } else {
          this.stopTimer();
          this.uiController.showSuccess('Recording paused');
        }
      }
    } catch (error) {
      this.logger.error('Failed to toggle pause', error as Error);
      this.uiController.showError('Failed to toggle pause');
    }
  }

  async handleStop(): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'STOP_RECORDING' });

      if (response.success) {
        this.stopTimer();
        this.uiController.clearDemoInputs();
        this.uiController.showSuccess('Demo saved successfully!');
        this.logger.info('Recording stopped and saved');
      } else {
        this.uiController.showError('Failed to save demo');
      }
    } catch (error) {
      this.logger.error('Failed to stop recording', error as Error);
      this.uiController.showError(this.errorMessages.RECORDING_STOP_FAILED);
    }
  }

  async handleAddAnnotation(sanitizeAnnotation: (s: string) => string): Promise<void> {
    const rawAnnotation = prompt('Enter annotation text:');
    if (rawAnnotation) {
      try {
        const annotation = sanitizeAnnotation(rawAnnotation);

        await chrome.runtime.sendMessage({
          type: 'ADD_STEP',
          data: {
            type: 'annotation',
            annotations: { text: annotation },
            element: { type: 'annotation' }
          }
        });
        this.uiController.showSuccess('Annotation added');
        this.logger.info('Annotation added');
      } catch (error) {
        this.logger.error('Failed to add annotation', error as Error);
        this.uiController.showError('Failed to add annotation');
      }
    }
  }

  async handleAddPause(): Promise<void> {
    try {
      await chrome.runtime.sendMessage({
        type: 'ADD_STEP',
        data: {
          type: 'pause',
          element: { type: 'pause', duration: 2000 },
          annotations: { text: 'Pause for 2 seconds' }
        }
      });
      this.uiController.showSuccess('Pause added');
      this.logger.debug('Pause added');
    } catch (error) {
      this.logger.error('Failed to add pause', error as Error);
      this.uiController.showError('Failed to add pause');
    }
  }

  startTimer(): void {
    if (this.timer) return;

    this.timer = window.setInterval(() => {
      if (this.startTime) {
        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.uiController.updateDuration(formatted);
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  cleanup(): void {
    this.stopTimer();
  }
}

// Export to globalThis
if (typeof globalThis !== 'undefined') {
  (globalThis as any).RecordingControls = RecordingControls;
}
