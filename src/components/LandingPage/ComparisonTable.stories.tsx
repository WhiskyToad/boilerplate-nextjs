import type { Meta, StoryObj } from "@storybook/react";
import ComparisonTable from "./ComparisonTable";

const meta: Meta<typeof ComparisonTable> = {
  title: "Landing Page/ComparisonTable",
  component: ComparisonTable,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ComparisonTable>;

export const Default: Story = {
  args: {},
};

export const SaaSComparison: Story = {
  args: {
    title: "How We Compare",
    subtitle: "See why customers choose us over the competition",
    yourProductName: "Our Platform",
    competitors: ["Competitor X", "Competitor Y"],
    features: [
      {
        name: "Core Features",
        description: "Essential capabilities for all users",
        yourProduct: true,
        competitorValues: [true, true],
        category: "Features",
      },
      {
        name: "Advanced Analytics",
        description: "Detailed insights and reporting capabilities",
        yourProduct: true,
        competitorValues: ["Limited", "Premium tier only"],
        category: "Features",
      },
      {
        name: "API Access",
        description: "Connect with other tools and services",
        yourProduct: true,
        competitorValues: [true, false],
        category: "Features",
      },
      {
        name: "White Labeling",
        description: "Apply your own branding",
        yourProduct: true,
        competitorValues: ["Premium tier only", "Premium tier only"],
        category: "Customization",
      },
      {
        name: "Custom Workflows",
        description: "Create your own process flows",
        yourProduct: true,
        competitorValues: [false, "Limited"],
        category: "Customization",
      },
      {
        name: "24/7 Support",
        description: "Get help whenever you need it",
        yourProduct: true,
        competitorValues: [false, "Premium tier only"],
        category: "Support",
      },
      {
        name: "Free Trial Period",
        description: "Try before you buy",
        yourProduct: "30 days",
        competitorValues: ["14 days", "7 days"],
        category: "Pricing",
      },
    ],
  },
};

export const TechnicalComparison: Story = {
  args: {
    title: "Technical Comparison",
    subtitle: "Feature-by-feature comparison of development platforms",
    yourProductName: "Our Framework",
    competitors: ["Framework A", "Framework B", "Framework C"],
    features: [
      {
        name: "TypeScript Support",
        yourProduct: true,
        competitorValues: [true, true, false],
        category: "Language Support",
      },
      {
        name: "Server-side Rendering",
        yourProduct: true,
        competitorValues: [true, false, "Partial"],
        category: "Rendering",
      },
      {
        name: "Static Site Generation",
        yourProduct: true,
        competitorValues: [true, "Partial", false],
        category: "Rendering",
      },
      {
        name: "Incremental Static Regeneration",
        description: "Update static content without full rebuilds",
        yourProduct: true,
        competitorValues: [false, false, false],
        category: "Rendering",
      },
      {
        name: "File-based Routing",
        yourProduct: true,
        competitorValues: [true, false, "Via plugin"],
        category: "Developer Experience",
      },
      {
        name: "Hot Module Replacement",
        yourProduct: true,
        competitorValues: [true, true, "Limited"],
        category: "Developer Experience",
      },
      {
        name: "Built-in Testing Framework",
        yourProduct: true,
        competitorValues: ["Via plugin", "Via plugin", false],
        category: "Testing",
      },
      {
        name: "Automated Accessibility Tests",
        yourProduct: true,
        competitorValues: [false, "Via plugin", false],
        category: "Testing",
      },
    ],
  },
};

export const PricingComparison: Story = {
  args: {
    title: "Pricing Plans Comparison",
    subtitle: "Find the right plan for your needs",
    yourProductName: "Our Plans",
    competitors: ["Company X", "Company Y"],
    features: [
      {
        name: "Monthly Price",
        yourProduct: "$19",
        competitorValues: ["$29", "$25"],
        category: "Pricing",
      },
      {
        name: "Annual Discount",
        yourProduct: "20%",
        competitorValues: ["10%", "15%"],
        category: "Pricing",
      },
      {
        name: "Users Included",
        yourProduct: "5",
        competitorValues: ["3", "2"],
        category: "Team",
      },
      {
        name: "Additional User Cost",
        yourProduct: "$5/user",
        competitorValues: ["$10/user", "$8/user"],
        category: "Team",
      },
      {
        name: "Storage",
        yourProduct: "50GB",
        competitorValues: ["25GB", "30GB"],
        category: "Resources",
      },
      {
        name: "API Requests",
        yourProduct: "Unlimited",
        competitorValues: ["10,000/day", "50,000/month"],
        category: "Resources",
      },
    ],
  },
};
