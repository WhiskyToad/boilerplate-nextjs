import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Alert from "../../../components/Feedback/Alert";
import { FiBell } from "react-icons/fi";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      description: "Variant style of the alert",
    },
    title: {
      control: "text",
      description: "Title of the alert",
    },
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    children: "This is an informational alert.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    children: "Operation completed successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "This action cannot be undone.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    children: "An error occurred while processing your request.",
  },
};

export const WithCloseButton: Story = {
  args: {
    variant: "info",
    title: "Dismissable Alert",
    children: "Click the X icon to dismiss this alert.",
    onClose: () => console.log("Alert closed"),
  },
};

export const CustomIcon: Story = {
  args: {
    variant: "info",
    title: "Custom Icon",
    children: "This alert has a custom icon.",
    icon: <FiBell className="h-6 w-6" />,
  },
};

export const NoTitle: Story = {
  args: {
    variant: "success",
    children: "Alert without title.",
  },
};
