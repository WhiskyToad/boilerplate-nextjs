import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Avatar, { AvatarProps } from "./Avatar";
import Badge from "../Data/Badge";
import { FiCamera } from "react-icons/fi";

const meta: Meta<typeof Avatar> = {
  title: "Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    shape: {
      control: "select",
      options: ["circle", "square", "rounded"],
    },
    status: {
      control: "select",
      options: [null, "online", "offline", "away", "busy", "invisible"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: "https://picsum.photos/seed/avatar/200",
    alt: "User avatar",
  },
};

export const WithInitials: Story = {
  args: {
    name: "John Doe",
    alt: "John Doe",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <FiCamera />,
    alt: "Camera icon",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar size="xs" name="XS" />
      <Avatar size="sm" name="SM" />
      <Avatar size="md" name="MD" />
      <Avatar size="lg" name="LG" />
      <Avatar size="xl" name="XL" />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar
        shape="circle"
        src="https://picsum.photos/seed/circle/200"
        alt="Circle avatar"
      />
      <Avatar
        shape="square"
        src="https://picsum.photos/seed/square/200"
        alt="Square avatar"
      />
      <Avatar
        shape="rounded"
        src="https://picsum.photos/seed/rounded/200"
        alt="Rounded avatar"
      />
    </div>
  ),
};

export const Statuses: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar name="ON" status="online" />
      <Avatar name="OFF" status="offline" />
      <Avatar name="AWY" status="away" />
      <Avatar name="BSY" status="busy" />
      <Avatar name="INV" status="invisible" />
    </div>
  ),
};

export const StatusPositions: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar name="BR" status="online" statusPosition="bottom-right" />
      <Avatar name="BL" status="online" statusPosition="bottom-left" />
      <Avatar name="TR" status="online" statusPosition="top-right" />
      <Avatar name="TL" status="online" statusPosition="top-left" />
    </div>
  ),
};

export const WithBadge: Story = {
  args: {
    name: "JD",
    badge: (
      <Badge variant="error" size="xs">
        3
      </Badge>
    ),
  },
};

export const WithRing: Story = {
  args: {
    src: "https://picsum.photos/seed/ring/200",
    alt: "Ringed avatar",
    ring: true,
    ringColor: "ring-primary",
  },
};

export const Bordered: Story = {
  args: {
    src: "https://picsum.photos/seed/border/200",
    alt: "Bordered avatar",
    bordered: true,
    borderColor: "border-primary",
  },
};

export const Clickable: Story = {
  args: {
    name: "JD",
    onClick: () => alert("Avatar clicked!"),
  },
};
