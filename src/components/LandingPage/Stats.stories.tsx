import type { Meta, StoryObj } from "@storybook/react";
import Stats from "./Stats";

const meta: Meta<typeof Stats> = {
  title: "Landing Page/Stats",
  component: Stats,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    bgVariant: {
      control: { type: "select" },
      options: ["default", "primary", "secondary", "neutral"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stats>;

export const Default: Story = {
  args: {},
};

export const Primary: Story = {
  args: {
    title: "Our Impact",
    subtitle: "Numbers that speak for themselves",
    bgVariant: "primary",
    stats: [
      {
        value: 97,
        suffix: "%",
        label: "Customer Satisfaction",
        description: "Based on post-support surveys",
        duration: 2,
        decimals: 0,
      },
      {
        value: 24,
        suffix: "hr",
        label: "Average Response Time",
        description: "For all support requests",
        duration: 2,
        decimals: 0,
      },
      {
        value: 5000,
        suffix: "+",
        label: "Businesses Helped",
        description: "Across 30+ countries",
        duration: 2.5,
        decimals: 0,
      },
      {
        value: 10,
        suffix: "M",
        label: "Tasks Completed",
        description: "On our platform",
        duration: 3,
        decimals: 0,
      },
    ],
  },
};

export const BusinessMetrics: Story = {
  args: {
    title: "Business Impact",
    subtitle: "How our solution affects your bottom line",
    bgVariant: "secondary",
    stats: [
      {
        value: 31,
        suffix: "%",
        label: "Average ROI",
        description: "Within first 6 months",
        duration: 2,
        decimals: 0,
      },
      {
        value: 62,
        suffix: "%",
        label: "Productivity Increase",
        description: "Reported by customers",
        duration: 2,
        decimals: 0,
      },
      {
        value: 4.2,
        prefix: "$",
        suffix: "M",
        label: "Customer Savings",
        description: "Annual average for enterprise",
        duration: 2.5,
        decimals: 1,
      },
      {
        value: 28,
        suffix: "%",
        label: "Reduced Overhead",
        description: "Through process optimization",
        duration: 2,
        decimals: 0,
      },
    ],
  },
};

export const MinimalStyle: Story = {
  args: {
    title: "",
    subtitle: "",
    bgVariant: "neutral",
    stats: [
      {
        value: 8,
        suffix: "yrs",
        label: "Experience",
        duration: 1.5,
        decimals: 0,
      },
      {
        value: 45,
        suffix: "+",
        label: "Team Members",
        duration: 1.5,
        decimals: 0,
      },
      {
        value: 4.9,
        label: "Average Rating",
        duration: 1.5,
        decimals: 1,
      },
      {
        value: 24,
        suffix: "/7",
        label: "Support",
        duration: 1.5,
        decimals: 0,
      },
    ],
  },
};
