import type { Meta, StoryObj } from "@storybook/react";
import Toggle from "./Toggle";
import { useState } from "react";

const meta: Meta<typeof Toggle> = {
  title: "Inputs/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: "Toggle Switch",
  },
};

export const WithLabel: Story = {
  args: {
    checked: true,
    onChange: () => {},
    label: "Enable notifications",
  },
};

export const LeftLabel: Story = {
  args: {
    ...WithLabel.args,
    labelPosition: "left",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle
        checked={true}
        onChange={() => {}}
        label="Extra Small"
        size="xs"
      />
      <Toggle checked={true} onChange={() => {}} label="Small" size="sm" />
      <Toggle
        checked={true}
        onChange={() => {}}
        label="Medium (default)"
        size="md"
      />
      <Toggle checked={true} onChange={() => {}} label="Large" size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle
        checked={true}
        onChange={() => {}}
        label="Primary"
        color="primary"
      />
      <Toggle
        checked={true}
        onChange={() => {}}
        label="Secondary"
        color="secondary"
      />
      <Toggle
        checked={true}
        onChange={() => {}}
        label="Accent"
        color="accent"
      />
      <Toggle checked={true} onChange={() => {}} label="Info" color="info" />
      <Toggle
        checked={true}
        onChange={() => {}}
        label="Success"
        color="success"
      />
      <Toggle
        checked={true}
        onChange={() => {}}
        label="Warning"
        color="warning"
      />
      <Toggle checked={true} onChange={() => {}} label="Error" color="error" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: "Disabled Toggle",
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: "Toggle with Error",
    error: "This field is required",
  },
};

export const Interactive = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Toggle
      checked={checked}
      onChange={(value) => setChecked(value)}
      label={`Toggle is ${checked ? "ON" : "OFF"}`}
    />
  );
};
