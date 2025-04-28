import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  ToastProvider,
  useToast,
  ExampleToastUsage,
} from "../../../components/Feedback/Toast";

const meta = {
  title: "Feedback/Toast",
  component: ToastProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-right",
        "top-left",
        "bottom-right",
        "bottom-left",
        "top-center",
        "bottom-center",
      ],
      description: "Position of the toast notifications",
    },
    autoClose: {
      control: "boolean",
      description: "Whether toasts should close automatically",
    },
    autoCloseTime: {
      control: "number",
      description: "Time in milliseconds before toast closes automatically",
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple toast example with usage component
export const Default: Story = {
  args: {
    position: "bottom-right",
    autoClose: true,
    autoCloseTime: 5000,
    children: <ExampleToastUsage />,
  },
};

// Custom hook usage example
export const CustomUsage: Story = {
  args: {
    position: "top-right",
    autoCloseTime: 3000,
    children: <ToastDemo />,
  },
};

// Custom example component to demonstrate toast functionality
const ToastDemo = () => {
  const { addToast } = useToast();

  const showToast = (type: "success" | "error" | "info" | "warning") => {
    const messages = {
      success: "Operation completed successfully!",
      error: "An error occurred. Please try again.",
      info: "Here is some information for you.",
      warning: "Warning: This action cannot be undone.",
    };

    addToast({
      type,
      message: messages[type],
      duration: type === "error" ? 8000 : 5000,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="mb-2">Click to show different toast types:</h3>
      <div className="flex gap-2 flex-wrap">
        <button
          className="btn btn-success"
          onClick={() => showToast("success")}
        >
          Success Toast
        </button>
        <button className="btn btn-error" onClick={() => showToast("error")}>
          Error Toast
        </button>
        <button className="btn btn-info" onClick={() => showToast("info")}>
          Info Toast
        </button>
        <button
          className="btn btn-warning"
          onClick={() => showToast("warning")}
        >
          Warning Toast
        </button>
      </div>
    </div>
  );
};
