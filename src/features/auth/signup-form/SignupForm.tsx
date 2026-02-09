'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

interface SignupFormProps {
  onSuccess?: () => void
  onToggleMode?: () => void
  showToggle?: boolean
}

export function SignupForm({ onSuccess, onToggleMode, showToggle = true }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service')
      setLoading(false)
      return
    }

    if (!agreePrivacy) {
      setError('You must agree to the Privacy Policy')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      onSuccess?.()
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title justify-center mb-4">Check Your Email</h2>
          <p className="text-sm opacity-80 mb-6">
            We&apos;ve sent you a confirmation link at <strong>{email}</strong>. 
            Please check your email and click the link to activate your account.
          </p>
          {showToggle && (
            <button
              onClick={onToggleMode}
              className="btn btn-ghost"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-center justify-center mb-6">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input input-bordered pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/50 hover:text-base-content/70"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <label className="label">
              <span className="label-text-alt">Minimum 6 characters</span>
            </label>
          </div>

          {/* Terms and Privacy Checkboxes */}
          <div className="space-y-3 pt-2">
            <div className="form-control">
              <label className="cursor-pointer label">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={loading}
                  />
                  <span className="label-text text-sm">
                    I agree to the{' '}
                    <a href={ROUTES.terms} target="_blank" className="link link-primary">
                      Terms of Service
                    </a>
                  </span>
                </div>
              </label>
            </div>
            
            <div className="form-control">
              <label className="cursor-pointer label">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    disabled={loading}
                  />
                  <span className="label-text text-sm">
                    I agree to the{' '}
                    <a href={ROUTES.privacy} target="_blank" className="link link-primary">
                      Privacy Policy
                    </a>
                  </span>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading || !agreeTerms || !agreePrivacy}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {showToggle && (
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{' '}
              <button
                onClick={onToggleMode}
                className="link link-primary"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
