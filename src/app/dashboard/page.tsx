"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-xl text-base-content/70 mb-8">
              Hi {user?.email?.split('@')[0]}! Your account is all set up.
            </p>

            <div className="card bg-base-200 shadow-lg max-w-2xl mx-auto">
              <div className="card-body text-left">
                <h2 className="card-title text-2xl mb-4">Ready to build your MVP?</h2>
                <p className="text-base-content/70 mb-4">
                  This dashboard is intentionally empty - it's your blank canvas. Start building your unique features here.
                </p>
                <div className="space-y-2 text-sm text-base-content/70">
                  <p>✓ Authentication is configured</p>
                  <p>✓ Payments are ready via Stripe</p>
                  <p>✓ Database is set up with Supabase</p>
                  <p>✓ UI components are available</p>
                </div>
                <div className="card-actions justify-end mt-6">
                  <a href="/dev" className="btn btn-primary">
                    View Developer Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}