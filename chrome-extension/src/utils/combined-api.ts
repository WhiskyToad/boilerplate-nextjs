// DemoFlow Combined API and Auth Manager
// Handles authentication and API communication without ES6 imports

interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
  };
  expiresAt?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthData['user'] | null;
  token: string | null;
  needsReauth: boolean;
}

interface APIResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
}

interface APIDemoData {
  title: string;
  description?: string;
  settings?: any;
}

interface APIStepData {
  sequence_order: number;
  step_type: string;
  element_data: any;
  annotations?: any;
  interactions?: any;
  timing_data?: any;
}

class DemoFlowCombinedAPI {
  private baseUrl: string = 'http://localhost:3000';
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    needsReauth: false
  };
  private listeners: Set<(state: AuthState) => void> = new Set();
  private authCompletionListeners: Set<(authData: AuthData) => void> = new Set();

  constructor() {
    this.loadConfig();
    this.loadAuthState();
  }

  // Configuration
  public async loadConfig(): Promise<void> {
    try {
      const data = await chrome.storage.local.get(['settings']);
      if (data.settings?.apiEndpoint) {
        this.baseUrl = data.settings.apiEndpoint;
      }
    } catch (error) {
      console.warn('Failed to load API config:', error);
    }
  }

  // Authentication State Management
  private async loadAuthState(): Promise<void> {
    try {
      const data = await chrome.storage.local.get(['authToken', 'user', 'tokenExpiresAt']);
      
      if (data.authToken && data.user) {
        const expiresAt = data.tokenExpiresAt || 0;
        const now = Date.now();
        
        if (expiresAt > now) {
          this.authState = {
            isAuthenticated: true,
            user: data.user,
            token: data.authToken,
            needsReauth: false
          };
          console.log('Loaded valid auth state for user:', data.user.email);
        } else {
          console.log('Stored token has expired, needs re-authentication');
          this.authState.needsReauth = true;
          await this.clearAuthState();
        }
      } else {
        console.log('No stored authentication found');
        this.authState.needsReauth = true;
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      this.authState.needsReauth = true;
    }
    
    this.notifyListeners();
  }

  // Decode JWT token to get expiration
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  public async setAuthData(authData: AuthData): Promise<void> {
    try {
      // Decode JWT to get real expiration
      let expiresAt = authData.expiresAt || 0;

      if (!expiresAt && authData.token) {
        const decoded = this.decodeJWT(authData.token);
        if (decoded && decoded.exp) {
          // JWT exp is in seconds, convert to milliseconds
          expiresAt = decoded.exp * 1000;
          console.log('Decoded JWT expiration:', new Date(expiresAt).toISOString());
        } else {
          // Fallback to 1 hour
          expiresAt = Date.now() + 60 * 60 * 1000;
          console.warn('Could not decode JWT, using 1 hour expiration');
        }
      }

      await chrome.storage.local.set({
        authToken: authData.token,
        user: authData.user,
        tokenExpiresAt: expiresAt
      });

      this.authState = {
        isAuthenticated: true,
        user: authData.user,
        token: authData.token,
        needsReauth: false
      };

      console.log('Auth data set successfully for user:', authData.user.email);
      this.notifyListeners();
    } catch (error) {
      console.error('Error setting auth data:', error);
      throw error;
    }
  }

  public async clearAuthState(): Promise<void> {
    try {
      await chrome.storage.local.remove(['authToken', 'user', 'tokenExpiresAt']);
      
      this.authState = {
        isAuthenticated: false,
        user: null,
        token: null,
        needsReauth: true
      };

      console.log('Auth state cleared');
      this.notifyListeners();
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  }

  public getAuthState(): AuthState {
    return { ...this.authState };
  }

  public isAuthenticated(): boolean {
    return this.authState.isAuthenticated && !!this.authState.token;
  }

  public needsReauth(): boolean {
    return this.authState.needsReauth || !this.isAuthenticated();
  }

  public async getValidToken(): Promise<string | null> {
    if (!this.authState.token) {
      return null;
    }

    const data = await chrome.storage.local.get(['tokenExpiresAt']);
    const expiresAt = data.tokenExpiresAt || 0;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (expiresAt - now < fiveMinutes) {
      console.log('Token is close to expiry, validating with server');
      const isValid = await this.validateTokenWithServer();
      if (!isValid) {
        return null;
      }
    }

    return this.authState.token;
  }

  private async validateTokenWithServer(): Promise<boolean> {
    if (!this.authState.token) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/test-auth`, {
        headers: {
          'Authorization': `Bearer ${this.authState.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Token validation successful');
        return true;
      } else {
        console.log('Token validation failed:', response.status);
        await this.clearAuthState();
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      await this.clearAuthState();
      return false;
    }
  }

  public async triggerAuthFlow(): Promise<void> {
    console.log('Triggering authentication flow');

    const authUrl = `${this.baseUrl}/login?extension=true&redirect=${encodeURIComponent('/auth-callback')}`;

    return new Promise((resolve, reject) => {
      chrome.tabs.create({ url: authUrl }, (tab) => {
        if (!tab.id) {
          reject(new Error('Failed to create auth tab'));
          return;
        }

        console.log('Auth tab created:', tab.id);
        const tabId = tab.id;

        // Set a timeout for the auth flow (3 minutes)
        const timeout = setTimeout(() => {
          cleanup(true);
          reject(new Error('Authentication timed out. Please try again.'));
        }, 180000);

        // Listen for tab closure
        const tabRemovedListener = (closedTabId: number) => {
          if (closedTabId === tabId) {
            cleanup(false);
            reject(new Error('Authentication cancelled'));
          }
        };

        // Listen for auth completion
        const authCompleteListener = (authData: AuthData) => {
          cleanup(false);
          this.setAuthData(authData).then(() => {
            console.log('Authentication flow completed successfully');
            resolve();
          }).catch(reject);
        };

        const cleanup = (closeTab: boolean) => {
          clearTimeout(timeout);
          this.removeAuthListener(authCompleteListener);
          chrome.tabs.onRemoved.removeListener(tabRemovedListener);

          if (closeTab) {
            try {
              chrome.tabs.remove(tabId);
            } catch (error) {
              // Tab might already be closed
            }
          }
        };

        this.addAuthListener(authCompleteListener);
        chrome.tabs.onRemoved.addListener(tabRemovedListener);
      });
    });
  }

  // Event listeners
  public addListener(listener: (state: AuthState) => void): void {
    this.listeners.add(listener);
  }

  public removeListener(listener: (state: AuthState) => void): void {
    this.listeners.delete(listener);
  }

  public addAuthListener(listener: (authData: AuthData) => void): void {
    this.authCompletionListeners.add(listener);
  }

  public removeAuthListener(listener: (authData: AuthData) => void): void {
    this.authCompletionListeners.delete(listener);
  }

  public notifyAuthCompletion(authData: AuthData): void {
    this.authCompletionListeners.forEach(listener => {
      try {
        listener(authData);
      } catch (error) {
        console.error('Error in auth completion listener:', error);
      }
    });
    this.authCompletionListeners.clear();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getAuthState());
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    });
  }

  // API Methods
  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = await this.getValidToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  public async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    if (!this.isAuthenticated()) {
      if (this.needsReauth()) {
        throw new Error('Authentication required - please log in');
      }
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getHeaders();
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        console.log('Received 401, triggering re-authentication');
        await this.clearAuthState();
        throw new Error('Authentication expired - please log in again');
      }
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return responseData;
    } catch (error) {
      console.error('API request failed:', error);
      
      if (error instanceof Error && error.message.includes('Authentication')) {
        await this.clearAuthState();
      }
      
      throw error;
    }
  }

  // Demo Management APIs
  public async createDemo(demoData: APIDemoData): Promise<any> {
    const response = await this.request('/api/demos', {
      method: 'POST',
      body: JSON.stringify(demoData),
    });
    
    // API returns { success: true, data: { demo: {...} } }
    if (response.success && response.data?.demo) {
      return response.data.demo;
    }
    
    throw new Error('Invalid response format from demo creation API');
  }

  public async saveSteps(demoId: string, steps: APIStepData | APIStepData[]): Promise<APIStepData[]> {
    const stepsArray = Array.isArray(steps) ? steps : [steps];
    
    const response = await this.request(`/api/demos/${demoId}/steps`, {
      method: 'POST',
      body: JSON.stringify({
        steps: stepsArray,
        replace_existing: false,
      }),
    });
    
    if (response.success && response.data?.steps) {
      return response.data.steps;
    }
    
    throw new Error('Invalid response format from save steps API');
  }

  public async updateDemo(demoId: string, updates: any): Promise<any> {
    const response = await this.request(`/api/demos/${demoId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    
    if (response.success && response.data?.demo) {
      return response.data.demo;
    }
    
    throw new Error('Invalid response format from update demo API');
  }

  public async initialize(): Promise<void> {
    await this.loadAuthState();
    console.log('Combined API initialized:', this.getAuthState());
  }
}

// Global instance - use globalThis for service worker compatibility
(globalThis as any).DemoFlowAPI = new DemoFlowCombinedAPI();