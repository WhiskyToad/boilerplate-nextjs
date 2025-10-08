// Auth Bridge
// Handles authentication messaging between web page and extension

class AuthBridge {
  private logger: any;
  private allowedOrigins: string[];

  constructor(logger: any, allowedOrigins: string[]) {
    this.logger = logger;
    this.allowedOrigins = allowedOrigins;
  }

  setup(): void {
    // Only set up auth bridge on allowed origins
    if (!this.isAllowedOrigin(window.location.origin)) {
      return;
    }

    this.logger.debug('🔌 Setting up auth bridge for', window.location.href);

    // Listen for window messages from the web page
    window.addEventListener('message', (event) => {
      this.handleMessage(event);
    });

    this.logger.info('DemoFlow auth bridge ready');
  }

  private handleMessage(event: MessageEvent): void {
    this.logger.debug('📨 Received window message:', event.data.type);

    // Validate origin
    if (!this.isAllowedOrigin(event.origin)) {
      this.logger.warn('Ignoring message from unknown origin:', event.origin);
      return;
    }

    if (event.data.type === 'DEMOFLOW_AUTH_SUCCESS') {
      this.logger.info('✅ Auth success detected! Forwarding to background...');

      // Forward to background script
      chrome.runtime.sendMessage({
        type: 'AUTH_SUCCESS_FROM_WEB',
        data: event.data.data
      }).then(response => {
        this.logger.debug('Background script acknowledged:', response);

        // Signal to the web page that extension received the data
        try {
          sessionStorage.setItem('demoflow_extension_ack', 'received');
          this.logger.debug('Acknowledged to web page');
        } catch (error) {
          this.logger.error('Failed to acknowledge:', error);
        }
      }).catch(error => {
        this.logger.error('Failed to send to background:', error);
      });
    }
  }

  private isAllowedOrigin(origin: string): boolean {
    if (this.allowedOrigins.includes('*')) {
      return true;
    }

    return this.allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.startsWith('http')) {
        return allowedOrigin === origin;
      }

      // Support wildcard subdomains like *.example.com
      if (allowedOrigin.startsWith('*.')) {
        try {
          const originUrl = new URL(origin);
          return originUrl.hostname.endsWith(allowedOrigin.substring(2));
        } catch {
          return false;
        }
      }

      return false;
    });
  }
}

// Export to globalThis
if (typeof globalThis !== 'undefined') {
  (globalThis as any).AuthBridge = AuthBridge;
}
