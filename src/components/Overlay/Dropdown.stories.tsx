import type { Meta, StoryObj } from "@storybook/react";
import Dropdown from "./Dropdown";
import { FiUser, FiSettings, FiLogOut, FiHelpCircle } from "react-icons/fi";
import { useState } from "react";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Overlay/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: [
        "bottom-start",
        "bottom-end",
        "bottom",
        "top-start",
        "top-end",
        "top",
        "left",
        "right",
      ],
    },
    width: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// Interactive demo with state
const DropdownWithState = (args: any) => {
  const [selected, setSelected] = useState(args.value || "");

  return <Dropdown {...args} value={selected} onChange={setSelected} />;
};

// Basic items
const simpleItems = [
  { value: "profile", label: "Profile", icon: <FiUser /> },
  { value: "settings", label: "Settings", icon: <FiSettings /> },
  { type: "divider" as const },
  { value: "logout", label: "Logout", icon: <FiLogOut /> },
];

// More complex items with sections
const complexItems = [
  {
    type: "section" as const,
    title: "User",
    items: [
      { value: "profile", label: "Profile", icon: <FiUser /> },
      { value: "settings", label: "Settings", icon: <FiSettings /> },
    ],
  },
  { type: "divider" as const },
  {
    type: "section" as const,
    title: "Help",
    items: [
      { value: "help", label: "Help Center", icon: <FiHelpCircle /> },
      { type: "divider" as const },
      { value: "logout", label: "Logout", icon: <FiLogOut /> },
    ],
  },
];

export const Default: Story = {
  render: (args) => <DropdownWithState {...args} />,
  args: {
    trigger: "Options",
    items: simpleItems,
    placement: "bottom",
  },
};

export const WithCustomTrigger: Story = {
  render: (args) => <DropdownWithState {...args} />,
  args: {
    trigger: <button className="btn btn-primary">Custom Trigger</button>,
    items: simpleItems,
    placement: "bottom",
  },
};

export const WithSections: Story = {
  render: (args) => <DropdownWithState {...args} />,
  args: {
    trigger: "Account",
    items: complexItems,
    placement: "bottom-end",
    width: "w-64",
  },
};

export const TopPlacement: Story = {
  render: (args) => <DropdownWithState {...args} />,
  args: {
    trigger: "Open Above",
    items: simpleItems,
    placement: "top",
  },
};

export const Disabled: Story = {
  render: (args) => <DropdownWithState {...args} />,
  args: {
    trigger: "Disabled",
    items: simpleItems,
    disabled: true,
  },
};
