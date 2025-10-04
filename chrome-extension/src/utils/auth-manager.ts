// DemoFlow Authentication Manager
// Handles token validation, refresh, and authentication state

export interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
  };
  expiresAt?: number; // Token expiry timestamp
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthData['user'] | null;
  token: string | null;
  needsReauth: boolean;
}

export class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    needsReauth: false
  };
  private listeners: Set<(state: AuthState) => void> = new Set();
  private baseUrl: string = 'http://localhost:3000';

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  constructor() {
    this.loadAuthState();
  }

  // Load authentication state from storage
  private async loadAuthState(): Promise<void> {
    try {
      const data = await chrome.storage.local.get(['authToken', 'user', 'tokenExpiresAt']);
      
      if (data.authToken && data.user) {
        const expiresAt = data.tokenExpiresAt || 0;
        const now = Date.now();
        
        if (expiresAt > now) {
          // Token is still valid
          this.authState = {
            isAuthenticated: true,
            user: data.user,
            token: data.authToken,
            needsReauth: false
          };
          console.log('Loaded valid auth state for user:', data.user.email);
        } else {
          // Token has expired
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

  // Validate current token with server
  async validateToken(): Promise<boolean> {
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
        await this.handleTokenExpiry();
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      await this.handleTokenExpiry();
      return false;
    }
  }

  // Handle token expiry
  private async handleTokenExpiry(): Promise<void> {
    console.log('Handling token expiry - clearing auth state');
    await this.clearAuthState();
    this.authState.needsReauth = true;
    this.notifyListeners();
  }

  // Set authentication data
  async setAuthData(authData: AuthData): Promise<void> {
    try {
      // Calculate expiry time (default to 1 hour from now if not provided)
      const expiresAt = authData.expiresAt || (Date.now() + 60 * 60 * 1000);
      
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

  // Clear authentication state
  async clearAuthState(): Promise<void> {
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

  // Get current authentication state
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Get valid token (validates before returning)
  async getValidToken(): Promise<string | null> {
    if (!this.authState.token) {
      return null;
    }

    // Check if token is close to expiry (within 5 minutes)
    const data = await chrome.storage.local.get(['tokenExpiresAt']);
    const expiresAt = data.tokenExpiresAt || 0;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (expiresAt - now < fiveMinutes) {
      console.log('Token is close to expiry, validating with server');
      const isValid = await this.validateToken();
      if (!isValid) {
        return null;
      }
    }

    return this.authState.token;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && !!this.authState.token;
  }

  // Check if re-authentication is needed
  needsReauth(): boolean {
    return this.authState.needsReauth || !this.isAuthenticated();
  }

  // Trigger authentication flow
  async triggerAuthFlow(): Promise<void> {
    console.log('Triggering authentication flow');
    
    // Open auth tab
    const authUrl = `${this.baseUrl}/login?extension=true&redirect=${encodeURIComponent('/auth-callback')}`;
    
    return new Promise((resolve, reject) => {
      chrome.tabs.create({ url: authUrl }, (tab) => {
        if (!tab.id) {
          reject(new Error('Failed to create auth tab'));
          return;
        }

        console.log('Auth tab created:', tab.id);
        
        // Set up timeout
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error('Authentication timed out'));
        }, 120000); // 2 minutes timeout

        // Set up auth completion listener
        const authCompleteListener = (authData: AuthData) => {
          cleanup();
          this.setAuthData(authData).then(resolve).catch(reject);
        };

        // Set up cleanup function
        const cleanup = () => {
          clearTimeout(timeout);
          this.removeAuthListener(authCompleteListener);
          try {
            chrome.tabs.remove(tab.id!);
          } catch (error) {
            // Tab might already be closed
          }
        };

        // Add listener for auth completion
        this.addAuthListener(authCompleteListener);

        // Auto-cleanup after timeout
        setTimeout(cleanup, 120000);
      });
    });
  }

  // Add authentication state listener
  addListener(listener: (state: AuthState) => void): void {
    this.listeners.add(listener);
  }

  // Remove authentication state listener
  removeListener(listener: (state: AuthState) => void): void {
    this.listeners.delete(listener);
  }

  // Add one-time auth completion listener
  private authCompletionListeners: Set<(authData: AuthData) => void> = new Set();

  addAuthListener(listener: (authData: AuthData) => void): void {
    this.authCompletionListeners.add(listener);
  }

  removeAuthListener(listener: (authData: AuthData) => void): void {
    this.authCompletionListeners.delete(listener);
  }

  // Notify auth completion listeners
  notifyAuthCompletion(authData: AuthData): void {
    this.authCompletionListeners.forEach(listener => {
      try {
        listener(authData);
      } catch (error) {
        console.error('Error in auth completion listener:', error);
      }
    });
    this.authCompletionListeners.clear();
  }

  // Notify state listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getAuthState());
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    });
  }

  // Initialize auth manager (call this on extension startup)
  async initialize(): Promise<void> {
    await this.loadAuthState();
    console.log('Auth manager initialized:', this.getAuthState());
  }
}