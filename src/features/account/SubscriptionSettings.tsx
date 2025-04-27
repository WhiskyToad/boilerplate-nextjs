import React from "react";
import { useRouter } from "next/router";
import { useSubscription } from "@/features/hooks/useSubscription";
import { FiAlertTriangle, FiCheck } from "react-icons/fi";

const PlanFeatures = {
  Free: ["1 active project", "AI-generated product blueprint"],
  Monthly: [
    "Unlimited projects",
    "Advanced AI blueprints",
    "Feature prioritization",
    "Complete roadmap planning",
    "Task management & tracking",
    "AI-powered validation",
    "Launch preparation tools",
  ],
  Annual: [
    "Unlimited projects",
    "Advanced AI blueprints",
    "Feature prioritization",
    "Complete roadmap planning",
    "Task management & tracking",
    "AI-powered validation",
    "Launch preparation tools",
    "80% discount compared to monthly",
  ],
};

const SubscriptionSettings = () => {
  const router = useRouter();
  const {
    subscription,
    isLoading,
    isPaid,
    isFree,
    planType,
    daysRemaining,
    refetch,
  } = useSubscription();
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const handleUpgrade = async () => {
    router.push("/pricing");
  };

  const handleManageSubscription = async () => {
    try {
      setIsUpgrading(true);
      const response = await fetch("/api/create-customer-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating customer portal session:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period."
      )
    ) {
      return;
    }

    try {
      setIsCanceling(true);
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscription?.stripe_subscription_id,
        }),
      });

      if (response.ok) {
        await refetch();
        router.reload();
      } else {
        throw new Error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Subscription Management</h2>

      <div className="bg-base-200 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Current Plan: {planType}</h3>
            <p className="text-base-content/70">
              {isPaid
                ? `Your subscription ${
                    subscription?.status === "active" ? "renews" : "expires"
                  } in ${daysRemaining} days`
                : "You are currently on the free plan"}
            </p>

            {subscription?.status === "canceled" && (
              <div className="mt-3 flex items-center text-warning">
                <FiAlertTriangle className="mr-2" />
                <span>
                  Your subscription has been canceled and will expire on{" "}
                  {new Date(
                    subscription.current_period_end!
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0">
            {isFree ? (
              <button className="btn btn-primary" onClick={handleUpgrade}>
                Upgrade Now
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleManageSubscription}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      Loading...
                    </>
                  ) : (
                    "Manage Billing"
                  )}
                </button>

                {subscription?.status === "active" && (
                  <button
                    className="btn btn-outline btn-error"
                    onClick={handleCancelSubscription}
                    disabled={isCanceling}
                  >
                    {isCanceling ? (
                      <>
                        <span className="loading loading-spinner loading-xs mr-2"></span>
                        Canceling...
                      </>
                    ) : (
                      "Cancel Subscription"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Your Plan Includes:</h3>
        <ul className="space-y-2">
          {PlanFeatures[planType]?.map((feature, index) => (
            <li key={index} className="flex items-center">
              <FiCheck className="text-success mr-3" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {isFree && (
        <div className="bg-primary/10 border border-primary/30 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Upgrade to Premium</h3>
          <p className="mb-4">
            Get unlimited projects, feature prioritization, roadmap planning,
            and more with our premium plans.
          </p>
          <button className="btn btn-primary" onClick={handleUpgrade}>
            View Plans
          </button>
        </div>
      )}

      {subscription?.status === "canceled" && (
        <div className="bg-warning/10 border border-warning/30 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">
            Reactivate Your Subscription
          </h3>
          <p className="mb-4">
            Your subscription has been canceled and will expire soon. Reactivate
            now to keep access to premium features.
          </p>
          <button className="btn btn-primary" onClick={handleUpgrade}>
            Reactivate Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSettings;
