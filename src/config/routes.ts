export const ROUTES = {
  home: '/',
  app: {
    home: '/app',
  },
  auth: {
    login: '/login',
    signup: '/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    callback: '/auth/callback',
    confirmed: '/auth/confirmed',
    authCodeError: '/auth/auth-code-error',
  },
  pricing: '/pricing',
  settings: '/settings',
  terms: '/terms',
  privacy: '/privacy',
  admin: '/admin',
  dev: '/dev',
  blog: '/blog',
  api: {
    manageSubscription: '/api/stripe/manage-subscription',
  },
} as const

export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.app.home

export function getSafeRedirectPath(
  candidate: string | null | undefined,
  fallback: string = DEFAULT_AUTHENTICATED_ROUTE
): string {
  if (!candidate) {
    return fallback
  }

  if (!candidate.startsWith('/') || candidate.startsWith('//')) {
    return fallback
  }

  return candidate
}

export function withRedirect(path: string, redirectPath: string): string {
  const params = new URLSearchParams({ redirect: redirectPath })
  return `${path}?${params.toString()}`
}
