/**
 * Disposable Email Blocker
 * Blocks temporary/disposable email addresses used for spam signups
 */

// Common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.org',
  'guerrillamail.de',
  'spam4.me',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'mailtothis.com',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  'getnada.com',
  'mohmal.com',
  'throwaway.email',
  'throwawaymail.com',
  'trashmail.com',
  'trashmail.net',
  'trash-mail.com',
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
  'fakeinbox.com',
  'emailondeck.com',
  'mintemail.com',
  'mailnesia.com',
  'mailcatch.com',
  'maildrop.cc',
  'dispostable.com',
  'spamgourmet.com',
  'mytemp.email',
  'mytempemail.com',
  'tmails.net',
  'gufum.com',
])

export function isDisposableEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false

  const domain = email.toLowerCase().split('@')[1]
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false
}

export function validateNotDisposable(email: string): { valid: boolean; error?: string } {
  if (isDisposableEmail(email)) {
    return {
      valid: false,
      error: 'Temporary email addresses are not allowed',
    }
  }
  return { valid: true }
}
