import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Avatar from "../../../components/Display/Avatar";
import { FiStar } from "react-icons/fi";
import Badge from "../../../components/Data/Badge";

const meta = {
  title: "Display/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the avatar",
    },
    shape: {
      control: "select",
      options: ["circle", "square", "rounded"],
      description: "Shape of the avatar",
    },
    status: {
      control: "select",
      options: [null, "online", "offline", "away", "busy", "invisible"],
      description: "Status indicator",
    },
    statusPosition: {
      control: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
      description: "Position of the status indicator",
    },
    bordered: {
      control: "boolean",
      description: "Whether the avatar has a border",
    },
    ring: {
      control: "boolean",
      description: "Whether the avatar has a ring",
    },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/300",
    alt: "User",
    size: "md",
    shape: "circle",
  },
};

export const WithInitials: Story = {
  args: {
    name: "John Doe",
    size: "md",
    shape: "circle",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <FiStar />,
    size: "md",
    shape: "circle",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar src="https://i.pravatar.cc/300" size="xs" />
      <Avatar src="https://i.pravatar.cc/300" size="sm" />
      <Avatar src="https://i.pravatar.cc/300" size="md" />
      <Avatar src="https://i.pravatar.cc/300" size="lg" />
      <Avatar src="https://i.pravatar.cc/300" size="xl" />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar src="https://i.pravatar.cc/300" shape="circle" />
      <Avatar src="https://i.pravatar.cc/300" shape="square" />
      <Avatar src="https://i.pravatar.cc/300" shape="rounded" />
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar src="https://i.pravatar.cc/300" status="online" />
      <Avatar src="https://i.pravatar.cc/300" status="offline" />
      <Avatar src="https://i.pravatar.cc/300" status="away" />
      <Avatar src="https://i.pravatar.cc/300" status="busy" />
    </div>
  ),
};

export const WithBadge: Story = {
  args: {
    src: "https://i.pravatar.cc/300",
    size: "lg",
    badge: (
      <Badge variant="error" size="sm">
        3
      </Badge>
    ),
  },
};

export const WithBorder: Story = {
  args: {
    src: "https://i.pravatar.cc/300",
    size: "md",
    bordered: true,
    borderColor: "border-primary",
  },
};

export const WithRing: Story = {
  args: {
    src: "https://i.pravatar.cc/300",
    size: "md",
    ring: true,
    ringColor: "ring-secondary",
  },
};

export const Clickable: Story = {
  args: {
    src: "https://i.pravatar.cc/300",
    size: "md",
    onClick: () => alert("Avatar clicked!"),
  },
};
