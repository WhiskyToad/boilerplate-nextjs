'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { posthog } from '@/lib/posthog'
import { CookieConsent, hasAnalyticsConsent } from '@/components/legal/CookieConsent'

interface PostHogProviderProps {
  children: React.ReactNode
}

function PostHogTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && process.env.NODE_ENV === 'production') {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      console.log('PostHog: Capturing pageview for:', url)
      posthog.capture('$pageview', {
        $current_url: url,
      })
    } else {
      console.log('PostHog: Disabled in development mode')
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const [hasConsent, setHasConsent] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const consent = hasAnalyticsConsent()
      console.log('PostHogProvider: Analytics consent check:', consent)
      setHasConsent(consent)
      setConsentChecked(true)
    } else {
      console.log('PostHogProvider: PostHog disabled in development mode')
      setConsentChecked(true)
    }
  }, [])

  const handleConsentChange = (newConsent: boolean) => {
    console.log('PostHogProvider: Consent changed to:', newConsent)
    setHasConsent(newConsent)
  }

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <PostHogTracker />
      </Suspense>
      {consentChecked && <CookieConsent onConsentChange={handleConsentChange} />}
    </>
  )
}