'use client'

import React, { useState } from 'react'

interface StoryAuthTabsProps {
  onSuccess?: () => void
  defaultTab?: 'login' | 'signup'
}

function StoryAuthTabs({ onSuccess, defaultTab = 'login' }: StoryAuthTabsProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    // Simulate Google OAuth flow
    setTimeout(() => {
      console.log('Google Sign-In initiated')
      // In real app, user would be redirected to Google
      setLoading(false)
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      if (email === 'error@example.com') {
        setError(activeTab === 'login' ? 'Invalid email or password' : 'Email already exists')
      } else {
        if (activeTab === 'signup') {
          setSuccess(true)
        } else {
          onSuccess?.()
          console.log('Login successful')
        }
      }
      setLoading(false)
    }, 1000)
  }

  if (success && activeTab === 'signup') {
    return (
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title justify-center mb-4">Check Your Email</h2>
          <p className="text-sm opacity-80 mb-6">
            We&apos;ve sent you a confirmation link at <strong>{email}</strong>. 
            Please check your email and click the link to activate your account.
          </p>
          <button
            onClick={() => {
              setSuccess(false)
              setActiveTab('login')
              setEmail('')
              setPassword('')
              setError(null)
            }}
            className="btn btn-ghost"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      {/* Tab Header */}
      <div className="tabs tabs-boxed bg-base-200 rounded-t-xl rounded-b-none">
        <button
          className={`tab tab-lg flex-1 ${activeTab === 'login' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('login')
            setError(null)
          }}
        >
          Sign In
        </button>
        <button
          className={`tab tab-lg flex-1 ${activeTab === 'signup' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('signup')
            setError(null)
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Tab Content */}
      <div className="card-body">
        <h2 className="card-title text-center justify-center mb-6">
          {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        
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
                minLength={activeTab === 'signup' ? 6 : undefined}
                placeholder={activeTab === 'login' ? 'Enter your password' : 'Create a password'}
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
            {activeTab === 'signup' && (
              <label className="label">
                <span className="label-text-alt">Minimum 6 characters</span>
              </label>
            )}
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
              disabled={loading}
            >
              {loading ? (
                activeTab === 'login' ? 'Signing In...' : 'Creating Account...'
              ) : (
                activeTab === 'login' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="divider">or</div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn btn-outline w-full"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="text-center mt-4">
          <p className="text-xs opacity-60">
            Try: error@example.com for error state
          </p>
        </div>
      </div>
    </div>
  )
}

import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof StoryAuthTabs> = {
  title: 'Components/AuthTabs',
  component: StoryAuthTabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Combined authentication component with tabs to switch between login and signup. Click the tabs to toggle between modes. Try using "error@example.com" to see error states.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSuccess: () => console.log('Authentication successful'),
  },
};

export const StartWithSignup: Story = {
  args: {
    defaultTab: 'signup',
    onSuccess: () => console.log('Authentication successful'),
  },
};