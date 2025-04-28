import type { Meta, StoryObj } from "@storybook/react";
import Pricing from "./Pricing";

const meta: Meta<typeof Pricing> = {
  title: "Landing Page/Pricing",
  component: Pricing,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: {},
};

export const SaaS: Story = {
  args: {
    title: "Choose the Plan That's Right for You",
    subtitle:
      "All plans include a 14-day trial period with no credit card required.",
    specialOfferText: "Save 20% with annual billing on all plans",
    tiers: [
      {
        name: "Basic",
        price: "Free",
        billingPeriod: "forever",
        description: "For individuals getting started",
        features: [
          { text: "Up to 3 projects", included: true },
          { text: "Basic templates", included: true },
          { text: "1GB storage", included: true },
          { text: "Community support", included: true },
          { text: "Advanced features", included: false },
          { text: "Team collaboration", included: false },
          { text: "API access", included: false },
        ],
        primaryAction: "Sign Up for Free",
        primaryActionLink: "/signup?plan=basic",
        highlight: false,
      },
      {
        name: "Professional",
        price: "$19",
        billingPeriod: "/month",
        description: "For freelancers and professionals",
        features: [
          { text: "Unlimited projects", included: true },
          { text: "All templates", included: true },
          { text: "10GB storage", included: true },
          { text: "Priority email support", included: true },
          { text: "Advanced features", included: true },
          { text: "Limited collaboration", included: true },
          { text: "API access", included: false },
        ],
        primaryAction: "Start Free Trial",
        primaryActionLink: "/signup?plan=pro",
        highlight: true,
        badge: "POPULAR",
      },
      {
        name: "Business",
        price: "$49",
        billingPeriod: "/month",
        description: "For teams and growing businesses",
        features: [
          { text: "Unlimited projects", included: true },
          { text: "All templates", included: true },
          { text: "100GB storage", included: true },
          { text: "24/7 phone support", included: true },
          { text: "Advanced features", included: true },
          { text: "Full team collaboration", included: true },
          { text: "API access", included: true },
        ],
        primaryAction: "Start Free Trial",
        primaryActionLink: "/signup?plan=business",
        highlight: false,
      },
    ],
  },
};

export const Agency: Story = {
  args: {
    title: "Agency Pricing",
    subtitle: "Tailored solutions for creative agencies",
    tiers: [
      {
        name: "Starter",
        price: "$99",
        billingPeriod: "/month",
        description: "For small agencies",
        features: [
          { text: "Up to 10 clients", included: true },
          { text: "5 team members", included: true },
          { text: "Project management tools", included: true },
          { text: "Basic client reporting", included: true },
          { text: "Advanced automation", included: false },
          { text: "White labeling", included: false },
        ],
        primaryAction: "Start Free Trial",
        primaryActionLink: "/agency/signup?plan=starter",
        highlight: false,
      },
      {
        name: "Growth",
        price: "$249",
        billingPeriod: "/month",
        description: "For growing agencies",
        features: [
          { text: "Up to 25 clients", included: true },
          { text: "15 team members", included: true },
          { text: "Advanced project management", included: true },
          { text: "Comprehensive client reporting", included: true },
          { text: "Advanced automation", included: true },
          { text: "White labeling", included: true },
        ],
        primaryAction: "Start Free Trial",
        primaryActionLink: "/agency/signup?plan=growth",
        highlight: true,
        badge: "BEST VALUE",
      },
      {
        name: "Scale",
        price: "$499",
        billingPeriod: "/month",
        description: "For established agencies",
        features: [
          { text: "Unlimited clients", included: true },
          { text: "Unlimited team members", included: true },
          { text: "Premium project management", included: true },
          { text: "Custom client dashboards", included: true },
          { text: "Full automation suite", included: true },
          { text: "Advanced white labeling", included: true },
        ],
        primaryAction: "Contact Sales",
        primaryActionLink: "/agency/contact",
        highlight: false,
      },
    ],
  },
};
