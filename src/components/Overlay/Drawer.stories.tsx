import type { Meta, StoryObj } from "@storybook/react";
import Drawer from "./Drawer";
import { useState } from "react";

const meta: Meta<typeof Drawer> = {
  title: "Components/Overlay/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// Wrapper for interactive demo
const DrawerDemo = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Open Drawer
      </button>

      <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4">
          <p>This is the drawer content. You can place any content here.</p>
          <p>The drawer can be positioned on any side of the screen.</p>
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <button key={i} className="btn btn-outline w-full">
                Menu Item {i + 1}
              </button>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export const RightDrawer: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Right Drawer",
    placement: "right",
    size: "md",
  },
};

export const LeftDrawer: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Left Drawer",
    placement: "left",
    size: "md",
  },
};

export const TopDrawer: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Top Drawer",
    placement: "top",
    size: "md",
  },
};

export const BottomDrawer: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Bottom Drawer",
    placement: "bottom",
    size: "md",
  },
};

export const WithFooter: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Drawer with Footer",
    placement: "right",
    size: "md",
    footer: (
      <div className="flex justify-end gap-2">
        <button className="btn">Cancel</button>
        <button className="btn btn-primary">Save</button>
      </div>
    ),
  },
};

export const FullWidth: Story = {
  render: (args) => <DrawerDemo {...args} />,
  args: {
    title: "Full Width Drawer",
    placement: "right",
    size: "full",
  },
};
