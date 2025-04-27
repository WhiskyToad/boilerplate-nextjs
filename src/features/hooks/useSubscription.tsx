import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { supabase } from "@/features/supabase/client";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "canceled"
  | "incomplete"
  | "past_due"
  | "unpaid"
  | "free";
export type PlanType = "Free" | "Monthly" | "Annual" | null;

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user } = useAuthStore();

  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscription", user],
    queryFn: async (): Promise<Subscription | null> => {
      if (!user) return null;

      // Check for an active subscription in the database
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // If no subscription is found, return a free plan status
        if (error.code === "PGRST116") {
          return {
            id: "free-plan",
            user_id: user.id,
            stripe_customer_id: "",
            stripe_subscription_id: "",
            plan: "Free",
            status: "free",
            current_period_end: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
        throw error;
      }

      return data as Subscription;
    },
    enabled: !!user, // Only run the query if a user is logged in
  });

  // Helper functions to check subscription status
  const isActive =
    !!subscription &&
    (subscription.status === "active" ||
      subscription.status === "trialing" ||
      subscription.status === "free");

  // Check if user is on a paid plan
  const isPaid =
    !!subscription &&
    subscription.status === "active" &&
    (subscription.plan === "Monthly" || subscription.plan === "Annual");

  // Check if user is on a free plan
  const isFree =
    !subscription ||
    subscription.plan === "Free" ||
    subscription.status !== "active";

  // Check if subscription is about to expire (within 14 days)
  const isExpiringSoon =
    !!subscription?.current_period_end &&
    new Date(subscription.current_period_end).getTime() - Date.now() <
      14 * 24 * 60 * 60 * 1000;

  // Calculate days remaining in subscription
  const daysRemaining = subscription?.current_period_end
    ? Math.ceil(
        (new Date(subscription.current_period_end).getTime() - Date.now()) /
          (24 * 60 * 60 * 1000)
      )
    : null;

  return {
    subscription,
    isLoading,
    error,
    refetch,
    isActive,
    isPaid,
    isFree,
    isExpiringSoon,
    daysRemaining,
    planType: subscription?.plan || "Free",
  };
}
