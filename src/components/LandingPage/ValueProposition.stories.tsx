import type { Meta, StoryObj } from "@storybook/react";
import ValueProposition from "./ValueProposition";
import { FiZap, FiTool, FiShield, FiThumbsUp } from "react-icons/fi";
import { BsKanban } from "react-icons/bs";

const meta: Meta<typeof ValueProposition> = {
  title: "Landing Page/ValueProposition",
  component: ValueProposition,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ValueProposition>;

export const Default: Story = {
  args: {},
};

export const CustomFeatures: Story = {
  args: {
    features: [
      {
        icon: <FiZap className="w-10 h-10 text-primary" />,
        title: "Lightning Fast",
        description:
          "Our platform is optimized for speed to ensure you get results quickly.",
      },
      {
        icon: <FiShield className="w-10 h-10 text-primary" />,
        title: "Highly Secure",
        description:
          "Bank-level security protecting your data with the latest encryption technologies.",
      },
      {
        icon: <FiThumbsUp className="w-10 h-10 text-primary" />,
        title: "User Friendly",
        description:
          "Designed with simplicity in mind, our platform is intuitive and easy to use.",
      },
    ],
  },
};

export const FourFeatures: Story = {
  args: {
    features: [
      {
        icon: <FiZap className="w-10 h-10 text-primary" />,
        title: "Lightning Fast",
        description:
          "Our platform is optimized for speed to ensure you get results quickly.",
      },
      {
        icon: <FiShield className="w-10 h-10 text-primary" />,
        title: "Highly Secure",
        description:
          "Bank-level security protecting your data with the latest encryption technologies.",
      },
      {
        icon: <BsKanban className="w-10 h-10 text-primary" />,
        title: "Advanced Workflow",
        description:
          "Streamline your projects with our powerful workflow management tools.",
      },
      {
        icon: <FiTool className="w-10 h-10 text-primary" />,
        title: "Customizable",
        description:
          "Tailor the platform to your specific needs with our wide range of customization options.",
      },
    ],
  },
};
