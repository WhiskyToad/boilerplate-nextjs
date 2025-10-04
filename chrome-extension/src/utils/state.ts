// DemoFlow Recording State Management
// Manages the current recording state across the extension

interface Step {
  id?: string;
  sequence_order: number;
  step_type: string;
  element_data: any;
  annotations?: any;
  interactions?: any;
  timing_data?: {
    timestamp: number;
    url?: string;
    title?: string;
  };
  timestamp?: number;
}

interface RecordingStateData {
  isRecording: boolean;
  isPaused: boolean;
  demoId: string | null;
  startTabId: number | null;
  startUrl: string | null;
  startTime: number | null;
  steps: Step[];
  currentStep: number;
}

interface StartRecordingData {
  demoId: string;
  startTabId: number;
  startUrl: string;
  steps?: Step[];
}

export class RecordingState {
  private state: RecordingStateData;

  constructor() {
    this.state = this.getDefaultState();
  }

  public getState(): RecordingStateData {
    return { ...this.state };
  }

  public startRecording(data: StartRecordingData): void {
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

  public stopRecording(): void {
    this.state = this.getDefaultState();
  }

  public pauseRecording(): void {
    if (this.state.isRecording) {
      this.state.isPaused = true;
    }
  }

  public resumeRecording(): void {
    if (this.state.isRecording) {
      this.state.isPaused = false;
    }
  }

  public addStep(step: Omit<Step, 'id' | 'timestamp'>): void {
    if (this.state.isRecording && !this.state.isPaused) {
      this.state.steps.push({
        ...step,
        id: this.generateStepId(),
        timestamp: Date.now(),
      });
      this.state.currentStep = this.state.steps.length - 1;
    }
  }

  public updateStep(stepIndex: number, updates: Partial<Step>): void {
    if (stepIndex >= 0 && stepIndex < this.state.steps.length) {
      this.state.steps[stepIndex] = {
        ...this.state.steps[stepIndex],
        ...updates,
      };
    }
  }

  public removeStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.state.steps.length) {
      this.state.steps.splice(stepIndex, 1);
      
      // Update sequence orders
      this.state.steps.forEach((step, index) => {
        step.sequence_order = index;
      });
      
      // Adjust current step if necessary
      if (this.state.currentStep >= this.state.steps.length) {
        this.state.currentStep = Math.max(0, this.state.steps.length - 1);
      }
    }
  }

  public getDuration(): number {
    if (!this.state.startTime) return 0;
    return Date.now() - this.state.startTime;
  }

  public getFormattedDuration(): string {
    const duration = this.getDuration();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private generateStepId(): string {
    return crypto.randomUUID();
  }

  // Serialization for storage
  public serialize(): string {
    return JSON.stringify(this.state);
  }

  public deserialize(data: string): void {
    try {
      this.state = JSON.parse(data);
    } catch (error) {
      console.error('Failed to deserialize state:', error);
      this.state = this.getDefaultState();
    }
  }

  private getDefaultState(): RecordingStateData {
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

  // Validation helpers
  public isValidForRecording(): boolean {
    return !this.state.isRecording;
  }

  public isValidForStop(): boolean {
    return this.state.isRecording;
  }

  public isValidForPause(): boolean {
    return this.state.isRecording && !this.state.isPaused;
  }

  public isValidForResume(): boolean {
    return this.state.isRecording && this.state.isPaused;
  }

  // Statistics
  public getStepCount(): number {
    return this.state.steps.length;
  }

  public getInteractionCount(): number {
    return this.state.steps.filter(step => 
      ['click', 'input', 'change', 'submit'].includes(step.step_type)
    ).length;
  }

  public getNavigationCount(): number {
    return this.state.steps.filter(step => 
      step.step_type === 'navigation'
    ).length;
  }

  public getUniqueUrls(): string[] {
    const urls = new Set<string>();
    this.state.steps.forEach(step => {
      if (step.timing_data?.url) {
        urls.add(step.timing_data.url);
      }
    });
    return Array.from(urls);
  }

  // Export for analysis
  public exportSteps(): Omit<Step, 'id' | 'timestamp'>[] {
    return this.state.steps.map(step => ({
      sequence_order: step.sequence_order,
      step_type: step.step_type,
      element_data: step.element_data,
      annotations: step.annotations,
      interactions: step.interactions,
      timing_data: step.timing_data || { timestamp: 0 },
    }));
  }

  // Import steps (for resuming interrupted recordings)
  public importSteps(steps: Omit<Step, 'id' | 'timestamp'>[]): void {
    this.state.steps = steps.map((step, index) => ({
      ...step,
      id: this.generateStepId(),
      sequence_order: index,
    }));
    this.state.currentStep = Math.max(0, this.state.steps.length - 1);
  }
}