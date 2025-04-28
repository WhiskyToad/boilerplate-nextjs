import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Badge from "./Badge";
import { FiBell, FiCheck, FiAlertCircle, FiStar } from "react-icons/fi";

const meta: Meta<typeof Badge> = {
  title: "Data/Badge",
  component: Badge,
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
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge size="xs">XS</Badge>
      <Badge size="sm">SM</Badge>
      <Badge size="md">MD</Badge>
      <Badge size="lg">LG</Badge>
    </div>
  ),
};

export const Outline: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary" outline>
        Primary
      </Badge>
      <Badge variant="secondary" outline>
        Secondary
      </Badge>
      <Badge variant="accent" outline>
        Accent
      </Badge>
      <Badge variant="success" outline>
        Success
      </Badge>
      <Badge variant="error" outline>
        Error
      </Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="info" icon={<FiBell />}>
        Notifications
      </Badge>
      <Badge variant="success" icon={<FiCheck />}>
        Complete
      </Badge>
      <Badge variant="warning" icon={<FiAlertCircle />}>
        Warning
      </Badge>
      <Badge variant="primary" icon={<FiStar />}>
        Featured
      </Badge>
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    children: "Click me",
    onClick: () => alert("Badge clicked!"),
    variant: "primary",
  },
};

export const NumberIndicators: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="primary" size="xs">
        1
      </Badge>
      <Badge variant="secondary" size="sm">
        5
      </Badge>
      <Badge variant="accent" size="md">
        10
      </Badge>
      <Badge variant="error" size="lg">
        99+
      </Badge>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="relative w-max">
        <button className="btn">
          Inbox
          <Badge variant="error" size="sm" className="absolute -top-2 -right-2">
            3
          </Badge>
        </button>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Status:</span>
        <Badge variant="success">Online</Badge>
      </div>

      <div className="card p-4 w-full">
        <div className="flex justify-between items-center">
          <h3>Product Name</h3>
          <Badge variant="accent">New</Badge>
        </div>
        <p className="mt-2">Product description goes here</p>
      </div>
    </div>
  ),
};
