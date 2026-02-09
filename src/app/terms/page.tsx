'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/features/landing/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { siteConfig } from '@/config/site-config'
import { ROUTES } from '@/config/routes'

export default function TermsPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignIn = () => {
    router.push(ROUTES.auth.login)
  }

  const handleGetStarted = () => {
    router.push(ROUTES.auth.signup)
  }

  const { legal } = siteConfig

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header
        variant="docs"
        user={user}
        loading={loading}
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
        onSignOut={signOut}
      />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold text-base-content mb-8">Terms of Service</h1>

          <div className="bg-base-100 rounded-xl p-8 prose prose-lg max-w-none">
            <p className="text-base-content/70 mb-6">
              <strong>Last updated:</strong> {legal.effectiveDate}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Acceptance of Terms</h2>
              <p className="text-base-content/80">
                By accessing and using {legal.companyName}, you accept and agree to be bound by the terms
                and provisions of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Description of Service</h2>
              <p className="text-base-content/80">
                {legal.companyName} provides {legal.terms.serviceDescription}.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">User Accounts</h2>
              <p className="text-base-content/80 mb-4">
                To use certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-base-content/80 space-y-2">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </section>

            {legal.terms.subscriptionInfo.hasFreePlan && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-base-content mb-4">Subscription Plans</h2>
                <p className="text-base-content/80 mb-4">
                  Our service offers free and paid subscription plans:
                </p>
                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                  <li>Free plan includes basic features with usage limits</li>
                  <li>Paid plans offer increased limits and additional features</li>
                  {legal.terms.subscriptionInfo.billingPeriods.length > 0 && (
                    <li>Subscriptions are billed {legal.terms.subscriptionInfo.billingPeriods.join(' or ')}</li>
                  )}
                  {legal.terms.subscriptionInfo.canCancelAnytime && (
                    <li>You may cancel your subscription at any time</li>
                  )}
                </ul>
              </section>
            )}

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Acceptable Use</h2>
              <p className="text-base-content/80 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-base-content/80 space-y-2">
                {legal.terms.acceptableUse.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Privacy</h2>
              <p className="text-base-content/80">
                Your privacy is important to us. Please review our{' '}
                <a href={ROUTES.privacy} className="link">Privacy Policy</a> to understand
                how we collect and use your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Termination</h2>
              <p className="text-base-content/80">
                We may terminate or suspend your account at any time for violations of these terms.
                You may also terminate your account at any time through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Limitation of Liability</h2>
              <p className="text-base-content/80">
                The service is provided "as is" without warranties. We shall not be liable for any
                indirect, incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Changes to Terms</h2>
              <p className="text-base-content/80">
                We may update these Terms from time to time. We will notify users of any
                material changes by updating the "Last updated" date at the top of this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Contact</h2>
              <p className="text-base-content/80">
                Questions about these Terms should be sent to{' '}
                <a href={`mailto:${legal.contactEmail}`} className="link">{legal.contactEmail}</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
