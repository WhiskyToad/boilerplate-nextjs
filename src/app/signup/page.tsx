'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SimpleAuth } from '@/features/auth/SimpleAuth'
import { AuthPageShell } from '@/features/auth/AuthPageShell'
import { useAuth } from '@/hooks/useAuth'
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES, getSafeRedirectPath, withRedirect } from '@/config/routes'

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  const redirectUrl = getSafeRedirectPath(searchParams.get('redirect'), DEFAULT_AUTHENTICATED_ROUTE)

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectUrl)
    }
  }, [loading, redirectUrl, router, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <AuthPageShell mode="signup">
      <SimpleAuth
        mode="signup"
        onToggleMode={() => router.push(withRedirect(ROUTES.auth.login, redirectUrl))}
        onSuccess={() => router.push(redirectUrl)}
      />
    </AuthPageShell>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base-100 flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  )
}
