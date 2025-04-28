import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./Modal";
import { useState } from "react";

const meta: Meta<typeof Modal> = {
  title: "Components/Modals/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "full"],
    },
    isOpen: {
      control: "boolean",
    },
    centered: {
      control: "boolean",
    },
    hideCloseButton: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Wrapper component to handle state
const ModalDemo = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>This is the modal content. You can put anything here.</p>
        <p className="mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: "Modal Title",
    size: "md",
    centered: true,
  },
};

export const WithFooter: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: "Modal with Footer",
    size: "md",
    centered: true,
    footer: (
      <div className="flex gap-2 justify-end w-full">
        <button className="btn">Cancel</button>
        <button className="btn btn-primary">Save</button>
      </div>
    ),
  },
};

export const LargeModal: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: "Large Modal",
    size: "lg",
    centered: true,
  },
};

export const FullScreenModal: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: "Full Screen Modal",
    size: "full",
    centered: false,
  },
};
