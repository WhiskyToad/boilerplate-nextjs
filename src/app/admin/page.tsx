"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FiUsers, FiFolder, FiDollarSign, FiActivity } from "react-icons/fi";
import { Card } from "@/components/ui/card/Card";
import { ROUTES } from "@/config/routes";

interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProjects: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  // List of admin emails (configure this in your environment or database)
  const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

  useEffect(() => {
    if (!loading && !user) {
      router.push(ROUTES.auth.login);
      return;
    }

    if (user && !ADMIN_EMAILS.includes(user.email || '')) {
      router.push(ROUTES.app.home);
      return;
    }

    if (user && ADMIN_EMAILS.includes(user.email || '')) {
      setIsAuthorized(true);
      fetchAdminStats();
    }
  }, [user, loading, router]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">Admin Dashboard</h1>
          <p className="text-base-content/70 mt-2">
            Overview of your SaaS metrics and user activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-base-content">
                  {loadingStats ? '...' : stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Total Projects */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-base-content">
                  {loadingStats ? '...' : stats.totalProjects}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <FiFolder className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          {/* Active Subscriptions */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Active Subscriptions</p>
                <p className="text-3xl font-bold text-base-content">
                  {loadingStats ? '...' : stats.activeSubscriptions}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <FiActivity className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          {/* Total Revenue */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">MRR</p>
                <p className="text-3xl font-bold text-base-content">
                  {loadingStats ? '...' : `$${stats.totalRevenue}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Setup Instructions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-base-content mb-4">Admin Dashboard Setup</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-base-content/70 mb-4">
              To fully enable the admin dashboard, you need to:
            </p>
            <ol className="text-base-content/70 space-y-2">
              <li>Add admin email addresses to your environment variables:
                <code className="block mt-2 p-2 bg-base-200 rounded text-sm">
                  NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com
                </code>
              </li>
              <li>Create the admin stats API endpoint at <code>/api/admin/stats</code></li>
              <li>Implement database queries to fetch user, project, and subscription counts</li>
              <li>Add Stripe integration to calculate Monthly Recurring Revenue (MRR)</li>
            </ol>
            <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded">
              <p className="text-sm font-medium">
                <strong>Note:</strong> This is a basic admin dashboard template. Customize it based on your specific needs and add more metrics as your SaaS grows.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
