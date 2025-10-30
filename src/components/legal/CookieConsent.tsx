'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button/Button'
import { FiX, FiSettings } from 'react-icons/fi'

const COOKIE_CONSENT_KEY = 'cookie-consent'
const ANALYTICS_CONSENT_KEY = 'analytics-consent'

interface CookieConsentProps {
  onConsentChange?: (hasConsent: boolean) => void
}

export function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setIsVisible(true)
    } else if (onConsentChange) {
      const analyticsConsent = localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'true'
      onConsentChange(analyticsConsent)
    }
  }, [onConsentChange])

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'true')
    setIsVisible(false)
    if (onConsentChange) {
      onConsentChange(true)
    }
    // Reload to initialize PostHog with consent
    window.location.reload()
  }

  const handleRejectAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'false')
    setIsVisible(false)
    if (onConsentChange) {
      onConsentChange(false)
    }
  }

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'custom')
    localStorage.setItem(ANALYTICS_CONSENT_KEY, analyticsEnabled.toString())
    setIsVisible(false)
    setShowDetails(false)
    if (onConsentChange) {
      onConsentChange(analyticsEnabled)
    }
    // Reload to apply new settings
    if (analyticsEnabled) {
      window.location.reload()
    }
  }

  // Don't render on server or if consent already given
  if (!mounted || !isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="bg-base-100 rounded-t-xl shadow-xl border border-base-300 max-w-5xl mx-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍪</span>
              <div>
                <h2 className="text-lg font-bold text-base-content">
                  We use cookies
                </h2>
                {!showDetails && (
                  <p className="text-base-content/70 text-sm">
                    We use cookies to improve your experience and analyze usage.
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleRejectAll}
              className="text-base-content/50 hover:text-base-content transition-colors ml-4"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Simple view */}
          {!showDetails && (
            <div className="space-y-4">
              <p className="text-sm text-base-content/80">
                We track basic usage without cookies, but we use optional analytics cookies for enhanced features like user profiles and detailed analytics. 
                You can choose which cookies to accept.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1"
                  size="sm"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  Reject All
                </Button>
                <Button
                  onClick={() => setShowDetails(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FiSettings className="w-4 h-4" />
                  Customize
                </Button>
              </div>
            </div>
          )}

          {/* Detailed view */}
          {showDetails && (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Essential cookies */}
                <div className="border border-base-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-base-content">Essential Cookies</h3>
                    <div className="badge badge-success">Always Active</div>
                  </div>
                  <p className="text-sm text-base-content/70 mb-3">
                    These cookies are necessary for the website to function and cannot be disabled.
                  </p>
                  <ul className="text-xs text-base-content/60 space-y-1">
                    <li>• Authentication and login sessions</li>
                    <li>• User preferences and settings</li>
                    <li>• Security and fraud prevention</li>
                  </ul>
                </div>

                {/* Analytics cookies */}
                <div className="border border-base-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-base-content">Analytics Cookies</h3>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-warning">Optional</div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={analyticsEnabled}
                        onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-base-content/70 mb-3">
                    Help us understand how you use our website to improve your experience.
                  </p>
                  <ul className="text-xs text-base-content/60 space-y-1">
                    <li>• Page views and user interactions</li>
                    <li>• Feature usage and performance metrics</li>
                    <li>• Anonymous usage statistics (PostHog)</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1"
                  size="sm"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="outline"
                  size="sm"
                >
                  Back
                </Button>
              </div>

              <p className="text-xs text-base-content/50 text-center">
                By continuing to use our site, you agree to our{' '}
                <a href="/privacy" className="link">Privacy Policy</a> and{' '}
                <a href="/terms" className="link">Terms of Service</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions for checking consent
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'true'
}

export const hasCookieConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_CONSENT_KEY) !== null
}