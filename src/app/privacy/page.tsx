'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/features/landing/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
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
            <h1>Privacy Policy</h1>
            <p className="text-base-content/70 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, submit feedback, or contact us for support.</p>
            
            <h3>Account Information</h3>
            <ul>
              <li>Email address</li>
              <li>Name (optional)</li>
              <li>Profile information you choose to provide</li>
            </ul>
            
            <h3>Feedback Data</h3>
            <ul>
              <li>Feedback, bug reports, and reviews submitted through our widget</li>
              <li>Technical information like browser type and page URL</li>
              <li>User interaction data to improve our service</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
            
            <h2>Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            
            <h2>Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            
            <h2>Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. Contact us if you wish to exercise these rights.</p>
            
            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us through our support channels.</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-base-content mb-8">Privacy Policy</h1>
        
        <div className="bg-base-100 rounded-xl p-8 prose prose-lg max-w-none">
          <p className="text-base-content/70 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Information We Collect</h2>
            <p className="text-base-content/80 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our feedback widget, or communicate with us.
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2">
              <li>Account information (email, name)</li>
              <li>Feedback and messages submitted through our widget</li>
              <li>Usage data and analytics (with your consent)</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-base-content/80 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To process transactions and send related information</li>
              <li>To send you technical notices and support messages</li>
              <li>To improve our service (with your consent for analytics)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Cookies and Tracking</h2>
            <p className="text-base-content/80 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2">
              <li><strong>Essential cookies:</strong> Required for login and security</li>
              <li><strong>Analytics cookies:</strong> To understand usage patterns (only with your consent)</li>
            </ul>
            <p className="text-base-content/80 mt-4">
              We use PostHog for analytics, which respects your privacy choices. 
              You can withdraw consent at any time by clearing your browser cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Data Sharing</h2>
            <p className="text-base-content/80">
              We do not sell, trade, or otherwise transfer your personal information to third parties, 
              except as described in this policy. We may share information with:
            </p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2 mt-4">
              <li>Service providers (Supabase for hosting, Stripe for payments)</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Your Rights</h2>
            <p className="text-base-content/80 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-base-content/80 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and data</li>
              <li>Withdraw consent for analytics cookies</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">Changes to Privacy Policy</h2>
            <p className="text-base-content/80">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by updating the "Last updated" date at the top of this page.
            </p>
          </section>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}