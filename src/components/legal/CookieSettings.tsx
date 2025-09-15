'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal/Modal'

const COOKIE_CONSENT_KEY = 'cookie-consent'
const ANALYTICS_CONSENT_KEY = 'analytics-consent'

interface CookieSettingsProps {
  onConsentChange?: (hasConsent: boolean) => void
}

export function CookieSettings({ onConsentChange }: CookieSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const consent = localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'true'
    setAnalyticsEnabled(consent)
  }, [])

  const handleSave = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'custom')
    localStorage.setItem(ANALYTICS_CONSENT_KEY, analyticsEnabled.toString())
    setIsOpen(false)
    if (onConsentChange) {
      onConsentChange(analyticsEnabled)
    }
    // Reload to apply new settings
    window.location.reload()
  }

  const handleClearAll = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY)
    localStorage.removeItem(ANALYTICS_CONSENT_KEY)
    setIsOpen(false)
    // Clear all PostHog data
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.reset()
    }
    window.location.reload()
  }

  if (!mounted) return null

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        🍪
        Cookie Settings
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Cookie Preferences"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-base-content/70">
            Manage your cookie preferences. Changes will take effect immediately.
          </p>

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

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSave} className="flex-1">
              Save Preferences
            </Button>
            <Button 
              onClick={handleClearAll}
              variant="outline" 
              className="flex-1"
            >
              Reset All Cookies
            </Button>
            <Button 
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-base-content/50 text-center">
            For more information, see our{' '}
            <a href="/privacy" className="link">Privacy Policy</a>.
          </p>
        </div>
      </Modal>
    </>
  )
}