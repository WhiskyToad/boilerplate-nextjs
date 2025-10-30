'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface LoginFormProps {
  onSuccess?: () => void
  onToggleMode?: () => void
  showToggle?: boolean
}

export function LoginForm({ onSuccess, onToggleMode, showToggle = true }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
    } else {
      onSuccess?.()
    }

    setLoading(false)
  }

  return (
    <div className="card w-full max-w-md bg-white shadow-xl border border-gray-200">
      <div className="card-body p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control w-full">
            <label className="label pb-2">
              <span className="label-text text-gray-700 font-medium">Email Address</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-control w-full">
            <label className="label pb-2">
              <span className="label-text text-gray-700 font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input input-bordered w-full bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
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
          </div>

          {error && (
            <div className="alert bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-semibold py-3 h-auto min-h-0 disabled:bg-blue-400 disabled:border-blue-400"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {showToggle && (
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-700 font-semibold"
                disabled={loading}
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}