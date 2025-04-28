import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Tooltip, { TooltipProps } from "./Tooltip";
import { FiInfo } from "react-icons/fi";

const meta: Meta<typeof Tooltip> = {
  title: "Display/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "accent",
        "info",
        "success",
        "warning",
        "error",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    children: <button className="btn btn-primary">Hover me</button>,
  },
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-16 justify-center">
      <Tooltip content="Top tooltip" position="top">
        <button className="btn btn-sm">Top</button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <button className="btn btn-sm">Bottom</button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <button className="btn btn-sm">Left</button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <button className="btn btn-sm">Right</button>
      </Tooltip>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-8 justify-center">
      <Tooltip content="Default tooltip" color="default">
        <button className="btn btn-sm">Default</button>
      </Tooltip>
      <Tooltip content="Primary tooltip" color="primary">
        <button className="btn btn-sm btn-primary">Primary</button>
      </Tooltip>
      <Tooltip content="Secondary tooltip" color="secondary">
        <button className="btn btn-sm btn-secondary">Secondary</button>
      </Tooltip>
      <Tooltip content="Accent tooltip" color="accent">
        <button className="btn btn-sm btn-accent">Accent</button>
      </Tooltip>
      <Tooltip content="Info tooltip" color="info">
        <button className="btn btn-sm btn-info">Info</button>
      </Tooltip>
      <Tooltip content="Success tooltip" color="success">
        <button className="btn btn-sm btn-success">Success</button>
      </Tooltip>
      <Tooltip content="Warning tooltip" color="warning">
        <button className="btn btn-sm btn-warning">Warning</button>
      </Tooltip>
      <Tooltip content="Error tooltip" color="error">
        <button className="btn btn-sm btn-error">Error</button>
      </Tooltip>
    </div>
  ),
};

export const CustomContent: Story = {
  args: {
    content: (
      <div>
        <h3 className="font-bold">Custom Content</h3>
        <p>This tooltip has custom JSX content</p>
        <div className="flex items-center mt-2 text-info">
          <FiInfo className="mr-1" /> With an icon
        </div>
      </div>
    ),
    children: <button className="btn">Hover for rich tooltip</button>,
    maxWidth: "300px",
  },
};

export const ClickToShow: Story = {
  args: {
    content: "Click activated tooltip",
    children: <button className="btn">Click me</button>,
    openOnClick: true,
  },
};

export const DelayedTooltip: Story = {
  args: {
    content: "Appears after 1 second",
    children: <button className="btn">Hover (wait for it)</button>,
    delay: 1000,
  },
};
