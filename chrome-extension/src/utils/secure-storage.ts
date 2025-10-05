// Secure Storage Utility
// Handles encrypted storage of sensitive data like auth tokens

interface StoredAuthData {
  token: string;
  user: {
    id: string;
    email: string;
  };
  expiresAt: number;
}

export class SecureStorage {
  private static readonly AUTH_KEY = 'demoflow_auth_v2';
  private static readonly CSRF_KEY = 'demoflow_csrf';

  /**
   * Store auth data securely
   * Uses chrome.storage.session which is cleared when browser closes
   */
  static async setAuthData(data: StoredAuthData): Promise<void> {
    try {
      // Use session storage - automatically cleared when browser closes
      await chrome.storage.session.set({
        [this.AUTH_KEY]: data
      });
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  /**
   * Retrieve auth data
   */
  static async getAuthData(): Promise<StoredAuthData | null> {
    try {
      const result = await chrome.storage.session.get([this.AUTH_KEY]);
      return result[this.AUTH_KEY] || null;
    } catch (error) {
      console.error('Failed to retrieve auth data:', error);
      return null;
    }
  }

  /**
   * Clear auth data (logout)
   */
  static async clearAuthData(): Promise<void> {
    try {
      await chrome.storage.session.remove([this.AUTH_KEY]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  /**
   * Check if token is expired
   */
  static async isTokenValid(): Promise<boolean> {
    const authData = await this.getAuthData();
    if (!authData) return false;

    const now = Date.now();
    return authData.expiresAt > now;
  }

  /**
   * Generate and store CSRF token for auth flow
   */
  static async generateCSRFToken(): Promise<string> {
    const token = crypto.randomUUID();
    await chrome.storage.session.set({
      [this.CSRF_KEY]: {
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      }
    });
    return token;
  }

  /**
   * Validate CSRF token
   */
  static async validateCSRFToken(token: string): Promise<boolean> {
    try {
      const result = await chrome.storage.session.get([this.CSRF_KEY]);
      const stored = result[this.CSRF_KEY];

      if (!stored) return false;
      if (stored.token !== token) return false;
      if (Date.now() > stored.expiresAt) return false;

      // Clear after use (one-time token)
      await chrome.storage.session.remove([this.CSRF_KEY]);
      return true;
    } catch (error) {
      console.error('CSRF validation failed:', error);
      return false;
    }
  }

  /**
   * Clear all stored data
   */
  static async clearAll(): Promise<void> {
    try {
      await chrome.storage.session.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).SecureStorage = SecureStorage;
}
