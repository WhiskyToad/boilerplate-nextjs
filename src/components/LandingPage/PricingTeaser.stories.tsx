import type { Meta, StoryObj } from "@storybook/react";
import PricingTeaser from "./PricingTeaser";

const meta: Meta<typeof PricingTeaser> = {
  title: "Landing Page/PricingTeaser",
  component: PricingTeaser,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PricingTeaser>;

export const Default: Story = {
  args: {},
};

export const CustomContent: Story = {
  args: {
    title: "Affordable Plans for Every Need",
    subtitle: "Start with our free tier and upgrade as you grow.",
    buttonText: "Explore All Plan Options",
    pricingLink: "/plans",
    freeFeatures: [
      "Unlimited public projects",
      "5 team members",
      "Basic analytics",
      "24/7 community support",
    ],
  },
};

export const BusinessFocused: Story = {
  args: {
    title: "Business-Ready Pricing",
    subtitle: "Enterprise-grade features with flexible pricing options.",
    buttonText: "See Business Plans",
    pricingLink: "/business-plans",
    freeFeatures: [
      "Free 14-day trial of all features",
      "Basic analytics dashboard",
      "Up to 3 team members",
      "Standard support",
      "1GB storage",
    ],
  },
};

export const DeveloperPlan: Story = {
  args: {
    title: "Developer-Friendly Pricing",
    subtitle:
      "Powerful tools at affordable prices for solo developers and small teams.",
    buttonText: "Compare Developer Plans",
    pricingLink: "/developer-pricing",
    freeFeatures: [
      "Full API access",
      "Local development environment",
      "CLI tools",
      "GitHub integration",
      "Developer community access",
    ],
  },
};
