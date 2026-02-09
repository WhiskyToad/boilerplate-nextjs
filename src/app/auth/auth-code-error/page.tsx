'use client'

import { Button } from '@/components/ui/button/Button'
import { Card, CardContent } from '@/components/ui/card/Card'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/config/routes'

export default function AuthCodeErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-error mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Authentication Error
              </h2>
              <p className="text-base-content/70 text-sm">
                There was a problem confirming your email or signing you in. 
                This could happen if the confirmation link has expired or been used already.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push(ROUTES.auth.signup)}
                variant="primary"
                className="w-full"
              >
                Try Signing Up Again
              </Button>
              
              <Button
                onClick={() => router.push(ROUTES.auth.login)}
                variant="outline"
                className="w-full"
              >
                Sign In Instead
              </Button>
              
              <button
                onClick={() => router.push(ROUTES.home)}
                className="text-sm text-base-content/70 hover:text-base-content cursor-pointer"
              >
                ← Back to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
