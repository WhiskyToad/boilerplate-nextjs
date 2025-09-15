"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Dashboard
            </h1>
            <p className="text-base-content/70">
              Welcome to your dashboard, {user?.email}!
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-lg">Welcome!</h2>
                <p className="text-base-content/70 text-sm">Your dashboard is ready to be customized for your SaaS.</p>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-lg">Add Features</h2>
                <p className="text-base-content/70 text-sm">Start building your app by adding your own features and components.</p>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-lg">Documentation</h2>
                <p className="text-base-content/70 text-sm">Check the README for guidance on customizing this boilerplate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}