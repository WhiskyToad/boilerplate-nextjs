import type { Meta, StoryObj } from "@storybook/react";
import ProductScreenshots from "./ProductScreenshots";

const meta: Meta<typeof ProductScreenshots> = {
  title: "Landing Page/ProductScreenshots",
  component: ProductScreenshots,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductScreenshots>;

export const Default: Story = {
  args: {},
};

export const CustomContent: Story = {
  args: {
    title: "See Our Platform in Action",
    subtitle:
      "Watch how our intuitive interface helps teams collaborate and achieve their goals faster.",
    ctaText: "Start Free Trial",
    ctaLink: "/trial",
    videoSrc: "/videos/platform_demo.mp4",
    actionBoxTitle: "Ready to transform your workflow?",
    actionBoxDescription:
      "Join thousands of teams that have improved their productivity with our solution.",
  },
};

export const DeveloperFocused: Story = {
  args: {
    title: "Developer Tools Showcase",
    subtitle:
      "Our IDE integrations and developer tools are built to make coding more efficient and enjoyable.",
    ctaText: "Try Developer Edition",
    ctaLink: "/developer",
    videoSrc: "/videos/dev_tools_demo.mp4",
    actionBoxTitle: "Built by developers, for developers",
    actionBoxDescription:
      "Experience a coding environment designed to maximize productivity and minimize friction.",
  },
};

export const EnterpriseVersion: Story = {
  args: {
    title: "Enterprise-Grade Solutions",
    subtitle:
      "Secure, scalable, and customizable tools designed for enterprise organizations.",
    ctaText: "Request Demo",
    ctaLink: "/enterprise-demo",
    videoSrc: "/videos/enterprise_demo.mp4",
    actionBoxTitle: "Scale with confidence",
    actionBoxDescription:
      "Our enterprise solution grows with your organization while maintaining security and performance.",
  },
};
