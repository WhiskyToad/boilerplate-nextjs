import type { Meta, StoryObj } from "@storybook/react";
import Features from "./Features";
import {
  FaSearchDollar,
  FaLightbulb,
  FaChartLine,
  FaRocket,
  FaClock,
  FaCode,
  FaLock,
  FaCog,
} from "react-icons/fa";

const meta: Meta<typeof Features> = {
  title: "Landing Page/Features",
  component: Features,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Features>;

export const Default: Story = {
  args: {},
};

export const BusinessFeatures: Story = {
  args: {
    title: "Business Solutions",
    features: [
      {
        icon: <FaSearchDollar className="w-8 h-8 text-primary" />,
        title: "Cost Analysis",
        description:
          "Identify cost-saving opportunities and optimize your budget with our advanced analytics tools.",
      },
      {
        icon: <FaLightbulb className="w-8 h-8 text-primary" />,
        title: "Strategic Planning",
        description:
          "Plan your business strategy with data-driven insights and forecasting tools.",
      },
      {
        icon: <FaChartLine className="w-8 h-8 text-primary" />,
        title: "Performance Tracking",
        description:
          "Monitor key performance indicators and business metrics in real-time dashboards.",
      },
      {
        icon: <FaRocket className="w-8 h-8 text-primary" />,
        title: "Growth Optimization",
        description:
          "Identify growth opportunities and optimize your sales funnel with our proven strategies.",
      },
    ],
  },
};

export const TechnicalFeatures: Story = {
  args: {
    title: "Technical Capabilities",
    features: [
      {
        icon: <FaCode className="w-8 h-8 text-primary" />,
        title: "API Integration",
        description:
          "Connect with your existing tools through our comprehensive API and webhook system.",
      },
      {
        icon: <FaCog className="w-8 h-8 text-primary" />,
        title: "Customizable Workflows",
        description:
          "Create automated workflows tailored to your specific business processes and requirements.",
      },
      {
        icon: <FaLock className="w-8 h-8 text-primary" />,
        title: "Enterprise Security",
        description:
          "Protect your data with advanced security features including encryption and role-based access controls.",
      },
      {
        icon: <FaClock className="w-8 h-8 text-primary" />,
        title: "Real-time Updates",
        description:
          "Stay informed with real-time notifications and updates across all your projects and teams.",
      },
    ],
  },
};
