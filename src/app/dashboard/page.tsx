"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/features/profile/UserProfile";
import { SubscriptionManager } from "@/features/subscription/SubscriptionManager";
import { Tabs } from "@/components/ui/tabs/Tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button/Button";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "demos", label: "Demos" },
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
                    <h2 className="card-title text-lg">DemoFlow</h2>
                    <p className="text-base-content/70 text-sm">
                      Create interactive product demos with our Chrome extension.
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <Link href="/demos">
                        <Button size="sm">Get Started</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "demos" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Interactive Demo Creation</h2>
                <p className="text-base-content/70 mb-6">
                  Create engaging product demos with click-through functionality
                </p>
                <Link href="/demos">
                  <Button>View All Demos</Button>
                </Link>
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