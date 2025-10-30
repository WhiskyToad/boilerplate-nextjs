import type { Meta, StoryObj } from "@storybook/nextjs";
import { GradientButton } from "./GradientButton";
import { FiArrowRight, FiDownload, FiPlay, FiStar } from "react-icons/fi";

const meta: Meta<typeof GradientButton> = {
  title: "UI/GradientButton",
  component: GradientButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["md", "lg", "xl"],
    },
    gradient: {
      control: "text",
      description: "CSS gradient background",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GradientButton>;

export const Default: Story = {
  args: {
    children: "Get Started Free",
    icon: <FiArrowRight className="text-white" />,
    size: "xl",
  },
};

export const Medium: Story = {
  args: {
    children: "Learn More",
    icon: <FiArrowRight className="text-white" />,
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Download Now",
    icon: <FiDownload className="text-white" />,
    size: "lg",
  },
};

export const WithoutIcon: Story = {
  args: {
    children: "Simple Button",
    size: "lg",
  },
};

export const CustomGradient: Story = {
  args: {
    children: "Custom Colors",
    icon: <FiStar className="text-white" />,
    gradient: "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)",
    size: "lg",
  },
};

export const PlayButton: Story = {
  args: {
    children: "Watch Demo",
    icon: <FiPlay className="text-white" />,
    gradient: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled State",
    icon: <FiArrowRight className="text-white" />,
    disabled: true,
    size: "lg",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <GradientButton size="md" icon={<FiArrowRight className="text-white" />}>
        Medium Button
      </GradientButton>
      <GradientButton size="lg" icon={<FiArrowRight className="text-white" />}>
        Large Button
      </GradientButton>
      <GradientButton size="xl" icon={<FiArrowRight className="text-white" />}>
        Extra Large Button
      </GradientButton>
    </div>
  ),
};