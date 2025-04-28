import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, ExampleToastUsage } from "./Toast";

const meta: Meta<typeof ToastProvider> = {
  title: "Components/Feedback/Toast",
  component: ToastProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ExampleToastUsage />
    </ToastProvider>
  ),
};

export const TopRight: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <ExampleToastUsage />
    </ToastProvider>
  ),
};

export const BottomCenter: Story = {
  render: () => (
    <ToastProvider position="bottom-center" autoCloseTime={10000}>
      <ExampleToastUsage />
    </ToastProvider>
  ),
};
