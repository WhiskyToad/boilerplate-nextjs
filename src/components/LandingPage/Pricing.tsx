import React from "react";
import PricingTier from "./PricingTier";
import { useFeatureFlagVariantKey } from "posthog-js/react";

const Pricing: React.FC = () => {
  // Change feature flag to test different price points
  const priceVariant = useFeatureFlagVariantKey("pricing-test") || "control";

  // Free tier is consistent across variants
  const freeTier = {
    name: "Free",
    price: "Free",
    billingPeriod: "forever",
    description: "Try our core blueprint generator",
    features: [
      { text: "1 active project", included: true },
      { text: "Blueprint", included: true },
      { text: "2 Features planned", included: true },
      { text: "Feature prioritization", included: false },
      { text: "Complete Roadmap planning", included: false },
      { text: "Unlimited generations", included: false },
      { text: "Launch preparation", included: false },
    ],
    primaryAction: "Get Started for Free",
    primaryActionLink: "/create-project",
    secondaryActionLink: undefined,
    highlight: false,
    stripePriceId: null,
    badge: undefined,
  };

  // Monthly tier is consistent across variants
  const monthlyTier = {
    name: "Monthly",
    price: "$15",
    billingPeriod: "/month",
    description: "All features, flexible monthly billing",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Advanced AI blueprints", included: true },
      { text: "Feature prioritization", included: true },
      { text: "Complete roadmap planning", included: true },
      { text: "Task management & tracking", included: true },
      { text: "AI-powered validation", included: true },
      { text: "Launch preparation tools", included: true },
    ],
    primaryAction: "Subscribe Monthly",
    primaryActionLink: "/create-project",
    secondaryActionLink: undefined,
    highlight: false,
    stripePriceId: "price_1RHiJl055mI3GdoM7GYAFXQ5",
    badge: undefined,
  };

  // Price variants for annual tier
  const annualTiers = {
    // Control/default pricing
    control: {
      name: "Annual",
      price: "$9.99",
      billingPeriod: "/year",
      description: "Best value for serious builders",
      badge: "BEST VALUE",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Advanced AI blueprints", included: true },
        { text: "Feature prioritization", included: true },
        { text: "Complete roadmap planning", included: true },
        { text: "Task management & tracking", included: true },
        { text: "AI-powered validation", included: true },
        { text: "Launch preparation tools", included: true },
      ],
      primaryAction: "Subscribe Annually",
      primaryActionLink: "/create-project",
      highlight: true,
      stripePriceId: "price_1RHiL2055mI3GdoMwjiC3PvM",
    },
    // Lower annual price testing
    low_price: {
      name: "Annual",
      price: "$4.99",
      billingPeriod: "/year",
      description: "80% savings compared to monthly",
      badge: "BEST VALUE",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Advanced AI blueprints", included: true },
        { text: "Feature prioritization", included: true },
        { text: "Complete roadmap planning", included: true },
        { text: "Task management & tracking", included: true },
        { text: "AI-powered validation", included: true },
        { text: "Launch preparation tools", included: true },
      ],
      primaryAction: "Subscribe Annually",
      primaryActionLink: "/create-project",
      highlight: true,
      stripePriceId: "price_1RH9E0055mI3GdoM12RVWAP1",
    },
    // Higher annual price testing
    high_price: {
      name: "Annual",
      price: "$19.99",
      billingPeriod: "/year",
      description: "Absolute best value for serious builders",
      badge: "BEST VALUE",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Advanced AI blueprints", included: true },
        { text: "Feature prioritization", included: true },
        { text: "Complete roadmap planning", included: true },
        { text: "Task management & tracking", included: true },
        { text: "AI-powered validation", included: true },
        { text: "Launch preparation tools", included: true },
      ],
      primaryAction: "Subscribe Annually",
      primaryActionLink: "/create-project",
      highlight: true,
      stripePriceId: "price_1RHiJl055mI3GdoM7GYAFXQ5",
    },
  };

  // Define the possible keys for annualTiers
  type AnnualTierKey = keyof typeof annualTiers;

  // Get the annual tier based on the active variant, ensuring the key is valid
  const validPriceVariant =
    typeof priceVariant === "string" && priceVariant in annualTiers
      ? (priceVariant as AnnualTierKey)
      : "control";
  const annualTier = annualTiers[validPriceVariant];

  // Final tiers to display, in order
  const tiers = [freeTier, annualTier, monthlyTier];

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-base-content/70">
            Get started for free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <PricingTier
              key={index}
              name={tier.name}
              price={tier.price}
              billingPeriod={tier.billingPeriod}
              description={tier.description}
              features={tier.features}
              primaryAction={tier.primaryAction}
              primaryActionLink={tier.primaryActionLink}
              highlight={tier.highlight}
              badge={tier.badge}
              stripePriceId={tier.stripePriceId}
              variant={priceVariant as string} // Pass the variant to track in analytics
            />
          ))}
        </div>

        <div className="text-center mt-8 text-base-content/70">
          <p>All paid plans include unlimited AI generations</p>
        </div>

        <div className="text-center mt-4">
          <div className="flex flex-col items-center text-center md:inline-flex md:flex-row md:items-center md:text-left bg-primary/10 rounded-lg p-3 gap-4">
            <span className="badge badge-primary mb-2 md:mr-2 md:mb-0">
              LIMITED OFFER
            </span>
            <p className="font-medium">
              Special pricing available for early adopters
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
