import type { Meta, StoryObj } from "@storybook/react";
import FinalCTA from "./FinalCTA";

const meta: Meta<typeof FinalCTA> = {
  title: "Landing Page/FinalCTA",
  component: FinalCTA,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FinalCTA>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    headline: "Transform Your Business Today",
    subtext:
      "Join thousands of businesses that have streamlined their operations and increased productivity with our platform.",
    buttonText: "Start Your Transformation",
    buttonLink: "/start",
    variant: "secondary",
  },
};

export const Error: Story = {
  args: {
    headline: "Limited Time Offer!",
    subtext:
      "Sign up now to lock in our special launch pricing. This offer ends in 48 hours!",
    buttonText: "Claim Special Pricing",
    buttonLink: "/special-offer",
    variant: "error",
  },
};

export const NoLogo: Story = {
  args: {
    headline: "Ready to Join Our Community?",
    subtext:
      "Connect with thousands of like-minded professionals, access exclusive resources, and take your skills to the next level.",
    buttonText: "Join Now",
    buttonLink: "/community",
    logoSrc: undefined,
    variant: "primary",
  },
};
