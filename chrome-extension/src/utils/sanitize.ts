// Input Sanitization Utilities
// Prevents XSS and other injection attacks

/**
 * Sanitize text for safe storage and display
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
  if (!text) return '';

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .substring(0, maxLength)
    .trim();
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize HTML (strip all tags)
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}

/**
 * Sanitize element data before storage
 */
export function sanitizeElementData(data: any): any {
  return {
    ...data,
    textContent: sanitizeText(data.textContent || '', 500),
    value: sanitizeText(data.value || '', 500),
    placeholder: sanitizeText(data.placeholder || '', 200),
    alt: sanitizeText(data.alt || '', 200),
    title: sanitizeText(data.title || '', 200),
    href: sanitizeUrl(data.href || ''),
  };
}

/**
 * Validate and sanitize demo title
 */
export function sanitizeDemoTitle(title: string): string {
  const sanitized = sanitizeText(title, 255);
  if (sanitized.length === 0) {
    throw new Error('Demo title cannot be empty');
  }
  return sanitized;
}

/**
 * Validate and sanitize demo description
 */
export function sanitizeDemoDescription(description: string): string {
  return sanitizeText(description, 2000);
}

/**
 * Sanitize annotation text
 */
export function sanitizeAnnotation(text: string): string {
  return sanitizeText(text, 500);
}
