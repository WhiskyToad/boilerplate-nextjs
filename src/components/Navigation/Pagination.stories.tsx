import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    shape: {
      control: "select",
      options: ["rounded", "square", "circle"],
    },
    siblingCount: {
      control: { type: "number", min: 0, max: 3 },
    },
    showFirstLast: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// Interactive demo component
const PaginationDemo = (args: any) => {
  const [page, setPage] = useState(args.currentPage || 1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        Current Page: {page} of {args.totalPages}
      </div>
      <Pagination {...args} currentPage={page} onPageChange={setPage} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <PaginationDemo {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    size: "md",
    shape: "rounded",
    siblingCount: 1,
  },
};

export const ManyPages: Story = {
  render: (args) => <PaginationDemo {...args} />,
  args: {
    currentPage: 5,
    totalPages: 20,
    size: "md",
    shape: "rounded",
    siblingCount: 1,
  },
};

export const CircleShaped: Story = {
  render: (args) => <PaginationDemo {...args} />,
  args: {
    currentPage: 3,
    totalPages: 10,
    size: "md",
    shape: "circle",
    siblingCount: 1,
  },
};

export const SquareShaped: Story = {
  render: (args) => <PaginationDemo {...args} />,
  args: {
    currentPage: 3,
    totalPages: 10,
    size: "md",
    shape: "square",
    siblingCount: 1,
  },
};

export const SmallSize: Story = {
  render: (args) => <PaginationDemo {...args} />,
  args: {
    currentPage: 3,
    totalPages: 10,
    size: "sm",
    shape: "rounded",
    siblingCount: 1,
  },
};

export const LargeSize: Story = {
  render: (args) => <PaginationDemo {...args} />,
  args: {
    currentPage: 3,
    totalPages: 10,
    size: "lg",
    shape: "rounded",
    siblingCount: 1,
  },
};

export const WithFirstLastButtons: Story = {
  render: (args) => <PaginationDemo {...args} />,
  args: {
    currentPage: 7,
    totalPages: 20,
    size: "md",
    shape: "rounded",
    siblingCount: 1,
    showFirstLast: true,
  },
};

export const WithMoreSiblings: Story = {
  render: (args) => <PaginationDemo {...args} />,
  args: {
    currentPage: 7,
    totalPages: 20,
    size: "md",
    shape: "rounded",
    siblingCount: 2,
  },
};
