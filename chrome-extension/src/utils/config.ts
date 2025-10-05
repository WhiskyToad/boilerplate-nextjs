// Environment Configuration
// Handles environment-specific settings

export interface ExtensionConfig {
  API_URL: string;
  AUTH_CALLBACK_URL: string;
  DASHBOARD_URL: string;
  DEBUG: boolean;
  AUTH_TIMEOUT_MS: number;
  SCREENSHOT_RETRY_ATTEMPTS: number;
  SCREENSHOT_RETRY_DELAY_MS: number;
  API_REQUEST_TIMEOUT_MS: number;
  MAX_CONCURRENT_REQUESTS: number;
  STATE_BACKUP_INTERVAL_MS: number;
  SIGNIFICANT_SCROLL_PX: number;
  API_CHECK_INTERVAL_MS: number;
}

const DEVELOPMENT_CONFIG: ExtensionConfig = {
  API_URL: 'http://localhost:3000',
  AUTH_CALLBACK_URL: 'http://localhost:3000/auth-callback',
  DASHBOARD_URL: 'http://localhost:3000/dashboard',
  DEBUG: true,
  AUTH_TIMEOUT_MS: 3 * 60 * 1000, // 3 minutes
  SCREENSHOT_RETRY_ATTEMPTS: 3,
  SCREENSHOT_RETRY_DELAY_MS: 1000,
  API_REQUEST_TIMEOUT_MS: 30000, // 30 seconds
  MAX_CONCURRENT_REQUESTS: 3,
  STATE_BACKUP_INTERVAL_MS: 30000, // 30 seconds
  SIGNIFICANT_SCROLL_PX: 50,
  API_CHECK_INTERVAL_MS: 100,
};

const PRODUCTION_CONFIG: ExtensionConfig = {
  API_URL: 'https://your-domain.com', // TODO: Replace with actual domain
  AUTH_CALLBACK_URL: 'https://your-domain.com/auth-callback',
  DASHBOARD_URL: 'https://your-domain.com/dashboard',
  DEBUG: false,
  AUTH_TIMEOUT_MS: 3 * 60 * 1000,
  SCREENSHOT_RETRY_ATTEMPTS: 3,
  SCREENSHOT_RETRY_DELAY_MS: 2000,
  API_REQUEST_TIMEOUT_MS: 30000,
  MAX_CONCURRENT_REQUESTS: 5,
  STATE_BACKUP_INTERVAL_MS: 60000, // 1 minute
  SIGNIFICANT_SCROLL_PX: 50,
  API_CHECK_INTERVAL_MS: 100,
};

/**
 * Get current environment configuration
 */
export function getConfig(): ExtensionConfig {
  const manifest = chrome.runtime.getManifest();
  const isDev = manifest.version.includes('dev') || manifest.version.includes('0.0');

  return isDev ? DEVELOPMENT_CONFIG : PRODUCTION_CONFIG;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  const manifest = chrome.runtime.getManifest();
  return manifest.version.includes('dev') || manifest.version.includes('0.0');
}

/**
 * Get allowed origins for content scripts
 */
export function getAllowedOrigins(): string[] {
  const config = getConfig();
  const url = new URL(config.API_URL);
  return [url.origin];
}

/**
 * Validate origin is allowed
 */
export function isAllowedOrigin(origin: string): boolean {
  const allowed = getAllowedOrigins();
  return allowed.includes(origin);
}

// Export config as default
export const CONFIG = getConfig();

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).CONFIG = CONFIG;
  (globalThis as any).getConfig = getConfig;
  (globalThis as any).isDevelopment = isDevelopment;
  (globalThis as any).isAllowedOrigin = isAllowedOrigin;
}
