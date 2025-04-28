import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Badge from "../../../components/Data/Badge";
import { FiStar, FiAlertCircle, FiCheck, FiBell } from "react-icons/fi";

const meta = {
  title: "Data/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
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
      description: "Badge variant style",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Size of the badge",
    },
    outline: {
      control: "boolean",
      description: "Whether to use outline style",
    },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "neutral",
    size: "md",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
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
    <div className="flex items-center gap-3">
      <Badge variant="primary" size="xs">
        XS
      </Badge>
      <Badge variant="primary" size="sm">
        SM
      </Badge>
      <Badge variant="primary" size="md">
        MD
      </Badge>
      <Badge variant="primary" size="lg">
        LG
      </Badge>
    </div>
  ),
};

export const Outline: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="primary" outline>
        Primary
      </Badge>
      <Badge variant="secondary" outline>
        Secondary
      </Badge>
      <Badge variant="accent" outline>
        Accent
      </Badge>
      <Badge variant="info" outline>
        Info
      </Badge>
      <Badge variant="success" outline>
        Success
      </Badge>
      <Badge variant="warning" outline>
        Warning
      </Badge>
      <Badge variant="error" outline>
        Error
      </Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="info" icon={<FiStar />}>
        Starred
      </Badge>
      <Badge variant="success" icon={<FiCheck />}>
        Completed
      </Badge>
      <Badge variant="warning" icon={<FiAlertCircle />}>
        Warning
      </Badge>
      <Badge variant="error" icon={<FiBell />}>
        Alert
      </Badge>
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    children: "Click me",
    variant: "primary",
    onClick: () => alert("Badge clicked!"),
  },
};

export const NumberBadges: Story = {
  render: () => (
    <div className="flex gap-4">
      <Badge variant="primary" size="sm">
        1
      </Badge>
      <Badge variant="secondary" size="sm">
        2
      </Badge>
      <Badge variant="accent" size="sm">
        3
      </Badge>
      <Badge variant="error" size="sm">
        99+
      </Badge>
    </div>
  ),
};
