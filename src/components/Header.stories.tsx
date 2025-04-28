import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";
import {
  FiUser,
  FiLogOut,
  FiBookOpen,
  FiUsers,
  FiArrowRight,
  FiSettings,
  FiHome,
} from "react-icons/fi";

const meta: Meta<typeof Header> = {
  title: "Components/Navigation/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Header>;

// Default header for logged out users
export const LoggedOut: Story = {
  args: {
    logo: (
      <>
        <div className="w-10 h-10 relative bg-primary rounded-full flex items-center justify-center text-white">
          <span className="font-bold">B</span>
        </div>
        <h1 className="text-xl font-bold ml-2 hidden md:block">Brand Name</h1>
      </>
    ),
    navItems: [
      { label: "Home", href: "/", icon: <FiHome size={16} /> },
      { label: "Features", href: "/features", icon: <FiBookOpen size={16} /> },
      { label: "Pricing", href: "/pricing" },
    ],
    cta: {
      label: "Get Started",
      href: "/signup",
      icon: (
        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
      ),
    },
    isLoggedIn: false,
  },
};

// Header for logged in users
export const LoggedIn: Story = {
  args: {
    logo: (
      <>
        <div className="w-10 h-10 relative bg-primary rounded-full flex items-center justify-center text-white">
          <span className="font-bold">B</span>
        </div>
        <h1 className="text-xl font-bold ml-2 hidden md:block">Brand Name</h1>
      </>
    ),
    navItems: [
      { label: "Dashboard", href: "/dashboard", icon: <FiHome size={16} /> },
      { label: "Learn", href: "/learn", icon: <FiBookOpen size={16} /> },
    ],
    dropdowns: [
      {
        label: "Projects",
        items: [
          { label: "View All Projects", href: "/projects" },
          { label: "Project One", href: "/projects/1" },
          { label: "Project Two", href: "/projects/2" },
          { label: "Create New", href: "/projects/create", highlight: true },
        ],
      },
    ],
    isLoggedIn: true,
    userDropdown: {
      userAvatar: (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-base-300 text-base-content">
          <FiUser size={24} />
        </div>
      ),
      items: [
        {
          label: "Account Settings",
          href: "/account",
          icon: <FiSettings size={16} />,
        },
        {
          label: "Logout",
          onClick: () => console.log("Logout clicked"),
          icon: <FiLogOut size={16} />,
        },
      ],
    },
  },
};

// Header with custom styling
export const CustomStyling: Story = {
  args: {
    logo: (
      <>
        <div className="w-10 h-10 relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
          <span className="font-bold text-lg">A</span>
        </div>
        <h1 className="text-xl font-bold ml-2 hidden md:block bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          AppName
        </h1>
      </>
    ),
    navItems: [
      { label: "Dashboard", href: "/dashboard", icon: <FiHome size={16} /> },
      { label: "Team", href: "/team", icon: <FiUsers size={16} /> },
    ],
    cta: {
      label: "Upgrade Plan",
      onClick: () => console.log("Upgrade clicked"),
      icon: <span className="ml-1">✨</span>,
    },
    className: "bg-gradient-to-r from-gray-50 to-gray-100 border-b",
    mobileBreakpoint: "lg",
    sticky: true,
  },
};
