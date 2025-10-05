// Auth Flow Manager
// Handles OAuth authentication flow

export interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
  };
  expiresAt?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthData['user'] | null;
  token: string | null;
  needsReauth: boolean;
}

export class AuthFlowManager {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    needsReauth: false
  };
  private listeners: Set<(state: AuthState) => void> = new Set();
  private authCompletionListeners: Set<(authData: AuthData) => void> = new Set();
  private authInProgress: boolean = false;

  private config: any;
  private logger: any;
  private errorMessages: any;
  private secureStorage: any;

  constructor(config: any, logger: any, errorMessages: any, secureStorage: any) {
    this.config = config;
    this.logger = logger;
    this.errorMessages = errorMessages;
    this.secureStorage = secureStorage;
  }

  async initialize(): Promise<void> {
    await this.loadAuthState();
    this.logger.info('Auth flow initialized', this.getAuthState());
  }

  async loadAuthState(): Promise<void> {
    try {
      const authData = await this.secureStorage.getAuthData();

      if (authData) {
        const isValid = await this.secureStorage.isTokenValid();

        if (isValid) {
          this.authState = {
            isAuthenticated: true,
            user: authData.user,
            token: authData.token,
            needsReauth: false
          };
          this.logger.info('Loaded valid auth state for user:', authData.user.email);
        } else {
          this.logger.info('Stored token has expired, needs re-authentication');
          this.authState.needsReauth = true;
          await this.clearAuthState();
        }
      } else {
        this.logger.debug('No stored authentication found');
        this.authState.needsReauth = true;
      }
    } catch (error) {
      this.logger.error('Error loading auth state', error as Error);
      this.authState.needsReauth = true;
    }

    this.notifyListeners();
  }

  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      this.logger.error('Failed to decode JWT', error as Error);
      return null;
    }
  }

  async setAuthData(authData: AuthData): Promise<void> {
    try {
      let expiresAt = authData.expiresAt || 0;

      if (!expiresAt && authData.token) {
        const decoded = this.decodeJWT(authData.token);
        if (decoded && decoded.exp) {
          expiresAt = decoded.exp * 1000;
          this.logger.debug('Decoded JWT expiration:', new Date(expiresAt).toISOString());
        } else {
          expiresAt = Date.now() + 60 * 60 * 1000;
          this.logger.warn('Could not decode JWT, using 1 hour expiration');
        }
      }

      await this.secureStorage.setAuthData({
        token: authData.token,
        user: authData.user,
        expiresAt
      });

      this.authState = {
        isAuthenticated: true,
        user: authData.user,
        token: authData.token,
        needsReauth: false
      };

      this.logger.info('Auth data set successfully for user:', authData.user.email);
      this.notifyListeners();
    } catch (error) {
      this.logger.error('Error setting auth data', error as Error);
      throw error;
    }
  }

  async clearAuthState(): Promise<void> {
    try {
      await this.secureStorage.clearAuthData();

      this.authState = {
        isAuthenticated: false,
        user: null,
        token: null,
        needsReauth: true
      };

      this.logger.info('Auth state cleared');
      this.notifyListeners();
    } catch (error) {
      this.logger.error('Error clearing auth state', error as Error);
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && !!this.authState.token;
  }

  needsReauth(): boolean {
    return this.authState.needsReauth || !this.isAuthenticated();
  }

  async getValidToken(): Promise<string | null> {
    if (!this.authState.token) {
      return null;
    }

    const isValid = await this.secureStorage.isTokenValid();
    if (!isValid) {
      this.logger.info('Token has expired');
      await this.clearAuthState();
      return null;
    }

    const authData = await this.secureStorage.getAuthData();
    if (authData) {
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (authData.expiresAt - now < fiveMinutes) {
        this.logger.debug('Token is close to expiry, validating with server');
        // Could add server validation here if needed
      }
    }

    return this.authState.token;
  }

  async triggerAuthFlow(): Promise<void> {
    if (this.authInProgress) {
      throw new Error(this.errorMessages.AUTH_IN_PROGRESS);
    }

    this.authInProgress = true;
    this.logger.info('Triggering authentication flow');

    try {
      const csrfToken = await this.secureStorage.generateCSRFToken();
      const authUrl = `${this.config.AUTH_CALLBACK_URL}?state=${csrfToken}`;

      return await new Promise((resolve, reject) => {
        chrome.tabs.create({ url: authUrl }, (tab) => {
          if (!tab.id) {
            reject(new Error(this.errorMessages.AUTH_FAILED));
            return;
          }

          this.logger.debug('Auth tab created:', tab.id);
          const tabId = tab.id;

          const timeout = setTimeout(() => {
            cleanup(true);
            reject(new Error(this.errorMessages.AUTH_TIMEOUT));
          }, this.config.AUTH_TIMEOUT_MS);

          const tabRemovedListener = (closedTabId: number) => {
            if (closedTabId === tabId) {
              cleanup(false);
              reject(new Error(this.errorMessages.AUTH_CANCELLED));
            }
          };

          const authCompleteListener = (authData: AuthData) => {
            cleanup(false);
            this.setAuthData(authData).then(() => {
              this.logger.info('Authentication flow completed successfully');
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
                this.logger.debug('Failed to close auth tab:', error);
              }
            }
          };

          this.addAuthListener(authCompleteListener);
          chrome.tabs.onRemoved.addListener(tabRemovedListener);
        });
      });
    } finally {
      this.authInProgress = false;
    }
  }

  // Listener management
  addListener(listener: (state: AuthState) => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: (state: AuthState) => void): void {
    this.listeners.delete(listener);
  }

  addAuthListener(listener: (authData: AuthData) => void): void {
    this.authCompletionListeners.add(listener);
  }

  removeAuthListener(listener: (authData: AuthData) => void): void {
    this.authCompletionListeners.delete(listener);
  }

  notifyAuthCompletion(authData: AuthData): void {
    this.authCompletionListeners.forEach(listener => {
      try {
        listener(authData);
      } catch (error) {
        this.logger.error('Error in auth completion listener', error as Error);
      }
    });
    this.authCompletionListeners.clear();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getAuthState());
      } catch (error) {
        this.logger.error('Error in auth state listener', error as Error);
      }
    });
  }
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).AuthFlowManager = AuthFlowManager;
}
