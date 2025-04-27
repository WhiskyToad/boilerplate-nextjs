import React, { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import LoginModal from "../../features/auth/LoginModal";
import { useAuthStore } from "@/features/store/authStore";
import posthog from "posthog-js"; // Keep posthog import if needed for analytics

// Load Stripe outside of component render to avoid recreating Stripe object on renders
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface PricingTierProps {
  name: string;
  price: string;
  originalPrice?: string;
  billingPeriod?: string;
  description: string;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  primaryAction: string;
  primaryActionLink?: string; // Keep if used elsewhere, otherwise can be removed
  highlight?: boolean;
  badge?: string;
  stripePriceId?: string | null;
  variant?: string; // Keep variant for analytics
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  originalPrice,
  billingPeriod,
  description,
  features,
  primaryAction,
  highlight = false,
  badge,
  stripePriceId,
  variant = "control", // Keep variant for analytics
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuthStore();

  // Store the user's intent to checkout
  const [pendingCheckout, setPendingCheckout] = useState(false);
  // Store if user came from free tier button
  const [isFreeTier, setIsFreeTier] = useState(false);

  // Check if user is logged in
  const checkUserLoggedIn = () => {
    return user !== null;
  };

  // Handle successful login
  const handleLoginComplete = () => {
    setIsLoginModalOpen(false);

    // Handle free tier redirect after login
    if (isFreeTier) {
      setIsFreeTier(false);
      // Capture event after successful login for free tier
      posthog.capture("pricing_tier_clicked", {
        tier_name: name,
        price: price,
        price_variant: variant,
        stripe_price_id: stripePriceId,
        action: "redirect_after_login",
      });
      router.push("/create-project");
      return;
    }

    // If the login was triggered by a checkout attempt, proceed with checkout
    if (pendingCheckout) {
      setPendingCheckout(false);
      // Capture event before processing checkout after login
      posthog.capture("pricing_tier_clicked", {
        tier_name: name,
        price: price,
        price_variant: variant,
        stripe_price_id: stripePriceId,
        action: "checkout_after_login",
      });
      processCheckout(user!.id);
    }
  };

  // Process the actual checkout with Stripe
  const processCheckout = async (checkoutUserId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: stripePriceId,
          planType: name,
          userId: checkoutUserId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js has not loaded yet.");
      }
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe checkout error:", error);
        // Optionally capture this error in PostHog
        posthog.capture("stripe_checkout_error", {
          error_message: error.message,
          tier_name: name,
          stripe_price_id: stripePriceId,
        });
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      // Optionally capture this error in PostHog
      posthog.capture("checkout_session_creation_failed", {
        error_message: error instanceof Error ? error.message : String(error),
        tier_name: name,
        stripe_price_id: stripePriceId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    // Capture the initial click event
    posthog.capture("pricing_tier_clicked", {
      tier_name: name,
      price: price,
      price_variant: variant,
      stripe_price_id: stripePriceId,
      action: "initial_click",
      logged_in: checkUserLoggedIn(),
    });

    // Handle free tier - just need authentication, no checkout
    if (name === "Free") {
      if (!checkUserLoggedIn()) {
        // Flag that this is from free tier for post-login handling
        setIsFreeTier(true);
        setIsLoginModalOpen(true);
      } else {
        // User is already logged in, just redirect
        router.push("/create-project");
      }
      return;
    }

    // Handle paid tiers
    if (!checkUserLoggedIn()) {
      setPendingCheckout(true);
      setIsLoginModalOpen(true);
      return;
    }

    // User is logged in, proceed with checkout for paid plans
    await processCheckout(user!.id);
  };

  return (
    <>
      <div
        className={`bg-base-100 rounded-lg border ${
          highlight ? "border-primary shadow-lg relative" : "border-base-300"
        } overflow-hidden flex flex-col h-full`} // Added h-full
      >
        {highlight &&
          badge && ( // Conditionally render badge if highlight is true
            <div className="absolute top-0 inset-x-0">
              <div className="bg-primary text-primary-content text-center py-1 text-sm font-medium uppercase">
                {badge}
              </div>
            </div>
          )}

        <div className={`p-6 ${highlight && badge ? "pt-10" : ""}`}>
          {" "}
          {/* Adjust padding if badge exists */}
          <h3 className="text-xl font-bold mb-1">{name}</h3>{" "}
          {/* Adjusted size */}
          <div className="mt-2 flex items-baseline flex-wrap">
            {" "}
            {/* Adjusted margin */}
            <span className="text-3xl font-bold">{price}</span>{" "}
            {/* Adjusted size */}
            {billingPeriod && (
              <span className="ml-1 text-sm opacity-80">
                {billingPeriod}
              </span> /* Adjusted style */
            )}
            {originalPrice && (
              <span className="ml-2 text-sm text-base-content/60 line-through">
                {" "}
                {/* Adjusted size */}
                {originalPrice}
              </span>
            )}
          </div>
          {/* Removed badge span from here as it's handled above */}
          <p className="mt-2 text-sm text-base-content/70">
            {description}
          </p>{" "}
          {/* Adjusted size */}
          <ul className="mt-6 space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                {" "}
                {/* Use gap */}
                {feature.included ? (
                  <FiCheck className="flex-shrink-0 h-5 w-5 text-success mt-0.5" />
                ) : (
                  <FiX className="flex-shrink-0 h-5 w-5 text-error/50 mt-0.5" /> /* Adjusted color */
                )}
                <span
                  className={`text-base-content ${
                    /* Adjusted class logic */
                    !feature.included ? "text-base-content/50" : ""
                  }`}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 mt-auto border-t border-base-300">
          {" "}
          {/* Added border */}
          <button
            className={`btn w-full ${
              name === "Free"
                ? "btn-outline btn-primary" // Style free tier like others but outline
                : highlight
                ? "btn-primary"
                : "btn-outline btn-primary" // Default to outline primary
            } ${isLoading ? "loading" : ""}`}
            onClick={handleCheckout}
            disabled={isLoading}
            type="button" // Explicitly set type
          >
            {isLoading ? "Processing..." : primaryAction}
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingCheckout(false);
          setIsFreeTier(false);
        }}
        title={isFreeTier ? "Sign in to continue" : "Login to Subscribe"}
        description={
          isFreeTier
            ? "Create an account or log in to start your free project"
            : "Please login or create an account to continue with your subscription"
        }
        onLoginComplete={handleLoginComplete}
      />
    </>
  );
};

export default PricingTier;
