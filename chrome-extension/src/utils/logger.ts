// Centralized Logging System
// Provides consistent logging across the extension

import { isDevelopment } from './config.js';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private context: string;
  private enabled: boolean;
  private minLevel: LogLevel;

  constructor(context: string) {
    this.context = context;
    this.enabled = true;
    this.minLevel = isDevelopment() ? LogLevel.DEBUG : LogLevel.INFO;
  }

  /**
   * Debug-level logging (development only)
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(`[DEBUG][${this.context}] ${message}`, ...args);
    }
  }

  /**
   * Info-level logging
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(`[INFO][${this.context}] ${message}`, ...args);
    }
  }

  /**
   * Warning-level logging
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN][${this.context}] ${message}`, ...args);
    }
  }

  /**
   * Error-level logging (always logged)
   */
  error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      if (error instanceof Error) {
        console.error(`[ERROR][${this.context}] ${message}`, error.message, error.stack, ...args);
      } else {
        console.error(`[ERROR][${this.context}] ${message}`, error, ...args);
      }
    }
  }

  /**
   * Performance timing
   */
  time(label: string): void {
    if (isDevelopment()) {
      console.time(`[PERF][${this.context}] ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (isDevelopment()) {
      console.timeEnd(`[PERF][${this.context}] ${label}`);
    }
  }

  /**
   * Group related logs
   */
  group(label: string): void {
    if (isDevelopment()) {
      console.group(`[${this.context}] ${label}`);
    }
  }

  groupEnd(): void {
    if (isDevelopment()) {
      console.groupEnd();
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enabled && level >= this.minLevel;
  }

  /**
   * Disable logging for this logger
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Enable logging for this logger
   */
  enable(): void {
    this.enabled = true;
  }
}

// Factory function for creating loggers
export function createLogger(context: string): Logger {
  return new Logger(context);
}

// Pre-configured loggers for common contexts
export const BackgroundLogger = createLogger('Background');
export const PopupLogger = createLogger('Popup');
export const ContentLogger = createLogger('Content');
export const APILogger = createLogger('API');
export const AuthLogger = createLogger('Auth');
export const StorageLogger = createLogger('Storage');

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Logger = Logger;
  (globalThis as any).createLogger = createLogger;
  (globalThis as any).BackgroundLogger = BackgroundLogger;
  (globalThis as any).PopupLogger = PopupLogger;
  (globalThis as any).ContentLogger = ContentLogger;
  (globalThis as any).APILogger = APILogger;
  (globalThis as any).AuthLogger = AuthLogger;
  (globalThis as any).StorageLogger = StorageLogger;
}
