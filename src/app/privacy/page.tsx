'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/features/landing/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { siteConfig } from '@/config/site-config'

export default function PrivacyPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleGetStarted = () => {
    router.push('/signup')
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
          <h1 className="text-4xl font-bold text-base-content mb-8">Privacy Policy</h1>

          <div className="bg-base-100 rounded-xl p-8 prose prose-lg max-w-none">
            <p className="text-base-content/70 mb-6">
              <strong>Last updated:</strong> {legal.effectiveDate}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Information We Collect</h2>
              <p className="text-base-content/80 mb-4">
                We collect information you provide directly to us when you use {legal.companyName}.
              </p>
              <ul className="list-disc list-inside text-base-content/80 space-y-2">
                {legal.privacy.dataCollected.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-base-content/80 space-y-2">
                {legal.privacy.dataUsage.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Third-Party Services</h2>
              <p className="text-base-content/80 mb-4">
                We use the following third-party services to provide our service:
              </p>
              <ul className="list-disc list-inside text-base-content/80 space-y-2">
                {legal.privacy.thirdPartyServices.map((service, index) => (
                  <li key={index}>
                    <strong>{service.name}:</strong> {service.purpose}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Data Sharing</h2>
              <p className="text-base-content/80">
                We do not sell, trade, or otherwise transfer your personal information to third parties,
                except as described in this policy or when required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Data Retention</h2>
              <p className="text-base-content/80">
                {legal.privacy.dataRetention}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Your Rights</h2>
              <p className="text-base-content/80 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-base-content/80 space-y-2">
                {legal.privacy.userRights.map((right, index) => (
                  <li key={index}>{right}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Changes to Privacy Policy</h2>
              <p className="text-base-content/80">
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by updating the "Last updated" date at the top of this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Contact</h2>
              <p className="text-base-content/80">
                If you have questions about this Privacy Policy, please contact us at{' '}
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