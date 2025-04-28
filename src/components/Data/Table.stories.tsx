import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Table, { TableColumn } from "./Table";
import Badge from "./Badge";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
}

const users: User[] = Array(25)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: ["Admin", "User", "Editor", "Viewer"][index % 4],
    status: ["active", "inactive", "pending"][index % 3] as
      | "active"
      | "inactive"
      | "pending",
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split("T")[0],
  }));

const columns: TableColumn<User>[] = [
  {
    header: "ID",
    accessor: "id",
    width: "60px",
    align: "center",
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
      const variants: Record<string, any> = {
        active: { variant: "success", label: "Active" },
        inactive: { variant: "error", label: "Inactive" },
        pending: { variant: "warning", label: "Pending" },
      };
      const { variant, label } = variants[value] || {
        variant: "neutral",
        label: value,
      };
      return <Badge variant={variant}>{label}</Badge>;
    },
    sortable: true,
  },
  {
    header: "Last Login",
    accessor: "lastLogin",
    sortable: true,
  },
];

const meta: Meta<typeof Table> = {
  title: "Data/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Table<User>>;

export const Default: Story = {
  args: {
    columns,
    data: users,
    keyField: "id",
  },
};

export const Compact: Story = {
  args: {
    columns,
    data: users,
    keyField: "id",
    compact: true,
  },
};

export const Bordered: Story = {
  args: {
    columns,
    data: users,
    keyField: "id",
    bordered: true,
  },
};

export const NoPagination: Story = {
  args: {
    columns,
    data: users.slice(0, 5),
    keyField: "id",
    pagination: false,
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    keyField: "id",
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    keyField: "id",
    emptyText: "No users found",
  },
};

export const WithRowClick: Story = {
  args: {
    columns,
    data: users,
    keyField: "id",
    onRowClick: (row) => alert(`Clicked on user: ${row.name}`),
  },
};

export const NonSortable: Story = {
  args: {
    columns,
    data: users,
    keyField: "id",
    sortable: false,
  },
};

export const CustomPageSize: Story = {
  args: {
    columns,
    data: users,
    keyField: "id",
    pageSize: 5,
  },
};
