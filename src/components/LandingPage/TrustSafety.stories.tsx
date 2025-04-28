import type { Meta, StoryObj } from "@storybook/react";
import TrustSafety from "./TrustSafety";
import { FiLock, FiShield, FiCheck, FiFileText } from "react-icons/fi";

const meta: Meta<typeof TrustSafety> = {
  title: "Landing Page/TrustSafety",
  component: TrustSafety,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TrustSafety>;

export const Default: Story = {
  args: {},
};

export const CustomItems: Story = {
  args: {
    items: [
      {
        icon: <FiLock className="w-8 h-8 text-primary flex-shrink-0" />,
        title: "End-to-end Encryption",
        description:
          "All your data is encrypted both in transit and at rest using AES-256, the gold standard in encryption security.",
      },
      {
        icon: <FiShield className="w-8 h-8 text-primary flex-shrink-0" />,
        title: "SOC 2 Compliant",
        description:
          "Our platform undergoes regular security audits and is fully SOC 2 Type II compliant.",
      },
    ],
  },
};

export const ExtendedSecurity: Story = {
  args: {
    items: [
      {
        icon: <FiLock className="w-8 h-8 text-primary flex-shrink-0" />,
        title: "End-to-end Encryption",
        description:
          "All your data is encrypted both in transit and at rest using AES-256, the gold standard in encryption security.",
      },
      {
        icon: <FiShield className="w-8 h-8 text-primary flex-shrink-0" />,
        title: "SOC 2 Compliant",
        description:
          "Our platform undergoes regular security audits and is fully SOC 2 Type II compliant.",
      },
      {
        icon: <FiFileText className="w-8 h-8 text-primary flex-shrink-0" />,
        title: "GDPR Compliance",
        description:
          "We're fully compliant with GDPR regulations, giving you control over your personal data.",
      },
      {
        icon: <FiCheck className="w-8 h-8 text-primary flex-shrink-0" />,
        title: "Regular Backups",
        description:
          "Automated backups ensure your data is never lost and can be restored if needed.",
      },
    ],
  },
};
