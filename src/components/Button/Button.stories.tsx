import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import {
  FiArrowRight,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiSend,
} from "react-icons/fi";

const meta: Meta<typeof Button> = {
  title: "Button/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "neutral",
        "info",
        "success",
        "warning",
        "error",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="info">Info</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="error">Error</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Button variant="primary" size="xs">
        Extra Small
      </Button>
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" startIcon={<FiPlus />}>
        Create New
      </Button>
      <Button variant="error" startIcon={<FiTrash2 />}>
        Delete
      </Button>
      <Button variant="success" endIcon={<FiArrowRight />}>
        Next Step
      </Button>
      <Button variant="info" startIcon={<FiDownload />}>
        Download
      </Button>
      <Button variant="accent" startIcon={<FiSend />}>
        Send Message
      </Button>
    </div>
  ),
};

export const Outline: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" outline>
        Primary
      </Button>
      <Button variant="secondary" outline>
        Secondary
      </Button>
      <Button variant="accent" outline>
        Accent
      </Button>
      <Button variant="success" outline>
        Success
      </Button>
      <Button variant="error" outline>
        Error
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: "Saving...",
    variant: "primary",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    variant: "primary",
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    variant: "primary",
    fullWidth: true,
  },
};

export const Link: Story = {
  args: {
    children: "Go to Dashboard",
    variant: "primary",
    as: "link",
    href: "#dashboard",
  },
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Default</Button>
      <Button variant="primary" circle>
        <FiPlus />
      </Button>
      <Button variant="secondary" square>
        <FiDownload />
      </Button>
    </div>
  ),
};

export const Glass: Story = {
  render: () => (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg">
      <Button variant="primary" glass>
        Glass Button
      </Button>
    </div>
  ),
};
