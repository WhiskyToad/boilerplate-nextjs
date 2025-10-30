'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiCreditCard, FiUser, FiMail } from 'react-icons/fi';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingBilling, setLoadingBilling] = useState(false);

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  const handleManageBilling = async () => {
    setLoadingBilling(true);
    try {
      const response = await fetch('/api/stripe/manage-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to open billing portal. Please try again.');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setLoadingBilling(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">Settings</h1>
          <p className="text-base-content/70 mt-2">Manage your account and billing</p>
        </div>

        {/* Account Info */}
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Account Information</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5 text-base-content/70" />
                <div>
                  <div className="text-sm text-base-content/70">User ID</div>
                  <div className="font-mono text-sm text-base-content">{user?.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-base-content/70" />
                <div>
                  <div className="text-sm text-base-content/70">Email</div>
                  <div className="text-base-content">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription & Billing */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Subscription & Billing</h2>

            <div className="mb-4">
              <div className="text-base-content/70 mb-2">Current Plan</div>
              <div className="text-2xl font-bold text-primary">Free</div>
              <p className="text-sm text-base-content/70 mt-1">
                Upgrade to unlock premium features
              </p>
            </div>

            <button
              onClick={handleManageBilling}
              disabled={loadingBilling}
              className="btn btn-primary"
            >
              {loadingBilling ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Loading...
                </>
              ) : (
                <>
                  <FiCreditCard className="w-4 h-4" />
                  Manage Billing
                </>
              )}
            </button>

            <div className="divider"></div>

            <div className="text-sm text-base-content/70">
              <p>
                Need help? Contact us at{' '}
                <a href="mailto:support@example.com" className="text-primary hover:underline">
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-ghost"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
