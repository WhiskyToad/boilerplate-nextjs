import type { Meta, StoryObj } from "@storybook/react";
import HowItWorks from "./HowItWorks";
import {
  FiEdit,
  FiList,
  FiSend,
  FiSearch,
  FiCheck,
  FiRefreshCw,
  FiDownload,
  FiSettings,
} from "react-icons/fi";

const meta: Meta<typeof HowItWorks> = {
  title: "Landing Page/HowItWorks",
  component: HowItWorks,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HowItWorks>;

export const Default: Story = {
  args: {},
};

export const CustomSteps: Story = {
  args: {
    title: "How Our Platform Works",
    steps: [
      {
        icon: <FiSearch className="text-4xl text-primary" />,
        title: "1. Research",
        description:
          "Start by researching your topic and gathering key information to inform your project.",
      },
      {
        icon: <FiEdit className="text-4xl text-primary" />,
        title: "2. Create",
        description:
          "Use our intuitive editor to build your project with our wide range of templates and tools.",
      },
      {
        icon: <FiCheck className="text-4xl text-primary" />,
        title: "3. Review",
        description:
          "Preview your work and make any necessary adjustments before finalizing your project.",
      },
      {
        icon: <FiSend className="text-4xl text-primary" />,
        title: "4. Share",
        description:
          "Publish your project and share it with your team, clients, or the world.",
      },
    ],
  },
};

export const DevelopmentProcess: Story = {
  args: {
    title: "Our Development Process",
    steps: [
      {
        icon: <FiSettings className="text-4xl text-primary" />,
        title: "1. Setup",
        description:
          "Configure your project settings and connect to your preferred stack and tools.",
      },
      {
        icon: <FiEdit className="text-4xl text-primary" />,
        title: "2. Develop",
        description:
          "Write, edit, and test your code in our integrated development environment.",
      },
      {
        icon: <FiRefreshCw className="text-4xl text-primary" />,
        title: "3. Deploy",
        description:
          "Push your changes to production with our one-click deployment system.",
      },
    ],
  },
};
