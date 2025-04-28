import type { Meta, StoryObj } from "@storybook/react";
import SingleFeature from "./SingleFeature";

const meta: Meta<typeof SingleFeature> = {
  title: "Landing Page/SingleFeature",
  component: SingleFeature,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "gray"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SingleFeature>;

export const Primary: Story = {
  args: {
    title: "Powerful Analytics",
    description:
      "Get actionable insights with our intuitive analytics dashboard. Track performance, monitor trends, and make data-driven decisions.",
    ctaText: "Learn More",
    ctaLink: "/features/analytics",
    imageUrl: "/images/feature-analytics.png",
    imageAlt: "Analytics Dashboard",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    title: "Team Collaboration",
    description:
      "Work seamlessly with your team in real-time. Share projects, assign tasks, and keep everyone on the same page.",
    ctaText: "Try It Free",
    ctaLink: "/signup",
    imageUrl: "/images/feature-collaboration.png",
    imageAlt: "Team Collaboration Interface",
    variant: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    title: "AI-Powered Insights",
    description:
      "Our machine learning algorithms analyze your data to provide personalized recommendations and insights.",
    ctaText: "See How It Works",
    ctaLink: "/features/ai",
    imageUrl: "/images/feature-ai.png",
    imageAlt: "AI Insights Dashboard",
    variant: "tertiary",
  },
};

export const Reversed: Story = {
  args: {
    title: "Mobile Accessibility",
    description:
      "Access your dashboard and all features from any device with our responsive design and dedicated mobile app.",
    ctaText: "Download the App",
    ctaLink: "/download",
    imageUrl: "/images/feature-mobile.png",
    imageAlt: "Mobile App Interface",
    variant: "gray",
    reverse: true,
  },
};
