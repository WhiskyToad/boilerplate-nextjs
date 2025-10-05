// API Client
// Handles HTTP requests to the backend API

export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
}

export interface APIDemoData {
  title: string;
  description?: string;
  settings?: any;
}

export interface APIStepData {
  sequence_order: number;
  step_type: string;
  element_data: any;
  annotations?: any;
  interactions?: any;
  timing_data?: any;
}

export class APIClient {
  private baseUrl: string;
  private config: any;
  private logger: any;
  private errorMessages: any;
  private authManager: any;

  constructor(config: any, logger: any, errorMessages: any, authManager: any) {
    this.baseUrl = config.API_URL;
    this.config = config;
    this.logger = logger;
    this.errorMessages = errorMessages;
    this.authManager = authManager;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = await this.authManager.getValidToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    if (!this.authManager.isAuthenticated()) {
      if (this.authManager.needsReauth()) {
        throw new Error(this.errorMessages.AUTH_REQUIRED);
      }
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getHeaders();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.API_REQUEST_TIMEOUT_MS);

    const requestConfig: RequestInit = {
      headers,
      ...options,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, requestConfig);

      clearTimeout(timeout);

      if (response.status === 401) {
        this.logger.info('Received 401, token expired');
        await this.authManager.clearAuthState();
        throw new Error(this.errorMessages.SESSION_EXPIRED);
      }

      const responseData = await response.json();

      if (!response.ok) {
        this.logger.error('API Error Response:', responseData);
        throw new Error(responseData.error || this.errorMessages.SERVER_ERROR);
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.warn('Request timed out:', endpoint);
        throw new Error(this.errorMessages.REQUEST_TIMEOUT);
      }

      if (error instanceof TypeError) {
        this.logger.error('Network error', error);
        throw new Error(this.errorMessages.NETWORK_ERROR);
      }

      if (error instanceof Error && error.message.includes('expired')) {
        await this.authManager.clearAuthState();
      }

      this.logger.error('API request failed', error as Error);
      throw error;
    }
  }

  async createDemo(demoData: APIDemoData): Promise<any> {
    const response = await this.request('/api/demos', {
      method: 'POST',
      body: JSON.stringify(demoData),
    });

    if (response.success && response.data?.demo) {
      return response.data.demo;
    }

    throw new Error('Invalid response format from demo creation API');
  }

  async saveSteps(demoId: string, steps: APIStepData | APIStepData[]): Promise<APIStepData[]> {
    const stepsArray = Array.isArray(steps) ? steps : [steps];

    this.logger.info(`💾 Saving ${stepsArray.length} steps (replace_existing: true)`);

    const response = await this.request(`/api/demos/${demoId}/steps`, {
      method: 'POST',
      body: JSON.stringify({
        steps: stepsArray,
        replace_existing: true,
      }),
    });

    if (response.success && response.data?.steps) {
      this.logger.debug('Steps saved successfully');
      return response.data.steps;
    }

    throw new Error('Invalid response format from save steps API');
  }

  async updateDemo(demoId: string, updates: any): Promise<any> {
    const response = await this.request(`/api/demos/${demoId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    if (response.success && response.data?.demo) {
      return response.data.demo;
    }

    throw new Error('Invalid response format from update demo API');
  }
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).APIClient = APIClient;
}
