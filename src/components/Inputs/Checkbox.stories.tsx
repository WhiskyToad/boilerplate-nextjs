import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: "Accept terms and conditions",
  },
};

export const Checked: Story = {
  args: {
    ...Default.args,
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: "Select all items",
    indeterminate: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "This field is required",
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox
        checked={true}
        onChange={() => {}}
        label="Extra Small"
        size="xs"
      />
      <Checkbox checked={true} onChange={() => {}} label="Small" size="sm" />
      <Checkbox
        checked={true}
        onChange={() => {}}
        label="Medium (default)"
        size="md"
      />
      <Checkbox checked={true} onChange={() => {}} label="Large" size="lg" />
    </div>
  ),
};

export const ColorSchemes: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox
        checked={true}
        onChange={() => {}}
        label="Primary"
        colorScheme="primary"
      />
      <Checkbox
        checked={true}
        onChange={() => {}}
        label="Secondary"
        colorScheme="secondary"
      />
      <Checkbox
        checked={true}
        onChange={() => {}}
        label="Accent"
        colorScheme="accent"
      />
    </div>
  ),
};

export const Interactive = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      label={`Checkbox is ${checked ? "checked" : "unchecked"}`}
    />
  );
};
