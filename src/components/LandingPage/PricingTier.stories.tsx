import type { Meta, StoryObj } from "@storybook/react";
import PricingTier from "./PricingTier";

const meta: Meta<typeof PricingTier> = {
  title: "Landing Page/PricingTier",
  component: PricingTier,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PricingTier>;

export const Free: Story = {
  args: {
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
    ],
    primaryAction: "Get Started for Free",
    primaryActionLink: "/signup",
    highlight: false,
  },
};

export const Pro: Story = {
  args: {
    name: "Pro",
    price: "$29",
    billingPeriod: "/month",
    description: "Everything you need for professional use",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Advanced features", included: true },
      { text: "Premium resources", included: true },
      { text: "API access", included: true },
      { text: "Priority support", included: true },
    ],
    primaryAction: "Subscribe Now",
    primaryActionLink: "/signup?plan=pro",
    highlight: true,
    badge: "POPULAR",
  },
};

export const Enterprise: Story = {
  args: {
    name: "Enterprise",
    price: "$99",
    originalPrice: "$129",
    billingPeriod: "/month",
    description: "For large organizations with custom needs",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Team collaboration", included: true },
      { text: "Advanced permissions", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
    ],
    primaryAction: "Contact Sales",
    primaryActionLink: "/contact",
    highlight: false,
  },
};
