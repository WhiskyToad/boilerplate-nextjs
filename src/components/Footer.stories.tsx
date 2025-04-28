import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Footer from "./Footer";
import {
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";

const meta: Meta<typeof Footer> = {
  title: "Components/Navigation/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Footer>;

// Default Footer
export const Default: Story = {
  args: {
    logo: (
      <div className="w-8 h-8 relative bg-primary rounded-full flex items-center justify-center text-white">
        <span className="font-bold">B</span>
      </div>
    ),
    logoText: "Brand Name",
    description:
      "Your company tagline or brief description that explains what your company does.",
    sections: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Demo", href: "/demo" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Documentation", href: "/docs" },
          { label: "Blog", href: "/blog" },
          { label: "Support", href: "/support" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms", href: "/terms" },
          { label: "Privacy", href: "/privacy" },
          { label: "Security", href: "/security" },
        ],
      },
    ],
    socialLinks: [
      {
        icon: <FiTwitter size={20} />,
        href: "https://twitter.com/example",
        ariaLabel: "Twitter",
      },
      {
        icon: <FiLinkedin size={20} />,
        href: "https://linkedin.com/company/example",
        ariaLabel: "LinkedIn",
      },
      {
        icon: <FiGithub size={20} />,
        href: "https://github.com/example",
        ariaLabel: "GitHub",
      },
    ],
    copyrightName: "Brand Inc.",
  },
};

// Minimal Footer
export const Minimal: Story = {
  args: {
    logo: (
      <div className="w-8 h-8 relative bg-primary rounded-full flex items-center justify-center text-white">
        <span className="font-bold">A</span>
      </div>
    ),
    logoText: "AppName",
    description: "Simple app description here",
    sections: [
      {
        title: "Links",
        links: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    socialLinks: [
      {
        icon: <FiTwitter size={20} />,
        href: "https://twitter.com/example",
        ariaLabel: "Twitter",
      },
      {
        icon: <FiGithub size={20} />,
        href: "https://github.com/example",
        ariaLabel: "GitHub",
      },
    ],
  },
};

// Custom Styling
export const CustomStyling: Story = {
  args: {
    logo: (
      <div className="w-10 h-10 relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
        <span className="font-bold text-lg">C</span>
      </div>
    ),
    logoText: "CreativeApp",
    description: "Bringing creative solutions to everyday problems since 2023.",
    sections: [
      {
        title: "Products",
        links: [
          { label: "Web App", href: "/app" },
          { label: "Mobile", href: "/mobile" },
          { label: "Desktop", href: "/desktop" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "Press", href: "/press" },
        ],
      },
    ],
    socialLinks: [
      {
        icon: <FiFacebook size={20} />,
        href: "https://facebook.com/example",
        ariaLabel: "Facebook",
      },
      {
        icon: <FiInstagram size={20} />,
        href: "https://instagram.com/example",
        ariaLabel: "Instagram",
      },
      {
        icon: <FiTwitter size={20} />,
        href: "https://twitter.com/example",
        ariaLabel: "Twitter",
      },
      {
        icon: <FiLinkedin size={20} />,
        href: "https://linkedin.com/company/example",
        ariaLabel: "LinkedIn",
      },
    ],
    className: "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100",
    containerClassName: "container mx-auto max-w-6xl",
  },
};
