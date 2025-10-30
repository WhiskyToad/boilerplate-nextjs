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

  useEffect(() => {
    // If user is already logged in, redirect to intended destination
    if (!loading && user) {
      router.push(redirectUrl)
    }
  }, [user, loading, router, redirectUrl])

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
    router.push(redirectUrl)
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-base-content/70 hover:text-base-content text-sm cursor-pointer"
          >
            ← Back to home
          </button>
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