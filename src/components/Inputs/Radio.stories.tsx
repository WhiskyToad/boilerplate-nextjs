import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./Radio";
import { useState } from "react";

const meta: Meta<typeof RadioGroup> = {
  title: "Inputs/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    name: "options",
    options: options,
    value: "",
    onChange: () => {},
    label: "Select an option",
  },
};

export const WithSelection: Story = {
  args: {
    ...Default.args,
    value: "option2",
  },
};

export const Inline: Story = {
  args: {
    ...Default.args,
    inline: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    name: "options",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2", disabled: true },
      { value: "option3", label: "Option 3" },
    ],
    value: "option1",
    onChange: () => {},
    label: "Select an option",
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "This field is required",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup
        name="size-xs"
        options={options}
        value="option1"
        onChange={() => {}}
        label="Extra Small"
        size="xs"
      />
      <RadioGroup
        name="size-sm"
        options={options}
        value="option1"
        onChange={() => {}}
        label="Small"
        size="sm"
      />
      <RadioGroup
        name="size-md"
        options={options}
        value="option1"
        onChange={() => {}}
        label="Medium (default)"
        size="md"
      />
      <RadioGroup
        name="size-lg"
        options={options}
        value="option1"
        onChange={() => {}}
        label="Large"
        size="lg"
      />
    </div>
  ),
};

export const ColorSchemes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup
        name="color-primary"
        options={options}
        value="option1"
        onChange={() => {}}
        label="Primary"
        colorScheme="primary"
      />
      <RadioGroup
        name="color-secondary"
        options={options}
        value="option1"
        onChange={() => {}}
        label="Secondary"
        colorScheme="secondary"
      />
      <RadioGroup
        name="color-accent"
        options={options}
        value="option1"
        onChange={() => {}}
        label="Accent"
        colorScheme="accent"
      />
    </div>
  ),
};

export const Interactive = () => {
  const [value, setValue] = useState("");
  return (
    <RadioGroup
      name="interactive"
      options={options}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      label={`Selected value: ${value || "none"}`}
    />
  );
};
