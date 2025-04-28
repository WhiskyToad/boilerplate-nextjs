import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { useState } from "react";

const meta: Meta<typeof Select> = {
  title: "Inputs/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

const simpleOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "grape", label: "Grape" },
];

const groupedOptions = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
];

export const Default: Story = {
  args: {
    value: "",
    onChange: () => {},
    options: simpleOptions,
    label: "Select a fruit",
    placeholder: "Choose a fruit",
  },
};

export const WithValue: Story = {
  args: {
    ...Default.args,
    value: "banana",
  },
};

export const WithGroups: Story = {
  args: {
    value: "",
    onChange: () => {},
    options: groupedOptions,
    label: "Select food item",
    placeholder: "Choose an option",
  },
};

export const WithSubtext: Story = {
  args: {
    ...Default.args,
    subtext: "Select your favorite fruit",
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "Please select an option",
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

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const Interactive = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-64">
      <Select
        label="Interactive Select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        options={simpleOptions}
        placeholder="Select a fruit"
        subtext={value ? `You selected: ${value}` : "Make a selection"}
      />
    </div>
  );
};
