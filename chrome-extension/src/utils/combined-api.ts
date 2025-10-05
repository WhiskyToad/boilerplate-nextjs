// Combined API - Modular Version
// Thin wrapper that loads and combines all utility modules

// Service Worker Import Declaration
declare function importScripts(...urls: string[]): void;

// Load all utility modules in order (dependencies first)
importScripts('./config.js');
importScripts('./logger.js');
importScripts('./errors.js');
importScripts('./sanitize.js');
importScripts('./secure-storage.js');
importScripts('./auth-flow.js');
importScripts('./api-client.js');

// Get modules from globalThis
const g = globalThis as any;

// Export utilities
const CONFIG = g.CONFIG || (globalThis as any).CONFIG;
const ERROR_MESSAGES = g.ERROR_MESSAGES || (globalThis as any).ERROR_MESSAGES;
const Logger = g.Logger || (globalThis as any).Logger;
const SecureStorage = g.SecureStorage || (globalThis as any).SecureStorage;
const AuthFlowManager = g.AuthFlowManager || (globalThis as any).AuthFlowManager;
const APIClient = g.APIClient || (globalThis as any).APIClient;

// Create loggers
const APILogger = new Logger('API');
const BackgroundLogger = new Logger('Background');
const PopupLogger = new Logger('Popup');
const ContentLogger = new Logger('Content');

// Combined API Facade
class DemoFlowCombinedAPI {
  private authManager: any;
  private apiClient: any;

  constructor() {
    this.authManager = new AuthFlowManager(CONFIG, APILogger, ERROR_MESSAGES, SecureStorage);
    this.apiClient = new APIClient(CONFIG, APILogger, ERROR_MESSAGES, this.authManager);
  }

  // Initialize
  async initialize(): Promise<void> {
    await this.authManager.initialize();
    APILogger.info('Combined API initialized (modular)');
  }

  // Auth methods (delegate to AuthFlowManager)
  getAuthState() {
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

  async setAuthData(authData: any): Promise<void> {
    return this.authManager.setAuthData(authData);
  }

  async clearAuthState(): Promise<void> {
    return this.authManager.clearAuthState();
  }

  async triggerAuthFlow(): Promise<void> {
    return this.authManager.triggerAuthFlow();
  }

  addListener(listener: any): void {
    this.authManager.addListener(listener);
  }

  removeListener(listener: any): void {
    this.authManager.removeListener(listener);
  }

  addAuthListener(listener: any): void {
    this.authManager.addAuthListener(listener);
  }

  removeAuthListener(listener: any): void {
    this.authManager.removeAuthListener(listener);
  }

  notifyAuthCompletion(authData: any): void {
    this.authManager.notifyAuthCompletion(authData);
  }

  // API methods (delegate to APIClient)
  getBaseUrl(): string {
    return this.apiClient.getBaseUrl();
  }

  async request(endpoint: string, options?: any): Promise<any> {
    return this.apiClient.request(endpoint, options);
  }

  async createDemo(demoData: any): Promise<any> {
    return this.apiClient.createDemo(demoData);
  }

  async saveSteps(demoId: string, steps: any): Promise<any> {
    return this.apiClient.saveSteps(demoId, steps);
  }

  async updateDemo(demoId: string, updates: any): Promise<any> {
    return this.apiClient.updateDemo(demoId, updates);
  }
}

// Export to globalThis for service worker compatibility
(globalThis as any).DemoFlowAPI = new DemoFlowCombinedAPI();
(globalThis as any).CONFIG = CONFIG;
(globalThis as any).ERROR_MESSAGES = ERROR_MESSAGES;
(globalThis as any).SecureStorage = SecureStorage;
(globalThis as any).Logger = Logger;
(globalThis as any).BackgroundLogger = BackgroundLogger;
(globalThis as any).PopupLogger = PopupLogger;
(globalThis as any).ContentLogger = ContentLogger;

// Make this file a module to avoid global scope conflicts
export {};
