// Centralized Error Messages and Handling

export const ERROR_MESSAGES = {
  // Authentication
  AUTH_REQUIRED: 'Please sign in to continue',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  AUTH_CANCELLED: 'Login was cancelled',
  AUTH_TIMEOUT: 'Login timed out. Please try again.',
  AUTH_IN_PROGRESS: 'Authentication already in progress',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',

  // Recording
  RECORDING_START_FAILED: 'Failed to start recording',
  RECORDING_STOP_FAILED: 'Failed to stop recording',
  RECORDING_IN_PROGRESS: 'Recording is already in progress',
  DEMO_TITLE_REQUIRED: 'Please enter a demo title',

  // Network
  NETWORK_ERROR: 'Network error. Please check your connection.',
  REQUEST_TIMEOUT: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',

  // Screenshots
  SCREENSHOT_CAPTURE_FAILED: 'Failed to capture screenshot',
  SCREENSHOT_UPLOAD_FAILED: 'Failed to upload screenshot',

  // Content Script
  CONTENT_SCRIPT_INJECTION_FAILED: 'Cannot record on this page. Please navigate to a regular webpage.',
  RESTRICTED_PAGE: 'Cannot record on Chrome extension pages',

  // General
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  INVALID_INPUT: 'Invalid input provided',
  OPERATION_FAILED: 'Operation failed. Please try again.',
} as const;

export class ExtensionError extends Error {
  code: string;
  recoverable: boolean;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', recoverable: boolean = true) {
    super(message);
    this.name = 'ExtensionError';
    this.code = code;
    this.recoverable = recoverable;
  }
}

export class AuthenticationError extends ExtensionError {
  constructor(message: string, code: string = 'AUTH_ERROR') {
    super(message, code, true);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends ExtensionError {
  constructor(message: string, code: string = 'NETWORK_ERROR') {
    super(message, code, true);
    this.name = 'NetworkError';
  }
}

export class RecordingError extends ExtensionError {
  constructor(message: string, code: string = 'RECORDING_ERROR') {
    super(message, code, true);
    this.name = 'RecordingError';
  }
}

/**
 * Handle errors consistently
 */
export function handleError(error: unknown, _context?: string): ExtensionError {
  if (error instanceof ExtensionError) {
    return error;
  }

  if (error instanceof Error) {
    return new ExtensionError(
      error.message || ERROR_MESSAGES.UNEXPECTED_ERROR,
      'UNKNOWN_ERROR',
      true
    );
  }

  return new ExtensionError(
    ERROR_MESSAGES.UNEXPECTED_ERROR,
    'UNKNOWN_ERROR',
    true
  );
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof ExtensionError) {
    return error.recoverable;
  }
  return true; // Assume recoverable by default
}

// Export to globalThis for service worker compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).ERROR_MESSAGES = ERROR_MESSAGES;
  (globalThis as any).ExtensionError = ExtensionError;
  (globalThis as any).AuthenticationError = AuthenticationError;
  (globalThis as any).NetworkError = NetworkError;
  (globalThis as any).RecordingError = RecordingError;
  (globalThis as any).handleError = handleError;
  (globalThis as any).isRecoverableError = isRecoverableError;
}
