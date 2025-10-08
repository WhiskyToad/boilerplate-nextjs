// Background API
// Creates DemoFlowAPI instance for background service worker using ES6 imports

import { CONFIG } from '../utils/config.js';
import { BackgroundLogger } from '../utils/logger.js';
import { ERROR_MESSAGES } from '../utils/errors.js';
import { SecureStorage } from '../utils/secure-storage.js';
import { AuthFlowManager } from '../utils/auth-flow.js';
import { APIClient } from '../utils/api-client.js';

export class BackgroundAPI {
  private authManager: any;
  private apiClient: any;

  constructor() {
    this.authManager = new AuthFlowManager(CONFIG, BackgroundLogger, ERROR_MESSAGES, SecureStorage);
    this.apiClient = new APIClient(CONFIG, BackgroundLogger, ERROR_MESSAGES, this.authManager);
  }

  // Initialize
  async initialize(): Promise<void> {
    await this.authManager.initialize?.();
    if (!this.authManager.initialize) {
      await this.authManager.loadAuthState();
    }
    BackgroundLogger.info('Background API initialized');
  }

  // Auth methods
  getAuthState(): any {
    return this.authManager.getAuthState();
  }

  isAuthenticated(): boolean {
    return this.authManager.isAuthenticated();
  }

  needsReauth(): boolean {
    return this.authManager.needsReauth();
  }

  async getValidToken(): Promise<string | null> {
    return this.authManager.getValidToken();
  }

  async triggerAuthFlow(): Promise<void> {
    return this.authManager.triggerAuthFlow();
  }

  async setAuthData(authData: any): Promise<void> {
    await this.authManager.setAuthData(authData);
  }

  async clearAuthState(): Promise<void> {
    await this.authManager.clearAuthState();
  }

  addListener(listener: (state: any) => void): void {
    this.authManager.addListener(listener);
  }

  removeListener(listener: (state: any) => void): void {
    this.authManager.removeListener(listener);
  }

  addAuthListener(listener: (authData: any) => void): void {
    this.authManager.addAuthListener(listener);
  }

  removeAuthListener(listener: (authData: any) => void): void {
    this.authManager.removeAuthListener(listener);
  }

  notifyAuthCompletion(authData: any): void {
    this.authManager.notifyAuthCompletion(authData);
  }

  // API methods
  getBaseUrl(): string {
    return this.apiClient.getBaseUrl();
  }

  async request(endpoint: string, options?: any): Promise<any> {
    return this.apiClient.request(endpoint, options);
  }

  async createDemo(demoData: any): Promise<any> {
    return this.apiClient.createDemo(demoData);
  }

  async saveSteps(demoId: string, steps: any[]): Promise<any> {
    return this.apiClient.saveSteps(demoId, steps);
  }

  async updateDemo(demoId: string, updates: any): Promise<any> {
    return this.apiClient.updateDemo(demoId, updates);
  }

  async getDemo(demoId: string): Promise<any> {
    return this.apiClient.getDemo(demoId);
  }

  async listDemos(params: Record<string, string> = {}): Promise<any> {
    return this.apiClient.listDemos(params);
  }

  async uploadScreenshot(base64Data: string): Promise<any> {
    return this.apiClient.uploadScreenshot(base64Data);
  }
}
