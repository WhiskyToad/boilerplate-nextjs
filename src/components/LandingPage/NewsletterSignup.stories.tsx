import type { Meta, StoryObj } from "@storybook/react";
import NewsletterSignup from "./NewsletterSignup";

const meta: Meta<typeof NewsletterSignup> = {
  title: "Landing Page/NewsletterSignup",
  component: NewsletterSignup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "primary", "minimal", "card"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NewsletterSignup>;

export const Default: Story = {
  args: {},
};

export const Primary: Story = {
  args: {
    title: "Join Our Newsletter",
    description:
      "Stay updated with the latest tips, tutorials, and product updates delivered straight to your inbox.",
    placeholderText: "Your email address",
    buttonText: "Subscribe",
    variant: "primary",
  },
};

export const Minimal: Story = {
  args: {
    title: "Subscribe for Updates",
    description: "Get the latest news and product announcements",
    placeholderText: "Enter your email",
    buttonText: "Sign Up",
    variant: "minimal",
  },
};

export const Card: Story = {
  args: {
    title: "Get Exclusive Content",
    description:
      "Subscribe to receive monthly insights, special offers, and expert tips that you won't find anywhere else.",
    placeholderText: "Your work email",
    buttonText: "Join the List",
    variant: "card",
    successMessage: "You're in! Check your inbox soon for exclusive content.",
  },
};

export const SpecialOffer: Story = {
  args: {
    title: "Get 20% Off Your First Purchase",
    description:
      "Sign up for our newsletter and receive a special discount code for your first order.",
    placeholderText: "Email address",
    buttonText: "Get My Discount",
    variant: "primary",
    successMessage: "Success! Your discount code has been sent to your email.",
  },
};
