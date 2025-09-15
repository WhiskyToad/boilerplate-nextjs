'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/features/landing/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleGetStarted = () => {
    router.push('/signup')
  }

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-base-content max-w-none">
            <h1>Terms of Service</h1>
            <p className="text-base-content/70 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using our feedback widget service, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h2>Use License</h2>
            <p>Permission is granted to temporarily use our service for personal and commercial purposes. This license shall automatically terminate if you violate any of these restrictions.</p>
            
            <h3>You may not:</h3>
            <ul>
              <li>Modify or copy the service materials</li>
              <li>Use the service for any commercial purpose without proper subscription</li>
              <li>Attempt to reverse engineer or copy any part of the service</li>
              <li>Remove any copyright or proprietary notations</li>
            </ul>
            
            <h2>User Accounts</h2>
            <p>You are responsible for safeguarding your account credentials and for all activities that occur under your account.</p>
            
            <h2>Acceptable Use</h2>
            <p>You agree not to use the service to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Transmit harmful, offensive, or illegal content</li>
              <li>Interfere with the service or other users</li>
              <li>Collect user data without consent</li>
            </ul>
            
            <h2>Service Availability</h2>
            <p>We strive to provide reliable service but do not guarantee 100% uptime. We reserve the right to modify, suspend, or discontinue the service at any time.</p>
            
            <h2>Limitation of Liability</h2>
            <p>In no event shall we be liable for any damages arising out of the use or inability to use our service.</p>
            
            <h2>Privacy</h2>
            <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.</p>
            
            <h2>Changes to Terms</h2>
            <p>We reserve the right to revise these terms at any time. Continued use of the service constitutes acceptance of revised terms.</p>
            
            <h2>Contact Information</h2>
            <p>Questions about the Terms of Service should be sent to us through our support channels.</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-base-content mb-8">Terms of Service</h1>
        
        <div className="bg-base-100 rounded-xl p-8 prose prose-lg max-w-none">
          <p className="text-base-content/70 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Acceptance of Terms</h2>
            <p className="text-base-content/80">
              By accessing and using Boost Toad, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Description of Service</h2>
            <p className="text-base-content/80 mb-4">
              Boost Toad provides a feedback widget service that allows you to collect user feedback, 
              bug reports, and reviews on your website.
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2">
              <li>Embeddable feedback widgets</li>
              <li>Dashboard for managing feedback</li>
              <li>Analytics and reporting features</li>
            </ul>
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

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Subscription Plans</h2>
            <p className="text-base-content/80 mb-4">
              Our service offers free and paid subscription plans:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2">
              <li>Free plan includes basic features with usage limits</li>
              <li>Paid plans offer increased limits and additional features</li>
              <li>Subscriptions are billed monthly or annually</li>
              <li>You may cancel your subscription at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Acceptable Use</h2>
            <p className="text-base-content/80 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to gain unauthorized access to the service</li>
              <li>Violate any laws in your jurisdiction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Privacy</h2>
            <p className="text-base-content/80">
              Your privacy is important to us. Please review our{' '}
              <a href="/privacy" className="link">Privacy Policy</a> to understand 
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
        </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}