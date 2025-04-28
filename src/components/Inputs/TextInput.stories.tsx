import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";
import { useState } from "react";

const meta: Meta<typeof TextInput> = {
  title: "Inputs/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    label: "Username",
    value: "",
    onChange: () => {},
    placeholder: "Enter your username",
  },
};

export const WithValue: Story = {
  args: {
    ...Default.args,
    value: "johndoe",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    value: "password123",
    onChange: () => {},
    placeholder: "Enter your password",
  },
};

export const WithHelper: Story = {
  args: {
    label: "Email",
    type: "email",
    value: "",
    onChange: () => {},
    placeholder: "your.email@example.com",
    helperText: "We'll never share your email with anyone else.",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    type: "email",
    value: "invalid-email",
    onChange: () => {},
    errorMessage: "Please enter a valid email address",
  },
};

export const Required: Story = {
  args: {
    label: "Full Name",
    value: "",
    onChange: () => {},
    placeholder: "Enter your full name",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    value: "johndoe",
    onChange: () => {},
    disabled: true,
  },
};

export const Multiline: Story = {
  args: {
    label: "Bio",
    value: "",
    onChange: () => {},
    placeholder: "Tell us about yourself",
    multiline: true,
    rows: 4,
  },
};

export const Interactive = () => {
  const [value, setValue] = useState("");
  return (
    <TextInput
      label="Interactive Input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Type something..."
      helperText={`Character count: ${value.length}`}
    />
  );
};
