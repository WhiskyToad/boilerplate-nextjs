// Popup API Loader
// Creates DemoFlowAPI instance for popup (no importScripts, loads from globalThis)

const popupApiGlobal = globalThis as any;

// Get utility classes from globalThis (loaded via script tags in HTML)
const CONFIG = popupApiGlobal.CONFIG;
const PopupLogger = popupApiGlobal.PopupLogger;
const ERROR_MESSAGES = popupApiGlobal.ERROR_MESSAGES;
const SecureStorage = popupApiGlobal.SecureStorage;
const AuthFlowManager = popupApiGlobal.AuthFlowManager;
const APIClient = popupApiGlobal.APIClient;

class DemoFlowPopupAPI {
  private authManager: any;
  private apiClient: any;
  private listeners: Array<(state: any) => void> = [];

  constructor() {
    this.authManager = new AuthFlowManager(CONFIG, PopupLogger, ERROR_MESSAGES, SecureStorage);
    this.apiClient = new APIClient(CONFIG, PopupLogger, ERROR_MESSAGES, this.authManager);

    // Setup auth state change listener
    this.authManager.addListener((newState: any) => {
      this.notifyListeners(newState);
    });
  }

  // Initialization
  async initialize(): Promise<void> {
    await this.authManager.loadAuthState();
  }

  // Auth methods
  async triggerAuthFlow(): Promise<void> {
    return this.authManager.triggerAuthFlow();
  }

  getAuthState(): any {
    return this.authManager.getAuthState();
  }

  addListener(callback: (state: any) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(state: any): void {
    this.listeners.forEach(listener => listener(state));
  }

  // API methods
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

  async listDemos(): Promise<any> {
    return this.apiClient.listDemos();
  }

  async uploadScreenshot(base64Data: string): Promise<any> {
    return this.apiClient.uploadScreenshot(base64Data);
  }
}

// Create and export API instance to globalThis
if (typeof globalThis !== 'undefined') {
  (globalThis as any).DemoFlowAPI = new DemoFlowPopupAPI();
}

// Make this file a module to avoid global scope conflicts
export {};
