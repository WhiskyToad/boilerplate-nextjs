"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/features/profile/UserProfile";
import { SubscriptionManager } from "@/features/subscription/SubscriptionManager";
import { Tabs } from "@/components/ui/tabs/Tabs";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "profile", label: "Profile" },
    { id: "subscription", label: "Subscription" },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Dashboard
            </h1>
            <p className="text-base-content/70">
              Welcome back, {user?.email}!
            </p>
          </div>

          <Tabs 
            items={tabs} 
            activeTab={activeTab} 
            onChange={setActiveTab}
          />

          <div className="mt-6">
            {activeTab === "overview" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title text-lg">Welcome!</h2>
                    <p className="text-base-content/70 text-sm">
                      Your SaaS dashboard is ready. Start building your next big idea!
                    </p>
                  </div>
                </div>
                
                <div className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title text-lg">Quick Start</h2>
                    <p className="text-base-content/70 text-sm">
                      Check out the Profile and Subscription tabs to get started.
                    </p>
                  </div>
                </div>
                
                <div className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title text-lg">Documentation</h2>
                    <p className="text-base-content/70 text-sm">
                      Check the README for guidance on customizing this boilerplate.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && <UserProfile />}

            {activeTab === "subscription" && <SubscriptionManager />}
          </div>
        </div>
      </div>
    </div>
  );
}