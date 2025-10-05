// DemoFlow Popup Script - No Module Imports
// Handles the extension popup UI and user interactions

interface PopupRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  demoId: string;
  steps: any[];
}

interface MessageData {
  type: string;
  data?: any;
}

class DemoFlowPopup {
  private api: any; // Will be globalThis.DemoFlowAPI
  private authState: any = null;
  private recordingState: PopupRecordingState | null = null;
  private timer: number | null = null;
  private startTime: number | null = null;

  constructor() {
    this.setupEventListeners();
    this.loadState();
  }

  private setupEventListeners(): void {
    // Control buttons
    document.getElementById('connectBtn')?.addEventListener('click', this.handleConnect.bind(this));
    document.getElementById('recordBtn')?.addEventListener('click', this.handleRecord.bind(this));
    document.getElementById('pauseBtn')?.addEventListener('click', this.handlePause.bind(this));
    document.getElementById('stopBtn')?.addEventListener('click', this.handleStop.bind(this));

    // Quick actions
    document.getElementById('addAnnotationBtn')?.addEventListener('click', this.handleAddAnnotation.bind(this));
    document.getElementById('addPauseBtn')?.addEventListener('click', this.handleAddPause.bind(this));

    // Footer actions
    document.getElementById('openDashboard')?.addEventListener('click', this.handleOpenDashboard.bind(this));
    document.getElementById('settingsBtn')?.addEventListener('click', this.handleOpenSettings.bind(this));

    // Settings modal
    document.getElementById('closeSettings')?.addEventListener('click', this.handleCloseSettings.bind(this));
    document.getElementById('saveSettings')?.addEventListener('click', this.handleSaveSettings.bind(this));
    document.getElementById('resetSettings')?.addEventListener('click', this.handleResetSettings.bind(this));

    // Listen for background script messages
    chrome.runtime.onMessage.addListener((message: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
      this.handleMessage(message, sender, sendResponse);

      // Handle auth completion from background script
      if (message.type === 'AUTH_COMPLETED') {
        console.log('Auth completed message received in popup');
        // Auth state will be updated via the listener we set up
      }
    });
  }

  private async loadState(): Promise<void> {
    try {
      // Wait for API to be available
      const checkAPI = () => {
        if ((globalThis as any).DemoFlowAPI) {
          this.api = (globalThis as any).DemoFlowAPI;
          this.initializeWithAPI();
        } else {
          setTimeout(checkAPI, 100);
        }
      };
      checkAPI();
    } catch (error) {
      console.error('Failed to load popup state:', error);
      this.updateUI();
    }
  }

  private async initializeWithAPI(): Promise<void> {
    try {
      await this.api.initialize();

      this.authState = this.api.getAuthState();

      // Set up auth state listener
      this.api.addListener((newState: any) => {
        this.authState = newState;
        this.updateUI();
      });

      // Get current recording state
      const response = await chrome.runtime.sendMessage({ type: 'GET_RECORDING_STATE' });
      if (response.success) {
        this.recordingState = response.data;
      }

      // Load recent demos if authenticated
      if (this.authState?.isAuthenticated) {
        await this.loadRecentDemos();
      }

      // Update UI
      this.updateUI();
    } catch (error) {
      console.error('Failed to initialize popup with API:', error);
      this.updateUI();
    }
  }

  private handleMessage(message: MessageData, _sender: chrome.runtime.MessageSender, _sendResponse: (response: any) => void): void {
    switch (message.type) {
      case 'STATE_UPDATE':
        this.recordingState = message.data;
        this.updateUI();
        break;
    }
  }

  private async handleConnect(): Promise<void> {
    const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
    const originalText = connectBtn?.textContent || 'Sign In';

    try {
      if (!this.api) {
        this.showError('API not initialized');
        return;
      }

      if (connectBtn) {
        connectBtn.disabled = true;
        connectBtn.textContent = 'Opening login...';
      }

      console.log('Starting authentication flow');
      await this.api.triggerAuthFlow();
      console.log('Authentication flow completed');
      this.showSuccess('Successfully connected!');

    } catch (error) {
      console.error('Authentication failed:', error);
      const errorMsg = (error as Error).message;

      if (errorMsg.includes('cancelled')) {
        this.showError('Login was cancelled');
      } else if (errorMsg.includes('timeout')) {
        this.showError('Login timed out. Please try again.');
      } else {
        this.showError(`Failed to connect: ${errorMsg}`);
      }
    } finally {
      if (connectBtn) {
        connectBtn.disabled = false;
        connectBtn.textContent = originalText;
      }
    }
  }


  private async handleRecord(): Promise<void> {
    if (this.recordingState?.isRecording) {
      return;
    }

    // Check authentication first
    if (!this.authState?.isAuthenticated) {
      this.showError('Please connect your account first');
      return;
    }

    try {
      const titleInput = document.getElementById('demoTitle') as HTMLInputElement;
      const descriptionInput = document.getElementById('demoDescription') as HTMLTextAreaElement;

      const title = titleInput?.value.trim() || '';
      const description = descriptionInput?.value.trim() || '';

      if (!title) {
        this.showError('Please enter a demo title');
        return;
      }

      const response = await chrome.runtime.sendMessage({
        type: 'START_RECORDING',
        data: { title, description }
      });

      if (response.success) {
        this.startTime = Date.now();
        this.startTimer();
        this.showSuccess('Recording started!');
      } else {
        this.showError(response.error || 'Failed to start recording');
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.showError(`Failed to start recording: ${(error as Error).message}`);
    }
  }

  private async handlePause(): Promise<void> {
    try {
      const action = this.recordingState?.isPaused ? 'RESUME_RECORDING' : 'PAUSE_RECORDING';
      const response = await chrome.runtime.sendMessage({ type: action });

      if (response.success) {
        if (this.recordingState?.isPaused) {
          this.startTimer();
          this.showSuccess('Recording resumed');
        } else {
          this.stopTimer();
          this.showSuccess('Recording paused');
        }
      }
    } catch (error) {
      console.error('Failed to toggle pause:', error);
      this.showError('Failed to toggle pause');
    }
  }

  private async handleStop(): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'STOP_RECORDING' });

      if (response.success) {
        this.stopTimer();
        this.clearDemoInputs();
        this.showSuccess('Demo saved successfully!');
        await this.loadRecentDemos();
      } else {
        this.showError('Failed to save demo');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.showError('Failed to stop recording');
    }
  }

  private async handleAddAnnotation(): Promise<void> {
    const annotation = prompt('Enter annotation text:');
    if (annotation) {
      try {
        await chrome.runtime.sendMessage({
          type: 'ADD_STEP',
          data: {
            type: 'annotation',
            annotations: { text: annotation },
            element: { type: 'annotation' }
          }
        });
        this.showSuccess('Annotation added');
      } catch (error) {
        console.error('Failed to add annotation:', error);
        this.showError('Failed to add annotation');
      }
    }
  }

  private async handleAddPause(): Promise<void> {
    try {
      await chrome.runtime.sendMessage({
        type: 'ADD_STEP',
        data: {
          type: 'pause',
          element: { type: 'pause', duration: 2000 },
          annotations: { text: 'Pause for 2 seconds' }
        }
      });
      this.showSuccess('Pause added');
    } catch (error) {
      console.error('Failed to add pause:', error);
      this.showError('Failed to add pause');
    }
  }

  private async handleOpenDashboard(): Promise<void> {
    const dashboardUrl = 'http://localhost:3000/dashboard';
    chrome.tabs.create({ url: dashboardUrl });
  }

  private handleOpenSettings(): void {
    const modal = document.getElementById('settingsModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  private handleCloseSettings(): void {
    const modal = document.getElementById('settingsModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
  }

  private async handleSaveSettings(): Promise<void> {
    const apiEndpointInput = document.getElementById('apiEndpoint') as HTMLInputElement;
    const autoSaveInput = document.getElementById('autoSave') as HTMLInputElement;
    const showHintsInput = document.getElementById('showHints') as HTMLInputElement;

    const apiEndpoint = apiEndpointInput?.value || 'http://localhost:3000';
    const autoSave = autoSaveInput?.checked || true;
    const showHints = showHintsInput?.checked || true;

    await chrome.storage.local.set({
      settings: { apiEndpoint, autoSave, showHints }
    });

    this.handleCloseSettings();
    this.showSuccess('Settings saved');
  }

  private async handleResetSettings(): Promise<void> {
    const apiEndpointInput = document.getElementById('apiEndpoint') as HTMLInputElement;
    const autoSaveInput = document.getElementById('autoSave') as HTMLInputElement;
    const showHintsInput = document.getElementById('showHints') as HTMLInputElement;

    if (apiEndpointInput) apiEndpointInput.value = 'http://localhost:3000';
    if (autoSaveInput) autoSaveInput.checked = true;
    if (showHintsInput) showHintsInput.checked = true;

    await this.handleSaveSettings();
  }

  private updateUI(): void {
    const authSection = document.getElementById('authSection') as HTMLElement;
    const recordingSection = document.getElementById('recordingSection') as HTMLElement;
    const statusIndicator = document.getElementById('statusIndicator') as HTMLElement;
    const statusText = document.getElementById('statusText') as HTMLElement;

    // Update authentication state
    if (this.authState?.isAuthenticated) {
      if (authSection) authSection.style.display = 'none';
      if (recordingSection) recordingSection.style.display = 'block';
    } else {
      if (authSection) authSection.style.display = 'block';
      if (recordingSection) recordingSection.style.display = 'none';
    }

    // Update recording state
    if (this.recordingState?.isRecording) {
      this.updateRecordingUI();
    } else {
      this.updateIdleUI();
    }

    // Update status indicator
    if (statusIndicator) {
      statusIndicator.className = 'status-indicator';
      if (this.recordingState?.isRecording) {
        if (this.recordingState.isPaused) {
          statusIndicator.classList.add('paused');
          if (statusText) statusText.textContent = 'Paused';
        } else {
          statusIndicator.classList.add('recording');
          if (statusText) statusText.textContent = 'Recording';
        }
      } else {
        if (statusText) statusText.textContent = 'Ready';
      }
    }
  }

  private updateRecordingUI(): void {
    const demoInfo = document.getElementById('demoInfo') as HTMLElement;
    const currentDemo = document.getElementById('currentDemo') as HTMLElement;
    const recordBtn = document.getElementById('recordBtn') as HTMLElement;
    const pauseBtn = document.getElementById('pauseBtn') as HTMLElement;
    const stopBtn = document.getElementById('stopBtn') as HTMLElement;
    const quickActions = document.getElementById('quickActions') as HTMLElement;

    if (demoInfo) demoInfo.style.display = 'none';
    if (currentDemo) currentDemo.style.display = 'block';
    if (recordBtn) recordBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'inline-flex';
    if (quickActions) quickActions.style.display = 'flex';

    // Update pause button text
    if (pauseBtn) {
      const pauseText = pauseBtn.querySelector('.btn-text') as HTMLElement;
      const pauseIcon = pauseBtn.querySelector('.btn-icon') as HTMLElement;

      if (this.recordingState?.isPaused) {
        if (pauseText) pauseText.textContent = 'Resume';
        if (pauseIcon) pauseIcon.textContent = '▶';
      } else {
        if (pauseText) pauseText.textContent = 'Pause';
        if (pauseIcon) pauseIcon.textContent = '⏸';
      }
    }

    // Update step count
    const stepCount = this.recordingState?.steps?.length || 0;
    const stepCountEl = document.getElementById('stepCount') as HTMLElement;
    if (stepCountEl) {
      stepCountEl.textContent = `${stepCount} steps`;
    }
  }

  private updateIdleUI(): void {
    const demoInfo = document.getElementById('demoInfo') as HTMLElement;
    const currentDemo = document.getElementById('currentDemo') as HTMLElement;
    const recordBtn = document.getElementById('recordBtn') as HTMLElement;
    const pauseBtn = document.getElementById('pauseBtn') as HTMLElement;
    const stopBtn = document.getElementById('stopBtn') as HTMLElement;
    const quickActions = document.getElementById('quickActions') as HTMLElement;

    if (demoInfo) demoInfo.style.display = 'block';
    if (currentDemo) currentDemo.style.display = 'none';
    if (recordBtn) recordBtn.style.display = 'inline-flex';
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    if (quickActions) quickActions.style.display = 'none';
  }

  private async loadRecentDemos(): Promise<void> {
    try {
      // This would fetch from your API
      // For now, show empty state
      const demoList = document.getElementById('demoList') as HTMLElement;
      if (demoList) {
        demoList.innerHTML = `
          <div class="empty-state">
            <p>No demos yet. Start recording to create your first demo!</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Failed to load recent demos:', error);
    }
  }

  private startTimer(): void {
    if (this.timer) return;

    this.timer = setInterval(() => {
      if (this.startTime) {
        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const durationEl = document.getElementById('duration') as HTMLElement;
        if (durationEl) {
          durationEl.textContent = timeString;
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private clearDemoInputs(): void {
    const titleInput = document.getElementById('demoTitle') as HTMLInputElement;
    const descriptionInput = document.getElementById('demoDescription') as HTMLTextAreaElement;

    if (titleInput) titleInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
  }


  private showSuccess(message: string): void {
    // Simple success notification
    console.log('Success:', message);
    // TODO: Implement toast notifications
  }

  private showError(message: string): void {
    // Simple error notification
    console.error('Error:', message);
    // TODO: Implement toast notifications
    alert(message); // Temporary
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DemoFlowPopup();
});
