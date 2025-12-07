import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated and is an admin
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (you can customize this check)
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(user.email || '')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch admin stats
    // Note: You'll need to implement these queries based on your database schema

    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Total projects (if you have a projects table)
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    // Active subscriptions (if you have a subscriptions table)
    const { count: activeSubscriptions } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Calculate MRR from active subscriptions
    // This is a simplified example - you'll need to adjust based on your schema
    const { data: subscriptions } = await supabase
      .from('user_subscriptions')
      .select('tier')
      .eq('status', 'active');

    let totalRevenue = 0;
    if (subscriptions) {
      subscriptions.forEach((sub) => {
        // Simple MRR calculation - adjust based on your pricing
        if (sub.tier === 'pro') totalRevenue += 19;
        if (sub.tier === 'teams') totalRevenue += 49;
      });
    }

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalProjects: totalProjects || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
