// Screenshot Manager
// Handles screenshot capture and upload with retry logic

export class ScreenshotManager {
  private api: any;
  private logger: any;
  private config: any;

  constructor(api: any, logger: any, config: any) {
    this.api = api;
    this.logger = logger;
    this.config = config;
  }

  async captureScreenshot(_tabId: number): Promise<string | null> {
    try {
      const screenshot = await chrome.tabs.captureVisibleTab({
        format: 'png',
        quality: 90
      });

      if (this.api) {
        const screenshotUrl = await this.uploadScreenshot(screenshot);
        return screenshotUrl;
      }

      return screenshot;
    } catch (error) {
      this.logger.error('Failed to capture screenshot', error as Error);
      return null;
    }
  }

  private async uploadScreenshot(
    base64Data: string,
    retries: number = this.config.SCREENSHOT_RETRY_ATTEMPTS
  ): Promise<string> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        this.logger.debug(`Screenshot upload attempt ${attempt + 1}/${retries}`);

        const response = await fetch(base64Data);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('file', blob, `screenshot-${Date.now()}.png`);

        const uploadResponse = await fetch(`${this.api?.getBaseUrl()}/api/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await this.api?.getValidToken()}`
          },
          body: formData
        });

        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          this.logger.info('Screenshot uploaded successfully');
          return result.data?.url || base64Data;
        }

        throw new Error(`Upload failed with status ${uploadResponse.status}`);

      } catch (error) {
        this.logger.warn(`Screenshot upload attempt ${attempt + 1} failed:`, error);

        if (attempt === retries - 1) {
          // Last attempt failed
          this.logger.error('All screenshot upload attempts failed', error as Error);
          return base64Data; // Fallback to base64
        }

        // Exponential backoff
        const delay = this.config.SCREENSHOT_RETRY_DELAY_MS * (attempt + 1);
        this.logger.debug(`Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }

    return base64Data; // Fallback
  }
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).ScreenshotManager = ScreenshotManager;
}
