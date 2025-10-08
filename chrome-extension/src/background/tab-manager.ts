// Tab Manager
// Handles tab lifecycle and content script injection

export class TabManager {
  private logger: any;

  constructor(logger: any) {
    this.logger = logger;
  }

  async ensureContentScriptInjected(tabId: number): Promise<boolean> {
    try {
      const tab = await chrome.tabs.get(tabId);

      if (!tab.url || this.isRestrictedUrl(tab.url)) {
        this.logger.warn('Content script injection skipped for restricted URL', { url: tab.url });
        return false;
      }

      if (await this.isContentScriptReady(tabId)) {
        return true;
      }

      const contentScriptFiles = [
        'content/types.js',
        'content/overlay-ui.js',
        'content/auth-bridge.js',
        'content/capture-handler.js',
        'content/content.js'
      ];

      this.logger.debug('Injecting content scripts into tab', { tabId, files: contentScriptFiles });

      await chrome.scripting.executeScript({
        target: { tabId },
        files: contentScriptFiles
      });

      const isReady = await this.waitForContentScript(tabId, 5000);
      if (!isReady) {
        this.logger.warn('Content script did not respond to readiness check', { tabId });
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('Failed to inject content script', error as Error);
      return false;
    }
  }

  isRestrictedUrl(url: string): boolean {
    const restrictedProtocols = ['chrome:', 'chrome-extension:', 'moz-extension:', 'edge:', 'opera:'];
    const restrictedDomains = ['chrome.google.com'];

    return restrictedProtocols.some(protocol => url.startsWith(protocol)) ||
           restrictedDomains.some(domain => url.includes(domain));
  }

  private async isContentScriptReady(tabId: number): Promise<boolean> {
    try {
      const response = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
      return response && response.success;
    } catch {
      return false;
    }
  }

  private async waitForContentScript(tabId: number, timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now();
    const checkInterval = 100;

    while (Date.now() - startTime < timeout) {
      if (await this.isContentScriptReady(tabId)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    return false;
  }

  async broadcastToAllTabs(message: any): Promise<void> {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, message);
        } catch {
          // Tab might not have content script
        }
      }
    }
  }
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).TabManager = TabManager;
}
