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
        this.logger.error('Response status:', response.status);
        this.logger.error('Response statusText:', response.statusText);
        throw new Error(responseData.error || this.errorMessages.SERVER_ERROR);
      }

      this.logger.debug('API Success Response:', responseData);
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
    this.logger.debug('Request URL:', `/api/demos/${demoId}/steps`);
    this.logger.debug('First step sample:', stepsArray[0]);

    try {
      const response = await this.request(`/api/demos/${demoId}/steps`, {
        method: 'POST',
        body: JSON.stringify({
          steps: stepsArray,
          replace_existing: true,
        }),
      });

      this.logger.debug('saveSteps response received');
      this.logger.debug('response.success:', response.success);
      this.logger.debug('response.data:', response.data);
      this.logger.debug('response.data?.steps:', response.data?.steps);

      if (response.success && response.data?.steps) {
        this.logger.info(`✅ Steps saved successfully: ${response.data.steps.length} steps`);
        return response.data.steps;
      }

      this.logger.error('Response validation failed! Full response:', JSON.stringify(response, null, 2));
      throw new Error('Invalid response format from save steps API');
    } catch (error) {
      this.logger.error('Exception in saveSteps:', error);
      this.logger.error('Error message:', error instanceof Error ? error.message : String(error));
      this.logger.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      throw error;
    }
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

  async getDemo(demoId: string): Promise<any> {
    const response = await this.request(`/api/demos/${demoId}`);

    if (response.success) {
      return response.data?.demo ?? response.data;
    }

    throw new Error(response.error || this.errorMessages.SERVER_ERROR);
  }

  async listDemos(params: Record<string, string> = {}): Promise<any> {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/demos?${queryString}` : '/api/demos';

    const response = await this.request(endpoint);

    if (response.success) {
      return response.data?.demos ?? response.data;
    }

    throw new Error(response.error || this.errorMessages.SERVER_ERROR);
  }

  async uploadScreenshot(base64Data: string): Promise<any> {
    try {
      const response = await fetch(base64Data);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, `screenshot-${Date.now()}.png`);

      const token = await this.authManager.getValidToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const uploadResponse = await fetch(`${this.baseUrl}/api/upload/image`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await uploadResponse.json().catch(() => ({}));

      if (!uploadResponse.ok) {
        this.logger.error('Screenshot upload failed', result);
        throw new Error(result.error || this.errorMessages.SCREENSHOT_UPLOAD_FAILED);
      }

      return result.data ?? result;
    } catch (error) {
      this.logger.error('Screenshot upload error', error as Error);
      throw error instanceof Error ? error : new Error(this.errorMessages.SCREENSHOT_UPLOAD_FAILED);
    }
  }
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).APIClient = APIClient;
}
