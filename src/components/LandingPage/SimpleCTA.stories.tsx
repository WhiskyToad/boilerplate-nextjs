import type { Meta, StoryObj } from "@storybook/react";
import SimpleCTA from "./SimpleCTA";

const meta: Meta<typeof SimpleCTA> = {
  title: "Landing Page/SimpleCTA",
  component: SimpleCTA,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimpleCTA>;

export const Default: Story = {
  args: {},
};

export const CustomContent: Story = {
  args: {
    title: "Start Your Digital Transformation Today",
    description:
      "Join thousands of businesses that have already transformed their operations with our platform.",
    buttonText: "Begin Your Journey",
    buttonLink: "/start",
    logoSrc: "/logo/icon-blue.png",
  },
};

export const NoLogo: Story = {
  args: {
    title: "Ready to Boost Your Productivity?",
    description: "Our tools are designed to help you work smarter, not harder.",
    buttonText: "Get Started",
    buttonLink: "/register",
    logoSrc: undefined,
  },
};

export const Enterprise: Story = {
  args: {
    title: "Enterprise Solutions",
    description:
      "Custom-tailored solutions for large organizations with complex needs. Contact our sales team to discuss your requirements.",
    buttonText: "Contact Sales",
    buttonLink: "/enterprise",
    logoSrc: "/logo/enterprise-icon.png",
  },
};
