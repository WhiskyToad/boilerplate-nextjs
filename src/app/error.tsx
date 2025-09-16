'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to external service
    console.error('Application error:', error)
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-xl font-bold text-error">Application Error</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base-content/70">
            Something went wrong with the application. Our team has been notified.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="bg-base-200 p-3 rounded text-xs">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
              {error.stack && (
                <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
              )}
            </details>
          )}
          
          <div className="flex gap-2">
            <Button onClick={reset} variant="primary">
              Try Again
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}