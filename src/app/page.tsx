'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LandingPage } from "@/features/landing/LandingPage"
import { SimpleAuth } from "@/features/auth/SimpleAuth"
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

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

  const handleSignIn = () => {
    setAuthMode('signin')
    setShowAuth(true)
  }

  const handleGetStarted = () => {
    setAuthMode('signup')
    setShowAuth(true)
  }

  const handleToggleMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  const handleAuthSuccess = () => {
    router.push('/dashboard')
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAuth(false)}
              className="text-base-content/70 hover:text-base-content text-sm cursor-pointer"
            >
              ← Back to home
            </button>
          </div>
          <SimpleAuth
            mode={authMode}
            onToggleMode={handleToggleMode}
            onSuccess={handleAuthSuccess}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <LandingPage 
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
      />
    </>
  )
}
