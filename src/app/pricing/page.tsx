'use client'

import { Header } from '@/components/shared/Header'
import { SimplePricing } from '@/features/landing/SimplePricing'
import { siteConfig } from '@/config/site-config'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

export default function PricingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      router.push(ROUTES.app.home)
    } else {
      router.push(ROUTES.auth.signup)
    }
  }

  const handleSignIn = () => {
    router.push(ROUTES.auth.login)
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Header variant="landing" onSignIn={handleSignIn} onGetStarted={() => router.push(ROUTES.auth.signup)} />

      <main className="bg-gradient-to-br from-base-100 via-base-50 to-base-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-base-content mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features. Start free, upgrade anytime.
            </p>
          </div>

          <SimplePricing onGetStarted={handleGetStarted} />

          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-base-content mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-base-300 pb-6">
                <h3 className="text-lg font-semibold text-base-content mb-2">Can I change plans anytime?</h3>
                <p className="text-base-content/70">
                  Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div className="border-b border-base-300 pb-6">
                <h3 className="text-lg font-semibold text-base-content mb-2">What payment methods do you accept?</h3>
                <p className="text-base-content/70">Major credit cards through Stripe.</p>
              </div>
              <div className="border-b border-base-300 pb-6">
                <h3 className="text-lg font-semibold text-base-content mb-2">Is there a free trial?</h3>
                <p className="text-base-content/70">
                  Yes. The Free plan lets you try {siteConfig.name} with no credit card required.
                </p>
              </div>
              <div className="border-b border-base-300 pb-6">
                <h3 className="text-lg font-semibold text-base-content mb-2">Can I cancel anytime?</h3>
                <p className="text-base-content/70">Yes, you can cancel your subscription at any time.</p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-base-content mb-2">Do you offer refunds?</h3>
                <p className="text-base-content/70">
                  We offer a 14-day money-back guarantee on paid plans.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-24 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-base-content mb-4">Ready to get started?</h2>
            <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
              Join builders using {siteConfig.name}. Start free, no credit card required.
            </p>
            <button
              onClick={() => router.push(user ? ROUTES.app.home : ROUTES.auth.signup)}
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Building Today
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-base-200 border-t border-base-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base-content/70">
            Have questions?{' '}
            <a href={`mailto:${siteConfig.supportEmail}`} className="text-primary hover:underline">
              Contact our team
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
