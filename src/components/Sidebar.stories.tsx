import type { Meta, StoryObj } from "@storybook/react";
import Sidebar, { SidebarProps } from "./Sidebar";
import {
  FiHome,
  FiSettings,
  FiUser,
  FiBookmark,
  FiFileText,
} from "react-icons/fi";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Base example
export const Default: Story = {
  args: {
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FiHome />,
      },
      {
        title: "Projects",
        path: "/projects",
        icon: <FiFileText />,
        subItems: [
          {
            title: "Active Projects",
            path: "/projects/active",
          },
          {
            title: "Archived Projects",
            path: "/projects/archived",
          },
        ],
      },
      {
        title: "Settings",
        path: "/settings",
        icon: <FiSettings />,
        subItems: [
          {
            title: "Profile",
            path: "/settings/profile",
          },
          {
            title: "Account",
            path: "/settings/account",
          },
        ],
      },
    ],
    drawerID: "sidebar-drawer",
    mobileTitle: "Navigation",
    sidebarWidth: 80,
  },
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FiHome />,
      },
      {
        title: "Bookmarks",
        path: "/bookmarks",
        icon: <FiBookmark />,
      },
      {
        title: "Profile",
        path: "/profile",
        icon: <FiUser />,
      },
    ],
    drawerID: "custom-drawer",
    mobileBgColor: "bg-primary/10",
    desktopBgColor: "bg-secondary/10",
    topOffset: 16,
    sidebarWidth: 72,
    logo: (
      <div className="flex justify-center">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    ),
  },
};
