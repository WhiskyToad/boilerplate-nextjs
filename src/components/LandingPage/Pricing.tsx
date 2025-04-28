import React from "react";
import PricingTier from "./PricingTier";

interface PricingProps {
  title?: string;
  subtitle?: string;
  tiers?: Array<any>; // Using any here as the tier structure is already defined in PricingTier
  onTierSelect?: (tierName: string) => void;
  specialOfferText?: string;
}

const Pricing: React.FC<PricingProps> = ({
  title = "Simple, Transparent Pricing",
  subtitle = "Get started for free",
  specialOfferText = "Special pricing available for early adopters",
  onTierSelect,
  tiers: propTiers,
}) => {
  // Default pricing tiers
  const defaultTiers = [
    {
      name: "Free",
      price: "Free",
      billingPeriod: "forever",
      description: "Try our core features",
      features: [
        { text: "1 project", included: true },
        { text: "Basic features", included: true },
        { text: "Limited resources", included: true },
        { text: "Premium features", included: false },
        { text: "Advanced functionality", included: false },
        { text: "Priority support", included: false },
        { text: "Custom branding", included: false },
      ],
      primaryAction: "Get Started for Free",
      primaryActionLink: "/signup",
      highlight: false,
      badge: undefined,
    },
    {
      name: "Pro",
      price: "$29",
      billingPeriod: "/month",
      description: "Best value for professionals",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Advanced features", included: true },
        { text: "Premium resources", included: true },
        { text: "Advanced functionality", included: true },
        { text: "API access", included: true },
        { text: "Priority support", included: true },
        { text: "Custom branding", included: true },
      ],
      primaryAction: "Subscribe Now",
      primaryActionLink: "/signup",
      highlight: true,
      badge: "POPULAR",
    },
    {
      name: "Team",
      price: "$49",
      billingPeriod: "/month",
      description: "For growing teams",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Team collaboration", included: true },
        { text: "Advanced permissions", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Custom integrations", included: true },
        { text: "Enterprise security", included: true },
      ],
      primaryAction: "Contact Sales",
      primaryActionLink: "/contact",
      highlight: false,
      badge: undefined,
    },
  ];

  const tiers = propTiers || defaultTiers;

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg max-w-2xl mx-auto text-base-content/70">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <PricingTier key={index} {...tier} onPrimaryAction={onTierSelect} />
          ))}
        </div>

        <div className="text-center mt-8 text-base-content/70">
          <p>All plans include 24/7 customer support</p>
        </div>

        {specialOfferText && (
          <div className="text-center mt-4">
            <div className="flex flex-col items-center text-center md:inline-flex md:flex-row md:items-center md:text-left bg-primary/10 rounded-lg p-3 gap-4">
              <span className="badge badge-primary mb-2 md:mr-2 md:mb-0">
                LIMITED OFFER
              </span>
              <p className="font-medium">{specialOfferText}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
