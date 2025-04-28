import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Card, { CardProps } from "./Card";
import Badge from "../Data/Badge";

const meta: Meta<typeof Card> = {
  title: "Display/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact", "glass", "bordered", "side"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    imagePlacement: {
      control: "select",
      options: ["top", "bottom", "side"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "Card Title",
    subtitle: "Card Subtitle",
    children: (
      <p>This is the content of the card. It can contain any React elements.</p>
    ),
    actions: <button className="btn btn-primary btn-sm">Action</button>,
  },
};

export const WithImage: Story = {
  args: {
    title: "Card with Image",
    subtitle: "Mountains landscape",
    image: "https://picsum.photos/seed/picsum/500/300",
    children: <p>Cards can include images at the top, bottom, or side.</p>,
    actions: <button className="btn btn-primary btn-sm">Learn more</button>,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card
        variant="default"
        title="Default"
        className="w-60"
        children={<p>Standard card variant</p>}
      />
      <Card
        variant="compact"
        title="Compact"
        className="w-60"
        children={<p>Compact card with less padding</p>}
      />
      <Card
        variant="bordered"
        title="Bordered"
        className="w-60"
        children={<p>Card with a border</p>}
      />
      <Card
        variant="glass"
        title="Glass"
        className="w-60"
        children={<p>Transparent glass effect card</p>}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card size="xs" title="Extra Small" children={<p>A very small card</p>} />
      <Card size="sm" title="Small" children={<p>A small card</p>} />
      <Card
        size="md"
        title="Medium"
        children={<p>A medium-sized card (default)</p>}
      />
      <Card
        size="lg"
        title="Large"
        children={<p>A large card with more padding</p>}
      />
    </div>
  ),
};

export const WithBadge: Story = {
  args: {
    title: "Card with Badge",
    subtitle: "Badge in the top right corner",
    image: "https://picsum.photos/seed/card/500/300",
    children: <p>This card has a badge in the top right corner</p>,
    badge: <Badge variant="error">New</Badge>,
  },
};

export const SideImage: Story = {
  args: {
    title: "Side Image Card",
    subtitle: "Image on the side",
    image: "https://picsum.photos/seed/side/300/300",
    imagePlacement: "side",
    variant: "side",
    children: (
      <p>This card has an image on the side instead of the top or bottom.</p>
    ),
    actions: <button className="btn btn-primary btn-sm">View details</button>,
  },
};

export const Clickable: Story = {
  args: {
    title: "Clickable Card",
    subtitle: "Click anywhere on this card",
    children: <p>This entire card is clickable.</p>,
    onClick: () => alert("Card clicked!"),
    hoverEffect: true,
  },
};

export const WithLink: Story = {
  args: {
    title: "Linked Card",
    subtitle: "Card with href property",
    children: <p>This card links to another page.</p>,
    href: "https://example.com",
    hoverEffect: true,
  },
};
