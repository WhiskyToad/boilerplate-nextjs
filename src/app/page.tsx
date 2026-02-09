'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LandingPage } from '@/features/landing/LandingPage'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push(ROUTES.app.home)
    }
  }, [loading, router, user])

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
    <LandingPage
      onSignIn={() => router.push(ROUTES.auth.login)}
      onGetStarted={() => router.push(ROUTES.auth.signup)}
    />
  )
}
