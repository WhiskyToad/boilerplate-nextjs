import type { Meta, StoryObj } from "@storybook/react";
import Hero from "./Hero";

const meta: Meta<typeof Hero> = {
  title: "Landing Page/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {},
};

export const ProductLaunch: Story = {
  args: {
    headline: (
      <>
        Launch Your Product <strong>Faster</strong>
        <br className="hidden md:block" />
        With Our{" "}
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          All-in-One Platform
        </span>
      </>
    ),
    subheadline: (
      <>
        Skip the technical headaches and focus on your business.
        <br />
        Our platform handles the heavy lifting so you can build your product in
        record time.
      </>
    ),
    buttonText: "Start Building Now",
    buttonLink: "/signup",
    features: [
      "No coding required",
      "Pre-built templates",
      "Drag-and-drop interface",
      "Launch in days, not months",
    ],
    badges: [
      "Visual Builder",
      "Analytics",
      "Integrations",
      "Team Collaboration",
    ],
  },
};

export const SaaS: Story = {
  args: {
    headline: (
      <>
        The Smart Way to
        <br className="hidden md:block" />
        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
          Manage Projects
        </span>
      </>
    ),
    subheadline: (
      <>
        Keep your team aligned and projects on track.
        <br />
        The modern solution for modern teams.
      </>
    ),
    buttonText: "Try for Free",
    buttonLink: "/free-trial",
    features: [
      "Intuitive task management",
      "Real-time collaboration",
      "Automated reporting",
      "Custom workflows",
    ],
    badges: [
      "Task Management",
      "Gantt Charts",
      "Time Tracking",
      "Resource Planning",
    ],
  },
};

export const Mobile: Story = {
  args: {
    headline: (
      <>
        Your Business
        <br className="hidden md:block" />
        <span className="bg-gradient-to-r from-green-500 to-emerald-700 text-transparent bg-clip-text">
          In Your Pocket
        </span>
      </>
    ),
    subheadline: (
      <>
        Run your entire business from your phone.
        <br />
        No technical skills required. Get started in minutes.
      </>
    ),
    buttonText: "Download Now",
    buttonLink: "/download",
    features: [
      "Manage orders on the go",
      "Track inventory in real-time",
      "Process payments anywhere",
      "Customer management system",
    ],
    badges: ["iOS", "Android", "Offline Mode", "Cloud Sync"],
  },
};
