import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import { FiBell } from "react-icons/fi";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    children: "This is an informational message.",
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
    children: "This action might have consequences.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    children: "An error occurred while processing your request.",
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: "info",
    children: "This is an alert without a title.",
  },
};

export const Dismissible: Story = {
  args: {
    ...Info.args,
    onClose: () => console.log("Alert closed"),
  },
};

export const CustomIcon: Story = {
  args: {
    variant: "info",
    title: "Notification",
    children: "You have a new message.",
    icon: <FiBell className="h-6 w-6" />,
  },
};

export const LongMessage: Story = {
  args: {
    variant: "warning",
    title: "System Update",
    children:
      "The system will undergo maintenance tonight from 2 AM to 4 AM. During this time, the application will be unavailable. Please save your work and log out before the maintenance window begins.",
  },
};

export const CustomStyling: Story = {
  args: {
    variant: "success",
    title: "Payment Received",
    children: "Thank you for your purchase!",
    className: "border-l-4 border-green-500",
  },
};
