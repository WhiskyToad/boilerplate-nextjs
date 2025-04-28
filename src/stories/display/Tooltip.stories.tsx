import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Tooltip from "../../../components/Display/Tooltip";

const meta = {
  title: "Display/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position of the tooltip",
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
      description: "Color of the tooltip",
    },
    delay: {
      control: "number",
      description: "Delay before showing tooltip (in ms)",
    },
    hideArrow: {
      control: "boolean",
      description: "Whether to hide the tooltip arrow",
    },
    openOnClick: {
      control: "boolean",
      description: "Open tooltip on click instead of hover",
    },
    maxWidth: {
      control: "text",
      description: "Maximum width of the tooltip",
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    position: "top",
    children: <button className="btn">Hover me</button>,
  },
};

export const Positions: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Tooltip content="Top tooltip" position="top">
        <button className="btn">Top</button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <button className="btn">Bottom</button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <button className="btn">Left</button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <button className="btn">Right</button>
      </Tooltip>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Tooltip content="Default tooltip" color="default">
        <button className="btn">Default</button>
      </Tooltip>
      <Tooltip content="Primary tooltip" color="primary">
        <button className="btn btn-primary">Primary</button>
      </Tooltip>
      <Tooltip content="Secondary tooltip" color="secondary">
        <button className="btn btn-secondary">Secondary</button>
      </Tooltip>
      <Tooltip content="Accent tooltip" color="accent">
        <button className="btn btn-accent">Accent</button>
      </Tooltip>
      <Tooltip content="Info tooltip" color="info">
        <button className="btn btn-info">Info</button>
      </Tooltip>
      <Tooltip content="Success tooltip" color="success">
        <button className="btn btn-success">Success</button>
      </Tooltip>
      <Tooltip content="Warning tooltip" color="warning">
        <button className="btn btn-warning">Warning</button>
      </Tooltip>
      <Tooltip content="Error tooltip" color="error">
        <button className="btn btn-error">Error</button>
      </Tooltip>
    </div>
  ),
};

export const RichContent: Story = {
  args: {
    content: (
      <div>
        <h4 className="font-bold">Rich Content</h4>
        <p>Tooltips can contain rich HTML content</p>
        <ul className="list-disc pl-4 mt-2">
          <li>Including lists</li>
          <li>And other elements</li>
        </ul>
      </div>
    ),
    position: "bottom",
    children: <button className="btn">Rich Content</button>,
    maxWidth: "300px",
  },
};

export const ClickToShow: Story = {
  args: {
    content: "Click-triggered tooltip",
    position: "top",
    openOnClick: true,
    children: <button className="btn">Click me</button>,
  },
};
