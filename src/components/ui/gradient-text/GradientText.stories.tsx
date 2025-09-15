import type { Meta, StoryObj } from "@storybook/nextjs";
import { GradientText } from "./GradientText";

const meta: Meta<typeof GradientText> = {
  title: "UI/GradientText",
  component: GradientText,
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
    gradient: {
      control: "text",
      description: "CSS gradient value",
    },
    animationDelay: {
      control: "text",
      description: "Animation delay for fade-in effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GradientText>;

export const Primary: Story = {
  args: {
    children: "Start Listening.",
    className: "text-6xl font-extrabold",
    gradient: "linear-gradient(135deg, #1972f5 0%, #1557c7 100%)",
  },
};

export const Secondary: Story = {
  args: {
    children: "Build Better",
    className: "text-4xl font-bold",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  },
};

export const Success: Story = {
  args: {
    children: "Success Story",
    className: "text-3xl font-semibold",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
};

export const Rainbow: Story = {
  args: {
    children: "Rainbow Text",
    className: "text-5xl font-black",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 25%, #8b5cf6 50%, #3b82f6 75%, #10b981 100%)",
  },
};

export const InHeading: Story = {
  render: () => (
    <h1 className="text-6xl font-display leading-tight text-white">
      Stop Guessing.{" "}
      <GradientText 
        className="font-extrabold animate-fade-in" 
        animationDelay="0.1s"
      >
        Start Listening.
      </GradientText>
    </h1>
  ),
};