'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button/Button'
import { Input } from '@/components/ui/input/Input'
import { Card, CardContent } from '@/components/ui/card/Card'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-6 text-center">
              <svg className="w-16 h-16 text-success mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Check Your Email
              </h2>
              <p className="text-base-content/70 text-sm mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Click the link in the email to reset your password.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/login')}
                  variant="primary"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
                
                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="text-sm text-base-content/70 hover:text-base-content cursor-pointer"
                >
                  Try a different email
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Forgot Password?
              </h2>
              <p className="text-base-content/70 text-sm">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-sm p-3 rounded-lg bg-error/10 text-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-sm text-base-content/70 hover:text-base-content cursor-pointer"
                >
                  Remember your password? Sign in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}