import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../../components/Button/Button";
import {
  FiArrowRight,
  FiDownload,
  FiPlus,
  FiTrash,
  FiCheck,
} from "react-icons/fi";

const meta = {
  title: "Button/Button",
  component: Button,
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
        "link",
      ],
      description: "Button variant style",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Size of the button",
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the button takes full width",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    loading: {
      control: "boolean",
      description: "Whether to show loading state",
    },
    outline: {
      control: "boolean",
      description: "Whether to use outline style",
    },
    circle: {
      control: "boolean",
      description: "Whether to use circle shape",
    },
    square: {
      control: "boolean",
      description: "Whether to use square shape",
    },
    glass: {
      control: "boolean",
      description: "Whether to use glass effect",
    },
    as: {
      control: "inline-radio",
      options: ["button", "link"],
      description: "Render as button or link",
    },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
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
    <div className="flex items-center gap-2">
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
        Create
      </Button>
      <Button variant="success" endIcon={<FiCheck />}>
        Submit
      </Button>
      <Button variant="info" startIcon={<FiDownload />}>
        Download
      </Button>
      <Button variant="error" startIcon={<FiTrash />}>
        Delete
      </Button>
      <Button variant="neutral" endIcon={<FiArrowRight />}>
        Next
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
      <Button variant="info" outline>
        Info
      </Button>
      <Button variant="success" outline>
        Success
      </Button>
      <Button variant="warning" outline>
        Warning
      </Button>
      <Button variant="error" outline>
        Error
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  args: {
    children: "Go to Dashboard",
    variant: "primary",
    as: "link",
    href: "#",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    variant: "primary",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
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

export const Circle: Story = {
  args: {
    children: <FiPlus />,
    variant: "primary",
    circle: true,
    size: "lg",
  },
};

export const Square: Story = {
  args: {
    children: <FiDownload />,
    variant: "primary",
    square: true,
    size: "lg",
  },
};

export const Glass: Story = {
  args: {
    children: "Glass Effect",
    variant: "primary",
    glass: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
