'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button/Button'
import { Input } from '@/components/ui/input/Input'
import { Card, CardContent } from '@/components/ui/card/Card'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

export interface SimpleAuthProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
  onSuccess?: () => void
  onForgotPassword?: () => void
  infoMessage?: string | null
}

export function SimpleAuth({
  mode,
  onToggleMode,
  onSuccess,
  onForgotPassword,
  infoMessage,
}: SimpleAuthProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupSuccessEmail, setSignupSuccessEmail] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === 'signup') {
      if (!isPasswordValid) {
        setError('Please use at least 8 characters with upper, lower, and a number.')
        setLoading(false)
        return
      }

      if (!agreeTerms || !agreePrivacy) {
        setError('You must accept the Terms and Privacy Policy to create an account.')
        setLoading(false)
        return
      }
    }

    try {
      if (mode === 'signup') {
        const result = await signUp(email, password)
        if (result.error) {
          throw result.error
        }

        setSignupSuccessEmail(email)
        setPassword('')
        return
      }

      const result = await signIn(email, password)
      if (result.error) {
        throw result.error
      }

      onSuccess?.()
    } catch (authError: any) {
      setError(authError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await signInWithGoogle()
      if (result.error) {
        throw result.error
      }
    } catch (authError: any) {
      setError(authError.message)
      setLoading(false)
    }
  }

  if (signupSuccessEmail && mode === 'signup') {
    return (
      <Card className="w-full max-w-xl mx-auto border border-base-300/70" variant="elevated">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-base-content">Check your inbox</h2>
          <p className="text-sm text-base-content/70">
            We sent a confirmation link to <span className="font-medium text-base-content">{signupSuccessEmail}</span>.
          </p>
          <p className="text-sm text-base-content/70">
            Open the link in your email to verify your account, then sign in.
          </p>
          <Button variant="outline" className="w-full" onClick={onToggleMode}>
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl mx-auto border border-base-300/70" variant="elevated">
      <CardContent className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-base-content">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            {mode === 'signin'
              ? 'Pick up where you left off.'
              : 'Start from a secure baseline and build your product fast.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={loading}
          />

          <div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="pr-12"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-9 text-xs text-base-content/60 hover:text-base-content"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {mode === 'signup' && password.length > 0 && (
              <p className="mt-2 text-xs text-base-content/60">
                Must include 8+ chars, uppercase, lowercase, and a number.
              </p>
            )}
          </div>

          {mode === 'signup' && (
            <div className="space-y-2 rounded-lg border border-base-300/80 bg-base-200/40 p-3 text-sm text-base-content/80">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary mt-0.5"
                  checked={agreeTerms}
                  onChange={(event) => setAgreeTerms(event.target.checked)}
                  disabled={loading}
                />
                <span>
                  I agree to the <Link href={ROUTES.terms} className="link">Terms of Service</Link>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary mt-0.5"
                  checked={agreePrivacy}
                  onChange={(event) => setAgreePrivacy(event.target.checked)}
                  disabled={loading}
                />
                <span>
                  I agree to the <Link href={ROUTES.privacy} className="link">Privacy Policy</Link>
                </span>
              </label>
            </div>
          )}

          {infoMessage && (
            <div className="rounded-lg bg-info/10 p-3 text-sm text-info">{infoMessage}</div>
          )}

          {error && (
            <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            loadingText={mode === 'signin' ? 'Signing in...' : 'Creating account...'}
            disabled={mode === 'signup' && password.length > 0 && !isPasswordValid}
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>

          <div className="divider text-xs text-base-content/50">or</div>

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Continue with Google
          </Button>

          <div className="space-y-2 pt-2 text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-base-content/70 hover:text-base-content"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>

            {mode === 'signin' && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="block w-full text-sm text-base-content/70 hover:text-base-content"
              >
                Forgot your password?
              </button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
