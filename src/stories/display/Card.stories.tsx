import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Card from "../../../components/Display/Card";
import { Button } from "../../../components/Button/Button";
import Badge from "../../../components/Data/Badge";

const meta = {
  title: "Display/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact", "glass", "bordered", "side"],
      description: "Card variant style",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Size of the card",
    },
    imagePlacement: {
      control: "radio",
      options: ["top", "bottom", "side"],
      description: "Placement of the image",
    },
    shadow: {
      control: "boolean",
      description: "Whether to add shadow to the card",
    },
    hoverEffect: {
      control: "boolean",
      description: "Whether to add hover effect to the card",
    },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Card Title",
    subtitle: "Card Subtitle",
    children: (
      <p>This is the content of the card. It can contain any React elements.</p>
    ),
    image: "https://picsum.photos/seed/picsum/500/300",
    imageAlt: "Sample image",
    actions: (
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Action
        </Button>
      </div>
    ),
    size: "md",
    variant: "default",
    shadow: true,
    hoverEffect: true,
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    variant: "compact",
    size: "sm",
    title: "Compact Card",
  },
};

export const Glass: Story = {
  args: {
    ...Default.args,
    variant: "glass",
    title: "Glass Card",
    className: "backdrop-blur-lg",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const SideImage: Story = {
  args: {
    ...Default.args,
    variant: "side",
    imagePlacement: "side",
    title: "Side Image Card",
  },
};

export const WithBadge: Story = {
  args: {
    ...Default.args,
    title: "Card with Badge",
    badge: <Badge variant="accent">New</Badge>,
  },
};

export const Clickable: Story = {
  args: {
    ...Default.args,
    title: "Clickable Card",
    onClick: () => alert("Card clicked!"),
  },
};

export const LinkCard: Story = {
  args: {
    ...Default.args,
    title: "Link Card",
    href: "#",
  },
};

export const NoImage: Story = {
  args: {
    title: "Card without Image",
    subtitle: "Just content",
    children: <p>This card doesn't have an image, just content.</p>,
    actions: (
      <Button variant="primary" size="sm">
        Action
      </Button>
    ),
  },
};
