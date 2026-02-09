'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

export default function AuthConfirmedPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push(ROUTES.app.home)
    }
  }, [loading, router, user])

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-base-content mb-3">Email confirmed</h1>
            <p className="text-sm text-base-content/70 mb-6">
              Your account is ready. Sign in to continue to your app workspace.
            </p>

            <Button className="w-full" onClick={() => router.push(ROUTES.auth.login)}>
              Continue to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
