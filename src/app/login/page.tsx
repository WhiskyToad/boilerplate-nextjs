'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SimpleAuth } from "@/features/auth/SimpleAuth"
import { useAuth } from '@/hooks/useAuth'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  
  const redirectUrl = searchParams.get('redirect') || '/dashboard'
  const isExtension = searchParams.get('extension') === 'true'

  useEffect(() => {
    // If user is already logged in, redirect to intended destination
    if (!loading && user) {
      if (isExtension) {
        // Redirect to auth-callback page for extension to capture
        router.push(`/auth-callback?redirect=${encodeURIComponent(redirectUrl)}`)
      } else {
        // Normal web app flow
        router.push(redirectUrl)
      }
    }
  }, [user, loading, router, redirectUrl, isExtension])

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  const handleToggleMode = () => {
    router.push('/signup')
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }

  const handleAuthSuccess = () => {
    if (isExtension) {
      // Redirect to auth-callback page for extension to capture
      router.push(`/auth-callback?redirect=${encodeURIComponent(redirectUrl)}`)
    } else {
      // Normal web app flow
      router.push(redirectUrl)
    }
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {isExtension ? (
            <div className="text-primary text-sm font-medium">
              🔗 Connecting to DemoFlow Extension
            </div>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="text-base-content/70 hover:text-base-content text-sm cursor-pointer"
            >
              ← Back to home
            </button>
          )}
        </div>
        <SimpleAuth
          mode="signin"
          onToggleMode={handleToggleMode}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}