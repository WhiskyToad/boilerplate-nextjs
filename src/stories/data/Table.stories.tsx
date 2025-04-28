import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Table from "../../../components/Data/Table";
import Badge from "../../../components/Data/Badge";

const meta = {
  title: "Data/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    striped: {
      control: "boolean",
      description: "Whether to add zebra stripes to the table",
    },
    hover: {
      control: "boolean",
      description: "Whether to add hover effect to rows",
    },
    bordered: {
      control: "boolean",
      description: "Whether to add borders to the table",
    },
    compact: {
      control: "boolean",
      description: "Whether to make the table compact",
    },
    loading: {
      control: "boolean",
      description: "Whether the table is in loading state",
    },
    pagination: {
      control: "boolean",
      description: "Whether to enable pagination",
    },
    pageSize: {
      control: "number",
      description: "Number of rows per page",
    },
    onRowClick: { action: "row clicked" },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for the table
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
}

const sampleUsers: User[] = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "User",
    status: i % 3 === 0 ? "active" : i % 3 === 1 ? "inactive" : "pending",
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split("T")[0],
  }));

export const Default: Story = {
  args: {
    columns: [
      {
        header: "ID",
        accessor: "id",
        width: "80px",
        sortable: true,
      },
      {
        header: "Name",
        accessor: "name",
        sortable: true,
      },
      {
        header: "Email",
        accessor: "email",
        sortable: true,
      },
      {
        header: "Role",
        accessor: "role",
        sortable: true,
      },
      {
        header: "Status",
        accessor: "status",
        render: (value) => {
          const statusColors = {
            active: "success",
            inactive: "error",
            pending: "warning",
          };
          return (
            <Badge
              variant={statusColors[value as "active" | "inactive" | "pending"]}
            >
              {value}
            </Badge>
          );
        },
        sortable: true,
        align: "center",
      },
      {
        header: "Join Date",
        accessor: "joinDate",
        sortable: true,
        align: "right",
      },
    ],
    data: sampleUsers,
    keyField: "id",
    striped: true,
    hover: true,
    bordered: false,
    compact: false,
    pagination: true,
    pageSize: 5,
    sortable: true,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    compact: true,
  },
};

export const Bordered: Story = {
  args: {
    ...Default.args,
    bordered: true,
  },
};

export const NoStripes: Story = {
  args: {
    ...Default.args,
    striped: false,
  },
};

export const NoHover: Story = {
  args: {
    ...Default.args,
    hover: false,
  },
};

export const ClickableRows: Story = {
  args: {
    ...Default.args,
    onRowClick: (row) => alert(`Clicked on user: ${row.name}`),
  },
};

export const NoSorting: Story = {
  args: {
    ...Default.args,
    sortable: false,
  },
};

export const NoPagination: Story = {
  args: {
    ...Default.args,
    pagination: false,
  },
};
