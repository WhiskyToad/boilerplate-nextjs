// DemoFlow API Client for Chrome Extension
// Handles communication with the DemoFlow backend API

interface APIResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
}

interface DemoData {
  title: string;
  description?: string;
  settings?: any;
}

interface DemoUpdateData {
  title?: string;
  description?: string;
  status?: string;
  total_steps?: number;
  estimated_duration?: number;
  settings?: any;
}

interface StepData {
  sequence_order: number;
  step_type: string;
  element_data: any;
  annotations?: any;
  interactions?: any;
  timing_data?: any;
}

interface UploadAssetResponse {
  asset: {
    id: string;
    url: string;
    type: string;
  };
}

export class DemoFlowAPI {
  private baseUrl: string = 'http://localhost:3000';
  private authToken: string | null = null;

  constructor() {
    this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    try {
      const data = await chrome.storage.local.get(['settings', 'authToken']);
      if (data.settings?.apiEndpoint) {
        this.baseUrl = data.settings.apiEndpoint;
      }
      if (data.authToken) {
        this.authToken = data.authToken;
      }
    } catch (error) {
      console.warn('Failed to load API config:', error);
    }
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Demo Management APIs
  public async createDemo(demoData: DemoData): Promise<any> {
    const response = await this.request<{ demo: any }>('/api/demos', {
      method: 'POST',
      body: JSON.stringify(demoData),
    });

    return response.data.demo;
  }

  public async updateDemo(demoId: string, updates: DemoUpdateData): Promise<any> {
    const response = await this.request<{ demo: any }>(`/api/demos/${demoId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    return response.data.demo;
  }

  public async getDemo(demoId: string): Promise<any> {
    const response = await this.request<{ demo: any }>(`/api/demos/${demoId}`);
    return response.data.demo;
  }

  public async getDemos(params: Record<string, string> = {}): Promise<any> {
    const searchParams = new URLSearchParams(params);
    const response = await this.request(`/api/demos?${searchParams}`);
    return response.data;
  }

  public async deleteDemo(demoId: string): Promise<any> {
    const response = await this.request(`/api/demos/${demoId}`, {
      method: 'DELETE',
    });

    return response.data;
  }

  // Demo Steps APIs
  public async saveSteps(demoId: string, steps: StepData | StepData[]): Promise<StepData[]> {
    const response = await this.request<{ steps: StepData[] }>(`/api/demos/${demoId}/steps`, {
      method: 'POST',
      body: JSON.stringify({
        steps: Array.isArray(steps) ? steps : [steps],
        replace_existing: false,
      }),
    });

    return response.data.steps;
  }

  public async saveStepsBulk(demoId: string, steps: StepData[], replaceExisting: boolean = false): Promise<StepData[]> {
    const response = await this.request<{ steps: StepData[] }>(`/api/demos/${demoId}/steps`, {
      method: 'POST',
      body: JSON.stringify({
        steps,
        replace_existing: replaceExisting,
      }),
    });

    return response.data.steps;
  }

  public async getSteps(demoId: string): Promise<StepData[]> {
    const response = await this.request<{ steps: StepData[] }>(`/api/demos/${demoId}/steps`);
    return response.data.steps;
  }

  public async updateStep(demoId: string, stepId: string, updates: Partial<StepData>): Promise<StepData> {
    const response = await this.request<{ step: StepData }>(`/api/demos/${demoId}/steps/${stepId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    return response.data.step;
  }

  public async deleteStep(demoId: string, stepId: string): Promise<any> {
    const response = await this.request(`/api/demos/${demoId}/steps/${stepId}`, {
      method: 'DELETE',
    });

    return response.data;
  }

  // Asset Upload APIs
  public async uploadAsset(demoId: string, file: File, assetType: string, stepId?: string): Promise<UploadAssetResponse['asset']> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', assetType);
    
    if (stepId) {
      formData.append('stepId', stepId);
    }

    const headers: Record<string, string> = {};
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await this.request<UploadAssetResponse>(`/api/demos/${demoId}/assets`, {
      method: 'POST',
      body: formData,
      headers,
    });

    return response.data.asset;
  }

  public async getAssets(demoId: string): Promise<any[]> {
    const response = await this.request<{ assets: any[] }>(`/api/demos/${demoId}/assets`);
    return response.data.assets;
  }

  // Utility methods for extension
  public async captureScreenshot(quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab(null as any, {
        format: 'png',
        quality: quality
      }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        // Convert data URL to blob
        fetch(dataUrl)
          .then(res => res.blob())
          .then(resolve)
          .catch(reject);
      });
    });
  }

  public async saveDOMSnapshot(demoId: string, stepId: string, domData: any): Promise<UploadAssetResponse['asset']> {
    const blob = new Blob([JSON.stringify(domData)], { type: 'application/json' });
    const file = new File([blob], 'dom-snapshot.json', { type: 'application/json' });
    
    return await this.uploadAsset(demoId, file, 'dom_snapshot', stepId);
  }

  public async saveScreenshot(demoId: string, stepId: string): Promise<UploadAssetResponse['asset'] | null> {
    try {
      const screenshotBlob = await this.captureScreenshot();
      const file = new File([screenshotBlob], 'screenshot.png', { type: 'image/png' });
      
      return await this.uploadAsset(demoId, file, 'screenshot', stepId);
    } catch (error) {
      console.warn('Failed to capture screenshot:', error);
      return null;
    }
  }

  // Health check
  public async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Authentication helpers
  public async validateToken(): Promise<boolean> {
    if (!this.authToken) return false;

    try {
      await this.request('/api/user/profile');
      return true;
    } catch (error) {
      console.warn('Token validation failed:', error);
      return false;
    }
  }

  public async logout(): Promise<void> {
    this.authToken = null;
    await chrome.storage.local.remove(['authToken', 'user']);
  }
}